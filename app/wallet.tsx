import ConnectedWalletScreen from "@/components/ConnectedWallet";
import DisconnectedWalletScreen from "@/components/DisconnectedWallet";
import React, { useEffect, useRef } from "react";
import { useAccount } from "wagmi";
import { useCreateWallet } from "../lib/api/wallet";

const WalletScreen = () => {
  const { isConnected, address } = useAccount();
  const { mutate: createWallet } = useCreateWallet();

  const wasConnected = useRef(isConnected);

  useEffect(() => {
    if (isConnected && !wasConnected.current && address) {
      if (createWallet) {
        createWallet(
          { wallet_address: address },
          {
            onSuccess: () => {
              console.log("Wallet created successfully!");
            },
            onError: (error) => {
              console.error("Error creating wallet:", error);
            },
          }
        );
      }
    }
    wasConnected.current = isConnected;
  }, [isConnected, address, createWallet]);

  return isConnected ? <ConnectedWalletScreen /> : <DisconnectedWalletScreen />;
};

export default WalletScreen;
