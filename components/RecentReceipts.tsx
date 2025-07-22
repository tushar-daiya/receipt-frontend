import images from "@/constants/images";
import { listReceipts } from "@/lib/api/receipts";
import { Receipt } from "@/lib/types";
import React from "react";
import { Image, Text, View } from "react-native";

const RecentReceipts = () => {
  return (
    <View className="px-6 flex-1">
      <Text className="font-bold text-white text-xl">Recent Receipts</Text>
      <ReceiptsList />
    </View>
  );
};

const ReceiptsList = () => {
  const { data, isError, isPending, error, isSuccess } = listReceipts({
    params: {},
  });
  const receipts: Receipt[] = data?.receipts || [];
  
  if (isPending) {
    return <Text className="text-white">Loading...</Text>;
  }
  if (isError) {
    return <Text className="text-red-500">Error: {error?.message}</Text>;
  }
  if (isSuccess && !receipts.length) {
    return <Text className="text-white">No receipts found</Text>;
  }
  
  return (
    <View>
      {receipts.map((item) => (
        <ReceiptItem key={item.id} item={item} />
      ))}
    </View>
  );
};

function ReceiptItem({ item }: { item: Receipt }) {
  return (
    <View className="py-2 flex-row items-center">
      <Image source={images.receipt_icon} className="w-8 h-8 mr-3" />
      <View className="ml-2">
        <Text className="text-white text-2xl font-bold">
          {item.amount.toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
          })}
        </Text>
        <Text className="text-primaryMuted">{item.category}</Text>
      </View>
    </View>
  );
}

export default RecentReceipts;