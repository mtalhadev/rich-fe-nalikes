import { useWallet } from "@/contexts/WalletContext";
import { useAccount, useSwitchChain } from "wagmi";
import { TARGET_CHAIN } from "@/config/chains";
import { showToast } from "@/components/CustomToast";
import { ethers } from "ethers";
import { erc20Abi } from "viem";
import {
  STAKING_CONTRACT_ABI,
  STAKING_CONTRACT_ADDRESS,
} from "../../utils/constants";

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

  // Check if user is on the correct chain
  const isOnCorrectChain = chain?.id === TARGET_CHAIN.id;

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

    // Add your staking logic here
    console.log("Staking on correct chain...", chain?.id, TARGET_CHAIN.id);
    try {
      const provider = new ethers.BrowserProvider(window.ethereum as any);
      const signer = await provider.getSigner();
      const stakingContract = new ethers.Contract(
        STAKING_CONTRACT_ADDRESS,
        STAKING_CONTRACT_ABI,
        signer
      );

      // Check if staking is active
      try {
        const currentBlock = await provider.getBlockNumber();
        const startBlock = await stakingContract.startBlock();
        const stakeEndBlock = await stakingContract.stakeEndBlock();

        const stakingActive =
          currentBlock >= startBlock && currentBlock <= stakeEndBlock;

        if (!stakingActive) {
          showToast("error", "Staking is not active. Cannot deposit.");
          return;
        }
        console.log("Staking is active");
      } catch (error) {
        console.log("Staking status check not available, continuing...");
      }

      const stakedTokenAddress = await stakingContract.stakedToken();
      const stakedTokenContract = new ethers.Contract(
        stakedTokenAddress,
        erc20Abi,
        signer
      );
      const decimals = await stakedTokenContract.decimals();

      const amountToDeposit = ethers.parseUnits(amount, decimals);

      // Check if user has enough tokens
      const userBalance = await stakedTokenContract.balanceOf(signer.address);
      console.log("User balance:", userBalance.toString());

      console.log("Amount to deposit:", amountToDeposit.toString());

      if (userBalance < amount) {
        showToast("error", "Insufficient token balance");
        return;
      }

      // Check user limit if applicable
      try {
        const hasUserLimit = await stakingContract.hasUserLimit();
        if (hasUserLimit) {
          const userInfo = await stakingContract.userInfo(signer.address);
          const poolLimitPerUser = await stakingContract.poolLimitPerUser();

          // Convert to BigInt for comparison
          const currentAmount = BigInt(userInfo.amount.toString());
          const limit = BigInt(poolLimitPerUser.toString());
          const depositAmount = BigInt(amountToDeposit.toString());

          if (currentAmount + depositAmount > limit) {
            showToast("error", "Amount exceeds user limit");
            return;
          }
        }
      } catch (error) {
        console.log("User limit check not available, continuing...");
      }

      // Check allowance
      const allowance = await stakedTokenContract.allowance(
        signer.address,
        STAKING_CONTRACT_ADDRESS
      );

      console.log("Allowance:", allowance.toString());
      console.log("Amount to deposit:", amountToDeposit.toString());

      // Convert allowance to BigNumber if it's not already
      const allowanceBN = ethers.parseUnits(allowance.toString(), 0);

      if (allowanceBN < amountToDeposit) {
        console.log("Approving tokens for staking contract...");
        showToast("info", "Approving tokens for staking contract...");
        const approveTx = await stakedTokenContract.approve(
          STAKING_CONTRACT_ADDRESS,
          amountToDeposit
        );
        await approveTx.wait();
        console.log("Approval successful");
        showToast("success", "Approval successful");
      }

      // Estimate gas
      let gasLimit;
      try {
        const gasEstimate = await stakingContract.deposit.estimateGas(amount);

        gasLimit = (gasEstimate * BigInt(120)) / BigInt(100); // 20% buffer
        console.log("Estimated gas:", gasEstimate.toString());
      } catch (error: any) {
        console.log("Gas estimation failed, using hardcoded limit", error);

        gasLimit = ethers.parseUnits("500000", 0); // 500k gas
      }

      console.log("Using gas limit:", gasLimit.toString());

      // Execute deposit
      showToast("info", "Depositing tokens...");
      console.log("Depositing tokens...", amount);

      try {
        const depositTx = await stakingContract.deposit(amount, {
          gasLimit: gasLimit,
        });

        console.log("Deposit transaction sent:", depositTx.hash);
        showToast("info", "Transaction sent! Waiting for confirmation...");
        const receipt = await depositTx.wait();
        console.log("Deposit successful! Block:", receipt.blockNumber);
        showToast("success", "Deposit successful!");

        // Refresh user balances after successful deposit
        try {
          // Small delay to ensure blockchain state is updated
          // await new Promise((resolve) => setTimeout(resolve, 2000));
          await fetchUserBalances();
          console.log("User balances refreshed after deposit");
        } catch (error) {
          console.error("Failed to refresh balances after deposit:", error);
        }
      } catch (error: any) {
        console.error("Deposit transaction failed:", error);

        // Try to extract more specific error information
        if (error.data) {
          console.log("Transaction error data:", error.data);
        }

        console.log("Transaction error:", error);

        showToast("error", getErrorMessage(error, "deposit"));
        return;
      }
    } catch (error) {
      console.error("Error depositing:", error);

      showToast("error", getErrorMessage(error, "deposit"));
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
      const provider = new ethers.BrowserProvider(window.ethereum as any);
      const signer = await provider.getSigner();
      const stakingContract = new ethers.Contract(
        STAKING_CONTRACT_ADDRESS,
        STAKING_CONTRACT_ABI,
        signer
      );

      // Check if bonus period has ended
      try {
        const currentBlock = await provider.getBlockNumber();
        const bonusEndBlock = await stakingContract.bonusEndBlock();

        if (currentBlock <= bonusEndBlock) {
          showToast(
            "error",
            "Cannot withdraw yet. Bonus period has not ended."
          );
          return;
        }
        console.log("Bonus period has ended, withdrawal allowed");
      } catch (error) {
        console.log("Bonus period check not available, continuing...");
      }

      // Get user's staked amount
      const userInfo = await stakingContract.userInfo(signer.address);
      const stakedAmount = userInfo.amount;

      if (stakedAmount <= 0) {
        showToast("warning", "You have no tokens staked to withdraw");
        return;
      }

      // Convert staked amount to human readable format for display
      const stakedTokenAddress = await stakingContract.stakedToken();
      const stakedTokenContract = new ethers.Contract(
        stakedTokenAddress,
        erc20Abi,
        signer
      );
      const decimals = await stakedTokenContract.decimals();
      const stakedAmountFormatted = ethers.formatUnits(stakedAmount, decimals);

      console.log("Withdrawing all staked tokens:", stakedAmountFormatted);

      // Check user has enough staked (this is redundant since we're withdrawing all, but keeping for consistency)
      if (stakedAmount <= 0) {
        showToast("error", "Insufficient staked amount");
        return;
      }

      // Estimate gas
      let gasLimit;
      try {
        const gasEstimate = await stakingContract.withdraw.estimateGas(
          stakedAmount
        );
        gasLimit = (gasEstimate * BigInt(120)) / BigInt(100); // 20% buffer
        console.log("Estimated gas:", gasEstimate.toString());
      } catch (error) {
        console.log("Gas estimation failed, using hardcoded limit", error);
        gasLimit = ethers.parseUnits("500000", 0); // 500k gas
      }

      console.log("Using gas limit:", gasLimit.toString());

      // Execute withdraw
      showToast("info", "Withdrawing tokens...");
      const withdrawTx = await stakingContract.withdraw(stakedAmount, {
        gasLimit: gasLimit,
      });

      console.log("Withdraw transaction sent:", withdrawTx.hash);
      showToast("info", "Transaction sent! Waiting for confirmation...");
      const receipt = await withdrawTx.wait();
      console.log("Withdraw successful! Block:", receipt.blockNumber);
      showToast("success", "Withdraw successful!");

      // Refresh user balances after successful withdraw
      try {
        // Small delay to ensure blockchain state is updated
        // await new Promise((resolve) => setTimeout(resolve, 2000));
        await fetchUserBalances();
        console.log("User balances refreshed after withdraw");
      } catch (error) {
        console.error("Failed to refresh balances after withdraw:", error);
      }
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
      const provider = new ethers.BrowserProvider(window.ethereum as any);
      const signer = await provider.getSigner();
      const stakingContract = new ethers.Contract(
        STAKING_CONTRACT_ADDRESS,
        STAKING_CONTRACT_ABI,
        signer
      );

      const userAddress = signer.address;
      const pendingReward = await stakingContract.pendingReward(userAddress);

      if (pendingReward <= 0) {
        showToast("warning", "No pending rewards to claim");
        return;
      }

      // Convert pending reward to human readable format for display
      const rewardTokenAddress = await stakingContract.rewardToken();
      const rewardTokenContract = new ethers.Contract(
        rewardTokenAddress,
        erc20Abi,
        signer
      );
      const decimals = await rewardTokenContract.decimals();
      const pendingRewardFormatted = ethers.formatUnits(
        pendingReward,
        decimals
      );

      console.log("Pending rewards:", pendingRewardFormatted);

      // Estimate gas
      let gasLimit;
      try {
        const gasEstimate = await stakingContract.claim.estimateGas();
        gasLimit = (gasEstimate * BigInt(120)) / BigInt(100); // 20% buffer
        console.log("Estimated gas:", gasEstimate.toString());
      } catch (error) {
        console.log("Gas estimation failed, using hardcoded limit", error);
        gasLimit = ethers.parseUnits("500000", 0); // 500k gas
      }

      console.log("Using gas limit:", gasLimit.toString());

      // Execute claim
      showToast("info", "Claiming rewards...");
      const claimTx = await stakingContract.claim({
        gasLimit: gasLimit,
      });

      console.log("Claim transaction sent:", claimTx.hash);
      showToast("info", "Transaction sent! Waiting for confirmation...");
      const receipt = await claimTx.wait();
      console.log("Claim successful! Block:", receipt.blockNumber);
      showToast("success", "Rewards claimed successfully!");

      // Refresh user balances after successful claim
      try {
        // Small delay to ensure blockchain state is updated
        // await new Promise((resolve) => setTimeout(resolve, 2000));
        await fetchUserBalances();
        console.log("User balances refreshed after claim");
      } catch (error) {
        console.error("Failed to refresh balances after claim:", error);
      }
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
      const provider = new ethers.BrowserProvider(window.ethereum as any);
      const signer = await provider.getSigner();
      const stakingContract = new ethers.Contract(
        STAKING_CONTRACT_ADDRESS,
        STAKING_CONTRACT_ABI,
        signer
      );

      // Get user's staked amount
      const userInfo = await stakingContract.userInfo(signer.address);
      const stakedAmount = userInfo.amount;

      if (stakedAmount <= 0) {
        showToast("warning", "You have no tokens staked to emergency withdraw");
        return;
      }

      // Convert staked amount to human readable format for display
      const stakedTokenAddress = await stakingContract.stakedToken();
      const stakedTokenContract = new ethers.Contract(
        stakedTokenAddress,
        erc20Abi,
        signer
      );
      const decimals = await stakedTokenContract.decimals();
      const stakedAmountFormatted = ethers.formatUnits(stakedAmount, decimals);

      console.log(
        "Emergency withdrawing all staked tokens:",
        stakedAmountFormatted
      );

      // Hardcoded gas limit (temporary until contract is updated)
      const hardcodedGasLimit = ethers.parseUnits("500000", 0); // 500k gas
      console.log("Using hardcoded gas limit:", hardcodedGasLimit.toString());

      // Execute emergency withdraw
      const emergencyWithdrawTx = await stakingContract.emergencyWithdraw({
        gasLimit: hardcodedGasLimit,
      });

      console.log(
        "Emergency withdraw transaction sent:",
        emergencyWithdrawTx.hash
      );
      const receipt = await emergencyWithdrawTx.wait();
      console.log("Emergency withdraw successful! Block:", receipt.blockNumber);
      showToast("success", "Emergency withdraw successful");

      // Refresh user balances after successful emergency withdraw
      try {
        // Small delay to ensure blockchain state is updated
        // await new Promise((resolve) => setTimeout(resolve, 2000));
        await fetchUserBalances();
        console.log("User balances refreshed after emergency withdraw");
      } catch (error) {
        console.error(
          "Failed to refresh balances after emergency withdraw:",
          error
        );
      }
    } catch (error) {
      console.error("Error emergency withdrawing:", error);
      showToast("error", getErrorMessage(error, "emergency withdraw"));
    }
  };

  // Function to calculate unstake timer
  const calculateUnstakeTimer = async () => {
    if (!isConnected || !STAKING_CONTRACT_ADDRESS) {
      return { timeRemaining: 0, canUnstake: false };
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum as any);
      const stakingContract = new ethers.Contract(
        STAKING_CONTRACT_ADDRESS,
        STAKING_CONTRACT_ABI,
        provider
      );

      const currentBlock = await provider.getBlockNumber();
      const bonusEndBlock = await stakingContract.stakeEndBlock();
      // Convert BigInt to Number for calculations
      const currentBlockNum = Number(currentBlock);
      const bonusEndBlockNum = Number(bonusEndBlock);

      const remainingBlocks = bonusEndBlockNum - currentBlockNum;

      const timeRemainingSeconds =
        remainingBlocks * Number(process.env.NEXT_PUBLIC_BLOCK_EXECUTION_TIME);

      const canUnstake = timeRemainingSeconds <= 0;

      return { timeRemaining: Math.max(0, timeRemainingSeconds), canUnstake };
    } catch (error) {
      console.error("Error calculating unstake timer:", error);
      return { timeRemaining: 0, canUnstake: false };
    }
  };

  // Function to format seconds to HH:MM:SS
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
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
  };
};
