import { connectorsForWallets } from "@rainbow-me/rainbowkit";
import { walletConnectWallet } from "@rainbow-me/rainbowkit/wallets";
import { abstractWallet } from "@abstract-foundation/agw-react/connectors";

export const connectors = connectorsForWallets(
  [
    {
      groupName: "Abstract",
      wallets: [abstractWallet],
    },
    {
      groupName: "WalletConnect",
      wallets: [walletConnectWallet],
    },
  ],
  {
    appName: "Rainbowkit Test",
    projectId: "8cd35fbde31e2715bf2838ba7e1bee42",
    appDescription: "",
    appIcon: "",
    appUrl: "",
  }
);
