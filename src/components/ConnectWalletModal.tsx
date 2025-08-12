"use client";

import React from "react";
import Image from "next/image";

interface ConnectWalletModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ConnectWalletModal: React.FC<ConnectWalletModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[#1e355e]/80 flex items-center justify-center z-50 p-4">
      <div className="bg-light-blue border border-primary-blue rounded-[10px] p-4 sm:p-6 w-full max-w-[520px] shadow-blue-custom">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-primary-blue font-luckiest-guy text-[24px] sm:text-[32px]">
            Connect Wallet
          </h2>
          <button
            onClick={onClose}
            className="text-primary-blue hover:text-white transition-colors cursor-pointer"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M18 6L6 18M6 6L18 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-2 justify-center">
            <div className="h-[80px] sm:h-[105px] w-full sm:w-[150px] bg-primary-blue rounded-lg flex items-center flex-col justify-center">
                <Image src="/abstract-global.svg" alt="logo" width={40} height={40} className="sm:w-[50px] sm:h-[50px]" />
                <p className="text-white font-luckiest-guy font-normal text-[13px] sm:text-[15px] mt-2">
                AbstractGlobal
                </p>
            </div>
            <div className="h-[80px] sm:h-[105px] w-full sm:w-[150px] bg-[#B8CEFF] border border-primary-blue rounded-lg flex items-center flex-col justify-center">
                <Image src="/metamask.svg" alt="logo" width={40} height={40} className="sm:w-[50px] sm:h-[50px]" />
                <p className="text-primary-blue font-luckiest-guy font-normal text-[13px] sm:text-[15px] mt-2">
                MetaMask
                </p>
            </div>
            <div className="h-[80px] sm:h-[105px] w-full sm:w-[150px] bg-[#B8CEFF] border border-primary-blue rounded-lg flex items-center flex-col justify-center">
                <Image src="/wallet-connect.svg" alt="logo" width={40} height={40} className="sm:w-[50px] sm:h-[50px]" />
                <p className="text-primary-blue font-luckiest-guy font-normal text-[13px] sm:text-[15px] mt-2">
                WalletConnect
                </p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ConnectWalletModal; 