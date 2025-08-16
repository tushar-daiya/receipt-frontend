import { defineChain } from "viem";
import receiptManagerAbi from "./receiptManger.json";

export { receiptManagerAbi };
export const receiptManagerAddress =
  "0x1feb9d5dac3d7f69b2acf0b00f4af900e1d75d64";

export const taraxaTestnet = defineChain({
  id: 842,
  name: "Taraxa Testnet",
  nativeCurrency: {
    decimals: 18,
    name: "Tara",
    symbol: "TARA",
  },
  rpcUrls: {
    default: { http: ["https://rpc.testnet.taraxa.io"] },
  },
  blockExplorers: {
    default: {
      name: "Taraxa Explorer",
      url: "https://explorer.testnet.taraxa.io",
    },
  },
  testnet: true,
});
