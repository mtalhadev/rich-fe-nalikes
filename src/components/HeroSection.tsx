"use client";

import { useWallet } from "@/contexts/WalletContext";
import { NumericFormat } from "react-number-format";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "700", "800"],
});

export default function HeroSection() {
  const { userBalances, connectWallet, connectWalletLabel } = useWallet();

  const totalStaked = userBalances?.stakedTokenBalanceContract || "0";

  return (
    <section className="relative w-full sm:pb-8 z-10 mt-6 md:mt-0">
      {/* Top Row: Logo, Badge, Button */}
      <div className="w-full flex flex-col md:flex-row items-center justify-between max-w-7xl mx-auto md:mx-0 mt-5 relative">
        <div className="flex-1 flex flex-col items-center md:items-start gap-2 md:gap-6 px-2 md:px-0 md:w-[52% w-full md:flex-none">
          <h1
            className={`text-3xl text-center md:text-left md:text-4xl lg:text-6xl text-white drop-shadow-[0.5px_0.5px_0_#1E355E] font-black leading-tight font-noto-sans text-stroke sm:mt-4`}
          >
            STAKE RWA & EARN REWARDS
          </h1>
          <p
            className={`text-sm text-center md:text-left md:text-base lg:text-xl text-dark-blue font-semibold sm:mt-0 mt-5`}
          >
            Lock your $RWA tokens in the vaults to earn rewards paid out in RWA
          </p>
          {/* Stats Row */}
          <div className="flex flex-col md:flex-row md:justify-center items-center gap-4 mt-4 w-full">
            {/* Mobile Layout - Vertical Stack */}
            <div className="flex flex-col gap-y-3 md:hidden w-full px-4">
              {/* First Row - Total Staked and Total Rewards */}
              <div className="flex gap-x-2 w-full">
                {/* Total Staked Card */}
                <div className="flex-1 w-full rounded-2xl bg-[#CDDCFF] p-4 flex flex-col justify-between min-h-[80px]">
                  <h1 className="font-luckiest-guy text-xs text-navy uppercase leading-tight">
                    Total Staked
                  </h1>
                  <div className="flex items-end gap-x-2 mt-1">
                    <span className="text-xl md:text-3xl leading-none font-luckiest-guy text-[#2e6385]">
                      <NumericFormat
                        value={totalStaked || 0}
                        thousandSeparator
                        displayType="text"
                        decimalScale={2}
                        className="word-break max-w-[70%] break-words text-xl md:text-3xl"
                      />
                    </span>
                    <span className="font-luckiest-guy text-xs text-navy mb-1">
                      RWA
                    </span>
                  </div>
                </div>

                {/* Total Rewards Card */}
                <div className="flex-1 w-full rounded-2xl bg-[#286CCB] p-4 flex flex-col justify-between min-h-[80px]">
                  <h1 className="font-luckiest-guy text-xs text-white uppercase leading-tight">
                    Total Rewards
                  </h1>
                  <div className="flex items-end gap-x-1 mt-1">
                    <span className="text-3xl leading-none font-luckiest-guy text-white">
                      300M+
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={connectWallet}
                type="button"
                className="bg-gradient-to-r btn-shine from-[#1AD3E4] to-[#005FEB] 
             border-2 border-secondary cursor-pointer text-white 
            w-full h-[39px] sm:text-sm md:text-xl lg:text-lg 
             text-nowrap rounded-lg font-luckiest-guy 
             hover:opacity-90 transition-opacity sm:hidden block"
              >
                {connectWalletLabel}
              </button>
            </div>

            {/* Desktop Layout - Horizontal */}
            <div className="hidden md:flex items-center gap-6 w-full lg:px-0">
              {/* Total Staked Card */}
              <div className="min-w-[20px] w-fit h-full gap-y-6 rounded-3xl bg-[#CDDCFF] p-6 flex flex-col justify-between relative flex-shrink-0">
                <h1 className="font-luckiest-guy text-2xl text-navy uppercase">
                  Total Staked
                </h1>
                <div className="flex items-end gap-x-2">
                  <span className="text-3xl md:text-6xl leading-noneleading-tight font-luckiest-guy text-dark-gray">
                    <NumericFormat
                      value={totalStaked || 0}
                      thousandSeparator
                      displayType="text"
                      decimalScale={2}
                      className="word-break max-w-[70%] break-words text-6xl"
                    />
                  </span>
                  <span className="font-luckiest-guy text-xl text-navy mb-2">
                    RWA
                  </span>
                </div>
              </div>

              {/* Total Rewards Card */}
              <div className="min-w-[200px] w-fit h-full gap-y-6 rounded-3xl bg-[#286CCB] p-6 flex flex-col justify-between relative flex-shrink-0">
                <h1 className="font-luckiest-guy text-2xl text-white uppercase">
                  Total Rewards
                </h1>
                <div className="flex items-end gap-x-2">
                  <span className="text-6xl leading-none font-luckiest-guy text-white">
                    300M+
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
