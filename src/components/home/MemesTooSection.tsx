import BunnyCarousel from "@/components/BunnyCarousel";

export default function MemesTooSection() {
  return (
    <div
      id="wallpaper"
      // className="w-full py-20 bg-gradient-to-r from-[#1AD3E4] to-[#005FEB] relative overflow-hidden"
    >
      <div className="max-w-7xl px-4 md:px-30 mx-auto flex flex-col lg:flex-row items-center justify-between relative z-10">
        <div className="flex-col flex lg:flex-row items-center justify-between w-full gap-6 md:gap-8">
          <h1 className="uppercase text-navy text-center lg:text-left text-[24px] md:text-[32px] lg:text-[42px] font-black leading-tight">
            Because Walls Need <br />
            Memes Too
          </h1>
          <button
            type="button"
            className="btn-shine hidden md:block text-white bg-gradient-btn text-nowrap h-[48px] md:h-[56px] border-2 border-secondary cursor-pointer rounded-xl font-luckiest-guy text-lg md:text-xl lg:text-2xl hover:bg-accent-yellow transition-colors shadow-lg px-6 md:px-12"
          >
            Discover More
          </button>
        </div>
      </div>

      {/* Slider */}
      <div className="w-full h-full flex items-center min-h-[35dvh] md:min-h-[70dvh] lg:min-h-[80dvh] relative mt-4 md:mt-0">
        <div className="h-full w-full">
          <BunnyCarousel />
        </div>
      </div>

      <div className="md:hidden block w-full px-4">
        <button
          type="button"
          className="btn-shine w-full text-white bg-gradient-btn text-nowrap h-[48px] md:h-[56px] border-2 border-secondary cursor-pointer rounded-xl font-luckiest-guy text-lg md:text-xl lg:text-2xl hover:bg-accent-yellow transition-colors shadow-lg px-6 md:px-12"
        >
          Discover More
        </button>
      </div>
    </div>
  );
}
