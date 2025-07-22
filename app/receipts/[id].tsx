import ImageDownloader from "@/components/ImageDownloader";
import images from "@/constants/images";
import { getReceipt } from "@/lib/api/receipts";
import { Receipt } from "@/lib/types";
import { Feather } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const Page = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  if (!id) {
    router.push("/");
    return null;
  }
  const { data, error, isPending, isError } = getReceipt({
    params: {},
    id: id as string,
  });

  const receipt: Receipt = data?.receipt;

  return (
    <View className="flex-1 bg-background">
      <View className="flex-row items-center h-20 px-6">
        <View className="flex-1 items-start">
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-8 h-8 justify-center items-center"
          >
            <Feather name="x" size={24} color="white" />
          </TouchableOpacity>
        </View>
        <Text className="text-xl font-semibold text-white">Receipt</Text>
        <View className="flex-1" />
      </View>
      {isPending && <Loading />}
      {isError && error && <Error err={error.message} />}
      {data && (
        <View className="flex-1">
          <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
            <View className="flex-1 px-6">
              <Text className="text-white text-2xl font-bold mt-4">
                {data.receipt.amount.toLocaleString("en-US", {
                  style: "currency",
                  currency: "USD",
                })}
              </Text>
              <View className="bg-secondary rounded-full self-start px-5 py-2 mt-8">
                <Text className="text-white font-medium">Paid</Text>
              </View>
              <Image
                source={{ uri: receipt.imageUrl }}
                className="w-full aspect-video rounded-lg mt-4"
              />
              <View className="mt-6 flex-col gap-6">
                <View className="flex-row items-center">
                  <View className="bg-secondary rounded-lg p-4">
                    <Image source={images.receipt_icon} className="w-8 h-8" />
                  </View>
                  <View className="ml-4">
                    <Text className="text-white text-lg font-semibold">
                      {receipt.vendor}
                    </Text>
                    <Text className="text-primaryMuted">Vendor</Text>
                  </View>
                </View>
                <View className="flex-row items-center">
                  <View className="bg-secondary rounded-lg p-4">
                    <Image source={images.receipt_icon} className="w-8 h-8" />
                  </View>
                  <View className="ml-4">
                    <Text className="text-white text-lg font-semibold">
                      {new Date(receipt.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </Text>
                    <Text className="text-primaryMuted">Receipt Date</Text>
                  </View>
                </View>
                <View className="flex-row items-center">
                  <View className="bg-secondary rounded-lg p-4">
                    <Image source={images.receipt_icon} className="w-8 h-8" />
                  </View>
                  <View className="ml-4">
                    <Text className="text-white text-lg font-semibold">
                      {receipt.category}
                    </Text>
                    <Text className="text-primaryMuted">Category</Text>
                  </View>
                </View>
                <View className="flex-row items-center">
                  <View className="bg-secondary rounded-lg p-4">
                    <Image source={images.receipt_icon} className="w-8 h-8" />
                  </View>
                  <View className="ml-4">
                    <Text className="text-white text-lg font-semibold">
                      Wallet Address
                    </Text>
                    <Text className="text-primaryMuted">Signing Wallet</Text>
                  </View>
                </View>
              </View>
            </View>
          </ScrollView>
          <View className="h-20 flex-row justify-between items-center mb-4">
            <Pressable className="flex-1 bg-[#B0E8C9] rounded-xl py-4 mx-4">
              <Text className="text-black text-center">Verify</Text>
            </Pressable>
            <Pressable
              onPress={() => router.push(`/receipts/${id}/share`)}
              className="flex-1 bg-[#294033] rounded-xl py-4 mx-4"
            >
              <Text className="text-white text-center">Share</Text>
            </Pressable>
            <ImageDownloader
              imageUrl={receipt.imageUrl}
              fileName={`receipt-${id}`}
            />
          </View>
        </View>
      )}
    </View>
  );
};

function Loading() {
  return (
    <View className="flex-1 items-center justify-center">
      <Text className="text-white text-lg">Loading...</Text>
    </View>
  );
}

function Error({ err }: { err: string }) {
  return (
    <View className="flex-1 items-center justify-center">
      <Text className="text-red-500 text-lg">Error: {err}</Text>
    </View>
  );
}

export default Page;

const styles = StyleSheet.create({});
