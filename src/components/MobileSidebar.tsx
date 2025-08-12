import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useWallet } from "@/contexts/WalletContext";
import Link from "next/link";

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileSidebar({ isOpen, onClose }: MobileSidebarProps) {
  const { isConnected, connectWallet } = useWallet();
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      const timer = setTimeout(() => setIsVisible(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleNavigation = (href: string) => {
    onClose();
    // Small delay to allow sidebar to close before scrolling
    setTimeout(() => {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }, 300);
  };

  const handleStakeClick = () => {
    onClose();
    if (isConnected) {
      router.push("/stake");
    } else {
      connectWallet();
    }
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      />

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-gray-900 z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/20">
            <h2 className="text-white font-alfa text-xl">Menu</h2>
            <button
              onClick={onClose}
              className="text-white hover:text-accent-yellow transition-colors p-2"
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
          </div>

          {/* Navigation Links */}
          <div className="flex-1 py-6">
            <nav className="space-y-4 px-6">
              {/* Wallpapers */}
              <button
                onClick={() => handleNavigation("#wallpaper")}
                className="w-full text-left text-white hover:text-accent-yellow transition-colors font-alfa text-lg"
              >
                Wallpapers
              </button>

              {/* Stickers */}
              <button
                onClick={() => handleNavigation("#stickers")}
                className="w-full text-left text-white hover:text-accent-yellow transition-colors font-alfa text-lg"
              >
                Stickers
              </button>
            </nav>
          </div>

          {/* Bottom Action Buttons */}
          <div className="p-6 border-t border-white/20 space-y-4">
            <Link
              href={
                "https://swap.reservoir.tools/#/swap?chain=abstract&outputCurrency=0xAf31d07AF1602Dfce07Fba81BcA5F9570CA83983"
              }
              target="_blank"
              rel="noopener noreferrer"
            >
              <button className="w-full bg-white text-[#005FEB] font-luckiest-guy text-lg py-3 rounded-xl hover:bg-white/90 transition-colors btn-shine">
                {"Buy RWA"}
              </button>
            </Link>

            {/* Social Links */}
            <div className="flex items-center justify-center space-x-4 pt-4">
              <a
                href="https://t.me/RWAlliance"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-accent-yellow transition-colors"
              >
                <Image
                  src="/icons/footer-telegram.svg"
                  alt="Telegram"
                  width={24}
                  height={24}
                  className="w-6 h-6"
                />
              </a>
              <a
                href="https://x.com/RWAlliance___"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white bg-white rounded-xl hover:text-accent-yellow transition-colors"
              >
                <Image
                  src="/icons/footer-x.svg"
                  alt="Telegram"
                  width={24}
                  height={24}
                  className="w-6 h-6"
                />
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
