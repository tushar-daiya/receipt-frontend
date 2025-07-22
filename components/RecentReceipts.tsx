import { FlatList, StyleSheet, Text, View } from "react-native";
import React from "react";
import { listReceipts } from "@/lib/api/receipts";

const RecentReceipts = () => {
  return (
    <View className="px-6">
      <Text className="font-bold text-white text-xl">Recent Receipts</Text>
      <ReceiptsList />
    </View>
  );
};

const ReceiptsList = () => {
  const { data, isError, isPending, error, isSuccess } = listReceipts({
    params: {},
  });
  const receipts = data?.data || [];
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
    <FlatList
      data={receipts}
      renderItem={({ item }) => (
        <View className="bg-background rounded-lg p-4 mb-4">
          <Text className="text-white font-bold">{item.title}</Text>
          <Text className="text-white">{item.date}</Text>
        </View>
      )}
      keyExtractor={(item) => item.id}
    />
  );
};
export default RecentReceipts;
