import Ticker1 from "@/../public/stake-ticker-1.svg";
import Ticker2 from "@/../public/stake-ticker-2.svg";
import Ticker3 from "@/../public/stake-ticker-3.svg";
import Ticker4 from "@/../public/stake-ticker-4.svg";
import Ticker5 from "@/../public/stake-ticker-5.svg";
import { Jaro } from "next/font/google";
import Image from "next/image";
import Link from "next/link";

const jaro = Jaro({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-jaro",
});

const Images = [Ticker1, Ticker2, Ticker3, Ticker4, Ticker5];

export default function StakeTicker() {
  return (
    <div className="w-screen overflow-hidden bg-[#B8CEFF] min-h-[30px] md:min-h-[40px] flex items-center justify-center py-1 whitespace-nowrap relative z-10">
      <div
        className="inline-block whitespace-nowrap"
        style={{
          animation: "marquee 30s linear infinite",
        }}
      >
        {Array.from({ length: 50 }).map((_, i) => (
          <div className="inline-block mx-2 md:mx-3">
            <div className="flex items-center gap-2">
              <Image
                key={i}
                src={Images[i % Images.length]}
                alt="Ticker"
                width={100}
                height={100}
                className={`w-12 h-12`}
              />
              <Link
                href={
                  "https://swap.reservoir.tools/#/swap?chain=abstract&outputCurrency=0xAf31d07AF1602Dfce07Fba81BcA5F9570CA83983"
                }
              >
                <button className="bg-gradient-to-r btn-shine from-[#1AD3E4] text-xs sm:text-sm text-nowrap md:text-lg to-[#005FEB] border-2 border-secondary cursor-pointer text-white px-2 sm:px-3 md:px-5 py-1 xs:py-2 lg:py-1 rounded-lg xs:rounded-xl lg:rounded-lg font-luckiest-guy hover:opacity-90 transition-opacity">
                  {"Buy RWA"}
                </button>
              </Link>
            </div>
          </div>
        ))}
      </div>
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
