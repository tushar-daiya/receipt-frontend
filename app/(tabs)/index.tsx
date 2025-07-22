// import { Plus } from "lucide-react-native";
import { listReceipts } from "@/lib/api/receipts";
import { Receipt } from "@/lib/types";
import { Feather } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";
import React from "react";
import {
  FlatList,
  Image,
  SafeAreaView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import images from "../../constants/images";

const GeometricShape = ({
  className,
  rotation = 0,
}: {
  className?: string;
  rotation?: number;
}) => (
  <View
    className={`absolute bg-green-500 rounded-lg ${className}`}
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
      className={`text-sm font-semibold ${isNegative ? "text-erorr" : "text-highlight"}`}
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
        <Image
          source={images.home_bg}
          className="absolute w-96 h-96 -z-10 opacity-20"
          resizeMode="contain"
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
          onPress={() => {
            router.push("/verify");
          }}
          className="bg-primary2 px-8 py-3 rounded-3xl mb-5 z-10"
        >
          <Text className="text-lg font-semibold text-white">Verify</Text>
        </TouchableOpacity>
      </View>

      {/* Statistics */}
      <View className="px-6 pb-10">
        <View className="flex-row gap-4 mb-4">
          <StatCard title="Paper Saved" value="120" percentage="10%" />
          <StatCard title="$ Saved" value="$ 5,400" percentage="5%" />
        </View>
        <StatCard title="CO₂ kg" value="25" percentage="2%" isNegative={true} />
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
