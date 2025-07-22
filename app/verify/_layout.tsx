import { ProgressBar } from "@/components/ProgressBar";
import { Stack } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
// import { Cross, Plus, X } from "lucide-react-native";

export default function TabLayout() {
  console.log("TabLayout rendered");
  return (
    <SafeAreaView className="flex-1 dark:bg-background bg-white">
      <View className="flex-row items-center h-20 px-6">
        <View className="flex-1">
          <TouchableOpacity className="w-8 h-8 justify-center items-center">
            {/* <X size={24} color="#FFFFFF" /> */}
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
    </SafeAreaView>
  );
}
