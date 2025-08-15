import { Feather } from "@expo/vector-icons";
import { useAppKit } from "@reown/appkit-wagmi-react-native";
import React from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import { useAccount } from "wagmi";
import { useCreateWallet } from "../lib/api/wallet";

const DisconnectedWalletScreen = () => {
  const { open } = useAppKit();
  const { isConnected, address } = useAccount();
  const { mutate: createWallet, isPending } = useCreateWallet();

  const handleConnectWallet = () => {
    open();
    if (isConnected && address) {
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
      } else {
        console.error("createWallet is undefined");
      }
    }
  };

  return (
    <View className="flex-1 justify-center items-center bg-background px-6">
      <Feather name="link" size={80} color="white" className="mb-8" />
      <Text className="text-white text-xl font-semibold mb-4">
        Wallet Not Connected
      </Text>
      <Text className="text-slate-400 text-base text-center mb-8">
        Connect your wallet to view your Taraxa balance and transaction history.
      </Text>

      <TouchableOpacity
        className="bg-primary2 rounded-full py-3 px-6 flex-row justify-center items-center"
        onPress={handleConnectWallet}
        disabled={isPending || isConnected}
      >
        {isPending ? (
          <ActivityIndicator size="small" color="black" className="mr-2" />
        ) : (
          <Feather name="link" size={20} color="black" className="mr-2" />
        )}
        <Text className="text-black text-lg font-semibold">
          {isPending ? "Connecting..." : "Connect Wallet"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default DisconnectedWalletScreen;
