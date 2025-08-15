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
import { cn, formatNumber } from "../../utils/helpers";

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
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [buttonLabel, setButtonLabel] = useState("CONNECT WALLET");
  const dropdownRef = useRef<HTMLDivElement>(null);
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

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

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
    <div className="bg-white w-full rounded-3xl md:rounded-2xl px-4 md:px-6 py-3 sm:py-5 text-white font-semibold mb-4 ">
      <div className="flex sm:flex-row flex-col justify-between sm:items-center text-navy">
        <div className="flex flex-col gap-[18px] sm:gap-6">
          <span className="font-poppins font-semibold">Total Staked</span>
          <span className="font-normal font-luckiest-guy text-5xl">
            <NumericFormat
              value={totalStaked || 0}
              thousandSeparator
              displayType="text"
              decimalScale={2}
            />
          </span>
        </div>
        {/* <div className="w-px h-5 my-auto bg-white mx-2" /> */}
        <Image
          src="/linear-line-new.svg"
          alt="linear-line"
          width={1000}
          height={1000}
          className="w-px sm:h-full sm:block hidden"
        />
        {/* border for small screen below */}
        <span className="border-gradient h-[1px] w-full my-[10px] sm:my-2 block sm:hidden " />
        <div className="flex flex-col sm:gap-6">
          <span className="renderStatsSection font-poppins font-semibold">
            Your Staked
          </span>
          <span className="font-normal font-alfa text-5xl">
            <NumericFormat
              value={userStakedBalance}
              thousandSeparator
              displayType="text"
              decimalScale={2}
            />
            /
            <NumericFormat
              value={stakedAmount}
              thousandSeparator
              displayType="text"
              decimalScale={2}
            />
          </span>
        </div>
      </div>
    </div>
  );

  const renderInputSection = () => (
    <>
      <div className="bg-[#78B9DF] w-full rounded-3xl md:rounded-2xl px-4 md:px-6 py-3.5 text-white font-semibold mb-4">
        <div className="flex sm:flex-row flex-col justify-between sm:items-center text-navy">
          <div className="flex flex-col sm:gap-4">
            <span className="font-poppins font-semibold">You Will Stake</span>
            <span className="font-normal font-luckiest-guy text-5xl">
              <input
                type="number"
                value={stakeAmount}
                onChange={(e) => {
                  const value = parseFloat(e.target.value) || 0;
                  const clampedValue = Math.min(
                    Math.max(value, 0),
                    maxStakeAmount
                  );
                  setStakeAmount(clampedValue.toString());
                }}
                placeholder="0.0"
                min="0"
                max={maxStakeAmount}
                disabled={maxStakeAmount === 0}
                className="h-fit p-0 text-5xl m-0 leading-0 font-normal bg-transparent border-none outline-none w-24 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none disabled:opacity-50 transition-all duration-200 ease-in-out focus:scale-[1.02]"
              />
            </span>
          </div>
          {/* <div className="w-px h-5 my-auto bg-white mx-2" /> */}
          <Image
            src="/linear-line-new2.svg"
            alt="linear-line"
            width={1000}
            height={1000}
            className="w-px sm:h-full hidden sm:block "
          />
          {/* border for small screen below */}
          <span className="border-gradient-blue-bg h-[1px] w-full my-2 block sm:hidden" />
          <div className="flex flex-col sm:gap-6">
            <span className="renderStatsSection">RWA</span>
            <span className="font-normal font-alfa text-5xl">
              <NumericFormat
                value={userBalance}
                thousandSeparator
                displayType="text"
                decimalScale={3}
              />
              <span className="text-sm sm:text-lg">RWA</span>
            </span>
          </div>
        </div>
      </div>
      {/* <div className="bg-[#B8CEFF] rounded-lg flex flex-col px-3 py-2 mb-4 border border-[#0036AE] shadow-[3px_3px_0_0_#0036AE]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <input
              type="number"
              value={stakeAmount}
              onChange={(e) => {
                const value = parseFloat(e.target.value) || 0;
                const clampedValue = Math.min(
                  Math.max(value, 0),
                  maxStakeAmount
                );
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
      </div> */}
    </>
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

  console.log({ days });
  const renderContent = () => {
    const config = CONTENT_CONFIG[activeButton];
    console.log({ config });
    return (
      <div className="flex flex-col justify-between sm:h-fit gap-6">
        <div className="flex flex-row sm:flex-col md:flex-row w-full gap-8">
          {config.sections.map((section, idx) => {
            switch (section.type) {
              case "stats":
                return (
                  <div key={idx} className="w-full">
                    {renderStatsSection()}
                  </div>
                );
              case "input":
                return (
                  <div key={idx} className="w-full">
                    {renderInputSection()}
                  </div>
                );
              case "info":
                return (
                  <div key={idx} className="w-full">
                    {renderInfoSection(section.data)}
                  </div>
                );
              case "unstack":
                return (
                  <div key={idx} className="w-full">
                    {renderUnstackSection(section.data)}
                  </div>
                );
              default:
                return null;
            }
          })}
        </div>
        <div
          className={`w-full flex ${
            days === 45 ? "justify-start" : "justify-end md:justify-start"
          }`}
        >
          <button
            onClick={async () => {
              if (!isConnected) {
                await connectWallet();
              } else {
                switch (activeButton) {
                  case "stake":
                    const stakeValidationError =
                      validateStakeAmount(stakeAmount);
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
            className={cn(
              "w-max sm:w-full md:w-fit bg-gradient-to-r btn-shine from-[#1AD3E4] text-nowrap md:text-xl lg:text-lg to-[#005FEB] border-2 border-secondary cursor-pointer text-white px-2.5 sm:px-4 md:px-6 py-2 lg:py-1.5 rounded-xl xs:rounded-2xl lg:rounded-lg font-luckiest-guy hover:opacity-90 transition-opacity"
            )}
          >
            {buttonLabel}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div
      className={`relative bg-[#CDDCFF] bg-[url('/stake-box-bg.svg')] bg-no-repeat bg-contain bg-top-left rounded-2xl md:rounded-[44px] p-4 md:p-6 w-full sm:h-auto mx-auto md:mx-0`}
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-8 w-full">
        <div className="flex items-center gap-4 w-full justify-between sm:justify-start">
          <div className="rounded-md px-2 md:px-4 py-1 text-primary-blue text-lg sm:text-xl md:text-3xl font-alfa">
            {`${days} DAYS VAULT`}
          </div>
          <div className="rounded-3xl flex gap-1 items-center text-lg text-white justify-center px-4 py-2 sm:bg-[#78B9DF]">
            <p className="font-normal text-center leading-none font-luckiest-guy mt-[1px] sm:mt-0">
              {apy ? formatNumber(Number(apy) * 1000, 2) : 0}%
            </p>
            <p className="text-center font-poppins font-bold">APY</p>
          </div>
        </div>

        {/* Action Dropdown */}
        <div ref={dropdownRef} className="relative mb-4 w-full md:w-fit">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="w-full md:w-fit bg-[#0036AE] text-white px-4 py-2 rounded-2xl font-luckiest-guy flex items-center gap-4 md:gap-10 justify-between shadow-lg"
          >
            <div className="flex items-center gap-3">
              <span>{BUTTON_CONFIG[activeButton].label}</span>
            </div>
            <svg
              className={`w-5 h-5 transition-transform duration-200 ${
                isDropdownOpen ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute top-full left-0 w-full mt-2 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden z-10">
              {(Object.keys(BUTTON_CONFIG) as ButtonState[]).map(
                (buttonType) => {
                  const config = BUTTON_CONFIG[buttonType];
                  const isActive = activeButton === buttonType;

                  return (
                    <button
                      key={buttonType}
                      className={`w-full px-4 py-2 flex items-center gap-3 font-luckiest-guy text-left transition-all duration-200 ${
                        isActive
                          ? "bg-[#0036AE] text-white"
                          : "text-[#0036AE] hover:bg-[#F1F5F9] border-b border-gray-100 last:border-b-0"
                      }`}
                      onClick={() => {
                        setActiveButton(buttonType);
                        setIsDropdownOpen(false);
                      }}
                    >
                      <Image
                        src={isActive ? config.activeIcon : config.inactiveIcon}
                        alt={buttonType}
                        width={16}
                        height={16}
                      />
                      <span>{config.label}</span>
                    </button>
                  );
                }
              )}
            </div>
          )}
        </div>
      </div>

      {/* Chain Status Indicator */}
      {isConnected && !isOnCorrectChain && (
        <div className="mb-4 p-3 bg-navy text-white rounded-lg border border-yellow-400">
          <p className="text-yellow-400 text-sm font-medium">
            ⚠️ Please switch to Abstract to continue
          </p>
        </div>
      )}

      {/* Dynamic Content */}
      {renderContent()}

      {days === 45 && (
        <Image
          src="/45days-bunny.svg"
          alt="stake-box-bg"
          width={1000}
          height={1000}
          className="absolute  md:block -bottom-48 sm:-bottom-62 md:-bottom-28 -right-6 md:-right-10 w-24 h-full"
        />
      )}
      {days === 90 && (
        <Image
          src="/90days-bunny.svg"
          alt="stake-box-bg"
          width={1000}
          height={1000}
          className="absolute  md:block -bottom-54 sm:-bottom-62 md:-bottom-40 -left-5 md:-left-8 w-24 h-full"
        />
      )}
    </div>
  );
};

export default VaultCard;
