import { createConfig } from "wagmi";
import { abstract, abstractTestnet, sepolia } from "wagmi/chains";
import { createClient, http } from "viem";
import { eip712WalletActions } from "viem/zksync";
import { connectors } from "./rainbowKit";

export const config = createConfig({
  connectors,
  chains: [
    process.env.NEXT_PUBLIC_ABSTRACT_LIVE === "true"
      ? abstract
      : abstractTestnet,
  ],
  client({ chain }) {
    return createClient({
      chain,
      transport: http(),
    }).extend(eip712WalletActions());
  },
  ssr: true,
});
