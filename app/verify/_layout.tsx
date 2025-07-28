import { ProgressBar } from "@/components/ProgressBar";
import { useReceiptStore } from "@/lib/verify-store";
import { Feather } from "@expo/vector-icons";
import { Stack, useFocusEffect, useRouter } from "expo-router";
import { useCallback } from "react";
import { BackHandler, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
// import { Cross, Plus, X } from "lucide-react-native";

export default function TabLayout() {
  const router = useRouter();
  const { currentStep, setCurrentStep } = useReceiptStore();
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        if (currentStep > 1) {
          const newStep = currentStep - 1;
          setCurrentStep(newStep);
          router.back();
          return true; // Prevent default behavior
        }
        return false; // Allow default behavior (exit)
      };

      const subscription = BackHandler.addEventListener(
        "hardwareBackPress",
        onBackPress
      );

      return () => subscription?.remove();
    }, [currentStep, setCurrentStep, router])
  );

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 bg-background">
        <View className="flex-row items-center px-6 mb-4"></View>
        <View className="flex-row items-center px-6 mb-6">
          <View className="flex-1">
            <TouchableOpacity
              className="w-8 h-8 justify-center items-center"
              onPress={() => router.replace("/")}
            >
              <Feather name="x" size={24} color="white" />
            </TouchableOpacity>
          </View>
          <Text className="text-xl font-semibold text-white">Add Receipt</Text>
          <View className="flex-1" />
        </View>
        <ProgressBar className="bg-background" />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="step2" />
          <Stack.Screen name="step3" />
          <Stack.Screen name="step4" />
        </Stack>
      </View>
    </SafeAreaView>
  );
}
