import Image from "next/image";

export default function Footer() {
  return (
    <footer className="w-full relative bg-[url('/footerbg.svg')] bg-no-repeat bg-center bg-cover min-h-[300px] md:min-h-[400px] lg:min-h-[380px] mt-4">
      {/* Your footer content */}
      {/* Left bottom glow */}
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-[#1AD3E4]/10 to-transparent rounded-full blur-2xl"></div>

      {/* Right top glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[#005FEB]/10 to-transparent rounded-full blur-2xl"></div>

      {/* Content container with relative positioning */}
      <div className="relative h-full lg:px-28 px-4 py-8 md:py-10 flex flex-col lg:flex-row md:items-center justify-between">
        <div className="w-full md:w-[90%] lg:w-[62%] h-full">
          {/* Top section with logo and connect wallet button */}
          <div className="flex flex-col lg:flex-row justify-between mb-8">
            {/* Left side - Logo */}
            <div className="flex items-center w-fit gap-4 mb-4 lg:mb-0">
              <Image
                src="/footer-logo.jpg"
                width={200}
                height={84}
                alt="RWA Logo"
                className="h-12 w-auto"
              />
            </div>
          </div>

          {/* Main content section */}
          <div className="flex flex-col xs:flex-row md:justify-between mb-8 mt-14 gap-6 xs:gap-2 md:gap-6">
            {/* Left section - About Us */}
            <div className="w-full xs:w-[50%] md:w-2/3 xs:pr-8 md:pr-0">
              <h3 className="text-[#0036AE] text-lg md:text-xl font-nunito-sans font-black mb-6">
                Contact Info
              </h3>
              <div className="space-y-3 max-w-[200px]">
                <div className="flex items-center gap-2 md:gap-3">
                  <Image
                    src="/icons/footer-x.svg"
                    alt="X"
                    width={20}
                    height={20}
                    className="w-5 h-5"
                  />
                  <a
                    href="https://x.com/RWAlliance___"
                    className="block text-[#0036AE] text-sm md:text-base font-nunito-sans underline"
                  >
                    https://x.com/RWAlliance___
                  </a>
                </div>
                <div className="flex items-center gap-2 md:gap-3">
                  <Image
                    src="/icons/footer-telegram.svg"
                    alt="X"
                    width={20}
                    height={20}
                    className="w-5 h-5"
                  />
                  <a
                    href="https://t.me/RWAlliance"
                    target="_blank"
                    className="block text-[#0036AE] text-sm md:text-base font-nunito-sans text-wrap w-full break-words xl:break-normal underline"
                  >
                    https://t.me/RWAlliance
                  </a>
                </div>
                <div className="flex items-center gap-2 md:gap-3">
                  <Image
                    src="/icons/footer-wallet.svg"
                    alt="X"
                    width={20}
                    height={20}
                    className="w-5 h-5"
                  />
                  <a
                    href="https://dexscreener.com/abstract/0x9d735b41918b3fc495c7de540f7213a979050859"
                    target="_blank"
                    className="block text-[#0036AE] text-sm md:text-base font-nunito-sans text-wrap w-full break-words xl:break-normal underline"
                  >
                    0xAf31d07AF1602Dfce07Fba81BcA5F9570CA83983
                  </a>
                </div>
              </div>
            </div>

            {/* Middle section - Quick Links */}
            <div className="md:w-1/3 w-full xs:w-[40%]">
              <h3 className="text-[#0036AE] font-nunito-sans font-black text-lg md:text-xl mb-6">
                QUICK LINKS
              </h3>
              <div className="flex gap-3 md:gap-6">
                <div className="space-y-3">
                  <a
                    href="#"
                    className="block text-[#0036AE] text-sm md:text-base font-nunito-sans "
                  >
                    Home
                  </a>
                  <a
                    href="#wallpaper"
                    className="block text-[#0036AE] text-sm md:text-base font-nunito-sans  "
                  >
                    Wallpapers
                  </a>
                  <a
                    href="#stickers"
                    className="block text-[#0036AE] text-sm md:text-base font-nunito-sans  "
                  >
                    Stickers
                  </a>
                </div>
                <div className="space-y-3 flex md:hidden md:items-center flex-col">
                  <a
                    href="#"
                    className="text-[#0036AE] text-sm md:text-base font-nunito-sans text-nowrap transition-colors underline"
                  >
                    Term & Condition
                  </a>
                  <a
                    href="#"
                    className="text-[#0036AE] text-sm md:text-base font-nunito-sans transition-colors underline"
                  >
                    Privacy Policy
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom section - Copyright and legal links */}
          <div className="border-[#0036AE] pt-4 border-t-[0.5px]">
            <div className="flex flex-col lg:flex-row justify-between xl:flex-row md:flex-col gap-4">
              <p className="text-center md:text-left text-[#0036AE] font-nunito-sans pr-8 md:pr-0">
                © 2025 Meme Coin, All Rights Reserved
              </p>
              <div className="hidden md:flex md:items-center flex-col sm:flex-row gap-2 md:gap-6">
                <a
                  href="#"
                  className="text-[#0036AE] font-nunito-sans  transition-colors underline"
                >
                  Term & Condition
                </a>
                <a
                  href="#"
                  className="text-[#0036AE] font-nunito-sans  transition-colors underline"
                >
                  Privacy Policy
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
