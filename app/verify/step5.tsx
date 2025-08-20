import { receiptManagerAddress } from "@/contract/contractConfig";
import { useCreateTransaction } from "@/lib/api/transaction";
import { useReceiptStore } from "@/lib/verify-store";
import receiptManagerAbi from "../../contract/receiptManager.json";

import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, Pressable, Text, View } from "react-native";
import { taraxaTestnet } from "viem/chains";
import {
  useAccount,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";

export default function Step5() {
  const { address, isConnected } = useAccount();
  const { formData, resetForm } = useReceiptStore();
  const { amount, vendor, date, category, receiptId } = formData;
  const router = useRouter();
  const [txnHash, setTxnHash] = useState<`0x${string}` | undefined>(undefined);
  const {
    mutate: createTransaction,
    isPending: isSaving,
    isSuccess: isSaved,
    isError: isSaveError,
  } = useCreateTransaction();

  const {
    data: contractData,
    isLoading: isConfirming,
    isSuccess: isConfirmed,
  } = useWaitForTransactionReceipt({ hash: txnHash });

  const { writeContract, isPending, isError, error } = useWriteContract();

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
            router.push("/");
          },
        }
      );
    } catch (error) {
      console.error("Error:", error);
      Alert.alert("Error", "Failed to add receipt. Please try again.");
    }
  };

  useEffect(() => {
    if (isConfirmed && contractData && address && receiptId) {
      if (createTransaction) {
        createTransaction(
          {
            receiptId,
            gas: contractData.gasUsed.toString(),
            blockNumber: contractData.blockNumber.toString(),
            network: taraxaTestnet.name,
            wallet_address: address,
            hash: txnHash,
          },
          {
            onSuccess: () => {
              Alert.alert("Success", "Transaction saved to your history.");
              resetForm();
              router.push("/");
            },
            onError: (error) => {
              Alert.alert(
                `Transaction confirmed on-chain but failed to save: ${error.message}`
              );
            },
          }
        );
      }
    }
  }, [isConfirmed, contractData, address, receiptId, createTransaction]);

  return (
    <View className="bg-background flex-1 px-6">
      <View>
        <Text className="text-white text-2xl font-bold">
          Confirm Receipt Submission to Blockchain
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
      </View>
      <View className="mt-auto mb-6">
        <Pressable
          onPress={handleSubmit}
          disabled={isPending}
          className={`rounded-full py-3 flex-row justify-center items-center ${
            isPending ? "bg-primaryMuted" : "bg-primary2"
          }`}
        >
          <Text className="text-white">
            {isPending ? "Submitting..." : "Submit to Blockchain"}
          </Text>
        </Pressable>
        {isError && (
          <Text className="text-red-500 text-center mt-4">
            {error?.message || "An error occurred"}
          </Text>
        )}
      </View>
    </View>
  );
}
