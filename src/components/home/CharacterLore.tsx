import Image from "next/image";

export default function CharacterLore() {
  return (
    <>
      <div className="w-full flex items-center justify-center px-8 md:px-20 my-6 md:my-14 relative">
        <h1 className="text-[#B8CEFF] opacity-20 text-center text-wrap text-[40px] sm:text-[70px] md:text-[120px] xl:text-[160px] font-luckiest-guy md:z-0 z-1">
          LORE
        </h1>
      </div>
      <div className="w-full md:pb-24 md:px-24 relative bg-[url('/lore-vector-bg.svg')] bg-no-repeat bg-cover overflow-hidden">
        <div className="w-full px-4">
          {/* Top Section */}
          <div className="text-center mb-16 md:mb-12 md:px-14 px-4 w-full">
            <h1 className="text-navy text-xl md:text-[36px] font-black font-noto-sans mb-4 md:mb-3 uppercase">
              Wally the Gentle “MINI” Giant
            </h1>
            <p className="text-center md:text-xl font-nunito-sans text-navy/80 max-w-4xl md:max-w-3xl mx-auto">
              Soft cheeks, big heart, strong spirit.
            </p>
          </div>

          {/* Main Content Block */}
          <div className="rounded-4xl w-full md:px-16 md:pt-14 py-6 px-8 md:py-14 bg-[url('/char-lore-bg.svg')] bg-no-repeat bg-cover relative shadow-xl bg-[#F8E2C6]">
            <div className="flex flex-col md:flex-row lg:items-center gap-8 md:gap-16">
              {/* Left Side - Text Content */}
              <div className="w-[70%] md:flex-1 text-left">
                <p className="text-navy/80 text-base md:text-xl md:text-md font-nunito-sans mb-4 md:pr-16">
                  Wally has swum through calm tides and fierce storms, every
                  wave taught him something. The little whale learned that true
                  strength is measured by the joy you bring others. He chooses
                  kindness, because he knows what it's like to need it most.
                </p>
                <p className="text-navy/80 text-base md:text-xl md:text-md font-nunito-sans md:pr-16">
                  Playful, loving, and just a little cheeky, He loves to make
                  friends, share stories, and prove that kindness is the
                  greatest treasure.
                </p>
              </div>

              {/* Right Side - Ch aracter and Graphics */}
              <div className="w-[35%] md:relative">
                <div className="w-[300px] md:w-[500px] scale-40 md:scale-75 lg:scale-90 h-[300px] md:h-[500px] absolute -top-36 md:-top-72 -right-12 md:-right-16 mx-auto -mr-6 md:-mr-10 -mt-12 md:-mt-20 z-10">
                  <Image
                    src="/adorable.gif"
                    alt="Stake-a-Lot Character"
                    width={400}
                    height={400}
                    className="object-contain scale-x-[-1] w-[600px] md:w-[800px] h-[600px] md:h-[800px]"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full flex items-center justify-center px-4 md:px-24 mt-14">
          <h1 className="text-[#B8CEFF] opacity-20 text-center text-wrap text-[40px] sm:text-[70px] md:text-[120px] xl:text-[160px] font-luckiest-guy md:z-0 z-1">
            MEMES WALLS
          </h1>
        </div>
      </div>
    </>
  );
}
