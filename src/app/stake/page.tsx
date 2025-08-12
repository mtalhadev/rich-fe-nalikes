import HeroSection from "@/components/HeroSection";
import Navbar from "@/components/Navbar";
import Ticker from "@/components/Ticker";
import VaultCard from "@/components/VaultCard";

export default function Home() {
  return (
    <div>
      <Ticker />
      <Navbar />
      <HeroSection />
      <main className="max-w-[1100px] mx-auto relative z-10 flex flex-col md:flex-row gap-10 px-6 mt-10">
        <VaultCard
          vaultName="45 DAYS VAULT"
          totalStaked={0}
          yourStaked={0}
          yourStakedMax={0}
          days={45}
          earliestUnlock="75:09:09"
          pendingRewards={6544.82}
          claimedRewards={6544.82}
          tokenSymbol="RWA"
          index={0}
        />
        <VaultCard
          vaultName="90 DAYS VAULT"
          totalStaked={10000}
          yourStaked={500}
          yourStakedMax={1000}
          days={90}
          earliestUnlock="120:00:00"
          pendingRewards={123.45}
          claimedRewards={678.9}
          tokenSymbol="RWA"
          index={1}
        />
      </main>

      <div className="w-full bg-dark-blue h-1 shadow-blue-2 mt-16 mb-8 max-w-[1250px] mx-auto" />
      <p
        className="text-dark-blue text-center font-spline-sans-mono font-bold mb-8 px-4 md:px-0"
        style={{ lineHeight: "23px", letterSpacing: "0%" }}
      >
        Copyright © 2025 -- Rich Whale Alliance. All rights reserved
      </p>
    </div>
  );
}
