import RWALogo from "@/../public/rwa-nav-logo.svg";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import MobileSidebar from "../MobileSidebar";

interface HeroSectionProps {
  isStakingPopupOpen: boolean;
  setIsStakingPopupOpen: (isOpen: boolean) => void;
}

export default function HeroSection({
  isStakingPopupOpen,
  setIsStakingPopupOpen,
}: HeroSectionProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="sm:bg-[url('/bg-desktop.svg')] bg-[url('/mobile-bg.svg')] bg-no-repeat bg-contain sm:bg-cover sm:bg-[position:center_-70px] flex flex-col md:gap-y-4 lg:gap-y-3 items-center py-4 lg:py-3 w-full h-[67vh] md:h-[80vh] lg:h-[90vh] relative">
      <div className="w-full mx-auto px-2 xs:px-4 sm:px-8 md:px-12 lg:px-20 flex h-fit items-center justify-between">
        <div className="w-full flex items-center justify-between gap-4 md:gap-12">
          <div className="md:w-36 md:h-28 lg:w-32 lg:h-24 h-fit w-fit">
            <Image
              src={RWALogo}
              width={248}
              height={91}
              alt="RWA Logo"
              className="w-full h-10 sm:h-full object-contain"
            />
          </div>
          <div className="flex items-center gap-x-2 md:gap-x-12">
            <a
              href="#wallpaper"
              className="text-white hidden md:block font-alfa text-lg hover:text-accent-yellow transition-colors"
            >
              Wallpapers
            </a>
            <a
              href="#stickers"
              className="text-white hidden md:block font-alfa text-lg hover:text-accent-yellow transition-colors"
            >
              Stickers
            </a>
            <div className="flex items-center gap-1 md:gap-3">
              <Link
                href={
                  "https://swap.reservoir.tools/#/swap?chain=abstract&outputCurrency=0xAf31d07AF1602Dfce07Fba81BcA5F9570CA83983"
                }
              >
                <button className="bg-gradient-to-r btn-shine from-[#1AD3E4] text-xs sm:text-sm text-nowrap md:text-xl lg:text-lg to-[#005FEB] border-2 border-secondary cursor-pointer text-white px-2 md:px-6 py-2 lg:py-1.5 rounded-xl lg:rounded-lg font-luckiest-guy hover:opacity-90 transition-opacity">
                  {"Buy RWA"}
                </button>
              </Link>
              <button
                onClick={() => setIsStakingPopupOpen(true)}
                className="bg-gradient-to-r btn-shine from-[#1AD3E4] text-xs sm:text-sm text-nowrap md:text-xl lg:text-lg to-[#005FEB] border-2 border-secondary cursor-pointer text-white px-2 md:px-4 py-2 lg:py-1.5 rounded-xl lg:rounded-lg font-luckiest-guy hover:opacity-90 transition-opacity"
              >
                Stake
              </button>
            </div>
            <button
              className="md:hidden block bg-gradient-to-r btn-shine from-[#1AD3E4] text-sm text-nowrap md:text-xl lg:text-lg to-[#005FEB] border-2 border-secondary cursor-pointer text-white px-1 py-1 lg:py-1.5 rounded-xl lg:rounded-lg font-luckiest-guy hover:opacity-90 transition-opacity"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Image
                src={"/icons/menu.svg"}
                alt="Menu"
                width={24}
                height={24}
                className="w-6 h-6"
              />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <MobileSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Staking Popup */}
      {isStakingPopupOpen && (
        <div
          className="fixed inset-0 bg-black/85 bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setIsStakingPopupOpen(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-md md:max-w-2xl lg:max-w-4xl w-fit h-fit mx-auto relative shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setIsStakingPopupOpen(false)}
              className="absolute top-4 right-4 text-white hover:text-gray-700 transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {/* Popup Content */}
            <div className="text-center">
              {/* Staking GIF */}
              <div className="flex justify-center">
                <Image
                  src="/staking.gif"
                  alt="Staking Animation"
                  width={300}
                  height={300}
                  className="rounded-lg shadow-lg max-w-full h-auto w-[300px] h-[300px] md:w-[500px] md:h-[500px] lg:w-[600px] lg:h-[600px]"
                  unoptimized
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
