import { useReceiptStore } from "@/lib/verify-store";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { taraxaTestnet } from "viem/chains";
import { useAccount, useEstimateFeesPerGas } from "wagmi";

const Step2 = () => {
  const router = useRouter();
  const { formData, setCurrentStep } = useReceiptStore();
  const { vendor, category, amount, date } = formData;
  const { isConnected } = useAccount();
  const [transactionFee, setTransactionFee] = useState<string | null>(null);

  const {
    data: gasPriceData,
    isLoading,
    error,
  } = useEstimateFeesPerGas({
    chainId: taraxaTestnet.id,
    type: "legacy",
  });

  const gasLimit = 21000;

  const formattedGasPrice = gasPriceData
    ? `${(Number(gasPriceData.gasPrice) * gasLimit) / 1e18} TARA`
    : "Calculating...";

  function onSubmit() {
    setCurrentStep(3);
    router.push("/verify/step3");
  }

  return (
    <View className="bg-background flex-1 px-6">
      <View>
        <Text className="text-white text-2xl font-bold">
          Confirm Receipt Details
        </Text>
        <View className="flex-row gap-4 mt-10 border-t border-white py-4">
          <View className="flex-1">
            <Text className="text-primaryMuted text-lg font-semibold">
              Vendor
            </Text>
            <Text className="text-white">{vendor}</Text>
          </View>
          <View className="flex-1">
            <Text className="text-primaryMuted text-lg font-semibold">
              Date
            </Text>
            <Text className="text-gray-400">
              {new Date(date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </Text>
          </View>
        </View>
        <View className="flex-row gap-4 mt-2 border-t border-white py-4">
          <View className="flex-1">
            <Text className="text-primaryMuted text-lg font-semibold">
              Amount
            </Text>
            <Text className="text-white">
              {Number(amount).toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
              })}
            </Text>
          </View>
          <View className="flex-1">
            <Text className="text-primaryMuted text-lg font-semibold">
              Category
            </Text>
            <Text className="text-gray-400">{category}</Text>
          </View>
        </View>
        <View className="mt-8 flex-row items-center justify-between">
          <Text className="text-xl text-white">Transaction Fee</Text>
          <Text className="text-xl text-white">{formattedGasPrice}</Text>
        </View>
        {error && (
          <Text className="text-red-500 mt-4">
            Error fetching gas price: {error.message}
          </Text>
        )}
      </View>
      <View className="mt-auto mb-6">
        <Pressable
          onPress={onSubmit}
          className="bg-primary2 rounded-full py-3 flex-row justify-center items-center"
        >
          <Text className="text-white">Next</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default Step2;

const styles = StyleSheet.create({});
