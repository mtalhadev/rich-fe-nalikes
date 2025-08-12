export default function TotalStakedSection() {
  return (
    <div className="relative w-screen h-full">
      <div className="max-w-6xl mx-auto w-full h-[120px] xs:h-[50px] sm:h-[450px] lg:pt-5 lg:h-fit flex flex-col justify-center relative">
        <div className="absolute -top-[235px] xs:-top-[310px] sm:-top-[20px] md:top-0 md:relative w-full flex flex-col gap-y-6 sm:gap-y-10 lg:gap-y-6 px-4 md:px-10 xl:px-0 py-8 sm:py-20 md:py-14 mx-auto">
          <div className="w-full flex flex-col lg:flex-row flex-wrap items-center justify-between gap-6 sm:gap-10 md:gap-6">
            <div className="w-full flex flex-col gap-y-3 sm:gap-y-4 lg:w-fit flex-1 items-center lg:items-start">
              <h1 className="text-navy uppercase text-center lg:text-left text-xl sm:text-2xl md:text-3xl font-black leading-tight">
                A world where Whales <br className="hidden md:block" /> Play &
                Prosper
              </h1>
              <h5 className="text-[#1E355E] text-center lg:text-left font-nunito-sans text-sm sm:text-base">
                Stake. Earn. Meme. Repeat.
                <br /> Wally keeps it cute while the rewards go heavy.
              </h5>
            </div>

            {/* Stats Cards */}
            <div className="w-full lg:w-fit">
              {/* Mobile Layout - Vertical Stack */}
              <div className="flex flex-col gap-y-3 md:hidden w-full px-4">
                {/* First Row - Total Staked and Total Rewards */}
                <div className="flex gap-x-3 w-full">
                  {/* Total Staked Card */}
                  <div className="flex-1 rounded-2xl bg-[#CDDCFF] p-4 flex flex-col justify-between min-h-[100px]">
                    <h1 className="font-luckiest-guy text-sm text-navy uppercase leading-tight">
                      Total Staked
                    </h1>
                    <div className="flex items-end gap-x-1 mt-2">
                      <span className="text-3xl leading-none font-luckiest-guy text-[#2e6385]">
                        0M
                      </span>
                      <span className="font-luckiest-guy text-xs text-navy mb-1">
                        RWA
                      </span>
                    </div>
                  </div>

                  {/* Total Rewards Card */}
                  <div className="flex-1 rounded-2xl bg-[#286CCB] p-4 flex flex-col justify-between min-h-[100px]">
                    <h1 className="font-luckiest-guy text-sm text-white uppercase leading-tight">
                      Total Rewards
                    </h1>
                    <div className="flex items-end gap-x-1 mt-2">
                      <span className="text-3xl leading-none font-luckiest-guy text-white">
                        300M+
                      </span>
                    </div>
                  </div>
                </div>

                {/* Second Row - Stake Now Button (Full Width) */}
                <div className="w-full">
                  <div className="w-full rounded-2xl bg-[#78B9DF] p-4 md:p-8 flex justify-center items-center md:min-h-[120px]">
                    <h1 className="font-luckiest-guy text-2xl md:text-4xl text-white uppercase leading-none text-center">
                      STAKE
                      <br className="hidden md:block" /> NOW
                    </h1>
                  </div>
                </div>
              </div>

              {/* Desktop Layout - Horizontal */}
              <div className="hidden md:flex justify-center items-center gap-x-6 w-full lg:px-0">
                {/* Total Staked Card */}
                <div className="min-w-[200px] w-fit h-full gap-y-6 rounded-3xl bg-[#CDDCFF] p-6 flex flex-col justify-between relative flex-shrink-0">
                  <h1 className="font-luckiest-guy text-2xl text-navy uppercase">
                    Total Staked
                  </h1>
                  <div className="flex items-end gap-x-2">
                    <span className="text-6xl leading-none font-luckiest-guy text-dark-gray">
                      0M
                    </span>
                    <span className="font-luckiest-guy text-xl text-navy mb-2">
                      RWA
                    </span>
                  </div>
                </div>

                {/* Total Rewards Card */}
                <div className="min-w-[200px] w-fit h-full gap-y-6 rounded-3xl bg-[#286CCB] p-6 flex flex-col justify-between relative flex-shrink-0">
                  <h1 className="font-luckiest-guy text-2xl text-white uppercase">
                    Total Rewards
                  </h1>
                  <div className="flex items-end gap-x-2">
                    <span className="text-6xl leading-none font-luckiest-guy text-white">
                      300M+
                    </span>
                  </div>
                </div>

                {/* Stake Now Button Card */}
                <div className="min-w-[200px] w-fit h-full gap-y-6 rounded-3xl bg-[#78B9DF] p-6 flex flex-col justify-between relative flex-shrink-0">
                  <h1 className="font-luckiest-guy text-6xl text-white text-wrap uppercase">
                    STAKE <br />
                    NOW
                  </h1>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
