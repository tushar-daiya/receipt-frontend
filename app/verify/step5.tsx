import {
  receiptManagerAbi,
  receiptManagerAddress,
} from "@/contract/contractConfig";
import { useReceiptStore } from "@/lib/verify-store";

import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Pressable, Text, View } from "react-native";
import {
  useAccount,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";

export default function Step5() {
  const { address, isConnected } = useAccount();
  const { formData, resetForm } = useReceiptStore();
  const { amount, vendor, date, category } = formData;
  const router = useRouter();
  const [txnHash, setTxnHash] = useState<`0x${string}` | undefined>(undefined);

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({ hash: txnHash });

  const { writeContract, isPending, isError, error, isSuccess } =
    useWriteContract();

  const handleSubmit = async () => {
    if (!isConnected) {
      Alert.alert("Error", "Please connect your wallet first.");
      return;
    }


    try {
      writeContract(
        {
          address: receiptManagerAddress,
          abi: receiptManagerAbi,
          functionName: "addReceipt",
          args: [
            vendor,
            category,
            parseFloat(amount),
            Math.floor(new Date(date).getTime() / 1000),
          ],
        },
        {
          onSuccess: (hash) => {
            setTxnHash(hash);
            Alert.alert("Transaction Submitted", `Hash: ${hash}`);
          },
        }
      );
    } catch (error) {
      console.error("Error:", error);
      Alert.alert("Error", "Failed to add receipt. Please try again.");
    }
  };

  return (
    <View className="flex-1 bg-background px-6 justify-center">
      <Text className="text-white text-2xl font-bold mb-4">Submit Receipt</Text>
      <View className="mb-6">
        <Text className="text-primaryMuted text-lg">Vendor: {vendor}</Text>
        <Text className="text-primaryMuted text-lg">Category: {category}</Text>
        <Text className="text-primaryMuted text-lg">
          Amount: ${parseFloat(amount).toFixed(2)}
        </Text>
        <Text className="text-primaryMuted text-lg">
          Date: {new Date(date).toLocaleDateString()}
        </Text>
      </View>
      <Pressable
        onPress={handleSubmit}
        // disabled={isPending}
        className={`rounded-full py-3 flex-row justify-center items-center ${
          isPending ? "bg-primaryMuted" : "bg-primary2"
        }`}
      >
        <Text className="text-white text-lg font-semibold">
          Submit to Blockchain
        </Text>
      </Pressable>
      {isError && (
        <Text className="text-red-500 text-center mt-4">
          {error?.message || "An error occurred"}
        </Text>
      )}
    </View>
  );
}
