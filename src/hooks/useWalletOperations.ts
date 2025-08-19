import { useWallet } from "@/contexts/WalletContext";
import {
  useAccount,
  useSwitchChain,
  useWriteContract,
  useReadContract,
  useWalletClient,
  useEstimateGas,
  useWaitForTransactionReceipt,
} from "wagmi";
import { TARGET_CHAIN } from "@/config/chains";
import { showToast } from "@/components/CustomToast";
import { ethers } from "ethers";
import { erc20Abi, encodeFunctionData } from "viem";
import {
  STAKING_CONTRACT_ABI,
  STAKING_CONTRACT_ADDRESS,
} from "../../utils/constants";
import { useEffect, useState } from "react";

// Function to add chain to MetaMask
const addChainToMetaMask = async () => {
  if (typeof window.ethereum === "undefined") {
    throw new Error("MetaMask is not installed");
  }

  try {
    await window.ethereum.request({
      method: "wallet_addEthereumChain",
      params: [
        {
          chainId: `0x${TARGET_CHAIN.id.toString(16)}`,
          chainName: TARGET_CHAIN.name,
          nativeCurrency: {
            name: TARGET_CHAIN.nativeCurrency.name,
            symbol: TARGET_CHAIN.nativeCurrency.symbol,
            decimals: TARGET_CHAIN.nativeCurrency.decimals,
          },
          rpcUrls: TARGET_CHAIN.rpcUrls.default.http,
          blockExplorerUrls: TARGET_CHAIN.blockExplorers?.default?.url
            ? [TARGET_CHAIN.blockExplorers.default.url]
            : undefined,
        },
      ],
    });
    return true;
  } catch (error: any) {
    console.error("Error adding chain to MetaMask:", error);
    if (error.code === 4902) {
      // Chain already exists
      return true;
    }
    throw error;
  }
};

export const useWalletOperations = () => {
  const { showStakingSuccessModal, userBalances } = useWallet();

  // State for staking flow
  const [stakingAmount, setStakingAmount] = useState<string>("");
  const [isStakingFlowActive, setIsStakingFlowActive] = useState(false);
  const [pendingStakingExecution, setPendingStakingExecution] = useState<
    string | null
  >(null);

  // Helper function to get user-friendly error messages
  const getErrorMessage = (error: any, action: string): string => {
    let errorMessage = `Failed to ${action}. Please try again.`;

    if (error && typeof error === "object") {
      const errorObj = error as any;

      // Check if user rejected the transaction
      if (errorObj.code === "ACTION_REJECTED" || errorObj.code === 4001) {
        errorMessage = "Transaction was cancelled by user.";
      }
      // Check for MetaMask specific error
      else if (errorObj.info?.error?.message) {
        if (
          errorObj.info.error.message.includes(
            "User denied transaction signature"
          )
        ) {
          errorMessage = "Transaction was cancelled by user.";
        } else {
          errorMessage = `Transaction failed: ${errorObj.info.error.message}`;
        }
      }
      // Check for other common error patterns
      else if (errorObj.message) {
        if (
          errorObj.message.includes("user rejected") ||
          errorObj.message.includes("rejected")
        ) {
          errorMessage = "Transaction was cancelled by user.";
        } else if (errorObj.message.includes("insufficient funds")) {
          errorMessage = "Insufficient funds for transaction.";
        } else if (errorObj.message.includes("gas")) {
          errorMessage = "Gas estimation failed. Please try again.";
        } else {
          errorMessage = `Transaction failed: ${errorObj.message}`;
        }
      }
      // Check for reason field
      else if (errorObj.reason) {
        if (errorObj.reason === "rejected") {
          errorMessage = "Transaction was cancelled by user.";
        } else {
          errorMessage = `Transaction failed: ${errorObj.reason}`;
        }
      }
    }

    return errorMessage;
  };

  const {
    isConnected,
    isConnecting,
    connectWallet,
    connectAbstractWallet,
    disconnectWallet,
    address,
    fetchUserBalances,
  } = useWallet();

  const { chain } = useAccount();
  const { switchChain, switchChainAsync } = useSwitchChain();
  const { data: walletClient } = useWalletClient();

  // Check if user is on the correct chain
  const isOnCorrectChain = chain?.id === TARGET_CHAIN.id;

  // Read contract hooks for staking contract - ALL HOOKS MUST BE AT TOP LEVEL
  const { data: stakedTokenAddress, refetch: refetchStakedTokenAddress } =
    useReadContract({
      address: STAKING_CONTRACT_ADDRESS as `0x${string}`,
      abi: STAKING_CONTRACT_ABI,
      functionName: "stakedToken",
      query: {
        enabled: !!STAKING_CONTRACT_ADDRESS,
      },
    });

  const { data: rewardTokenAddress, refetch: refetchRewardTokenAddress } =
    useReadContract({
      address: STAKING_CONTRACT_ADDRESS as `0x${string}`,
      abi: STAKING_CONTRACT_ABI,
      functionName: "rewardToken",
      query: {
        enabled: !!STAKING_CONTRACT_ADDRESS,
      },
    });

  // User-specific read contract hooks
  const { data: userInfo, refetch: refetchUserInfo } = useReadContract({
    address: STAKING_CONTRACT_ADDRESS as `0x${string}`,
    abi: STAKING_CONTRACT_ABI,
    functionName: "userInfo",
    args: address ? [address] : undefined,
    query: {
      enabled: !!STAKING_CONTRACT_ADDRESS && !!address,
    },
  });

  const { data: pendingReward, refetch: refetchPendingReward } =
    useReadContract({
      address: STAKING_CONTRACT_ADDRESS as `0x${string}`,
      abi: STAKING_CONTRACT_ABI,
      functionName: "pendingReward",
      args: address ? [address] : undefined,
      query: {
        enabled: !!STAKING_CONTRACT_ADDRESS && !!address,
      },
    });

  // Block-related read contract hooks
  const { data: bonusEndBlock, refetch: refetchBonusEndBlock } =
    useReadContract({
      address: STAKING_CONTRACT_ADDRESS as `0x${string}`,
      abi: STAKING_CONTRACT_ABI,
      functionName: "stakeEndBlock",
      query: {
        enabled: !!STAKING_CONTRACT_ADDRESS,
      },
    });

  // Token-related read contract hooks
  const { data: tokenDecimals, refetch: refetchTokenDecimals } =
    useReadContract({
      address: stakedTokenAddress as `0x${string}`,
      abi: erc20Abi,
      functionName: "decimals",
      query: {
        enabled: !!stakedTokenAddress,
      },
    });

  const { data: userTokenBalance, refetch: refetchUserTokenBalance } =
    useReadContract({
      address: stakedTokenAddress as `0x${string}`,
      abi: erc20Abi,
      functionName: "balanceOf",
      args: address ? [address as `0x${string}`] : undefined,
      query: {
        enabled: !!stakedTokenAddress && !!address,
      },
    });

  const { data: tokenAllowance, refetch: refetchTokenAllowance } =
    useReadContract({
      address: stakedTokenAddress as `0x${string}`,
      abi: erc20Abi,
      functionName: "allowance",
      args:
        address && STAKING_CONTRACT_ADDRESS
          ? [
              address as `0x${string}`,
              STAKING_CONTRACT_ADDRESS as `0x${string}`,
            ]
          : undefined,
      query: {
        enabled:
          !!stakedTokenAddress && !!address && !!STAKING_CONTRACT_ADDRESS,
      },
    });

  // Write contract hooks
  const {
    writeContract: writeStakingContract,
    isPending: isStakingPending,
    data: stakingData,
    reset: resetStakingContract,
    error: stakingError,
  } = useWriteContract();
  const {
    writeContract: writeTokenContract,
    isPending: isApprovalPending,
    data: approvalData,
    reset: resetTokenContract,
    error: approvalError,
  } = useWriteContract();

  // Gas estimation hooks
  const {
    data: stakingGasEstimate,
    isError: isStakingGasError,
    error: stakingGasError,
    refetch: refetchStakingGas,
  } = useEstimateGas({
    to: STAKING_CONTRACT_ADDRESS as `0x${string}`,
    data:
      stakingAmount && tokenDecimals
        ? encodeFunctionData({
            abi: STAKING_CONTRACT_ABI,
            functionName: "deposit",
            args: [ethers.parseUnits(stakingAmount, tokenDecimals)],
          })
        : undefined,
    query: {
      enabled: !!STAKING_CONTRACT_ADDRESS && !!stakingAmount && !!tokenDecimals,
    },
  });

  // Transaction status tracking hooks
  const {
    isLoading: isApprovalConfirming,
    isSuccess: isApprovalSuccess,
    isError: isApprovalError,
  } = useWaitForTransactionReceipt({
    hash: approvalData,
  });

  const {
    isLoading: isStakingConfirming,
    isSuccess: isStakingSuccess,
    isError: isStakingError,
  } = useWaitForTransactionReceipt({
    hash: stakingData,
  });

  useEffect(() => {
    if (stakingError) {
      showToast("error", "Staking failed. Please try again.");
    }
  }, [stakingError]);

  useEffect(() => {
    if (approvalError) {
      showToast("error", "Approval failed. Please try again.");
    }
  }, [approvalError]);

  // useEffect to handle approval success and trigger staking
  useEffect(() => {
    if (isApprovalSuccess && isStakingFlowActive && stakingAmount) {
      console.log("Approval successful, waiting for gas estimate...");
      showToast(
        "success",
        "Approval confirmed! Preparing staking transaction..."
      );

      // Set pending execution to wait for gas estimate
      setPendingStakingExecution(stakingAmount);
    }
  }, [isApprovalSuccess, isStakingFlowActive, stakingAmount]);

  // useEffect to detect when gas estimate is ready and execute staking
  useEffect(() => {
    console.log("Gas estimation useEffect triggered:", {
      pendingStakingExecution,
      stakingAmount,
      stakingGasEstimate: stakingGasEstimate?.toString(),
      isStakingGasError,
      isStakingFlowActive,
      hasAllConditions: !!(
        pendingStakingExecution &&
        stakingAmount &&
        stakingGasEstimate &&
        !isStakingGasError &&
        isStakingFlowActive
      ),
    });

    if (
      pendingStakingExecution &&
      stakingAmount &&
      stakingGasEstimate &&
      !isStakingGasError &&
      isStakingFlowActive
    ) {
      console.log(
        "Gas estimate ready, executing staking for amount:",
        pendingStakingExecution
      );
      setPendingStakingExecution(null); // Clear pending execution
      executeStaking(pendingStakingExecution);
    } else {
      console.log("Gas estimation useEffect conditions not met:", {
        hasPendingExecution: !!pendingStakingExecution,
        hasStakingAmount: !!stakingAmount,
        hasGasEstimate: !!stakingGasEstimate,
        hasNoGasError: !isStakingGasError,
        isFlowActive: isStakingFlowActive,
      });
    }
  }, [
    pendingStakingExecution,
    stakingAmount,
    stakingGasEstimate,
    isStakingGasError,
    isStakingFlowActive,
  ]);

  // Handle staking success
  useEffect(() => {
    if (isStakingSuccess && isStakingFlowActive) {
      console.log("Staking successful!");
      showToast("success", "Staking successful!");
      showStakingSuccessModal();

      // Refresh all contract data to get latest balances
      const refreshAllContractData = async () => {
        try {
          console.log("Refreshing all contract data immediately...");

          // Refetch all the contract data
          await Promise.all([
            refetchStakedTokenAddress(),
            refetchRewardTokenAddress(),
            refetchUserInfo(),
            refetchPendingReward(),
            refetchBonusEndBlock(),
            refetchTokenDecimals(),
            refetchUserTokenBalance(),
            refetchTokenAllowance(),
            refetchStakingGas(),
          ]);

          console.log("All contract data refreshed successfully");
        } catch (error) {
          console.error("Error refreshing contract data:", error);
        }
      };

      setTimeout(() => {
        refreshAllContractData();
      }, 1000);

      // Reset staking flow
      setIsStakingFlowActive(false);
      setStakingAmount("");
      setPendingStakingExecution(null); // Clear pending execution state

      // CRITICAL: Reset all transaction states to prevent false positives on next operation
      console.log("Resetting all transaction states...");
      resetStakingContract();
      resetTokenContract();
      // Note: useWaitForTransactionReceipt hooks will automatically reset when their hash changes
    }
  }, [isStakingSuccess, isStakingFlowActive]);

  // Handle approval error
  useEffect(() => {
    if (isApprovalError && isStakingFlowActive) {
      console.error("Approval failed");
      showToast("error", "Token approval failed. Please try again.");
      setIsStakingFlowActive(false);
      setStakingAmount("");

      // Refresh allowance data to get current state
      console.log(
        "Refreshing allowance data after approval failure/rejection..."
      );
      refetchTokenAllowance();

      // Reset transaction states on error too
      resetTokenContract();
      // Note: useWaitForTransactionReceipt hooks will automatically reset when their hash changes
    }
  }, [
    isApprovalError,
    isStakingFlowActive,
    refetchTokenAllowance,
    approvalError,
  ]);

  // Handle staking error
  useEffect(() => {
    if (isStakingError && isStakingFlowActive) {
      console.error("Staking failed");
      showToast("error", "Staking failed. Please try again.");
      setIsStakingFlowActive(false);
      setStakingAmount("");

      // Always refresh allowance data since staking didn't complete
      console.log(
        "Refreshing allowance data after staking failure/rejection..."
      );
      refetchTokenAllowance();

      // Reset transaction states on error too
      resetStakingContract();
      // Note: useWaitForTransactionReceipt hooks will automatically reset when their hash changes
    }
  }, [
    isStakingError,
    isStakingFlowActive,
    refetchTokenAllowance,
    stakingError,
  ]);

  // Function to execute staking after approval
  const executeStaking = (amount: string) => {
    if (!stakedTokenAddress || !tokenDecimals || !STAKING_CONTRACT_ADDRESS) {
      showToast("error", "Token information not available");
      setIsStakingFlowActive(false);
      setStakingAmount("");
      return;
    }

    const amountToDeposit = ethers.parseUnits(amount, tokenDecimals);

    console.log("Executing staking with amount:", amountToDeposit.toString());
    showToast("info", "Executing staking transaction...");

    // Use gas estimate from hook if available, otherwise use fallback
    let gasLimit: bigint;

    if (stakingGasEstimate && !isStakingGasError) {
      // Add 20% buffer to the estimated gas
      gasLimit = (stakingGasEstimate * BigInt(120)) / BigInt(100);
      console.log("Using estimated gas with 20% buffer:", gasLimit.toString());
    } else {
      // Fallback to hardcoded gas limit
      gasLimit = BigInt(500000); // 500k gas
      console.log("Using fallback gas limit:", gasLimit.toString());

      if (stakingGasError) {
        console.log("Gas estimation error:", stakingGasError);
      }
    }

    // Execute staking with determined gas limit
    writeStakingContract({
      address: STAKING_CONTRACT_ADDRESS as `0x${string}`,
      abi: STAKING_CONTRACT_ABI,
      functionName: "deposit",
      args: [amountToDeposit],
      gas: gasLimit,
    });
  };

  // Function to manually refresh all contract data (can be called from components)
  const refreshAllBalances = async () => {
    try {
      console.log("Manually refreshing all contract data...");

      // Refetch all contract data
      await Promise.all([
        refetchStakedTokenAddress(),
        refetchRewardTokenAddress(),
        refetchUserInfo(),
        refetchPendingReward(),
        refetchBonusEndBlock(),
        refetchTokenDecimals(),
        refetchUserTokenBalance(),
        refetchTokenAllowance(),
        refetchStakingGas(),
      ]);

      console.log("Manual contract data refresh completed");
    } catch (error) {
      console.error("Error manually refreshing contract data:", error);
    }
  };

  // Common operations that can be used across components
  const handleStake = async (amount: string) => {
    console.log("=== HANDLE STAKE CALLED ===");
    console.log("Current state:", {
      isConnected,
      stakingAmount,
      isStakingFlowActive,
      pendingStakingExecution,
      hasStakingContract: !!STAKING_CONTRACT_ADDRESS,
    });

    if (!isConnected) {
      connectWallet();
      return;
    }

    // Validate amount
    const amountValue = parseFloat(amount);
    if (isNaN(amountValue) || amountValue <= 0) {
      showToast("error", "Please enter a valid amount greater than 0");
      return;
    }

    if (!STAKING_CONTRACT_ADDRESS) {
      showToast("error", "Staking contract address is not set");
      return;
    }

    // Check if user is on the correct chain
    if (!isOnCorrectChain) {
      try {
        console.log("Switching chain to:", TARGET_CHAIN.id);
        await switchChainAsync({ chainId: TARGET_CHAIN.id });
      } catch (error: any) {
        console.error("Failed to switch chain:", error);

        // If chain doesn't exist, try to add it
        if (error.code === 4902 || error.message?.includes("does not exist")) {
          try {
            showToast("info", "Adding Abstract chain to MetaMask...");
            await addChainToMetaMask();
            await switchChainAsync({ chainId: TARGET_CHAIN.id });
            showToast("success", "Abstract chain added!");
            return;
          } catch (addChainError) {
            console.error("Failed to add chain:", addChainError);
            showToast("error", "Failed to add Abstract chain to MetaMask");
            return;
          }
        }

        showToast("warning", "Please switch to Abstract Testnet to continue");
        return;
      }
    }

    console.log("Staking on correct chain...", chain?.id, TARGET_CHAIN.id);

    try {
      if (!stakedTokenAddress || !tokenDecimals) {
        showToast("error", "Token information not available");
        return;
      }

      const amountToDeposit = ethers.parseUnits(amount, tokenDecimals);

      // Check if user has enough tokens
      if (!userTokenBalance || userTokenBalance < amountToDeposit) {
        showToast("error", "Insufficient token balance");
        return;
      }

      // Check allowance using hook data
      if (tokenAllowance !== undefined && tokenAllowance < amountToDeposit) {
        console.log("Approval needed - setting up approval flow");
        showToast("info", "Approving tokens for staking contract...");

        // Set staking flow state
        setStakingAmount(amount);
        setIsStakingFlowActive(true);

        // Execute approval using hook with gas limit
        writeTokenContract({
          address: stakedTokenAddress as `0x${string}`,
          abi: erc20Abi,
          functionName: "approve",
          args: [STAKING_CONTRACT_ADDRESS as `0x${string}`, amountToDeposit],
        });
      } else {
        // Sufficient allowance, proceed directly to staking
        console.log("Sufficient allowance - setting up direct staking flow");
        setStakingAmount(amount);
        setIsStakingFlowActive(true);

        // Set pending execution to wait for gas estimate
        setPendingStakingExecution(amount);
        console.log("Pending execution set for amount:", amount);
      }
    } catch (error) {
      console.error("Error in staking flow:", error);
      showToast("error", getErrorMessage(error, "start staking"));
      setIsStakingFlowActive(false);
      setStakingAmount("");
    }

    console.log("=== HANDLE STAKE COMPLETED ===");
  };

  const handleUnstake = async () => {
    if (!isConnected) {
      connectWallet();
      return;
    }

    // Check if user is on the correct chain
    if (!isOnCorrectChain) {
      showToast("warning", "Please switch to Abstract Testnet to continue");
      return;
    }

    if (!STAKING_CONTRACT_ADDRESS) {
      showToast("error", "Staking contract address is not set");
      return;
    }

    try {
      // Use userInfo directly from the hook result
      if (!userInfo || !Array.isArray(userInfo) || userInfo[0] <= BigInt(0)) {
        showToast("warning", "You have no tokens staked to withdraw");
        return;
      }

      const stakedAmount = userInfo[0];

      // Execute withdraw
      showToast("info", "Withdrawing tokens...");

      writeStakingContract({
        address: STAKING_CONTRACT_ADDRESS as `0x${string}`,
        abi: STAKING_CONTRACT_ABI,
        functionName: "withdraw",
        args: [stakedAmount],
      });

      showToast("success", "Withdraw transaction sent!");

      // Refresh user balances after successful withdraw
      setTimeout(() => {
        fetchUserBalances();
        console.log("User balances refreshed after withdraw");
      }, 2000);
    } catch (error) {
      console.error("Error withdrawing:", error);
      showToast("error", getErrorMessage(error, "withdraw"));
    }
  };

  const handleClaim = async () => {
    if (!isConnected) {
      connectWallet();
      return;
    }

    // Check if user is on the correct chain
    if (!isOnCorrectChain) {
      showToast("warning", "Please switch to Abstract Testnet to continue");
      return;
    }

    if (!STAKING_CONTRACT_ADDRESS) {
      showToast("error", "Staking contract address is not set");
      return;
    }

    try {
      // Use pendingReward directly from the hook result
      if (
        !pendingReward ||
        typeof pendingReward !== "bigint" ||
        pendingReward <= BigInt(0)
      ) {
        showToast("warning", "No pending rewards to claim");
        return;
      }

      // Execute claim
      showToast("info", "Claiming rewards...");

      writeStakingContract({
        address: STAKING_CONTRACT_ADDRESS as `0x${string}`,
        abi: STAKING_CONTRACT_ABI,
        functionName: "claim",
      });

      showToast("success", "Claim transaction sent!");

      // Refresh user balances after successful claim
      setTimeout(() => {
        fetchUserBalances();
        console.log("User balances refreshed after claim");
      }, 2000);
    } catch (error) {
      console.error("Error claiming rewards:", error);
      showToast("error", getErrorMessage(error, "claim rewards"));
    }
  };

  const handleEmergencyWithdraw = async () => {
    if (!isConnected) {
      connectWallet();
      return;
    }

    // Check if user is on the correct chain
    if (!isOnCorrectChain) {
      showToast("warning", "Please switch to Abstract Testnet to continue");
      return;
    }

    if (!STAKING_CONTRACT_ADDRESS) {
      showToast("error", "Staking contract address is not set");
      return;
    }

    try {
      // Use userInfo directly from the hook result
      if (!userInfo || !Array.isArray(userInfo) || userInfo[0] <= BigInt(0)) {
        showToast("warning", "You have no tokens staked to emergency withdraw");
        return;
      }

      // Execute emergency withdraw
      showToast("info", "Emergency withdrawing tokens...");

      writeStakingContract({
        address: STAKING_CONTRACT_ADDRESS as `0x${string}`,
        abi: STAKING_CONTRACT_ABI,
        functionName: "emergencyWithdraw",
      });

      showToast("success", "Emergency withdraw transaction sent!");

      // Refresh user balances after successful emergency withdraw
      setTimeout(() => {
        fetchUserBalances();
        console.log("User balances refreshed after emergency withdraw");
      }, 2000);
    } catch (error) {
      console.error("Error emergency withdrawing:", error);
      showToast("error", getErrorMessage(error, "emergency withdraw"));
    }
  };

  // Function to calculate unstake timer
  const calculateUnstakeTimer = async () => {
    console.log("calculateUnstakeTimer");
    console.log("isConnected", isConnected);
    console.log("STAKING_CONTRACT_ADDRESS", STAKING_CONTRACT_ADDRESS);
    console.log("bonusEndBlock", bonusEndBlock);

    if (!isConnected || !STAKING_CONTRACT_ADDRESS) {
      return { timeRemaining: 0, canUnstake: false };
    }

    try {
      // Use public provider to get current block number
      const publicProvider = new ethers.JsonRpcProvider(
        process.env.NEXT_PUBLIC_RPC_URL
      );
      const currentBlock = await publicProvider.getBlockNumber();

      // Use bonusEndBlock directly from the hook result
      if (!bonusEndBlock) {
        return { timeRemaining: 0, canUnstake: false };
      }

      console.log("currentBlock", currentBlock);
      console.log("bonusEndBlock", bonusEndBlock);

      // Convert BigInt to Number for calculations
      const currentBlockNum = Number(currentBlock);
      const bonusEndBlockNum = Number(bonusEndBlock);

      const remainingBlocks = bonusEndBlockNum - currentBlockNum;

      const timeRemainingSeconds = Math.round(
        remainingBlocks * (userBalances?.perBlockExecutionTime || 12)
      );

      const canUnstake = timeRemainingSeconds <= 0;

      return { timeRemaining: Math.max(0, timeRemainingSeconds), canUnstake };
    } catch (error) {
      console.error("Error calculating unstake timer:", error);
      return { timeRemaining: 0, canUnstake: false };
    }
  };

  // Function to format seconds to DD:HH:MM or HH:MM:SS based on remaining time
  const formatTime = (seconds: number) => {
    const days = Math.floor(seconds / 86400); // 86400 = 24 * 60 * 60

    if (days >= 1) {
      // 24 hours or more: show DD:HH:MM
      const hours = Math.floor((seconds % 86400) / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);

      return `${days.toString().padStart(2, "0")}:${hours
        .toString()
        .padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
    } else {
      // Less than 24 hours: show HH:MM:SS
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      const secs = seconds % 60;

      return `${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    }
  };

  return {
    // Connection state
    isConnected,
    isConnecting,
    address,
    isOnCorrectChain,

    // Connection methods
    connectWallet,
    connectAbstractWallet,
    disconnectWallet,

    // Common operations
    handleStake,
    handleUnstake,
    handleClaim,
    handleEmergencyWithdraw,

    // Timer functions
    calculateUnstakeTimer,
    formatTime,

    // Loading states
    isStakingPending,
    isApprovalPending,
    isStakingConfirming,
    isApprovalConfirming,
    isStakingFlowActive,

    // Transaction status
    isApprovalSuccess,
    isStakingSuccess,
    isApprovalError,
    isStakingError,

    // Utility functions
    refreshAllBalances,
  };
};
