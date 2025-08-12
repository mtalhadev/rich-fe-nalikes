"use client";

import Image from "next/image";
import React, {
  useEffect,
  useState,
  useRef,
  useMemo,
  useCallback,
} from "react";
import { useWallet } from "@/contexts/WalletContext";
import { NumericFormat } from "react-number-format";
import { useWalletOperations } from "@/hooks/useWalletOperations";
import { showToast } from "@/components/CustomToast";

type ButtonState = "stake" | "unstake" | "claim";

type VaultCardProps = {
  vaultName?: string;
  totalStaked?: number | string;
  yourStaked?: number | string;
  yourStakedMax?: number | string;
  days?: number;
  earliestUnlock?: string;
  pendingRewards?: number | string;
  claimedRewards?: number | string;
  tokenSymbol?: string;
  index?: number;
};

// Data structure for button configuration
const BUTTON_CONFIG = {
  stake: {
    label: "STAKE",
    activeIcon: "/stake-icon.svg",
    inactiveIcon: "/stake-icon-blue.svg",
    action: "STAKE",
  },
  unstake: {
    label: "UNSTAKE",
    activeIcon: "/unstake-icon-white.svg",
    inactiveIcon: "/unstake-icon.svg",
    action: "UNSTAKE",
  },
  claim: {
    label: "CLAIM",
    activeIcon: "/claim-icon-white.svg",
    inactiveIcon: "/claim-icon.svg",
    action: "CLAIM",
  },
} as const;

// Data structure for content configuration
const CONTENT_CONFIG = {
  stake: {
    sections: [
      {
        type: "stats",
        data: {
          totalStaked: 0,
          yourStaked: 0,
          yourStakedMax: 0,
        },
      },
      {
        type: "input",
        data: {
          label: "You Will Stake",
          value: "0.0",
          showMax: true,
        },
      },
    ],
  },
  unstake: {
    sections: [
      {
        type: "unstack",
        data: {
          items: [
            {
              label: "Unstack Unlock in",
              value: "unstackTime",
              showIcon: true,
              icon: "/icon.svg",
            },
            {
              label: "You will receive",
              value: "pendingReward",
              showIcon: true,
              icon: "/icon.svg",
            },
          ],
        },
      },
    ],
  },
  claim: {
    sections: [
      {
        type: "info",
        data: {
          items: [
            {
              label: "Pending rewards",
              value: "pendingReward",
            },
          ],
        },
      },
    ],
  },
} as const;

const VaultCard: React.FC<VaultCardProps> = ({
  days = 45,
  yourStaked = 0,
  yourStakedMax = 0,
  earliestUnlock = "75:09:09",
  pendingRewards = 6544.82,
  claimedRewards = 6544.82,
  tokenSymbol = "RWA",
  index = 0,
}) => {
  const { isConnected, connectWallet, userBalances } = useWallet();
  const {
    handleStake,
    handleUnstake,
    handleClaim,
    isOnCorrectChain,
    calculateUnstakeTimer,
    formatTime,
  } = useWalletOperations();
  const [activeButton, setActiveButton] = useState<ButtonState>("stake");
  const [mounted, setMounted] = useState(false);
  const [buttonLabel, setButtonLabel] = useState("CONNECT WALLET");
  const [stakeAmount, setStakeAmount] = useState("0");
  const [unstakeTimer, setUnstakeTimer] = useState("00:00:00");
  const [canUnstake, setCanUnstake] = useState(false);
  const [timeRemainingSeconds, setTimeRemainingSeconds] = useState(0);
  const [countdownActive, setCountdownActive] = useState(false);

  // Get user's balances and data - memoized to prevent unnecessary re-renders
  const balances = useMemo(
    () => ({
      totalStaked: userBalances?.stakedTokenBalanceContract || "0",
      userBalance: userBalances?.tokenBalance || "0",
      userStakedBalance: userBalances?.stakedTokenBalance || "0",
      pendingReward: userBalances?.pendingReward || "0",
      stakedAmount: userBalances?.stakedTokenAllowance || "0", // This will be updated to actual staked amount
    }),
    [userBalances]
  );

  const {
    totalStaked,
    userBalance,
    userStakedBalance,
    pendingReward,
    stakedAmount,
  } = balances;
  const apy = useMemo(() => {
    const apyValue =
      days === 45
        ? userBalances?.fourtyFiveDaysApy || "0"
        : userBalances?.ninetyDaysApy || "0";
    return apyValue;
  }, [days, userBalances?.fourtyFiveDaysApy, userBalances?.ninetyDaysApy]);

  const maxStakeAmount = useMemo(() => parseFloat(userBalance), [userBalance]);

  // Validate stake amount - memoized to prevent recreation
  const validateStakeAmount = useCallback(
    (amount: string) => {
      const numAmount = parseFloat(amount);
      if (isNaN(numAmount) || numAmount <= 0) {
        return "Please enter a valid amount greater than 0";
      }
      if (numAmount > maxStakeAmount) {
        return `Amount cannot exceed your balance of ${userBalance} ${tokenSymbol}`;
      }
      return null; // Valid
    },
    [maxStakeAmount, userBalance, tokenSymbol]
  );

  // Validate unstake operation - memoized to prevent recreation
  const validateUnstake = useCallback(() => {
    const stakedAmountNum = parseFloat(stakedAmount);
    if (stakedAmountNum <= 0) {
      return "You have no tokens staked to withdraw";
    }
    return null; // Valid
  }, [stakedAmount]);

  // Validate claim operation - memoized to prevent recreation
  const validateClaim = useCallback(() => {
    const rewardBalanceNum = parseFloat(pendingReward);
    if (rewardBalanceNum <= 0) {
      showToast("error", "No rewards available to claim");
      return "No rewards available to claim";
    }
    return null; // Valid
  }, [pendingReward]);
  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 200 + (index || 0) * 200);
    return () => clearTimeout(timer);
  }, [index]);

  useEffect(() => {
    if (isConnected) {
      setButtonLabel(BUTTON_CONFIG[activeButton].action);
    } else {
      setButtonLabel("CONNECT WALLET");
    }
  }, [isConnected, activeButton]);

  // Initial timer fetch - only run when connection status changes
  useEffect(() => {
    const updateTimer = async () => {
      if (isConnected) {
        const { timeRemaining, canUnstake } = await calculateUnstakeTimer();
        setTimeRemainingSeconds(timeRemaining);
        setUnstakeTimer(formatTime(timeRemaining));
        setCanUnstake(canUnstake);

        // Start countdown if there's time remaining
        if (timeRemaining > 0) {
          setCountdownActive(true);
        } else {
          setCountdownActive(false);
        }
      }
    };

    updateTimer();
  }, [isConnected]); // Only depend on isConnected, not the functions

  // Countdown timer effect - optimized to prevent unnecessary re-renders
  useEffect(() => {
    if (!countdownActive || timeRemainingSeconds <= 0) {
      return;
    }

    const interval = setInterval(() => {
      setTimeRemainingSeconds((prevSeconds) => {
        const newSeconds = Math.max(0, prevSeconds - 1);

        // Update the formatted timer display
        setUnstakeTimer(formatTime(newSeconds));

        // Stop countdown if we reach 0
        if (newSeconds === 0) {
          setCountdownActive(false);
          setCanUnstake(true);
        }

        return newSeconds;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [countdownActive, formatTime]); // Include formatTime dependency

  // Cleanup countdown when component unmounts or connection changes
  useEffect(() => {
    return () => {
      setCountdownActive(false);
      setTimeRemainingSeconds(0);
    };
  }, [isConnected]);

  const getButtonStyles = (buttonType: ButtonState) => {
    const baseStyles =
      "flex-1 font-normal py-1 rounded-lg flex items-center justify-center gap-1 font-luckiest-guy text-[15px] transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg";
    return activeButton === buttonType
      ? `${baseStyles} bg-primary-blue text-white shadow-md`
      : `${baseStyles} bg-[#B8CEFF] text-primary-blue border border-primary-blue hover:bg-[#A3C0FF] hover:border-[#002A8C]`;
  };

  const getValueFromKey = (key: string) => {
    const valueMap = {
      totalStaked,
      yourStaked,
      yourStakedMax,
      earliestUnlock,
      claimedRewards,
      stakedAmount,
      pendingReward,
      userBalance,
      unstackTime: earliestUnlock,
    };
    return valueMap[key as keyof typeof valueMap] || 0;
  };

  const renderStatsSection = () => (
    <div className="bg-dark-blue rounded-lg px-3 md:px-4 py-3 text-white font-semibold mb-4">
      <div className="border-b-2 border-[#759CF3] flex justify-between items-center">
        <div className="flex flex-col">
          <span className="text-xs font-poppins font-semibold">
            Total Staked
          </span>
          <span className="font-normal font-luckiest-guy text-lg">
            <NumericFormat
              value={totalStaked || 0}
              thousandSeparator
              displayType="text"
              decimalScale={2}
            />
          </span>
        </div>
        <div className="w-px h-5 my-auto bg-white mx-2" />
        <div className="flex flex-col">
          <span className="text-xs font-poppins font-semibold">
            Your Staked
          </span>
          <span className="font-normal font-luckiest-guy text-end text-lg">
            <NumericFormat
              value={userStakedBalance}
              thousandSeparator
              displayType="text"
              decimalScale={2}
            />{" "}
            <span className="text-[#759CF3]">
              /{" "}
              <NumericFormat
                value={stakedAmount}
                thousandSeparator
                displayType="text"
                decimalScale={2}
              />
            </span>
          </span>
        </div>
      </div>
    </div>
  );

  const renderInputSection = () => (
    <div className="bg-[#B8CEFF] rounded-lg flex flex-col px-3 py-2 mb-4 border border-[#0036AE] shadow-[3px_3px_0_0_#0036AE]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <input
            type="number"
            value={stakeAmount}
            onChange={(e) => {
              const value = parseFloat(e.target.value) || 0;
              const clampedValue = Math.min(Math.max(value, 0), maxStakeAmount);
              setStakeAmount(clampedValue.toString());
            }}
            placeholder="0.0"
            min="0"
            max={maxStakeAmount}
            disabled={maxStakeAmount === 0}
            className="font-luckiest-guy font-normal text-primary-blue text-base md:text-lg bg-transparent border-none outline-none w-24 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none disabled:opacity-50 transition-all duration-200 ease-in-out focus:scale-[1.02]"
          />
        </div>
        <div className="flex items-center">
          <span className="mx-2 text-white font-normal font-luckiest-guy text-lg">
            {tokenSymbol}
          </span>
          <Image src="/logo.svg" alt="logo" width={25} height={25} />
        </div>
      </div>
      <div className="flex items-center justify-between">
        <p className="font-poppins font-normal text-[8px] text-white">
          You Will Stake
        </p>
        <div className="flex items-center gap-1 mt-0.5">
          <Image src="/wallet.svg" alt="wallet" width={12} height={12} />

          <p className="font-poppins font-normal text-[8px] text-primary-blue">
            <NumericFormat
              value={userBalance}
              thousandSeparator
              displayType="text"
              decimalScale={3}
            />{" "}
          </p>
          <span className="font-poppins font-medium text-primary-blue text-[8px]">
            {tokenSymbol}
          </span>
          <button
            className="bg-[#759CF3] text-dark-blue py-0.5 px-1.5 rounded-[2px] font-medium text-[6px] font-poppins hover:bg-[#5A8BE8] transition-all duration-200 ease-in-out transform hover:scale-110 hover:shadow-sm disabled:opacity-50 disabled:hover:scale-100"
            onClick={() => setStakeAmount(userBalance)}
            disabled={maxStakeAmount === 0}
          >
            MAX
          </button>
        </div>
      </div>
    </div>
  );

  const renderInfoSection = (data: any) => (
    <div className="bg-dark-blue rounded-lg flex flex-col p-4 mb-4 border border-primary-blue shadow-blue-3 transition-all duration-300 ease-in-out hover:shadow-lg hover:scale-[1.01]">
      {data.title && (
        <p className="text-accent-yellow text-lg font-luckiest-guy font-normal border-b pb-2 border-[#759CF3]">
          {data.title}
        </p>
      )}
      {data.items?.map((item: any, idx: number) => (
        <div
          key={idx}
          className="flex items-center justify-between border-b border-[#759CF3] py-2"
        >
          <p className="text-accent-yellow text-[16px] font-luckiest-guy font-normal">
            {item.label}
          </p>
          <div className="flex items-end flex-col">
            <p className="text-white text-xl font-luckiest-guy font-normal text-end sm:text-start">
              <NumericFormat
                value={getValueFromKey(item.value)}
                thousandSeparator
                displayType="text"
                decimalScale={2}
              />{" "}
              {tokenSymbol}
            </p>
            {item.showIcon && item.subValue && (
              <div className="text-accent-yellow text-[12px] font-luckiest-guy font-normal flex items-center gap-1">
                <Image src={item.icon} alt="icon" width={12} height={12} />
                <p>{getValueFromKey(item.subValue)}</p>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );

  const renderUnstackSection = (data: any) => (
    <div className="bg-dark-blue rounded-lg flex flex-col p-4 mb-4 border border-primary-blue shadow-blue-3 transition-all duration-300 ease-in-out hover:shadow-lg hover:scale-[1.01]">
      {data.items?.map((item: any, idx: number) => (
        <div
          key={idx}
          className="flex items-center justify-between border-b border-[#759CF3] py-2"
        >
          <p className="text-accent-yellow text-[16px] font-luckiest-guy font-normal">
            {item.label}
          </p>
          {/* show timer if item.value is unstackedTime */}
          {item.value === "unstackTime" ? (
            <div className="flex items-center gap-1">
              <div className="bg-white text-dark-blue px-2 py-1 rounded text-center min-w-[40px]">
                <span className="font-luckiest-guy text-lg">
                  {unstakeTimer.split(":")[0]}
                </span>
              </div>
              <span className="text-white text-xl font-luckiest-guy">:</span>
              <div className="bg-white text-dark-blue px-2 py-1 rounded text-center min-w-[40px]">
                <span className="font-luckiest-guy text-lg">
                  {unstakeTimer.split(":")[1]}
                </span>
              </div>
              <span className="text-white text-xl font-luckiest-guy">:</span>
              <div className="bg-white text-dark-blue px-2 py-1 rounded text-center min-w-[40px]">
                <span className="font-luckiest-guy text-lg">
                  {unstakeTimer.split(":")[2]}
                </span>
              </div>
            </div>
          ) : (
            <div className="flex items-end flex-col">
              <p className="text-white text-xl font-luckiest-guy font-normal text-end sm:text-start">
                <NumericFormat
                  value={getValueFromKey(item.value)}
                  thousandSeparator
                  displayType="text"
                  decimalScale={2}
                />{" "}
                {tokenSymbol}
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  );

  const renderContent = () => {
    const config = CONTENT_CONFIG[activeButton];

    return (
      <div className="flex flex-col justify-between sm:h-[270px]">
        <div>
          {config.sections.map((section, idx) => {
            switch (section.type) {
              case "stats":
                return <div key={idx}>{renderStatsSection()}</div>;
              case "input":
                return <div key={idx}>{renderInputSection()}</div>;
              case "info":
                return <div key={idx}>{renderInfoSection(section.data)}</div>;
              case "unstack":
                return (
                  <div key={idx}>{renderUnstackSection(section.data)}</div>
                );
              default:
                return null;
            }
          })}
        </div>
        <button
          onClick={async () => {
            if (!isConnected) {
              await connectWallet();
            } else {
              switch (activeButton) {
                case "stake":
                  const stakeValidationError = validateStakeAmount(stakeAmount);
                  if (stakeValidationError) {
                    console.error(stakeValidationError);
                    return;
                  }
                  handleStake(stakeAmount);
                  break;
                case "unstake":
                  if (!canUnstake) {
                    showToast(
                      "error",
                      "Cannot unstake yet. Timer must reach 00:00:00."
                    );
                    return;
                  }
                  const unstakeValidationError = validateUnstake();
                  if (unstakeValidationError) {
                    console.error(unstakeValidationError);
                    return;
                  }
                  handleUnstake();
                  break;
                case "claim":
                  const claimValidationError = validateClaim();
                  if (claimValidationError) {
                    console.error(claimValidationError);
                    return;
                  }
                  handleClaim();
                  break;
              }
            }
          }}
          disabled={activeButton === "unstake" && !canUnstake}
          className={`w-full border border-[#0036AE] text-white py-2 rounded-lg text-[25px] shadow-blue-3 font-luckiest-guy font-normal btn-shine transition-all duration-300 ease-in-out transform hover:scale-[1.02] hover:shadow-xl active:scale-[0.98] ${
            activeButton === "unstake" && !canUnstake
              ? "bg-gray-400 cursor-not-allowed opacity-50"
              : "bg-gradient-to-r from-[#0036AE] to-[#759CF3] hover:from-[#002A8C] hover:to-[#5A8BE8]"
          }`}
        >
          {buttonLabel}
        </button>
      </div>
    );
  };

  return (
    <div
      className={`bg-light-blue border border-primary-blue rounded-[10px] p-4 md:p-6 w-full md:w-[400px] sm:h-auto mx-auto md:mx-0 shadow-blue-custom transition-all duration-300 ease-in-out hover:shadow-xl hover:scale-[1.01] ${
        mounted ? "slide-in-left" : ""
      }`}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-4 gap-2">
        <div className="bg-[#FFE2B0] text-center rounded-md px-2 md:px-4 py-1 text-primary-blue font-luckiest-guy text-2xl md:text-[32px] flex-1 transition-all duration-300 ease-in-out hover:scale-[1.02] hover:shadow-md">
          {`${days} DAYS VAULT`}
        </div>
        <div className="bg-[#FFE2B0] rounded-md px-2 py-1 transition-all duration-300 ease-in-out hover:scale-[1.02] hover:shadow-md">
          <p className="text-primary-blue font-normal text-sm md:text-2xl text-center leading-none font-luckiest-guy">
            {apy}%
          </p>
          <p className="text-[10px] md:text-[14px] text-center font-poppins text-primary-blue font-bold">
            APY
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col md:flex-row gap-2 mb-4">
        {(Object.keys(BUTTON_CONFIG) as ButtonState[]).map((buttonType) => {
          const config = BUTTON_CONFIG[buttonType];
          const isActive = activeButton === buttonType;

          return (
            <button
              key={buttonType}
              className={getButtonStyles(buttonType)}
              onClick={() => setActiveButton(buttonType)}
            >
              <Image
                src={isActive ? config.activeIcon : config.inactiveIcon}
                alt={buttonType}
                width={12}
                height={12}
              />
              <span>{config.label}</span>
            </button>
          );
        })}
      </div>

      {/* Chain Status Indicator */}
      {isConnected && !isOnCorrectChain && (
        <div className="mb-4 p-3 bg-yellow-100 border border-yellow-400 rounded-lg">
          <p className="text-yellow-800 text-sm font-medium">
            ⚠️ Please switch to Abstract to continue
          </p>
        </div>
      )}

      {/* Dynamic Content */}
      {renderContent()}
    </div>
  );
};

export default VaultCard;
