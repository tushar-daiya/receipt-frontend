import { ProgressBar } from "@/components/ProgressBar";
import { Feather } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
// import { Cross, Plus, X } from "lucide-react-native";

export default function TabLayout() {
  const router = useRouter();
  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 bg-background pt-10">
        <View className="flex-row items-center px-6 mb-4"></View>
        <View className="flex-row items-center px-6 mb-6">
          <View className="flex-1">
            <TouchableOpacity
              className="w-8 h-8 justify-center items-center"
              onPress={() => router.back()}
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
