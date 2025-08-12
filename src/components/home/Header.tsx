import Image from "next/image";
import Link from "next/link";
import Button from "./Button";

const NAV_ITEMS = [
  {
    label: "Wallpaper",
    href: "/",
  },
  {
    label: "Stickers",
    href: "/",
  },
];

export default function Header() {
  return (
    <div className="w-full h-fit py-4 px-12 flex justify-between items-center">
      <Image
        src={"/logo.png"}
        alt="Logo"
        width={248}
        height={91}
        className="w-40 h-16"
      />

      <div className="flex w-fit items-center gap-x-12 h-full">
        {NAV_ITEMS.map((item) => (
          <Link
            href={item.href}
            key={item.label}
            className="text-white p-0 m-0 text-lg font-luckiest-guy"
          >
            {item.label}
          </Link>
        ))}
        {/* button */}
        <Button>Connect Wallet</Button>
      </div>
    </div>
  );
}
