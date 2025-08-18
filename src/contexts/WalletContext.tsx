"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import {
  useAccount,
  useDisconnect,
  useReadContract,
  useSwitchChain,
} from "wagmi";
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
  tokenBalance: number;
  stakedTokenBalanceContract: number;
  stakedTokenBalance: number;
  stakedTokenSupply: number;
  rewardTokenBalance: number;
  stakedTokenAllowance: string;
  nativeBalance: string;
  stakedTokenAddress: string;
  rewardTokenAddress: string;
  pendingReward: number;
  fourtyFiveDaysApy: string;
  ninetyDaysApy: string;
  perBlockExecutionTime?: number;
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
  fetchTotalStaked: () => Promise<void>;
  updateBlockExecutionTime: () => Promise<void>;
  isLoadingBalances: boolean;

  // Success Modal
  isStakingSuccessModalOpen: boolean;
  setIsStakingSuccessModalOpen: (isOpen: boolean) => void;
  showStakingSuccessModal: () => void;
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
  const [userBalances, setUserBalances] = useState<UserBalances | null>({
    tokenBalance: 0,
    stakedTokenBalanceContract: 0,
    stakedTokenBalance: 0,
    stakedTokenSupply: 0,
    rewardTokenBalance: 0,
    stakedTokenAllowance: "0",
    nativeBalance: "0",
    stakedTokenAddress: "",
    rewardTokenAddress: "",
    pendingReward: 0,
    fourtyFiveDaysApy: "0",
    ninetyDaysApy: "0",
    perBlockExecutionTime: 12,
  });
  const [isLoadingBalances, setIsLoadingBalances] = useState(false);
  const [isStakingSuccessModalOpen, setIsStakingSuccessModalOpen] =
    useState(false);

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

  // Show staking success modal
  const showStakingSuccessModal = () => {
    setIsStakingSuccessModalOpen(true);
  };

  // Fetch total staked amount using public RPC (no wallet connection required)
  const fetchTotalStaked = async () => {
    if (!STAKING_CONTRACT_ADDRESS) {
      console.log("Staking contract address is not set");
      return;
    }

    try {
      // Use public RPC endpoint for Abstract
      const publicProvider = new ethers.JsonRpcProvider(
        process.env.NEXT_PUBLIC_RPC_URL
      );

      const stakingContract = new ethers.Contract(
        STAKING_CONTRACT_ADDRESS,
        STAKING_CONTRACT_ABI,
        publicProvider
      );

      // Get total staked amount
      const stakedTokenSupply = await stakingContract.stakedTokenSupply();

      // Get token decimals for proper formatting
      const stakedTokenAddress = await stakingContract.stakedToken();
      const tokenContract = new ethers.Contract(
        stakedTokenAddress,
        ["function decimals() view returns (uint8)"],
        publicProvider
      );

      const decimals = await tokenContract.decimals();

      // Format the total staked amount
      const formattedTotalStaked = ethers.formatUnits(
        stakedTokenSupply,
        decimals
      );

      // Update userBalances with the total staked amount
      setUserBalances((prevBalances) => {
        if (prevBalances) {
          return {
            ...prevBalances,
            stakedTokenSupply: parseFloat(formattedTotalStaked),
          };
        }
        return prevBalances;
      });

      console.log("Total staked amount updated:", formattedTotalStaked);
    } catch (err: any) {
      console.error("Error fetching total staked:", err);
      // Don't update state on error, keep existing values
    }
  };

  // Calculate and update block execution time
  const updateBlockExecutionTime = async () => {
    try {
      // Use public RPC endpoint for Abstract
      const publicProvider = new ethers.JsonRpcProvider(
        process.env.NEXT_PUBLIC_RPC_URL
      );

      // Get latest block number
      const latestBlock = await publicProvider.getBlockNumber();

      // Get latest block details
      const latest = await publicProvider.getBlock(latestBlock);

      // Get earlier block details (20 blocks back)
      const first = await publicProvider.getBlock(latestBlock - 20);

      if (latest && first) {
        // Calculate average block time
        const avgBlockTime = (latest.timestamp - first.timestamp) / 20;

        // Update userBalances with the calculated block time
        setUserBalances((prevBalances) => {
          if (prevBalances) {
            return {
              ...prevBalances,
              perBlockExecutionTime: avgBlockTime,
            };
          }
          return prevBalances;
        });

        console.log("Block execution time updated:", avgBlockTime);
      }
    } catch (err: any) {
      console.error("Error calculating block execution time:", err);
      // Keep the default value on error
    }
  };

  // Read contract hooks for staking contract
  const { data: stakedTokenAddress } = useReadContract({
    address: STAKING_CONTRACT_ADDRESS as `0x${string}`,
    abi: STAKING_CONTRACT_ABI,
    functionName: "stakedToken",
    query: {
      enabled: !!STAKING_CONTRACT_ADDRESS,
    },
  });

  const { data: rewardTokenAddress } = useReadContract({
    address: STAKING_CONTRACT_ADDRESS as `0x${string}`,
    abi: STAKING_CONTRACT_ABI,
    functionName: "rewardToken",
    query: {
      enabled: !!STAKING_CONTRACT_ADDRESS,
    },
  });

  const { data: stakedTokenSupply } = useReadContract({
    address: STAKING_CONTRACT_ADDRESS as `0x${string}`,
    abi: STAKING_CONTRACT_ABI,
    functionName: "stakedTokenSupply",
    query: {
      enabled: !!STAKING_CONTRACT_ADDRESS,
    },
  });

  const { data: rewardPerBlock } = useReadContract({
    address: STAKING_CONTRACT_ADDRESS as `0x${string}`,
    abi: STAKING_CONTRACT_ABI,
    functionName: "rewardPerBlock",
    query: {
      enabled: !!STAKING_CONTRACT_ADDRESS,
    },
  });

  // Read contract hooks for user-specific data
  const { data: userInfo } = useReadContract({
    address: STAKING_CONTRACT_ADDRESS as `0x${string}`,
    abi: STAKING_CONTRACT_ABI,
    functionName: "userInfo",
    args: address ? [address] : undefined,
    query: {
      enabled: !!STAKING_CONTRACT_ADDRESS && !!address,
    },
  });

  const { data: pendingReward } = useReadContract({
    address: STAKING_CONTRACT_ADDRESS as `0x${string}`,
    abi: STAKING_CONTRACT_ABI,
    functionName: "pendingReward",
    args: address ? [address] : undefined,
    query: {
      enabled: !!STAKING_CONTRACT_ADDRESS && !!address,
    },
  });

  // Read contract hooks for token contracts (only when addresses are available)
  const { data: tokenBalance } = useReadContract({
    address: stakedTokenAddress as `0x${string}`,
    abi: erc20Abi,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: {
      enabled: !!stakedTokenAddress && !!address,
    },
  });

  const { data: rewardTokenBalance } = useReadContract({
    address: rewardTokenAddress as `0x${string}`,
    abi: erc20Abi,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: {
      enabled: !!rewardTokenAddress && !!address,
    },
  });

  const { data: stakedTokenAllowance } = useReadContract({
    address: stakedTokenAddress as `0x${string}`,
    abi: erc20Abi,
    functionName: "allowance",
    args:
      address && STAKING_CONTRACT_ADDRESS
        ? [address, STAKING_CONTRACT_ADDRESS as `0x${string}`]
        : undefined,
    query: {
      enabled: !!stakedTokenAddress && !!address && !!STAKING_CONTRACT_ADDRESS,
    },
  });

  const { data: stakedTokenBalanceContract } = useReadContract({
    address: stakedTokenAddress as `0x${string}`,
    abi: erc20Abi,
    functionName: "balanceOf",
    args: STAKING_CONTRACT_ADDRESS
      ? [STAKING_CONTRACT_ADDRESS as `0x${string}`]
      : undefined,
    query: {
      enabled: !!stakedTokenAddress && !!STAKING_CONTRACT_ADDRESS,
    },
  });

  // Read contract hooks for token decimals
  const { data: stakedTokenDecimals } = useReadContract({
    address: stakedTokenAddress as `0x${string}`,
    abi: erc20Abi,
    functionName: "decimals",
    query: {
      enabled: !!stakedTokenAddress,
    },
  });

  const { data: rewardTokenDecimals } = useReadContract({
    address: rewardTokenAddress as `0x${string}`,
    abi: erc20Abi,
    functionName: "decimals",
    query: {
      enabled: !!rewardTokenAddress,
    },
  });

  // Fetch user balances - now using the read contract hooks
  const fetchUserBalances = async () => {
    if (!isConnected || !address || !STAKING_CONTRACT_ADDRESS) {
      console.log(
        "Cannot fetch balances: not connected, no address, or no contract address"
      );
      return;
    }
    console.log("fetching user balances");
    console.log("stakedTokenAddress", stakedTokenAddress);
    console.log("rewardTokenAddress", rewardTokenAddress);
    console.log("stakedTokenDecimals", stakedTokenDecimals);
    console.log("rewardTokenDecimals", rewardTokenDecimals);
    console.log("userInfo", userInfo);
    console.log("pendingReward", pendingReward);
    console.log("tokenBalance", tokenBalance);
    console.log("rewardTokenBalance", rewardTokenBalance);
    console.log("stakedTokenAllowance", stakedTokenAllowance);
    console.log("stakedTokenBalanceContract", stakedTokenBalanceContract);
    console.log("stakedTokenSupply", stakedTokenSupply);
    console.log("rewardPerBlock", rewardPerBlock);

    // The balances are now automatically updated through the useReadContract hooks
    // We just need to format and set them when all data is available
    if (
      stakedTokenAddress &&
      rewardTokenAddress &&
      stakedTokenDecimals !== undefined &&
      rewardTokenDecimals !== undefined &&
      userInfo &&
      pendingReward !== undefined &&
      tokenBalance !== undefined &&
      rewardTokenBalance !== undefined &&
      stakedTokenAllowance !== undefined &&
      stakedTokenBalanceContract !== undefined &&
      stakedTokenSupply !== undefined &&
      rewardPerBlock !== undefined
    ) {
      try {
        // Calculate APY
        let fourtyFiveDaysApy = "0";
        let ninetyDaysApy = "0";

        try {
          if (rewardPerBlock !== null && stakedTokenBalanceContract !== null) {
            const rewardPerBlockFormatted = ethers.formatUnits(
              rewardPerBlock as bigint,
              rewardTokenDecimals
            );

            // Calculate rewards per year using dynamic block execution time
            const currentBlockTime = userBalances?.perBlockExecutionTime || 12;
            const blocksPerFourtyFiveDays =
              (45 * 24 * 60 * 60) / currentBlockTime;
            const blocksPerNinetyDays = (90 * 24 * 60 * 60) / currentBlockTime;
            const rewardsPerFourtyFiveDays =
              Number(rewardPerBlockFormatted) * Number(blocksPerFourtyFiveDays);
            const rewardsPerNinetyFiveDays =
              Number(rewardPerBlockFormatted) * Number(blocksPerNinetyDays);

            const totalStaked = ethers.formatUnits(
              stakedTokenBalanceContract as bigint,
              stakedTokenDecimals
            );

            if (Number(totalStaked) > 0) {
              const apyFourtyFiveDays =
                Number(rewardsPerFourtyFiveDays) / Number(totalStaked);
              const apyNinetyDays =
                Number(rewardsPerNinetyFiveDays) / Number(totalStaked);
              fourtyFiveDaysApy = apyFourtyFiveDays.toString();
              ninetyDaysApy = apyNinetyDays.toString();
            }
          }
        } catch (error) {
          console.error("Error calculating APY:", error);
        }

        console.log("Formatting balances with:");
        console.log(
          "pendingReward:",
          pendingReward,
          "type:",
          typeof pendingReward
        );
        console.log(
          "tokenBalance:",
          tokenBalance,
          "type:",
          typeof tokenBalance
        );
        console.log(
          "stakedTokenBalanceContract:",
          stakedTokenBalanceContract,
          "type:",
          typeof stakedTokenBalanceContract
        );
        console.log(
          "userInfo[0]:",
          userInfo && Array.isArray(userInfo) ? userInfo[0] : userInfo,
          "type:",
          typeof (userInfo && Array.isArray(userInfo) ? userInfo[0] : userInfo)
        );
        console.log(
          "stakedTokenSupply:",
          stakedTokenSupply,
          "type:",
          typeof stakedTokenSupply
        );
        console.log(
          "rewardTokenBalance:",
          rewardTokenBalance,
          "type:",
          typeof rewardTokenBalance
        );
        console.log(
          "stakedTokenAllowance:",
          stakedTokenAllowance,
          "type:",
          typeof stakedTokenAllowance
        );

        const balances: UserBalances = {
          stakedTokenAddress: stakedTokenAddress as string,
          rewardTokenAddress: rewardTokenAddress as string,
          pendingReward: fixedNumber(
            pendingReward !== null
              ? ethers.formatUnits(pendingReward as bigint, rewardTokenDecimals)
              : "0",
            2
          ),
          fourtyFiveDaysApy,
          ninetyDaysApy,
          tokenBalance: fixedNumber(
            tokenBalance !== null
              ? ethers.formatUnits(tokenBalance as bigint, stakedTokenDecimals)
              : "0",
            2
          ),
          stakedTokenBalanceContract: fixedNumber(
            stakedTokenBalanceContract !== null
              ? ethers.formatUnits(
                  stakedTokenBalanceContract as bigint,
                  stakedTokenDecimals
                )
              : "0",
            2
          ),
          stakedTokenBalance: fixedNumber(
            userInfo && Array.isArray(userInfo) && userInfo[0] !== null
              ? ethers.formatUnits(userInfo[0] as bigint, stakedTokenDecimals)
              : "0",
            2
          ),
          stakedTokenSupply: fixedNumber(
            stakedTokenSupply !== null
              ? ethers.formatUnits(
                  stakedTokenSupply as bigint,
                  stakedTokenDecimals
                )
              : "0",
            2
          ),
          rewardTokenBalance: fixedNumber(
            rewardTokenBalance !== null
              ? ethers.formatUnits(
                  rewardTokenBalance as bigint,
                  rewardTokenDecimals
                )
              : "0",
            2
          ),
          stakedTokenAllowance:
            stakedTokenAllowance !== null
              ? ethers.formatUnits(
                  stakedTokenAllowance as bigint,
                  stakedTokenDecimals
                )
              : "0",
          nativeBalance: "0", // We'll need to get this separately if needed
        };

        setUserBalances((prevBalances) => {
          if (prevBalances) {
            return {
              ...prevBalances,
              ...balances,
            };
          }
          return balances;
        });
        console.log("User balances updated:", balances);
      } catch (error) {
        console.error("Error formatting balances:", error);
      }
    }
  };

  // Update connect wallet label based on connection state
  useEffect(() => {
    if (isConnected && address) {
      // setConnectWalletLabel("DISCONNECT WALLET");
      setConnectWalletLabel(address.slice(0, 6) + "..." + address.slice(-4));
    } else {
      setConnectWalletLabel("CONNECT WALLET");
    }
  }, [isConnected, setConnectWalletLabel, address]);

  // Update balances when contract data changes
  useEffect(() => {
    if (isConnected && address) {
      fetchUserBalances();
    }
  }, [
    isConnected,
    address,
    stakedTokenAddress,
    rewardTokenAddress,
    stakedTokenDecimals,
    rewardTokenDecimals,
    userInfo,
    pendingReward,
    tokenBalance,
    rewardTokenBalance,
    stakedTokenAllowance,
    stakedTokenBalanceContract,
    stakedTokenSupply,
    rewardPerBlock,
  ]);

  // Fetch total staked amount when component mounts (no wallet connection required)
  useEffect(() => {
    fetchTotalStaked();
    updateBlockExecutionTime();
  }, []);

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
    fetchTotalStaked,
    updateBlockExecutionTime,
    isLoadingBalances,

    // Success Modal
    isStakingSuccessModalOpen,
    setIsStakingSuccessModalOpen,
    showStakingSuccessModal,
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
