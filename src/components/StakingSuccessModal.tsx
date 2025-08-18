"use client";

import { useWallet } from "@/contexts/WalletContext";

export default function StakingSuccessModal() {
  const { isStakingSuccessModalOpen, setIsStakingSuccessModalOpen } =
    useWallet();

  if (!isStakingSuccessModalOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/85 bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={() => setIsStakingSuccessModalOpen(false)}
    >
      <div
        className="bg-white rounded-2xl max-w-md md:max-w-2xl lg:max-w-4xl w-fit h-fit mx-auto relative shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={() => setIsStakingSuccessModalOpen(false)}
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
          {/* Success Video */}
          <div className="flex justify-center">
            <video
              autoPlay
              loop
              // muted
              playsInline
              className="rounded-lg shadow-lg max-w-full h-auto w-[300px] h-[300px] md:w-[500px] md:h-[500px] lg:w-[600px] lg:h-[600px]"
            >
              <source src="/vault_wally_gold.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>

          {/* Success Message */}
          {/* <div className="mt-6 px-6 pb-6">
            <h3 className="text-2xl md:text-3xl font-bold text-green-600 mb-3">
              🎉 Staking Successful!
            </h3>
            <p className="text-gray-700 text-lg">
              Your tokens have been successfully staked. Start earning rewards!
            </p>
          </div> */}
        </div>
      </div>
    </div>
  );
}
