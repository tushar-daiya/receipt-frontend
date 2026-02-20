import { Feather } from "@expo/vector-icons";
import { useWeb3Modal } from "@web3modal/wagmi-react-native";
import React from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import { useAccount } from "wagmi";

const DisconnectedWalletScreen = () => {
  const { open } = useWeb3Modal();
  const { isConnected, address, isConnecting } = useAccount();

  const handleConnectWallet = async () => {
    try {
      await open();
    } catch (err) {
      console.error("Error opening wallet modal:", err);
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
        disabled={isConnecting}
      >
        {isConnecting ? (
          <ActivityIndicator size="small" color="black" className="mr-2" />
        ) : (
          <Feather name="link" size={20} color="black" className="mr-2" />
        )}
        <Text className="text-black text-lg font-semibold">
          {isConnecting ? "Connecting..." : "Connect Wallet"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default DisconnectedWalletScreen;
