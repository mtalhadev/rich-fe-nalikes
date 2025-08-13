"use client";

import { useWallet } from "@/contexts/WalletContext";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "700", "800"],
});

export default function HeroSection() {
  const { userBalances } = useWallet();

  const totalStaked = userBalances?.stakedTokenBalanceContract || "0";

  return (
    <section className="relative w-full sm:pb-8 z-10 mt-6 md:mt-0">
      {/* Top Row: Logo, Badge, Button */}
      <div className="w-full flex flex-col md:flex-row items-center justify-between max-w-7xl mx-auto md:mx-0 mt-5 relative">
        <div className="flex-1 flex flex-col items-center md:items-start gap-2 md:gap-6 px-2 md:px-0 md:w-[52%] md:flex-none">
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
          <div className="flex flex-col md:flex-row md:justify-center items-center gap-5 mt-4 w-full">
            {/* Mobile Layout - Vertical Stack */}
            <div className="flex flex-col gap-y-3 md:hidden w-full px-4">
              {/* First Row - Total Staked and Total Rewards */}
              <div className="flex gap-x-3 w-full ">
                {/* Total Staked Card */}
                <div className="flex-1 rounded-2xl bg-[#CDDCFF] p-4 flex flex-col justify-between min-h-[100px]">
                  <h1 className="font-luckiest-guy text-sm text-navy uppercase leading-tight">
                    Total Staked
                  </h1>
                  <div className="flex items-end gap-x-1 mt-2">
                    <span className="text-3xl leading-none font-luckiest-guy text-[#2e6385]">
                      {totalStaked}
                    </span>
                    <span className="font-luckiest-guy text-xs text-navy mb-1">
                      RWA
                    </span>
                  </div>
                </div>

                {/* Total Rewards Card */}
                <div className="flex-1 rounded-2xl bg-[#286CCB] p-4 flex flex-col justify-between min-h-[100px]">
                  <h1 className="font-luckiest-guy text-sm text-white uppercase leading-tight">
                    Total Rewards
                  </h1>
                  <div className="flex items-end gap-x-1 mt-2">
                    <span className="text-3xl leading-none font-luckiest-guy text-white">
                      300M+
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Desktop Layout - Horizontal */}
            <div className="hidden md:flex flex-wrap items-center gap-6 w-full lg:px-0">
              {/* Total Staked Card */}
              <div className="min-w-[200px] w-fit h-full gap-y-6 rounded-3xl bg-[#CDDCFF] p-6 flex flex-col justify-between relative flex-shrink-0">
                <h1 className="font-luckiest-guy text-2xl text-navy uppercase">
                  Total Staked
                </h1>
                <div className="flex items-end gap-x-2">
                  <span className="text-6xl leading-none font-luckiest-guy text-dark-gray">
                    {totalStaked}
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
