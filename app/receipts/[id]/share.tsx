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

const Share = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { data, error, isError, isPending, isSuccess } = getReceipt({
    params: {},
    id: id as string,
  });

  console.log(data, error, isPending, isError, isSuccess);

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
      {receipt && (
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          <View className="flex-1 px-6">
            <Image
              source={{ uri: receipt.imageUrl }}
              className="w-full aspect-[9/16] rounded-lg mt-4"
            />
            <View className="flex-1 gap-4 my-8">
              <Pressable className="w-full bg-[#45EB12] rounded-full h-12 justify-center items-center">
                <Text className="text-black text-center font-semibold">
                  Save
                </Text>
              </Pressable>
              <Pressable className="w-full bg-[#2B4724] rounded-full h-12 justify-center items-center">
                <Text className="text-white text-center font-semibold">
                  Forward via Email
                </Text>
              </Pressable>
              <Pressable className="w-full bg-[#2B4724] rounded-full h-12 justify-center items-center">
                <Text className="text-white text-center font-semibold">
                  Forward to User
                </Text>
              </Pressable>
              <Pressable className="w-full bg-[#2B4724] rounded-full h-12 justify-center items-center">
                <Text className="text-white text-center font-semibold">
                  View on TaxFix
                </Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
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

export default Share;

const styles = StyleSheet.create({});
