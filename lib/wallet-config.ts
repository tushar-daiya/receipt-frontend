import {
  createAppKit,
  defaultWagmiConfig,
} from "@reown/appkit-wagmi-react-native";
import {
  arbitrum,
  mainnet,
  polygon,
  taraxa,
  taraxaTestnet,
} from "@wagmi/core/chains";

const projectId = "3ccc1b3d09166eade6cb3bcff870fec6";

const metadata = {
  name: "Receipt dApp",
  description: "Your smart receipt manager",
  url: "https://github.com/tushar-daiya/receipt-frontend",

  icons: ["https://avatars.githubusercontent.com/u/179229932"],
  redirect: {
    native: "receiptdapp://",
  },
};

const chains = [mainnet, polygon, arbitrum, taraxa, taraxaTestnet] as const;

export const wagmiConfig = defaultWagmiConfig({ chains, projectId, metadata });
export const appKitModal = createAppKit({
  projectId,
  metadata,
  wagmiConfig,
  defaultChain: taraxaTestnet,
  enableAnalytics: true,
});
