import { listReceipts } from "@/lib/api/receipts";
import { useGetTransaction } from "@/lib/api/transaction";
import { Receipt } from "@/lib/types";
import { Feather } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard"; // Import Clipboard API
import * as Linking from "expo-linking";
import { Link, useRouter } from "expo-router";
import React from "react";
import {
  Alert,
  FlatList,
  Image,
  SafeAreaView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useAccount } from "wagmi";
import images from "../../constants/images";

const GeometricShape = ({
  className,
  rotation = 0,
}: {
  className?: string;
  rotation?: number;
}) => (
  <View
    className={`absolute bg-primary2 opacity-10 -z-50 rounded-lg ${className}`}
    style={{
      transform: [{ rotate: `${rotation}deg` }],
    }}
  />
);

const StatCard = ({
  title,
  value,
  percentage,
  isNegative = false,
}: {
  title: string;
  value: string;
  percentage: string;
  isNegative?: boolean;
}) => (
  <View className="flex-1 bg-background rounded-2xl p-5 border border-border">
    <Text className="text-sm text-white mb-2 font-medium">{title}</Text>
    <Text className="text-2xl font-bold text-white mb-1">{value}</Text>
    <Text
      className={`text-sm font-semibold ${
        isNegative ? "text-erorr" : "text-highlight"
      }`}
    >
      {isNegative ? "" : "+"}
      {percentage}
    </Text>
  </View>
);

function ReceiptItem({ item }: { item: Receipt }) {
  return (
    <Link
      href={{
        pathname: "/receipts/[id]",
        params: { id: item.id },
      }}
    >
      <View className="py-4 flex-row items-center px-6">
        <View className="p-4 rounded-lg bg-secondary">
          <Image source={images.receipt_icon} className="w-6 h-6" />
        </View>
        <View className="ml-5">
          <Text className="text-white text-xl font-bold">
            {item.amount.toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
            })}
          </Text>
          <Text className="text-primaryMuted">{item.category}</Text>
        </View>
      </View>
    </Link>
  );
}

export default function index() {
  const router = useRouter();
  const { address: wallet_address } = useAccount();

  const { data: transactionData } = useGetTransaction({
    params: { wallet_address: wallet_address || "" },
  });

  const handleVerify = async () => {
    if (!transactionData || !transactionData.transactions.length) {
      Alert.alert("No Transactions", "No transactions found for this wallet.");
      return;
    }

    const lastTransaction = transactionData.transactions[0];
    const transactionHash = lastTransaction.hash;

    await Clipboard.setStringAsync(transactionHash);
    Alert.alert(
      "Transaction Copied",
      "The transaction hash has been copied to your clipboard."
    );

    const explorerUrl = `https://explorer.testnet.taraxa.io/tx/${transactionHash}`;
    Linking.openURL(explorerUrl).catch((error) => {
      Alert.alert(
        "Error",
        "Failed to open Taraxa Explorer. Please check your internet connection."
      );
      console.error("Failed to open Taraxa Explorer:", error);
    });
  };

  const { data, isError, isPending, error, isSuccess } = listReceipts({
    params: {},
  });
  const receipts: Receipt[] = data?.receipts || [];

  const HeaderComponent = () => (
    <>
      {/* Header */}
      <View className="flex-row items-center h-20 px-6">
        <View className="flex-1" />
        <Text className="text-xl font-semibold text-white">Receipts</Text>
        <View className="flex-1 items-end">
          <TouchableOpacity
            className="w-8 h-8 justify-center items-center"
            onPress={() => router.push("/verify")}
          >
            <Feather name="plus" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Main Content */}
      <View className="flex-1 justify-center items-center relative px-6 h-[400px]">
        <GeometricShape className="w-48 h-24 top-0 left-0" rotation={45} />
        <GeometricShape className="w-48 h-32 top-10 right-0" rotation={-30} />
        <GeometricShape className="w-48 h-20 bottom-0 left-0" rotation={60} />
        <GeometricShape
          className="w-28 h-28 bottom-10 right-0"
          rotation={-45}
        />

        {/* Title and Description */}
        <View className="items-center mb-10 z-10">
          <Text className="text-4xl font-bold text-white mb-3">
            Verify Receipt
          </Text>
          <Text className="text-base text-white text-center leading-6 px-5">
            Ensure authenticity and integrity of your receipts using blockchain
            technology..
          </Text>
        </View>

        {/* Verify Button */}
        <TouchableOpacity
          onPress={handleVerify}
          className="bg-primary2 px-8 py-3 rounded-3xl mb-5 z-10"
        >
          <Text className="text-lg font-semibold text-white">Verify</Text>
        </TouchableOpacity>
      </View>

      {/* Statistics */}
      <View className="px-6 pb-10">
        <View className="flex-row gap-4 mb-4">
          <StatCard title="Paper Saved" value="120" percentage="10%" />
          <StatCard
            title="CO₂ kg"
            value="25"
            percentage="2%"
            isNegative={true}
          />
        </View>
        <StatCard title="Money Saved" value="$ 5,400" percentage="5%" />
      </View>

      {/* Recent Receipts Section Header */}
      <View className="px-6 pb-4">
        <Text className="font-bold text-white text-xl">Recent Receipts</Text>
      </View>
    </>
  );

  const EmptyComponent = () => {
    if (isPending) {
      return (
        <View className="px-6 py-4">
          <Text className="text-white">Loading...</Text>
        </View>
      );
    }
    if (isError) {
      return (
        <View className="px-6 py-4">
          <Text className="text-red-500">Error: {error?.message}</Text>
        </View>
      );
    }
    if (isSuccess && !receipts.length) {
      return (
        <View className="px-6 py-4">
          <Text className="text-white">No receipts found</Text>
        </View>
      );
    }
    return null;
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <StatusBar barStyle="default" backgroundColor="#12211A" />
      <FlatList
        className="mb-4"
        data={receipts}
        renderItem={({ item }) => <ReceiptItem item={item} />}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={HeaderComponent}
        ListEmptyComponent={EmptyComponent}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}
      />
    </SafeAreaView>
  );
}
