import { receiptManagerAddress } from "@/contract/contractConfig";
import { useCreateTransaction } from "@/lib/api/transaction";
import { useReceiptStore } from "@/lib/verify-store";
import receiptManagerAbi from "../../contract/receiptManager.json";

import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Pressable, Text, View } from "react-native";
import { parseGwei } from "viem";
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
  console.log("address", address);

  const [txnHash, setTxnHash] = useState<`0x${string}` | undefined>(undefined);
  const {
    writeContract,
    isPending: isSubmitting,
    error: submitError,
  } = useWriteContract();

  const {
    data: contractData,
    isLoading: isConfirming,
    isSuccess: isConfirmed,
    isError: isTxError,
  } = useWaitForTransactionReceipt({ hash: txnHash });

  const { mutate: createTransaction, isPending: isSaving } =
    useCreateTransaction();

  const isProcessing = isSubmitting || isConfirming || isSaving;

  const handleSubmit = async () => {
    if (!isConnected) {
      Alert.alert("Error", "Please connect your wallet first.");
      return;
    }

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
        gasPrice: parseGwei("10"),
      },
      {
        onSuccess: (hash) => {
          setTxnHash(hash);
        },
        onError: (err) => {
          Alert.alert("Submission Rejected", err.message);
        },
      }
    );
  };

  useEffect(() => {
    if (isConfirmed && contractData && address && receiptId && txnHash) {
      console.log("trxnhash", txnHash);
      createTransaction(
        {
          receiptId,
          gas: contractData.gasUsed.toString(),
          blockNumber: contractData.blockNumber.toString(),
          network: taraxaTestnet.name,
          wallet_address: address,
          trxnHash: txnHash,
          status: "SUCCESS",
        },
        {
          onSuccess: () => {
            Alert.alert(
              "Success!",
              "Your receipt was confirmed on-chain and saved to your history.",
              [
                {
                  text: "OK",
                  onPress: () => {
                    resetForm();
                    router.push("/");
                  },
                },
              ]
            );
          },
          onError: (error) => {
            Alert.alert(
              "Save Failed",
              `Transaction was confirmed on-chain but failed to save. Please contact support. Error: ${error.message}`,
              [{ text: "OK", onPress: () => router.push("/") }]
            );
          },
        }
      );
    }
  }, [isConfirmed, contractData]);

  useEffect(() => {
    if (isTxError && address && receiptId && txnHash) {
      createTransaction(
        {
          receiptId,
          gas: "0",
          blockNumber: "0",
          network: taraxaTestnet.name,
          wallet_address: address,
          trxnHash: txnHash,
          status: "FAILED",
        },
        {
          onSuccess: () => {
            Alert.alert(
              "Transaction Failed",
              "The transaction failed on the blockchain but we have saved the attempt to your history.",
              [{ text: "OK", onPress: () => router.push("/") }]
            );
          },
          onError: (error) => {
            Alert.alert(
              "On-Chain & Save Failed",
              `The transaction failed on-chain and we also failed to save it to our database. Please contact support. Error: ${error.message}`,
              [{ text: "OK", onPress: () => router.push("/") }]
            );
          },
        }
      );
    }
  }, [isTxError]);

  const getStatusText = () => {
    if (isConfirming) return "Confirming transaction on-chain...";
    if (isSaving) return "Saving receipt to your history...";
    if (isSubmitting) return "Please confirm in your wallet...";
    return "Submit to Blockchain";
  };

  return (
    <View className="bg-background flex-1 px-6">
      <View>
        <Text className="text-white text-2xl font-bold">
          Confirm Receipt Submission to Blockchain
        </Text>
        <View className="flex-row gap-4 mt-10 border-t border-white py-4">
          <View className="flex-1">
            <Text className="text-white text-lg font-semibold">Vendor</Text>
            <Text className="text-white">{vendor}</Text>
          </View>
          <View className="flex-1">
            <Text className="text-white text-lg font-semibold">Date</Text>
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
            <Text className="text-white text-lg font-semibold">Amount</Text>
            <Text className="text-white">
              {Number(amount).toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
              })}
            </Text>
          </View>
          <View className="flex-1">
            <Text className="text-white text-lg font-semibold">Category</Text>
            <Text className="text-gray-400">{category}</Text>
          </View>
        </View>
      </View>
      <View className="mt-auto mb-6">
        <Pressable
          onPress={handleSubmit}
          disabled={isProcessing}
          className={`rounded-full py-3 flex-row justify-center items-center ${
            isProcessing ? "bg-primary" : "bg-primary2"
          }`}
        >
          {isProcessing && (
            <ActivityIndicator size="small" color="#ffffff" className="mr-2" />
          )}
          <Text className="text-white text-lg">{getStatusText()}</Text>
        </Pressable>
        {submitError && (
          <Text className="text-red-500 text-center mt-4">
            Error: {submitError.message}
          </Text>
        )}
      </View>
    </View>
  );
}
