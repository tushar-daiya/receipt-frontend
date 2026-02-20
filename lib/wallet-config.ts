import {
  createWeb3Modal,
  defaultWagmiConfig,
} from "@web3modal/wagmi-react-native";

import { http } from "wagmi";
import { mainnet, taraxa, taraxaTestnet } from "wagmi/chains";
const projectId = "3ccc1b3d09166eade6cb3bcff870fec6";

if (!projectId) {
  throw new Error(
    "Project ID is not defined. Please visit https://cloud.walletconnect.com"
  );
}

const metadata = {
  name: "Receipt manager dApp",
  description: "A receipt manager for you",
  url: "https://github.com/tushar-daiya/receipt-frontend",
  icons: ["https://mydapp.example.com/icon.png"],
  redirect: {
    native: "receiptdapp://",
  },
};

const chains = [taraxa, taraxaTestnet, mainnet] as const;

export const config = defaultWagmiConfig({
  chains,
  projectId,
  metadata,
  transports: {
    [taraxa.id]: http(),
    [taraxaTestnet.id]: http(),
    [mainnet.id]: http(),
  },
});

createWeb3Modal({
  projectId,
  wagmiConfig: config,
  defaultChain: taraxaTestnet,
  featuredWalletIds: [],
});
