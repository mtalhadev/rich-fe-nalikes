import React from "react";
import { Jaro } from "next/font/google";

const jaro = Jaro({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-jaro",
});

const Ticker = () => {
  return (
    <div className="w-screen overflow-hidden bg-white border-b-2 py-1 whitespace-nowrap relative z-10">
      <div
        className="inline-block whitespace-nowrap"
        style={{
          animation: "marquee 15s linear infinite"
        }}
      >
        {Array.from({ length: 50 }).map((_, i) => (
          <span
            className={`font-normal inline-block mx-2 md:mx-3 text-primary-blue text-sm md:text-[20px] leading-[1] ${jaro.variable}`}
            style={{ letterSpacing: 0, fontFamily: 'var(--font-jaro), sans-serif' }}
            key={i}
          >
            STAKE $RWA
          </span>
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
};

export default Ticker; 