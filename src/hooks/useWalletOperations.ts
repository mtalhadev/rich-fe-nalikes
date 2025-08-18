import { useWallet } from "@/contexts/WalletContext";
import {
  useAccount,
  useSwitchChain,
  useWriteContract,
  useReadContract,
  useWalletClient,
  useWaitForTransactionReceipt,
} from "wagmi";
import { TARGET_CHAIN } from "@/config/chains";
import { showToast } from "@/components/CustomToast";
import { ethers } from "ethers";
import { erc20Abi } from "viem";
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

  // Handle approval success - automatically proceed to staking
  useEffect(() => {
    if (isApprovalSuccess && isStakingFlowActive && stakingAmount) {
      console.log("Approval successful, proceeding with staking...");
      showToast("success", "Approval confirmed! Proceeding with staking...");

      // Execute staking with the stored amount
      executeStaking(stakingAmount);
    }
  }, [isApprovalSuccess, isStakingFlowActive, stakingAmount]);

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
          ]);

          console.log("All contract data refreshed successfully");

          // Also call the context's fetchUserBalances to format the new data
          await fetchUserBalances();
        } catch (error) {
          console.error("Error refreshing contract data:", error);
        }
      };

      refreshAllContractData();

      // Reset staking flow
      setIsStakingFlowActive(false);
      setStakingAmount("");

      // CRITICAL: Reset all transaction states to prevent false positives on next operation
      console.log("Resetting all transaction states...");
      resetStakingContract();
      resetTokenContract();
      // Note: useWaitForTransactionReceipt hooks will automatically reset when their hash changes
    }
  }, [isStakingSuccess, isStakingFlowActive, fetchUserBalances]);

  // Handle approval error
  useEffect(() => {
    if (isApprovalError && isStakingFlowActive) {
      console.error("Approval failed");
      showToast("error", "Token approval failed. Please try again.");
      setIsStakingFlowActive(false);
      setStakingAmount("");

      // Reset transaction states on error too
      resetTokenContract();
      // Note: useWaitForTransactionReceipt hooks will automatically reset when their hash changes
    }
  }, [isApprovalError, isStakingFlowActive]);

  // Handle staking error
  useEffect(() => {
    if (isStakingError && isStakingFlowActive) {
      console.error("Staking failed");
      showToast("error", "Staking failed. Please try again.");
      setIsStakingFlowActive(false);
      setStakingAmount("");

      // Reset transaction states on error too
      resetStakingContract();
      // Note: useWaitForTransactionReceipt hooks will automatically reset when their hash changes
    }
  }, [isStakingError, isStakingFlowActive]);

  // Function to execute staking after approval
  const executeStaking = (amount: string) => {
    if (!stakedTokenAddress || !tokenDecimals) {
      showToast("error", "Token information not available");
      setIsStakingFlowActive(false);
      setStakingAmount("");
      return;
    }

    const amountToDeposit = ethers.parseUnits(amount, tokenDecimals);

    console.log("Executing staking with amount:", amountToDeposit.toString());
    showToast("info", "Executing staking transaction...");

    writeStakingContract({
      address: STAKING_CONTRACT_ADDRESS as `0x${string}`,
      abi: STAKING_CONTRACT_ABI,
      functionName: "deposit",
      args: [amountToDeposit],
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
      ]);

      console.log("Manual contract data refresh completed");

      // Also call the context's fetchUserBalances to format the new data
      await fetchUserBalances();
    } catch (error) {
      console.error("Error manually refreshing contract data:", error);
    }
  };

  // Common operations that can be used across components
  const handleStake = async (amount: string) => {
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

      // Check allowance
      if (tokenAllowance === undefined) {
        showToast("error", "Failed to get allowance");
        return;
      }

      // Store amount for later use in the flow
      setStakingAmount(amount);
      setIsStakingFlowActive(true);

      // If allowance is insufficient, approve first
      if (tokenAllowance < amountToDeposit) {
        console.log("Approving tokens for staking contract...");
        showToast("info", "Approving tokens for staking contract...");

        writeTokenContract({
          address: stakedTokenAddress as `0x${string}`,
          abi: erc20Abi,
          functionName: "approve",
          args: [STAKING_CONTRACT_ADDRESS as `0x${string}`, amountToDeposit],
        });

        // Don't return here - let the useEffect handle the flow
      } else {
        // If allowance is sufficient, proceed directly to staking
        executeStaking(amount);
      }
    } catch (error) {
      console.error("Error in staking flow:", error);
      showToast("error", getErrorMessage(error, "start staking"));
      setIsStakingFlowActive(false);
      setStakingAmount("");
    }
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
