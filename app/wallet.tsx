import ConnectedWalletScreen from "@/components/ConnectedWallet";
import DisconnectedWalletScreen from "@/components/DisconnectedWallet";
import React from "react";
import { useAccount } from "wagmi";

const WalletScreen = () => {
  const { isConnected } = useAccount();

  return isConnected ? <ConnectedWalletScreen /> : <DisconnectedWalletScreen />;
};
export default WalletScreen;
