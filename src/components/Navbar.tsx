"use client";

import RWALogo from "@/../public/rwa-nav-logo.svg";
import HeroSection from "@/components/HeroSection";
import React, { useState } from "react";
import { useWallet } from "@/contexts/WalletContext";
import { LogOut, Copy, Check } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import MobileSidebar from "./MobileSidebar";

export default function Navbar() {
  const {
    connectWallet,
    disconnectWallet,
    connectWalletLabel,
    isConnected,
    address,
  } = useWallet();
  const [copied, setCopied] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleCopyAddress = async () => {
    if (isConnected && address) {
      try {
        await navigator.clipboard.writeText(address);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);

        // Show toast notification
        if ("Notification" in window && Notification.permission === "granted") {
          new Notification("Address Copied!", {
            body: "Wallet address copied to clipboard",
            icon: "/favicon.ico",
          });
        }
      } catch (err) {
        console.error("Failed to copy address:", err);
      }
    }
  };

  const handleDisconnect = () => {
    disconnectWallet();
  };

  return (
    <div className="mb-8 sm:bg-[url('/bg-desktop.svg')] bg-[url('/stake-banner-bg.svg')] bg-no-repeat bg-cover bg-center max-h-[60dvh] sm:min-h-[80dvh] flex flex-col md:gap-y-4 lg:gap-y-3 items-center py-4 lg:py-3 w-full relative">
      <div className="max-w-7xl w-full mx-auto px-2 xs:px-4 sm:px-8 md:px-12 lg:px-18 flex flex-col h-fit items-center justify-between">
        <div className="w-full flex items-center justify-between gap-12">
          <Link
            href="/"
            className="md:w-36 md:h-28 lg:w-32 lg:h-24 h-fit w-fit"
          >
            <Image
              src={RWALogo}
              width={248}
              height={91}
              alt="RWA Logo"
              className="w-full h-10 sm:h-full object-contain"
            />
          </Link>
          <div className="flex items-center gap-x-2 md:gap-x-6">
            {/* <Link
              href={
                "https://swap.reservoir.tools/#/swap?chain=abstract&outputCurrency=0xAf31d07AF1602Dfce07Fba81BcA5F9570CA83983"
              }
            >
              <button className="bg-gradient-to-r btn-shine from-[#1AD3E4] text-xs sm:text-sm  text-nowrap md:text-xl lg:text-lg to-[#005FEB] border-2 border-secondary cursor-pointer text-white px-2.5 sm:px-4 md:px-6 py-1 xs:py-2 lg:py-1.5 rounded-lg xs:rounded-xl lg:rounded-lg font-luckiest-guy hover:opacity-90 transition-opacity">
                {"Buy RWA"}
              </button>
            </Link> */}
            <Link
              href={
                "https://swap.reservoir.tools/#/swap?chain=abstract&outputCurrency=0xAf31d07AF1602Dfce07Fba81BcA5F9570CA83983"
              }
              target="_blank"
              rel="noopener noreferrer"
            >
              <button
                type="button"
                className="bg-gradient-to-r btn-shine from-[#1AD3E4] to-[#005FEB] 
             border-2 border-secondary cursor-pointer text-white 
             min-w-[132px] h-[39px] sm:text-sm md:text-xl lg:text-lg 
             text-nowrap rounded-lg font-luckiest-guy 
             hover:opacity-90 transition-all duration-200 active:scale-95 hover:scale-105"
              >
                Buy RWA
              </button>
            </Link>
            {isConnected ? (
              <>
                <button
                  onClick={handleCopyAddress}
                  className="hidden md:block bg-gradient-to-r btn-shine from-[#1AD3E4] text-xs sm:text-sm text-nowrap md:text-xl lg:text-lg to-[#005FEB] border-2 border-secondary cursor-pointer text-white px-2.5 sm:px-4 md:px-6 py-1 xs:py-2 lg:py-1.5 rounded-lg xs:rounded-xl lg:rounded-lg font-luckiest-guy hover:opacity-90 transition-all duration-200 flex items-center gap-2 active:scale-95 hover:scale-105"
                >
                  {copied ? (
                    <div className="flex items-center gap-2">
                      <span className="animate-pulse">Copied!</span>
                      <Check className="w-4 h-4 animate-bounce" />
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      {connectWalletLabel}
                      <Copy className="w-4 h-4" />
                    </div>
                  )}
                </button>
                <button
                  onClick={handleDisconnect}
                  className="hidden md:block bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg transition-all duration-200 active:scale-95 hover:scale-105"
                  title="Disconnect Wallet"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={connectWallet}
                  className="hidden md:block bg-gradient-to-r btn-shine from-[#1AD3E4] text-xs sm:text-sm text-nowrap md:text-xl lg:text-lg to-[#005FEB] border-2 border-secondary cursor-pointer text-white px-2.5 sm:px-4 md:px-6 py-1 xs:py-2 lg:py-1.5 rounded-lg xs:rounded-xl lg:rounded-lg font-luckiest-guy hover:opacity-90 transition-all duration-200 active:scale-95 hover:scale-105"
                >
                  {connectWalletLabel}
                </button>
              </>
            )}
            <button
              type="button"
              className="w-[39px] h-[39px] flex items-center justify-center 
             bg-gradient-to-r btn-shine from-[#1AD3E4] to-[#005FEB] 
             border-2 border-secondary cursor-pointer text-white 
             rounded-lg font-luckiest-guy hover:opacity-90 transition-all duration-200 active:scale-95 hover:scale-105
             md:hidden"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Image
                src="/icons/menu.svg"
                alt="Menu"
                width={24}
                height={24}
                className="w-6 h-6"
              />
            </button>
          </div>
        </div>
        {/* Mobile Sidebar */}
        <MobileSidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        <HeroSection />
      </div>
    </div>
  );
}
