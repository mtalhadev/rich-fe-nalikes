import StakeSlider from "@/../public/stake-slider.svg";
import StakeSliderMb from "@/../public/stake-slider-mb.svg";
import Image from "next/image";

export default function RWASeperator() {
  return (
    <div>
      <div className="w-full relative md:my-16 lg:my-12 my-8">
        <Image
          src={StakeSlider}
          width={1000}
          height={1000}
          alt="Separator"
          className="hidden md:block object-contain md:object-cover h-full md:h-fit w-screen"
        />
        <Image
          src={StakeSliderMb}
          width={1000}
          height={1000}
          alt="Separator"
          className="md:hidden block object-contain md:object-cover h-full md:h-fit w-screen"
        />
      </div>
    </div>
  );
}
