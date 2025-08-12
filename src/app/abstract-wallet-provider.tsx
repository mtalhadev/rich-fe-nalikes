"use client";

import { AbstractWalletProvider } from "@abstract-foundation/agw-react";
import { abstract, abstractTestnet, sepolia } from "viem/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { config } from "../../utils/wagmi";
import { lightTheme, RainbowKitProvider } from "@rainbow-me/rainbowkit";

const client = new QueryClient();

export default function AbstractWalletProviderClient({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AbstractWalletProvider
      chain={
        process.env.NEXT_PUBLIC_ABSTRACT_LIVE === "true"
          ? abstract
          : abstractTestnet
      }
    >
      <WagmiProvider config={config}>
        <QueryClientProvider client={client}>
          <RainbowKitProvider theme={lightTheme()}>
            {children}
          </RainbowKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </AbstractWalletProvider>
  );
}
