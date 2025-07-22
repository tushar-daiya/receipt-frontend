import { Feather } from "@expo/vector-icons";
import React from "react";
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  Text,
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

        {/* Address Section */}
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
        <View className="bg-slate-100 rounded-2xl p-6 mb-6 relative overflow-hidden">
          {/* Decorative shapes */}
          <View className="absolute top-4 right-4">
            <View className="w-20 h-20 bg-amber-200 rounded-full opacity-60" />
          </View>
          <View className="absolute -top-4 right-8">
            <View className="w-16 h-16 bg-amber-300 rounded-full opacity-40" />
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
            <View className="bg-primary rounded-full h-2 w-3/4" />
          </View>
        </View>

        {/* Action Buttons */}
        <View className="flex-row gap-6 mb-8">
          <TouchableOpacity className="flex-1 bg-primary rounded-xl py-4">
            <Text className="text-black text-center font-semibold text-lg">
              Receive
            </Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex-1 bg-secondary rounded-xl py-4">
            <Text className="text-white text-center font-semibold text-lg">
              Send
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
      <TouchableOpacity className="items-center py-4 mt-auto mb-6">
        <Text className="text-slate-400 text-sm">Disconnect Wallet</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default WalletScreen;
