import TickIcon from "@/icons/tick.icon";
import Image from "next/image";
import { useState } from "react";

export default function ProjectOverview() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const cards = [
    {
      id: "01",
      title: "Infiltration",
      image: "/cute-bunny.svg",
      description:
        "A gentle splash. A charming smile. The world meets Wally - an icon in the making. From timelines to toylines, the cutest whale family swims effortlessly into hearts, feeds the fanfare, and floats across platforms like couture on a Paris runway. No one suspected a thing. Classic Wally.",
    },
    {
      id: "02",
      title: "Operation Blowhole",
      image: "/bonds-bunny.png",
      description:
        "Behind every wink, a war chest. From lovable IP to ocean-deep tech, Wally turns charm into capital. Revenue flows like water-fueling the mission, rewarding the loyal, and stitching value into every corner of the reef. He's cute. He's collectible. He's somehow building a treasury.",
    },
    {
      id: "03",
      title: "World Domination",
      image: "/devils-bunny.png",
      description:
        "The floaties are off. The halo? Missing. From internet sweetheart to full-blown aquatic overlord, he's here to control culture, markets, and moods. Memes? Ours. Liquidity? Ours. Your brand's mascot? Probably Wally now. You don't wear Wally. Wally wears you.",
    },
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % cards.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + cards.length) % cards.length);
  };
  return (
    <div className="w-full py-12 md:py-20 md:px-12 lg:px-24 relative mt-20 md:mt-28 bg-[url('/overview-bg.svg')] bg-no-repeat bg-cover bg-center">
      <div className="max-w-6xl mx-auto px-2">
        {/* Left Section */}
        <div className="flex flex-col h-fit lg:flex-row gap-20">
          <div className="flex-1 w-full h-fit">
            <h2 className="text-navy text-2xl md:text-4xl text-center lg:text-left font-black mb-8 uppercase md:whitespace-nowrap">
              Meet Wally
            </h2>
            <ul className="text-[#474747] text-center lg:text-left text-xs sm:text-sm md:text-lg font-nunito-sans flex flex-col gap-y-2 md:gap-y-3">
              <li>The cutest whale family to ever infiltrate your timeline.</li>
              <li>Born from memes. Designed for markets.</li>
              <li>Loved by the internet. Feared by liquidity pools.</li>
              <li>They smile. They build. They reward.</li>
              <li>$1.3M donated back to the reef.</li>
              <li>IP. Tech. Merch. All for the whales.</li>
              <li>This is not a project. It’s a movement.</li>
              <li>Cute is the Trojan horse.</li>
              <li>World domination is the mission.</li>
            </ul>
          </div>

          {/* Right Section */}
          <div className="relative hidden lg:flex gap-6 lg:max-w-[50%] justify-center h-full items-end pt-36">
            <Image
              src={"/angel_on_world.svg"}
              alt="stats"
              width={504}
              height={751}
              className="self-end w-full scale-150 h-full"
            />
          </div>
        </div>

        {/* Mobile Slider */}
        <div className="md:hidden px-4 mt-12 relative">
          <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-lg relative ">
            <div className="text-[#759CF3] text-[60px] md:text-[120px] font-luckiest-guy absolute top-2 right-4 opacity-10">
              {cards[currentSlide].id}
            </div>

            <div className="mb-16 relative">
              <div className="absolute -top-14 md:-top-20 -left-4">
                <Image
                  src={cards[currentSlide].image}
                  width={100}
                  height={100}
                  className="md:w-20 md:h-20 w-28 h-28"
                  alt={`Step ${cards[currentSlide].id}`}
                />
              </div>
            </div>

            <h3 className="text-navy font-luckiest-guy text-xl mb-3">
              {cards[currentSlide].title}
            </h3>

            <p className="text-[#727272] font-nunito-sans text-sm leading-relaxed">
              {cards[currentSlide].description}
            </p>
          </div>

          {/* Navigation Arrows */}
          <div className="flex justify-center gap-4 mt-8">
            <button
              onClick={prevSlide}
              className="w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
            >
              <Image
                src="/icons/left-arrow.svg"
                alt="arrow-left"
                width={24}
                height={24}
                className="w-4 h-4"
              />
            </button>

            <button
              onClick={nextSlide}
              className="w-12 h-12 bg-[#5A7BF7] rounded-full shadow-lg flex items-center justify-center hover:bg-[#4A6BF7] transition-colors"
            >
              <Image
                src="/icons/right-arrow.svg"
                alt="arrow-right"
                width={24}
                height={24}
                className="w-4 h-4"
              />
            </button>
          </div>
        </div>

        {/* Desktop Grid */}
        <div className="hidden md:block relative lg:min-h-[470px] xl:min-h-[200px] h-fit">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mt-12 md:mt-20 lg:absolute lg:-top-16 xl:-top-56">
            {cards.map((card, index) => (
              <div
                key={card.id}
                className="bg-white rounded-2xl p-6 md:p-8 md:min-h-[350px] border border-gray-200 shadow-lg relative"
              >
                <div className="text-[#759CF3] text-[60px] md:text-[72px] font-luckiest-guy absolute top-3 md:top-4 right-4 md:right-6 opacity-20">
                  {card.id}
                </div>
                <div className="mb-12 md:mb-16 relative">
                  <div className="absolute -top-20 md:-top-23 -left-4 md:-left-6">
                    <Image
                      src={card.image}
                      width={100}
                      height={100}
                      className="w-20 h-20 md:w-32 md:h-32"
                      alt={`Step ${card.id}`}
                    />
                  </div>
                </div>
                <h3 className="text-navy font-luckiest-guy text-xl md:text-2xl mb-2">
                  {card.title}
                </h3>
                <p className="text-[#727272] font-nunito-sans text-sm md:text-base">
                  {card.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
