import Image from "next/image";
import Link from "next/link";

export default function StickersSection() {
  return (
    <div
      id="stickers"
      className="w-full relative max-w-7xl mx-auto px-4 md:px-16"
    >
      <div className="relative overflow-hidden md:overflow-visible text-center lg:text-left h-[470px] md:h-[480px] lg:h-[420px] flex flex-col justify-evenly bg-gradient-btn rounded-3xl md:rounded-4xl">
        <div className="w-full md:w-[70%] space-y-8 md:space-y-14 lg:space-y-14 md:absolute h-fit top-0 left-0 px-4 md:px-5 lg:px-10 py-6 md:py-8 lg:py-12 z-40">
          <div className="space-y-3 md:space-y-4">
            <h2 className="text-white text-2xl md:text-4xl lg:text-5xl xl:text-6xl text-wrap font-noto-sans font-bold mb-4 md:mb-6 lg:mb-4 uppercase leading-tight text-center md:text-left">
              Wally, Now in <br className="hidden md:block" /> Sticker Form
            </h2>
            <p className="text-white text-base md:text-lg lg:text-xl text-center md:text-left">
              Because words alone aren't enough for this{" "}
              <br className="hidden md:block" />
              level of cute.
            </p>
          </div>

          {/* Platform Links */}
          <div className="hidden md:flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 lg:gap-3 w-fit mx-auto md:mx-0">
            <Link
              href={"https://t.me/RWAlliance"}
              className="bg-white rounded-lg px-3 sm:px-4 lg:px-6 py-2 sm:py-2.5 lg:py-3 flex items-center justify-center gap-2 min-h-[40px] sm:min-h-[48px] touch-manipulation"
            >
              <Image
                src="/icons/telegram.svg"
                alt="Telegram"
                width={100}
                height={100}
                className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 flex-shrink-0"
              />
              <span className="font-poppins text-xs sm:text-sm lg:text-base font-semibold text-[#1B92D1] uppercase leading-none">
                TELEGRAM
              </span>
            </Link>
          </div>
        </div>

        <div className="h-full relative flex justify-center items-center">
          <Image
            src="/mobile.gif"
            width={150}
            height={200}
            alt="Phone Mockup"
            className="md:absolute md:block hidden bottom-0 -right-1 md:right-3 md:w-[40%] w-[50%] z-40 h-[65%] md:h-fit"
          />
          <div className="absolute pt-4 bottom-0 right-0 w-full flex justify-center items-end h-full">
            <Image
              src="/mobile.gif"
              width={701}
              height={780}
              alt="Phone Mockup"
              className="h-fit w-72 md:hidden block pl-7"
            />
            <Link
              href={"https://t.me/RWAlliance"}
              className="absolute -top-10 left-3 z-40 sm:left-14"
            >
              <Image
                src="/icons/wally-telegram.svg"
                width={701}
                height={780}
                alt="icon"
                className="h-fit w-8 md:hidden block"
              />
            </Link>
          </div>
        </div>

        <Image
          src="/sad-bunny.svg"
          width={701}
          height={780}
          alt="Sad Mockup"
          className="hidden md:block absolute -top-[85px] md:-top-[106px] z-10 left-[25%] md:w-20 w-16"
        />
      </div>
    </div>
  );
}
