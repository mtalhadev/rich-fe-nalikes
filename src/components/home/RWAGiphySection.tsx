import CoinSvg from "@/../public/coin-svg.svg";
import Image from "next/image";
import { cn } from "../../../utils/helpers";

const Images = [
  "/giphy-1.gif",
  "/giphy-2.gif",
  "/giphy-3.gif",
  "/giphy-4.gif",
  "/giphy-5.gif",
  "/giphy-6.gif",
  "/giphy-7.gif",
  "/giphy-8.gif",
  "/giphy-9.gif",
  "/giphy-10.gif",
  "/giphy-11.gif",
  "",
];

export default function RWAGiphySection() {
  return (
    <div className="flex flex-col">
      <h1 className="text-[#B8CEFF] opacity-20 text-center text-wrap text-[40px] sm:text-[70px] md:text-[120px] xl:text-[160px] font-luckiest-guy md:z-0 z-1">
        TENOR GIPHY
      </h1>
      <div className="w-full py-6 md:py-10 bg-white relative overflow-hidden md:bg-[url('/giphy-bg.svg')] bg-no-repeat bg-cover md:pb-100 lg:pb-80">
        <div className="max-w-6xl mx-auto px-4 md:px-12 xl:px-0">
          <div className="flex flex-col md:grid lg:grid-cols-3 grid-cols-2 gap-6 md:gap-10 lg:gap-2 items-center justify-center">
            <div className="text-center md:text-left mb-6 md:mb-8 lg:mb-12 col-span-1 lg:col-span-2 lg:pr-40">
              <h1 className="text-navy text-xl md:text-2xl lg:text-3xl font-black mb-2 md:mb-3 uppercase leading-tight">
                Send cute chaos directly into your chats.
              </h1>
              <p className="text-[#21375F] font-nunito-sans mx-auto text-sm md:text-base">
                From "GM" to "Let's ride," Wally's got a reaction for every
                mood. Drop them everywhere, spread the splash.
              </p>
            </div>

            <div className="flex items-center justify-center flex-1 w-full md:justify-end col-span-1 px-4">
              <div className="bg-[#286CCB] pb-14 lg:pb-5 rounded-3xl md:rounded-3xl px-6 md:px-8 lg:px-6 py-5 md:py-6 lg:py-5 mb-8 md:mb-12 lg:mb-10 relative w-full pr-16 md:pr-20 lg:pr-24">
                <div className="text-white w-full space-y-3 md:space-y-4">
                  <p className="text-4xl md:text-6xl font-luckiest-guy leading-none">
                    150+
                  </p>
                  <h3 className="font-luckiest-guy text-base md:text-lg">
                    Wally GIFs & Stickers
                  </h3>
                  <div className="w-full h-full relative md:w-fit flex justify-center items-center">
                    <a
                      href="https://memedepot.com/d/rich-whale-alliance"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block"
                    >
                      <p className="absolute w-[110%] xs:w-[116%] -right-7 xs:-right-11 -bottom-11 md:static rounded-full text-center md:rounded-xl bg-navy shadow-md shadow-amber-50/40 text-base md:text-lg font-luckiest-guy cursor-pointer px-3 md:px-4 py-2.5 md:w-fit border hover:bg-navy/90 transition-colors">
                        Explore Now
                      </p>
                    </a>
                  </div>
                </div>

                <Image
                  src="/sad-bunny.svg"
                  alt="Giphy Coin"
                  width={100}
                  height={100}
                  className="absolute bottom-20 md:-bottom-10 -right-3 md:-right-4 lg:-right-10 w-20 md:w-32"
                />
              </div>
            </div>
          </div>

          {/* GIF Gallery Grid */}
          {/* Mobile Layout - Horizontal Scroll */}
          <div className="md:hidden">
            <div className="flex overflow-x-auto gap-3 mt-8 px-4 scrollbar-hide">
              {Images.filter((val) => val)
                .slice(0, 8)
                .map((val, i) => (
                  <div key={i} className="flex-shrink-0">
                    <div className="p-2 rounded-lg h-[80px] w-[80px] bg-white overflow-hidden shadow-md">
                      <Image
                        src={val}
                        width={60}
                        height={60}
                        alt={`GIF ${i + 1}`}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Desktop Layout - Grid */}
          <div className="hidden md:flex overflow-x-hidden flex-wrap gap-x-12 md:gap-y-0 gap-4 md:gap-8 lg:gap-y-6 mt-10 lg:mt-8 justify-center mx-auto scrollbar-hide px-4 md:px-0">
            {Images.map((val, i) => (
              <div
                key={i}
                className="flex items-center justify-center w-fit flex-shrink-0"
              >
                {val && (
                  <div
                    className={cn(
                      "p-2 rounded-lg h-[100px] w-[100px] md:w-[140px] md:h-[140px] bg-white overflow-hidden shadow-md",
                      i % 2 !== 0 && "mt-16"
                    )}
                  >
                    <Image
                      src={val}
                      width={60}
                      height={60}
                      alt={`GIF ${i + 1}`}
                      className={cn("w-full h-full object-cover rounded-lg")}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
