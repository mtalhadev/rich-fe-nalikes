// components/BunnyCarousel.tsx

import React, { useEffect, useState } from "react";
import Image from "next/image";
import slider1 from "@/../public/slider-1.png";
import slider2 from "@/../public/slider-2.png";
import slider3 from "@/../public/slider-3.png";
import slider4 from "@/../public/slider-4.png";
import slider5 from "@/../public/slider-5.png";
import slider6 from "@/../public/slider-6.png";
import slider7 from "@/../public/slider-7.png";
import { cn } from "../../utils/helpers";

const images = [slider1, slider2, slider3, slider4, slider5, slider6, slider7];

const BunnyCarousel: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  // Auto shift every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Calculate position relative to active center
  const getRelativePosition = (index: number) => {
    let diff = index - activeIndex;

    // Handle wrapping for smooth infinite loop
    if (diff > images.length / 2) {
      diff -= images.length;
    } else if (diff < -images.length / 2) {
      diff += images.length;
    }

    return diff;
  };

  return (
    <div className="w-full overflow-hidden">
      {/* Unified carousel for all screen sizes */}
      <div className="relative h-[380px] lg:h-[600px] flex items-center justify-center overflow-hidden">
        <div className="relative w-full flex items-center justify-center">
          {images.map((img, index) => {
            const position = getRelativePosition(index);
            const isCenter = position === 0;
            const distance = Math.abs(position);

            // Responsive sizes - increased for full-width coverage
            const centerWidth = { sm: 320, lg: 650 };
            const centerHeight = { sm: 400, lg: 600 };
            const sideWidth = { sm: 220, lg: 680 };
            const sideHeight = { sm: 280, lg: 500 };

            // Calculate opacity and scale based on distance
            const opacity =
              distance === 0
                ? 1
                : distance === 1
                ? 0.9
                : distance === 2
                ? 0.7
                : 0.4;

            const scale =
              distance === 0
                ? 1
                : distance === 1
                ? 0.8
                : distance === 2
                ? 0.65
                : 0.45;

            // Calculate horizontal spacing (responsive) - optimized for full-width coverage
            const spacing =
              typeof window !== "undefined" && window.innerWidth >= 1024
                ? 240 // Increased for larger images on desktop
                : 100; // Increased for larger mobile images
            const baseOffset = position * spacing;

            // Hide images that are too far from center
            const isVisible = distance <= 3;

            return (
              <div
                key={index} // Use stable index as key to prevent re-rendering
                className={cn(
                  "absolute transition-all duration-700 ease-in-out will-change-transform",
                  !isVisible && "pointer-events-none"
                )}
                style={{
                  transform: `translateX(${baseOffset}px) scale(${scale})`,
                  opacity: isVisible ? opacity : 0,
                  zIndex: isCenter ? 50 : Math.max(1, 50 - distance * 10),
                }}
              >
                <div className="relative">
                  <Image
                    src={img}
                    alt={`bunny-${index}`}
                    width={isCenter ? centerWidth.lg : sideWidth.lg}
                    height={isCenter ? centerHeight.lg : sideHeight.lg}
                    className={cn(
                      "rounded-2xl object-cover transition-all duration-700 will-change-transform",
                      // Responsive sizing with Tailwind - increased for full-width coverage
                      isCenter
                        ? "w-[240px] h-[300px] lg:w-[380px] lg:h-[480px]"
                        : "w-[180px] h-[220px] lg:w-[280px] lg:h-[350px]",
                      isCenter ? "shadow-2xl" : "shadow-lg"
                    )}
                  />

                  {/* Overlay for non-center images */}
                  {!isCenter && (
                    <div
                      className="absolute inset-0 bg-black/20 rounded-2xl transition-opacity duration-700"
                      style={{ opacity: distance * 0.15 }}
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Navigation dots */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
          {images.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIndex(idx)}
              className={cn(
                "w-2 h-2 lg:w-3 lg:h-3 rounded-full transition-all duration-300",
                idx === activeIndex
                  ? "bg-white scale-125 shadow-lg"
                  : "bg-white/50 hover:bg-white/70 hover:scale-110"
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default BunnyCarousel;
