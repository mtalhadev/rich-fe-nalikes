"use client";
import "@rainbow-me/rainbowkit/styles.css";
import Image from "next/image";
import { useWallet } from "@/contexts/WalletContext";

const Navbar = () => {
  const { isConnected, connectWallet, connectWalletLabel } = useWallet();

  return (
    <div className="relative z-10 w-full flex items-center justify-between px-4 md:px-6 pt-6 max-w-[1100px] mx-auto">
      <div className="flex items-center gap-2">
        <Image
          src="/logo.svg"
          alt="Logo"
          width={45}
          height={45}
          className="md:w-[45px] md:h-[45px]"
        />
        <span className="text-base md:text-[25px] text-primary-blue font-normal font-luckiest-guy">
          RWA
        </span>
      </div>
      <button
        className="bg-accent-yellow font-luckiest-guy text-primary-blue font-normal py-1.5 md:py-2 px-3 md:px-4 rounded-lg shadow-blue-4 transition-all text-sm md:text-brand-md lg:text-[25px] btn-shine hover:scale-105 active:scale-95"
        onClick={connectWallet}
      >
        {connectWalletLabel}
      </button>
    </div>
  );
};

export default Navbar;
