import Footer from "@/components/common/Footer";
import Navbar from "@/components/Navbar";
import VaultCard from "@/components/VaultCard";

export default function Home() {
  return (
    <div>
      {/* <StakeTicker /> */}
      {/* <Ticker /> */}
      <Navbar />
      {/* <HeroSection /> */}
      <main className="max-w-7xl mb-10 md:mb-24 mx-auto relative z-10 flex flex-col w-full md:gap-10 gap-14 px-6 md:px-20 sm:mt-10 ">
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

      <Footer />
    </div>
  );
}
