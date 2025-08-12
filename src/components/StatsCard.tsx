"use client";

import React, { useEffect, useState } from "react";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

interface StatsCardProps {
  value: string;
  label: string;
  className?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({
  value,
  label,
  className = "",
}) => {
  const [displayValue, setDisplayValue] = useState("0");
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    // Reset animated state when value changes to allow re-animation
    setAnimated(false);
  }, [value]);

  useEffect(() => {
    if (animated) return;

    const numericMatch = value.match(/(\d+)/);
    if (!numericMatch) {
      setDisplayValue(value);
      setAnimated(true);
      return;
    }

    const targetNum = parseInt(numericMatch[1]);
    let currentNum = 0;
    const duration = 1200;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      currentNum = Math.floor(progress * targetNum);

      const newValue = value.replace(/(\d+)/, currentNum.toString());
      setDisplayValue(newValue);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setDisplayValue(value);
        setAnimated(true);
      }
    };

    requestAnimationFrame(animate);
  }, [value, animated]);

  return (
    <div
      className={`bg-light-blue border border-primary-blue rounded-xl px-4 md:px-6 py-3 md:py-4 text-center md:min-w-[120px] ${className} shadow-blue-3 flex justify-between items-center sm:block`}
    >
      <div
        className={`text-white md:text-lg lg:text-xl font-semibold font-poppins text-left`}
      >
        {label}
      </div>
      <div
        className={`text-primary-blue text-sm md:text-2xl lg:text-3xl mt-1 font-luckiest-guy`}
      >
        {displayValue}
      </div>
    </div>
  );
};

export default StatsCard;
