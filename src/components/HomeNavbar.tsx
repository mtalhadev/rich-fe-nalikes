import Image from "next/image";
import Link from "next/link";
import Logo from "@/../public/logo-svg.svg";

export default function HomeNavbar() {
  return (
    <div className="w-full flex items-center justify-between px-30 pt-4 font-luckiest-guy text-white">
      <Image src={Logo} alt="Logo" width={248} height={91} />
      <div className="flex items-center gap-x-10">
        <Link
          href={""}
          className="text-3xl hover:scale-105 active:scale-95  transition-all"
        >
          Wallpaper
        </Link>
        <Link
          href={""}
          className="text-3xl hover:scale-105 active:scale-95  transition-all"
        >
          Stickers
        </Link>
        <button
          type="button"
          className="bg-primary-gradient border-2 border-secondary rounded-md w-[321px] h-16 bg-gradient-btn text-[32px] cursor-pointer  transition-all text-sm md:text-brand-md lg:text-[25px] btn-shine hover:scale-105 active:scale-95"
        >
          Connect Wallet
        </button>
      </div>
    </div>
  );
}
