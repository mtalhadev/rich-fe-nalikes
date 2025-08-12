import WalletIcon from "@/icons/wallet.icon";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function FollowUs() {
  const [golfVideoPlaying, setGolfVideoPlaying] = useState(false);
  const [carVideoPlaying, setCarVideoPlaying] = useState(false);

  const handleGolfVideoPlay = () => {
    setGolfVideoPlaying(true);
  };

  const handleCarVideoPlay = () => {
    setCarVideoPlaying(true);
  };

  return (
    <div className="">
      <div className="w-full flex items-center justify-center px-4 md:px-8 lg:px-24 mb-6 md:my-10 relative">
        <h1 className="text-[#B8CEFF] opacity-20 text-center text-wrap text-[40px] sm:text-[50px] md:text-[70px] lg:text-[120px] xl:text-[160px] font-luckiest-guy md:z-0 z-1">
          FOLLOW US
        </h1>
      </div>
      <div className="w-full px-4 md:px-12 lg:px-32 pb-8 md:py-12 bg-white relative bg-[url('/animation-bg.svg')] bg-no-repeat bg-contain">
        <div className="flex flex-col lg:flex-row items-start gap-8 md:gap-16">
          {/* Left Section - Text Content and Social Media */}
          <div className="w-full lg:w-3/6 lg:pr-28">
            {/* Header */}
            <div className="mb-6 md:mb-8">
              <h2 className="hidden md:block text-[#018EFC] text-lg md:text-xl font-nunito-sans font-bold mb-3 md:mb-4">
                Dive in!
              </h2>
              <h1 className="uppercase text-[#191825] md:text-left text-center text-[20px] md:text-[28px] lg:text-[40px] font-black mb-6 md:mb-8 leading-tight">
                The Story Continues Beyond the Reef
              </h1>
            </div>

            {/* Mobile Social Media Cards - 2x2 Grid */}
            <div className="md:hidden grid grid-cols-4 gap-1 sm:gap-2 justify-items-center">
              {/* Twitter Card */}
              <Link
                href={"https://x.com/RWAlliance___"}
                className="bg-white z-40 rounded-2xl cursor-pointer p-1 border border-gray-200 shadow-lg w-full h-[85px] flex flex-col justify-center items-center gap-1"
              >
                <div className="w-5 h-5">
                  <Image
                    src="/x.svg"
                    alt="Twitter"
                    width={32}
                    height={32}
                    className="w-5 h-5"
                  />
                </div>
                <span className="font-raleway font-semibold text-[#111827] text-xs">
                  150<span className="text-blue-500">k</span>
                </span>
                <h3 className="text-[8px] font-raleway text-[#111827] font-medium">
                  Twitter
                </h3>
              </Link>

              {/* TikTok Card */}
              <div className="bg-white rounded-2xl p-2 border border-gray-200 shadow-lg w-full h-[85px] flex flex-col justify-center items-center gap-1">
                <div className="w-5 h-5">
                  <Image
                    src="/tiktok.svg"
                    alt="Twitter"
                    width={32}
                    height={32}
                    className="w-5 h-5"
                  />
                </div>
                <span className="font-raleway font-semibold text-[#111827] text-xs">
                  TikTok
                </span>
                <h3 className="text-[8px] font-raleway text-[#111827] font-medium">
                  Coming soon
                </h3>
              </div>

              {/* Instagram Card */}
              <div className="bg-white rounded-2xl p-2 border border-gray-200 shadow-lg w-full h-[85px] flex flex-col justify-center items-center gap-1">
                <div className="w-5 h-5">
                  <Image
                    src="/instagram.svg"
                    alt="Twitter"
                    width={32}
                    height={32}
                    className="w-5 h-5"
                  />
                </div>
                <span className="font-raleway font-semibold text-[#111827] text-xs">
                  Instagram
                </span>
                <h3 className="text-[8px] font-raleway text-[#111827] font-medium">
                  Coming soon
                </h3>
              </div>

              {/* YouTube Card */}
              <div className="bg-white rounded-2xl p-2 border border-gray-200 shadow-lg w-full h-[85px] flex flex-col justify-center items-center gap-1">
                <div className="w-5 h-5">
                  <Image
                    src="/youtube.svg"
                    alt="Twitter"
                    width={32}
                    height={32}
                    className="w-5 h-5"
                  />
                </div>
                <span className="font-raleway font-semibold text-[#111827] text-xs">
                  YouTube
                </span>
                <h3 className="text-[8px] font-raleway text-[#111827] font-medium">
                  Coming soon
                </h3>
              </div>
            </div>

            {/* Desktop Social Media Cards - Original Layout */}
            <div className="hidden md:grid grid-cols-2 gap-x-4 md:gap-x-10 lg:gap-x-24 gap-y-3 md:gap-y-4">
              {/* Twitter */}
              <Link
                href={"https://x.com/RWAlliance___"}
                className="bg-white w-full max-w-[140px] cursor-pointer md:max-w-[180px] lg:max-w-[200px] rounded-xl md:rounded-2xl h-auto p-3 md:p-4 border border-gray-200 justify-self-end shadow-lg hover:shadow-xl transition-all duration-300 mb-float-left-right md:float-left-right max-h-[120px]"
                style={{ animationDelay: "0s" }}
              >
                <div className="flex justify-between items-start gap-1 md:gap-2 lg:gap-4 mb-2">
                  <div className="text-[#111827] flex flex-col gap-1">
                    <span className="text-base md:text-lg lg:text-xl font-raleway font-semibold">
                      6,942
                    </span>
                    <span className="text-xs md:text-sm font-semibold font-raleway text-be-dark">
                      Followers
                    </span>
                  </div>
                  <div className="w-6 h-6 md:w-8 md:h-8 lg:w-12 lg:h-12 flex items-center justify-center">
                    <Image
                      src="/x.svg"
                      alt="Twitter"
                      width={48}
                      height={48}
                      className="w-6 h-6 md:w-8 md:h-8"
                    />
                  </div>
                </div>
                <h3 className="text-xs md:text-sm font-raleway">Twitter</h3>
              </Link>

              {/* TikTok */}
              <div
                className="max-h-[120px] bg-white w-full max-w-[140px] md:max-w-[180px] lg:max-w-[200px] mt-6 md:mt-10 lg:mt-15 justify-self-end rounded-xl md:rounded-3xl p-3 md:p-6 border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 mb-float-left-right md:float-left-right"
                style={{ animationDelay: "0.5s" }}
              >
                <div className="flex justify-between items-start gap-1 md:gap-2 lg:gap-4 mb-2">
                  <div className="text-[#111827] font-raleway font-semibold text-base md:text-lg lg:text-xl">
                    <span>TikTok</span>
                  </div>
                  <div className="w-6 h-6 md:w-8 md:h-8 lg:w-12 lg:h-12 flex items-center justify-center">
                    <Image
                      src="/tiktok.svg"
                      alt="TikTok"
                      width={48}
                      height={48}
                      className="w-6 h-6 md:w-8 md:h-8"
                    />
                  </div>
                </div>
                <h3 className="text-xs md:text-sm font-raleway">Coming soon</h3>
              </div>

              {/* Instagram */}
              <div
                className="max-h-[120px] bg-white w-full max-w-[140px] md:max-w-[180px] lg:max-w-[200px] rounded-xl md:rounded-3xl h-auto justify-self-start p-3 md:p-6 border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 mb-float-left-right md:float-left-right"
                style={{ animationDelay: "1s" }}
              >
                <div className="flex justify-between items-start gap-1 md:gap-2 lg:gap-4 mb-2">
                  <div className="text-[#111827] font-raleway font-semibold text-base md:text-lg lg:text-xl">
                    <span>Instagram</span>
                  </div>
                  <div className="w-6 h-6 md:w-8 md:h-8 lg:w-12 lg:h-12 flex items-center justify-center">
                    <Image
                      src="/instagram.svg"
                      alt="Instagram"
                      width={48}
                      height={48}
                      className="w-6 h-6 md:w-8 md:h-8"
                    />
                  </div>
                </div>
                <h3 className="text-xs md:text-sm font-raleway">Coming soon</h3>
              </div>

              {/* YouTube */}
              <div
                className="max-h-[120px] bg-white w-full max-w-[140px] md:max-w-[180px] lg:max-w-[200px] mt-6 md:mt-10 rounded-xl md:rounded-3xl justify-self-start p-3 md:p-6 border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 mb-float-left-right md:float-left-right"
                style={{ animationDelay: "1.5s" }}
              >
                <div className="flex justify-between items-start gap-1 md:gap-2 lg:gap-4 mb-2">
                  <div className="text-[#111827] font-raleway font-semibold text-base md:text-lg lg:text-xl">
                    <span>YouTube</span>
                  </div>
                  <div className="w-6 h-6 md:w-8 md:h-8 lg:w-12 lg:h-12 flex items-center justify-center">
                    <Image
                      src="/youtube.svg"
                      alt="YouTube"
                      width={48}
                      height={48}
                      className="w-6 h-6 md:w-8 md:h-8"
                    />
                  </div>
                </div>
                <h3 className="text-xs md:text-sm font-raleway">Coming soon</h3>
              </div>
            </div>
          </div>

          {/* Right Section - Visual Cards */}
          <div className="w-full lg:w-3/6 relative md:block hidden">
            {/* Golf Theme Card */}
            <div className="pl-20 relative">
              <div className="relative bg-gradient-to-br pl- from-[#E3F2FD] to-[#BBDEFB] rounded-3xl mb-6">
                <div className="w-full h-72 relative overflow-hidden rounded-2xl">
                  {golfVideoPlaying ? (
                    <video
                      src="/video1.mp4"
                      autoPlay
                      controls
                      className="absolute inset-0 w-full h-full rounded-2xl"
                    />
                  ) : (
                    <>
                      <video
                        src="/video1.mp4"
                        className="absolute inset-0 w-full h-full opacity-20 rounded-2xl"
                        muted
                        loop
                      />
                      <Image
                        src="/character-golf.svg"
                        alt="Golf Character"
                        fill
                        className="object-cover z-10 relative"
                      />
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
                        <button
                          onClick={handleGolfVideoPlay}
                          className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform cursor-pointer"
                        >
                          <div className="w-0 h-0 border-l-[12px] border-l-[#018EFC] border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent ml-1"></div>
                        </button>
                      </div>
                    </>
                  )}
                </div>

                {/* <Image
                  src={"/followus-line1.svg"}
                  alt="Golf Character"
                  width={240}
                  height={240}
                  className="object-contain h-32 w-32 absolute -top-24 -left-10"
                /> */}
              </div>

              <div className="absolute left-24 md:left-10 top-56 -translate-x-4/4 -translate-y-1/2 w-[131px] h-[460px]">
                <Image
                  src={"/oval-vector.svg"}
                  alt="Oval vector"
                  width={240}
                  height={240}
                  className="object-contain md:h-72 md:w-40 h-60 w-20"
                />
              </div>
            </div>

            {/* Car and Meme Coin Row */}
            <div className="flex gap-6 items-center mt-16">
              {/* Car Theme Card */}
              <div className="flex-1 bg-gradient-to-br from-[#E3F2FD] to-[#BBDEFB] rounded-3xl relative">
                <div className="w-full h-72 relative overflow-hidden rounded-2xl">
                  {carVideoPlaying ? (
                    <video
                      src="/video2.mp4"
                      autoPlay
                      controls
                      className="absolute inset-0 w-full h-full rounded-2xl"
                    />
                  ) : (
                    <>
                      <video
                        src="/video2.mp4"
                        className="absolute inset-0 w-full h-full opacity-20 rounded-2xl"
                        muted
                        loop
                      />
                      <Image
                        src="/car-character.svg"
                        alt="Car Character"
                        fill
                        className="object-cover z-10 relative"
                      />
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
                        <button
                          onClick={handleCarVideoPlay}
                          className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform cursor-pointer"
                        >
                          <div className="w-0 h-0 border-l-[12px] border-l-[#018EFC] border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent ml-1"></div>
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Meme Coin Icon - Vertically Centered */}
              {/* <div className="relative bg-white rounded-xl p-2 shadow-lg w-24 h-32 flex flex-col items-center justify-center self-center">
                <div className="w-12 h-12 relative mb-2">
                  <Image
                    src="/laughing-bunny.svg"
                    alt="Meme Coin"
                    fill
                    className="object-contain"
                  />
                </div>
                <p className="text-[#018EFC] font-luckiest-guy text-sm font-bold text-center">
                  MEME COIN
                </p>
                <Image
                  src={"/followus-line2.svg"}
                  alt="Golf Character"
                  width={240}
                  height={240}
                  className="object-contain h-20 w-20 absolute -bottom-20 -right-12"
                />
              </div> */}
            </div>
          </div>
        </div>

        {/* Faded Animation Text */}
      </div>
    </div>
  );
}
