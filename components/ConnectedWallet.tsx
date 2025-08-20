import { useGetTransaction } from "@/lib/api/transaction";
import { authStore } from "@/lib/auth-store";
import { Feather } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Alert,
  Modal,
  Pressable,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { taraxaTestnet } from "viem/chains";
import { useAccount, useBalance, useDisconnect } from "wagmi";

const ConnectedWalletScreen = () => {
  const { address, isConnected } = useAccount();
  const { user, setUser } = authStore();
  const { disconnect } = useDisconnect();
  const result = useBalance({ address, chainId: taraxaTestnet.id });

  const [isUsernameModalVisible, setIsUsernameModalVisible] = useState(false);
  const [newUsername, setNewUsername] = useState(user?.username || "");
  const [isUpdating, setIsUpdating] = useState(false);

  // Fetch transactions for the connected wallet
  const {
    data: transactionData,
    isPending: isLoading,
    isError,
  } = useGetTransaction({
    params: { wallet_address: address || "" },
  });

  const openUsernameModal = () => {
    setNewUsername(user?.username || "");
    setIsUsernameModalVisible(true);
  };

  return (
    <SafeAreaView className="flex-1 bg-background px-6">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="flex-row items-center justify-between py-4">
          <View className="w-8" />
          <Text className="text-xl font-semibold text-white">Wallet</Text>
          <View className="w-8" />
        </View>

        {/* User Info */}
        <View className="rounded-xl mb-6 flex-row items-center">
          <View className="rounded-xl p-4 mr-3 bg-secondary">
            <Feather name="user" size={20} color={"white"} />
          </View>
          <Pressable onPress={openUsernameModal} className="flex-1">
            <View className="flex-row items-center justify-between">
              <View>
                <Text className="text-white font-medium">Username</Text>
                <Text className="text-slate-400 text-sm">{user?.username}</Text>
              </View>
              <Feather name="edit-2" size={16} color="#9ca3af" />
            </View>
          </Pressable>
        </View>

        <View className="rounded-xl mb-6 flex-row items-center">
          <View className="rounded-xl p-4 mr-3 bg-secondary">
            <Feather name="copy" size={20} color={"white"} />
          </View>
          <Pressable>
            <Text className="text-white font-medium">Wallet Address</Text>
            <Text className="text-slate-400 text-sm">{address}</Text>
          </Pressable>
        </View>

        {/* Balance Card */}
        <View className="bg-primaryMuted rounded-2xl p-6 mb-6 relative overflow-hidden">
          {/* Decorative shapes */}
          <View className="absolute top-4 right-4">
            <View className="w-32 h-32 bg-primary2 rounded-full opacity-60" />
          </View>
          <View className="absolute -top-4 right-8">
            <View className="w-24 h-24 bg-white rounded-full opacity-40" />
          </View>

          <View className="mt-8">
            <Text className="text-slate-800 text-lg font-medium mb-2">
              Your Current Balance
            </Text>
            <Text className="text-slate-900 text-3xl font-bold">
              {result.data?.formatted} {result.data?.symbol.toLowerCase()}
            </Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View className="flex-row gap-6 mb-4">
          <TouchableOpacity
            className="flex-1 bg-primary2 rounded-xl py-4"
            onPress={() => Alert.alert("Receive TARA")}
          >
            <Text className="text-black text-center font-semibold text-lg">
              Receive
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="flex-1 bg-secondary rounded-xl py-4"
            onPress={() => Alert.alert("Send TARA")}
          >
            <Text className="text-white text-center font-semibold text-lg">
              Send
            </Text>
          </TouchableOpacity>
        </View>
        <View className="flex-row gap-6 mb-8">
          <TouchableOpacity
            className="flex-1 bg-secondary rounded-xl py-4"
            onPress={() => Alert.alert("Buy TARA")}
          >
            <Text className="text-white text-center font-semibold text-lg">
              Buy
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="flex-1 bg-primary2 rounded-xl py-4"
            onPress={() => Alert.alert("Swap TARA")}
          >
            <Text className="text-black text-center font-semibold text-lg">
              Swap
            </Text>
          </TouchableOpacity>
        </View>

        {/* Transactions Section */}
        <View className="bg-primaryMuted rounded-2xl p-6 mb-6">
          <Text className="text-slate-800 text-lg font-medium mb-4">
            Recent Transactions
          </Text>
          {isLoading && <Text className="text-slate-400">Loading...</Text>}
          {isError && (
            <Text className="text-red-500">Failed to load transactions.</Text>
          )}
          {transactionData?.transactions?.length ? (
            transactionData.transactions.map((txn: any, index: any) => (
              <View
                key={index}
                className="flex-row justify-between items-center mb-4"
              >
                <View>
                  <Text className="text-slate-900 font-medium">
                    {txn.hash.slice(0, 6)}...{txn.hash.slice(-4)}
                  </Text>
                  <Text className="text-slate-400 text-sm">
                    Block: {txn.blockNumber}
                  </Text>
                </View>
                <Text className="text-slate-800 font-medium">
                  {txn.value} TARA
                </Text>
              </View>
            ))
          ) : (
            <Text className="text-slate-400">No transactions found.</Text>
          )}
        </View>
      </ScrollView>

      {/* Disconnect Wallet */}
      <View className="mb-6 mt-4">
        <Pressable
          className="bg-red-500 rounded-full py-3 flex-row justify-center items-center"
          onPress={() => disconnect()}
        >
          <Feather
            name="log-out"
            size={20}
            color="white"
            style={{ marginRight: 8 }}
          />
          <Text className="text-white font-semibold text-lg">Disconnect</Text>
        </Pressable>
      </View>

      {/* Username Edit Modal */}
      <Modal
        visible={isUsernameModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsUsernameModalVisible(false)}
      >
        <View className="flex-1 bg-black/50 justify-center items-center px-6">
          <View className="bg-background rounded-2xl p-6 w-full max-w-sm">
            <Text className="text-white text-xl font-semibold mb-4 text-center">
              Edit Username
            </Text>

            <TextInput
              value={newUsername}
              onChangeText={setNewUsername}
              placeholder="Enter new username"
              placeholderTextColor="#9ca3af"
              className="bg-secondary text-white rounded-xl px-4 py-3 mb-6 text-base"
              autoFocus={true}
              maxLength={30}
            />

            <View className="flex-row gap-3">
              <TouchableOpacity
                className="flex-1 bg-secondary rounded-xl py-3"
                onPress={() => setIsUsernameModalVisible(false)}
                disabled={isUpdating}
              >
                <Text className="text-white text-center font-medium">
                  Cancel
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default ConnectedWalletScreen;
