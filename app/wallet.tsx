import { authStore } from "@/lib/auth-store";
import { authClient } from "@/lib/auth-client";
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

type Transaction = {
  id: number;
  type: "received" | "sent";
  amount: string;
  address: string;
  icon: "arrow-down-left" | "arrow-up-right";
};
const WalletScreen = () => {
  const { user, setUser } = authStore();
  const [isUsernameModalVisible, setIsUsernameModalVisible] = useState(false);
  const [newUsername, setNewUsername] = useState(user?.username || "");
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdateUsername = async () => {
    if (!newUsername.trim()) {
      Alert.alert("Error", "Username cannot be empty");
      return;
    }

    if (newUsername === user?.username) {
      setIsUsernameModalVisible(false);
      return;
    }

    setIsUpdating(true);
    try {
      const { data, error } = await authClient.updateUser({
        username: newUsername.trim(),
      });

      if (error) {
        Alert.alert("Error", error.message || "Failed to update username");
      } else {
        // Update the user in the store
        if (user) {
          setUser({
            ...user,
            username: newUsername.trim(),
          });
        }
        setIsUsernameModalVisible(false);
        Alert.alert("Success", "Username updated successfully");
      }
    } catch (err) {
      Alert.alert("Error", "An unexpected error occurred");
    } finally {
      setIsUpdating(false);
    }
  };

  const openUsernameModal = () => {
    setNewUsername(user?.username || "");
    setIsUsernameModalVisible(true);
  };
  const transactions: Transaction[] = [
    {
      id: 1,
      type: "received",
      amount: "100 TARA",
      address: "0x789...012",
      icon: "arrow-down-left",
    },
    {
      id: 2,
      type: "sent",
      amount: "50 TARA",
      address: "0x345...678",
      icon: "arrow-up-right",
    },
    {
      id: 3,
      type: "received",
      amount: "250 TARA",
      address: "0x901...234",
      icon: "arrow-down-left",
    },
    {
      id: 4,
      type: "sent",
      amount: "75 TARA",
      address: "0x567...890",
      icon: "arrow-up-right",
    },
    {
      id: 5,
      type: "received",
      amount: "500 TARA",
      address: "0x123...456",
      icon: "arrow-down-left",
    },
    {
      id: 6,
      type: "received",
      amount: "500 TARA",
      address: "0x123...456",
      icon: "arrow-down-left",
    },
    {
      id: 7,
      type: "received",
      amount: "500 TARA",
      address: "0x123...456",
      icon: "arrow-down-left",
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-background px-6">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="flex-row items-center justify-between py-4">
          <View className="w-8" />
          <Text className="text-xl font-semibold text-white">Wallet</Text>
          <View className="w-8" />
        </View>

        <View className="rounded-xl mb-6 flex-row items-center">
          <View className="rounded-xl p-4 mr-3 bg-secondary ">
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
          <View className="rounded-xl p-4 mr-3 bg-secondary ">
            <Feather name="copy" size={20} color={"white"} />
          </View>
          <Pressable>
            <Text className="text-white font-medium">Copy Address</Text>
            <Text className="text-slate-400 text-sm">0x123...456</Text>
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
              Taraxa Balance
            </Text>
            <Text className="text-slate-900 text-3xl font-bold">
              12,345.67 TARA
            </Text>
          </View>
        </View>

        {/* Gas Credits */}
        <View className="mb-6">
          <View className="flex-row items-center justify-between mb-2">
            <Text className="text-white font-medium">Gas Credits</Text>
            <Text className="text-white font-medium">75%</Text>
          </View>
          <View className="bg-secondary rounded-full h-2">
            <View className="bg-primary2 rounded-full h-2 w-3/4" />
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

        {/* Recent Activity */}
        <View className="mb-6">
          <Text className="text-white text-2xl font-bold mb-4">
            Recent Activity
          </Text>

          {transactions.map((transaction) => (
            <View key={transaction.id} className="flex-row items-center py-4">
              <View className="bg-secondary rounded-lg p-4 mr-3">
                <Feather
                  name={transaction.icon}
                  size={24}
                  color={
                    transaction.type === "received" ? "#10b981" : "#ef4444"
                  }
                />
              </View>
              <View className="flex-1">
                <Text className="text-white font-medium">
                  {transaction.type === "received" ? "Received" : "Sent"}{" "}
                  {transaction.amount}
                </Text>
                <Text className="text-slate-400 text-sm">
                  {transaction.type === "received" ? "To" : "From"}:{" "}
                  {transaction.address}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Disconnect Wallet */}
      </ScrollView>
      <View className="mb-6 mt-4">
        <Pressable
          className="bg-primary2 rounded-full py-3 flex-row justify-center items-center"
          onPress={() => Alert.alert("Disconnect Wallet")}
        >
          <Text className="text-white">Disconnect Wallet</Text>
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
              
              <TouchableOpacity
                className="flex-1 bg-primary2 rounded-xl py-3"
                onPress={handleUpdateUsername}
                disabled={isUpdating}
              >
                <Text className="text-black text-center font-medium">
                  {isUpdating ? "Updating..." : "Update"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default WalletScreen;
