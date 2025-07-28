import { Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import { useReceiptStore } from "@/lib/verify-store";
import { useRouter } from "expo-router";

const Step3 = () => {
  const router = useRouter();
  const { formData, updateFormData, setCurrentStep } = useReceiptStore();
  function onSubmit() {
    setCurrentStep(4);
    router.push("/verify/step4");
  }
  return (
    <View className="bg-background flex-1 px-6">
      <View>
        <Text className="text-white text-2xl font-bold">Pick a method</Text>
        <Pressable
          onPress={() => updateFormData({ imageUploadMethod: "camera" })}
          className="rounded-lg p-4 border border-border mt-6"
        >
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-white font-semibold">Scan cam</Text>
              <Text className="text-primaryMuted font-semibold">
                Use your camera to scan a receipt
              </Text>
            </View>
            <View
              className={`w-6 h-6 rounded-full border ${
                formData.imageUploadMethod === "camera"
                  ? "border-green-400"
                  : "border-gray-500"
              } items-center justify-center`}
            >
              {formData.imageUploadMethod === "camera" && (
                <View className="w-3 h-3 bg-green-400 rounded-full" />
              )}
            </View>
          </View>
        </Pressable>
        <Pressable
          className="rounded-lg p-4 border border-border mt-6"
          onPress={() => updateFormData({ imageUploadMethod: "gallery" })}
        >
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-white font-semibold">File Upload</Text>
              <Text className="text-primaryMuted font-semibold">
                Upload a receipt file from your device
              </Text>
            </View>
            <View
              className={`w-6 h-6 rounded-full border ${
                formData.imageUploadMethod === "gallery"
                  ? "border-green-400"
                  : "border-gray-500"
              } items-center justify-center`}
            >
              {formData.imageUploadMethod === "gallery" && (
                <View className="w-3 h-3 bg-green-400 rounded-full" />
              )}
            </View>
          </View>
        </Pressable>
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

export default Step3;

const styles = StyleSheet.create({});
