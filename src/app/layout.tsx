import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

import { ToastWrapper } from "@/components/CustomToast";
import { WalletProvider } from "@/contexts/WalletContext";
import "react-toastify/dist/ReactToastify.css";
import AbstractWalletProviderClient from "./abstract-wallet-provider";
import { Alfa_Slab_One, Noto_Sans, Nunito_Sans } from "next/font/google";
import Head from "next/head";

const luckiestGuy = localFont({
  src: [
    {
      path: "../../public/fonts/LuckiestGuy.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/LuckiestGuy.woff",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-luckiest-guy",
  style: "normal",
  display: "swap",
  weight: "400",
});

const alfaSlabOne = Alfa_Slab_One({
  subsets: ["latin"],
  variable: "--font-alfa-slab-one",
  style: "normal",
  weight: "400",
});

const notoSans = Noto_Sans({
  subsets: ["latin"],
  variable: "--font-noto-sans",
  style: "normal",
  weight: ["400", "700", "900"],
});

const nunitoSans = Nunito_Sans({
  subsets: ["latin"],
  variable: "--font-nunito-sans",
  style: "normal",
  weight: ["400", "700", "900"],
});

export const metadata: Metadata = {
  title: "Rich Whale Alliance",
  description: "Rich Whale Alliance",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1"
        />
      </Head>
      <body
        className={`${luckiestGuy.variable} ${alfaSlabOne.variable} ${notoSans.variable} ${nunitoSans.variable}`}
      >
        <AbstractWalletProviderClient>
          <WalletProvider>{children}</WalletProvider>
          <ToastWrapper />
        </AbstractWalletProviderClient>
      </body>
    </html>
  );
}
