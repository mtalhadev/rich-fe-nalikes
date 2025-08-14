"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { useAccount, useDisconnect, useSwitchChain } from "wagmi";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { useLoginWithAbstract } from "@abstract-foundation/agw-react";
import { ethers } from "ethers";
import { erc20Abi } from "viem";
import { TARGET_CHAIN } from "@/config/chains";
import { showToast } from "@/components/CustomToast";
import {
  STAKING_CONTRACT_ABI,
  STAKING_CONTRACT_ADDRESS,
} from "../../utils/constants";
import { fixedNumber } from "../../utils/helpers";

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

interface UserBalances {
  tokenBalance: string;
  stakedTokenBalanceContract: number;
  stakedTokenBalance: number;
  rewardTokenBalance: string;
  stakedTokenAllowance: string;
  nativeBalance: string;
  stakedTokenAddress: string;
  rewardTokenAddress: string;
  pendingReward: string;
  fourtyFiveDaysApy: string;
  ninetyDaysApy: string;
}

interface WalletContextType {
  // Connection state
  isConnected: boolean;
  isConnecting: boolean;

  // Connection methods
  connectWallet: () => Promise<void>;
  connectAbstractWallet: () => Promise<void>;
  disconnectWallet: () => void;

  // UI state
  connectWalletLabel: string;
  setConnectWalletLabel: (label: string) => void;

  // Account info
  address: string | undefined;
  isMounted: boolean;

  // Chain info
  isOnCorrectChain: boolean;

  // Balances
  userBalances: UserBalances | null;
  fetchUserBalances: () => Promise<void>;
  isLoadingBalances: boolean;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

interface WalletProviderProps {
  children: ReactNode;
}

export const WalletProvider: React.FC<WalletProviderProps> = ({ children }) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectWalletLabel, setConnectWalletLabel] =
    useState("CONNECT WALLET");
  const [isMounted, setIsMounted] = useState(false);
  const [userBalances, setUserBalances] = useState<UserBalances | null>(null);
  const [isLoadingBalances, setIsLoadingBalances] = useState(false);

  // Wagmi hooks
  const { isConnected, address, chain } = useAccount();
  const { openConnectModal } = useConnectModal();
  const { disconnect } = useDisconnect();

  // Abstract wallet hooks
  const { login, logout } = useLoginWithAbstract();
  const { switchChainAsync } = useSwitchChain();

  // Check if user is on the correct chain
  const isOnCorrectChain = chain?.id === TARGET_CHAIN.id;
  // Function to handle chain switching
  const handleChainSwitch = async () => {
    if (isOnCorrectChain) return true;

    try {
      await switchChainAsync({ chainId: TARGET_CHAIN.id });
      return true;
    } catch (error: any) {
      console.error("Failed to switch chain:", error);

      // If chain doesn't exist, try to add it
      if (error.code === 4902 || error.message?.includes("does not exist")) {
        try {
          showToast("info", "Adding Abstract chain to MetaMask...");
          await addChainToMetaMask();
          await switchChainAsync({ chainId: TARGET_CHAIN.id });
          showToast("success", "Abstract chain added and switched!");
          return true;
        } catch (addChainError) {
          console.error("Failed to add chain:", addChainError);
          showToast("error", "Failed to add Abstract chain to MetaMask");
          return false;
        }
      }

      showToast("warning", "Please switch to Abstract Testnet to continue");
      return false;
    }
  };

  // Set mounted state after hydration
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Handle regular wallet connection
  const connectWallet = async () => {
    if (isConnected) {
      disconnect();
    } else {
      openConnectModal?.();

      // Listen for connection and then switch chain
      const checkConnection = setInterval(async () => {
        if (isConnected && address) {
          clearInterval(checkConnection);
          const switched = await handleChainSwitch();
          if (switched) {
            console.log(
              "Successfully connected and switched to Abstract chain"
            );
          }
        }
      }, 1000);

      // Clear interval after 30 seconds to prevent memory leaks
      setTimeout(() => clearInterval(checkConnection), 30000);
    }
  };

  // Handle Abstract wallet connection
  const connectAbstractWallet = async () => {
    try {
      setIsConnecting(true);
      await login();
    } catch (error) {
      console.error("Failed to connect Abstract wallet:", error);
    } finally {
      setIsConnecting(false);
    }
  };

  // Handle wallet disconnection
  const disconnectWallet = () => {
    if (isConnected) {
      disconnect();
    }
    // Note: Abstract wallet logout is handled through the regular disconnect
    // since Abstract is integrated through RainbowKit
  };

  // Fetch user balances
  const fetchUserBalances = async () => {
    if (!isConnected || !address || !STAKING_CONTRACT_ADDRESS) {
      console.log(
        "Cannot fetch balances: not connected, no address, or no contract address"
      );
      return;
    }

    setIsLoadingBalances(true);
    try {
      const provider = new ethers.BrowserProvider(window.ethereum as any);
      const signer = await provider.getSigner();

      console.log("Contract address:", STAKING_CONTRACT_ADDRESS);
      console.log("User address:", signer.address);

      const stakingContract = new ethers.Contract(
        STAKING_CONTRACT_ADDRESS,
        STAKING_CONTRACT_ABI,
        signer
      );

      // Check if contract exists and has code
      const code = await provider.getCode(STAKING_CONTRACT_ADDRESS);
      if (code === "0x") {
        console.error(
          "No contract found at address:",
          STAKING_CONTRACT_ADDRESS
        );
        setUserBalances(null);
        return;
      }

      console.log("Contract code found, attempting to call stakedToken()...");

      let stakedTokenAddress: string;
      let rewardTokenAddress: string;

      try {
        stakedTokenAddress = await stakingContract.stakedToken();
        console.log("Staked token address:", stakedTokenAddress);
      } catch (stakedTokenError) {
        console.error("Error calling stakedToken():", stakedTokenError);
        console.log(
          "This might mean the contract doesn't have stakedToken() function"
        );
        setUserBalances(null);
        return;
      }

      try {
        rewardTokenAddress = await stakingContract.rewardToken();
        console.log("Reward token address:", rewardTokenAddress);
      } catch (rewardTokenError) {
        console.error("Error calling rewardToken():", rewardTokenError);
        console.log(
          "This might mean the contract doesn't have rewardToken() function"
        );
        setUserBalances(null);
        return;
      }

      const stakedTokenContract = new ethers.Contract(
        stakedTokenAddress,
        erc20Abi,
        signer
      );
      const rewardTokenContract = new ethers.Contract(
        rewardTokenAddress,
        erc20Abi,
        signer
      );

      const userInfo = await stakingContract.userInfo(signer.address);
      const pendingReward = await stakingContract.pendingReward(signer.address);
      const stakedTokenBalance = userInfo.amount;

      const stakedTokenBalanceContract = await stakedTokenContract.balanceOf(
        STAKING_CONTRACT_ADDRESS
      );

      const tokenBalance = await stakedTokenContract.balanceOf(signer.address);
      const rewardTokenBalance = await rewardTokenContract.balanceOf(
        signer.address
      );
      const stakedTokenAllowance = await stakedTokenContract.allowance(
        signer.address,
        STAKING_CONTRACT_ADDRESS
      );
      const nativeBalance = await provider.getBalance(signer.address);

      const stakedTokenDecimals = await stakedTokenContract.decimals();
      const rewardTokenDecimals = await rewardTokenContract.decimals();

      let fourtyFiveDaysApy = "0";
      let ninetyDaysApy = "0";

      try {
        const rewardPerBlock = await stakingContract.rewardPerBlock();

        // Calculate rewards per year (assuming 12 second block time)
        const blocksPerFourtyFiveDays =
          (45 * 24 * 60 * 60) /
          Number(process.env.NEXT_PUBLIC_BLOCK_EXECUTION_TIME);
        const blocksPerNinetyDays =
          (90 * 24 * 60 * 60) /
          Number(process.env.NEXT_PUBLIC_BLOCK_EXECUTION_TIME);
        const rewardsPerFourtyFiveDays =
          rewardPerBlock * BigInt(blocksPerFourtyFiveDays);
        const rewardsPerNinetyFiveDays =
          rewardPerBlock * BigInt(blocksPerNinetyDays);

        // This would require getting total staked from the contract
        // For now, we'll use a placeholder
        const totalStaked = ethers.parseUnits(
          stakedTokenBalanceContract.toString(),
          stakedTokenDecimals
        );

        if (totalStaked > BigInt(0)) {
          const apyFourtyFiveDays =
            rewardsPerFourtyFiveDays / (totalStaked * BigInt(10));
          const apyNinetyDays =
            rewardsPerNinetyFiveDays / (totalStaked * BigInt(10));
          fourtyFiveDaysApy = apyFourtyFiveDays.toString();
          ninetyDaysApy = apyNinetyDays.toString();
        }
      } catch (error) {
        console.error("Error calculating APY:", error);
      }

      const balances: UserBalances = {
        stakedTokenAddress,
        rewardTokenAddress,
        pendingReward: ethers.formatUnits(pendingReward, stakedTokenDecimals),
        fourtyFiveDaysApy,
        ninetyDaysApy,
        // tokenBalance: ethers.formatUnits(
        //   tokenBalance,
        //   stakedTokenDecimals
        // ),
        tokenBalance: tokenBalance.toString(),
        stakedTokenBalanceContract: fixedNumber(
          ethers.formatUnits(stakedTokenBalanceContract, stakedTokenDecimals),
          2
        ),
        stakedTokenBalance: fixedNumber(
          ethers.formatUnits(stakedTokenBalance, stakedTokenDecimals),
          2
        ),
        // rewardTokenBalance: ethers.formatUnits(
        //   rewardTokenBalance,
        //   rewardTokenDecimals
        // ),
        rewardTokenBalance: rewardTokenBalance.toString(),
        stakedTokenAllowance: ethers.formatUnits(
          stakedTokenAllowance,
          stakedTokenDecimals
        ),
        nativeBalance: ethers.formatUnits(nativeBalance),
      };

      setUserBalances(balances);
      console.log("User balances updated:", balances);
    } catch (error) {
      console.error("Error fetching user balances:", error);
      setUserBalances(null);
    } finally {
      setIsLoadingBalances(false);
    }
  };

  // Update connect wallet label based on connection state
  useEffect(() => {
    if (isConnected) {
      setConnectWalletLabel("DISCONNECT WALLET");
    } else {
      setConnectWalletLabel("CONNECT WALLET");
    }
  }, [isConnected, setConnectWalletLabel]);

  // Fetch balances when user connects
  useEffect(() => {
    if (isConnected && address) {
      fetchUserBalances();
    } else {
      setUserBalances(null);
    }
  }, [isConnected, address]);

  const value: WalletContextType = {
    // Connection state
    isConnected,
    isConnecting,

    // Connection methods
    connectWallet,
    connectAbstractWallet,
    disconnectWallet,

    // UI state
    connectWalletLabel,
    setConnectWalletLabel,

    // Account info
    address,
    isMounted,

    // Chain info
    isOnCorrectChain,

    // Balances
    userBalances,
    fetchUserBalances,
    isLoadingBalances,
  };

  return (
    <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
  );
};

// Custom hook to use wallet context
export const useWallet = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
};
