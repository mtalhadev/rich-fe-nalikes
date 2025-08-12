import { abstract, abstractTestnet, sepolia } from "wagmi/chains";

// Target chain for staking operations
export const TARGET_CHAIN =
  process.env.NEXT_PUBLIC_ABSTRACT_LIVE === "true" ? abstract : sepolia;

// You can also use environment variables if needed
// export const TARGET_CHAIN_ID = process.env.NEXT_PUBLIC_CHAIN_ID
//   ? parseInt(process.env.NEXT_PUBLIC_CHAIN_ID)
//   : abstractTestnet.id;
