import { abstract, abstractTestnet } from "wagmi/chains";

// Target chain for staking operations
export const TARGET_CHAIN =
  process.env.NEXT_PUBLIC_ABSTRACT_LIVE === "true" ? abstract : abstractTestnet;

// You can also use environment variables if needed
// export const TARGET_CHAIN_ID = process.env.NEXT_PUBLIC_CHAIN_ID
//   ? parseInt(process.env.NEXT_PUBLIC_CHAIN_ID)
//   : abstractTestnet.id;
