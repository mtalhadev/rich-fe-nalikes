import { Jaro } from "next/font/google";
import Ticker1 from "@/../public/ticker-1.svg";
import Ticker2 from "@/../public/ticker-2.svg";
import Ticker3 from "@/../public/ticker-3.svg";
import Ticker4 from "@/../public/ticker-4.svg";
import Ticker5 from "@/../public/ticker-5.svg";
import Ticker6 from "@/../public/ticker-6.svg";
import Image from "next/image";

const jaro = Jaro({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-jaro",
});

const Images = [Ticker1, Ticker2, Ticker3, Ticker4, Ticker5, Ticker6];

export default function RWATicker() {
  return (
    <div className="w-screen overflow-hidden bg-[#B8CEFF] min-h-[40px] my-8 md:min-h-[55px] flex items-center justify-center py-1 whitespace-nowrap relative z-10">
      <div
        className="inline-block whitespace-nowrap"
        style={{
          animation: "marquee 8s linear infinite",
        }}
      >
        {Array.from({ length: 50 }).map((_, i) => (
          <Image
            key={i}
            src={Images[i % Images.length]}
            alt="Ticker"
            width={100}
            height={100}
            className={`w-fit h-full inline-block mx-2 md:mx-3`}
          />
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
