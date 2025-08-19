import { receiptManagerAddress } from "@/contract/contractConfig";

import { useCreateTransaction } from "@/lib/api/transaction";
import { useReceiptStore } from "@/lib/verify-store";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Pressable, Text, View } from "react-native";
import { BaseError } from "viem";
import {
  useAccount,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import receiptManagerAbi from "../../contract/receiptManager.json";

export default function Step5() {
  const { address, chain } = useAccount();
  const { formData, resetForm } = useReceiptStore();
  const { amount, vendor, date, category, receiptId } = formData;
  const router = useRouter();

  const [txnHash, setTxnHash] = useState<`0x${string}` | undefined>(undefined);
  const [displayError, setDisplayError] = useState<string | null>(null);

  const { writeContract, isPending: isSubmitting } = useWriteContract();
  const {
    data: receipt,
    isLoading: isConfirming,
    isSuccess: isConfirmed,
  } = useWaitForTransactionReceipt({ hash: txnHash });
  const {
    mutate: createTransaction,
    isPending: isSaving,
    isSuccess: isSaved,
    isError: isSaveError,
  } = useCreateTransaction();

  const handleSubmit = () => {
    setDisplayError(null);

    if (!address) {
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
      },
      {
        onSuccess: (hash) => setTxnHash(hash),
        onError: (err) => {
          if (err instanceof BaseError) {
            setDisplayError(err.shortMessage);
          } else {
            setDisplayError(err.message);
          }
        },
      }
    );
  };

  useEffect(() => {
    if (isConfirmed && receipt && address && chain && receiptId) {
      createTransaction(
        {
          receiptId,
          gas: receipt.gasUsed.toString(),
          blockNumber: receipt.blockNumber.toString(),
          network: chain.name,
          wallet_address: address,
        },
        {
          onSuccess: () => {
            Alert.alert("Success", "Transaction saved to your history.");
            resetForm();
            router.push("/");
          },
          onError: (error) => {
            setDisplayError(
              `Transaction confirmed on-chain but failed to save: ${error.message}`
            );
          },
        }
      );
    }
  }, [isConfirmed, receipt, address, chain, receiptId, createTransaction]);

  const isLoading = isSubmitting || isConfirming || isSaving;
  let loadingMessage = "Submit to Blockchain";
  if (isSubmitting) loadingMessage = "Waiting for signature...";
  if (isConfirming) loadingMessage = "Confirming transaction...";
  if (isSaving) loadingMessage = "Saving transaction details...";

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
        disabled={isLoading}
        className={`rounded-full py-3 flex-row justify-center items-center ${
          isLoading ? "bg-gray-500" : "bg-primary2"
        }`}
      >
        {isLoading && (
          <ActivityIndicator size="small" color="white" className="mr-2" />
        )}
        <Text className="text-white text-lg font-semibold">
          {loadingMessage}
        </Text>
      </Pressable>
      {displayError && (
        <Text className="text-red-500 text-center mt-4">{displayError}</Text>
      )}
    </View>
  );
}
