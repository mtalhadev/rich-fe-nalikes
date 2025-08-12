"use client";

import Image from "next/image";
import { Poppins } from "next/font/google";
import StatsCard from "./StatsCard";
import { useWallet } from "@/contexts/WalletContext";
import { formatLargeNumber } from "../../utils/helpers";
import { useState, useEffect, useMemo } from "react";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "700", "800"],
});

export default function HeroSection() {
  const { userBalances } = useWallet();

  const totalStaked = userBalances?.stakedTokenBalanceContract || "0";

  const stats = useMemo(
    () => [
      { value: `${formatLargeNumber(totalStaked)} RWA`, label: "Total Staked" },
      { value: "300M+ REWARDS", label: "Total Rewards" },
    ],
    [totalStaked]
  );

  return (
    <section className="relative w-full sm:pb-8  max-w-[1100px] mx-auto z-10 px-4 md:px-0">
      {/* Top Row: Logo, Badge, Button */}

      <div className="w-full flex flex-col md:flex-row items-center justify-between max-w-6xl mx-auto mt-5 relative">
        <div className="flex-1 flex flex-col items-start gap-4 px-2 md:px-6">
          <div className="bg-accent-yellow font-luckiest-guy text-primary-blue font-normal py-2 px-4 rounded-lg shadow-blue-4 transition-all text-xs w-fit flex items-center gap-2 sm:mt-8 mt-4">
            <Image src="/abstract.png" alt="Abstract" width={10} height={9} />
            <h1 className="text-[12px] mt-0.5">Powered by Abstract</h1>
          </div>
          <h1
            className={`text-2xl md:text-4xl lg:text-6xl font-bold text-white drop-shadow-[3px_3px_0_#1E355E] leading-tight font-poppins text-stroke sm:mt-8 mt-4`}
          >
            STAKE $RWA & EARN REWARDS
          </h1>
          <p
            className={`text-sm md:text-base lg:text-[25px] text-dark-blue font-semibold max-w-2xl font-poppins sm:mt-0 mt-6`}
          >
            Lock your $RWA tokens in the vaults to earn rewards{" "}
            <br className="hidden md:block" />
            paid out in $RWA
          </p>
          {/* Stats Row */}
          <div className="flex flex-col md:flex-row gap-4 mt-4 w-full">
            {stats.map((stat, idx) => (
              <StatsCard key={idx} value={stat.value} label={stat.label} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
