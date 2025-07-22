// import { Plus } from "lucide-react-native";
import RecentReceipts from "@/components/RecentReceipts";
import { useRouter } from "expo-router";
import React from "react";
import {
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import images from "../../constants/images";
const GeometricShape = ({
  className,
  rotation = 0,
}: {
  className?: string;
  rotation?: number;
}) => (
  <View
    className={`absolute bg-green-500 rounded-lg ${className}`}
    style={{
      transform: [{ rotate: `${rotation}deg` }],
    }}
  />
);

const StatCard = ({
  title,
  value,
  percentage,
  isNegative = false,
}: {
  title: string;
  value: string;
  percentage: string;
  isNegative?: boolean;
}) => (
  <View className="flex-1 bg-background rounded-2xl p-5 border border-border ">
    <Text className="text-sm text-white mb-2 font-medium">{title}</Text>
    <Text className="text-2xl font-bold text-white mb-1">{value}</Text>
    <Text
      className={`text-sm font-semibold ${isNegative ? "text-erorr" : "text-highlight"}`}
    >
      {isNegative ? "" : "+"}
      {percentage}
    </Text>
  </View>
);

export default function index() {
  const router = useRouter();
  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView>
        <StatusBar barStyle="light-content" backgroundColor="#12211A" />

        {/* Header */}
        <View className="flex-row items-center h-20 px-6">
          <View className="flex-1" />
          <Text className="text-xl font-semibold text-white">Receipts</Text>
          <View className="flex-1 items-end">
            <TouchableOpacity className="w-8 h-8 justify-center items-center">
              <Image source={images.home_icon} className="w-6 h-6" />
              {/* <Plus size={24} color="#FFFFFF" /> */}
            </TouchableOpacity>
          </View>
        </View>

        {/* Main Content */}
        <View className="flex-1 justify-center items-center relative px-6 h-[400px]">
          <Image
            source={images.home_bg}
            className="absolute w-96 h-96 -z-10 opacity-20"
            resizeMode="contain"
          />

          {/* Title and Description */}
          <View className="items-center mb-10 z-10">
            <Text className="text-4xl font-bold text-white mb-3">
              Verify Receipt
            </Text>
            <Text className="text-base text-white text-center leading-6 px-5">
              Ensure authenticity and integrity of your receipts using
              blockchain technology..
            </Text>
          </View>

          {/* Verify Button */}
          <TouchableOpacity
            onPress={() => {
              router.push("/verify");
            }}
            className="bg-primary2 px-8 py-3 rounded-3xl mb-5 z-10"
          >
            <Text className="text-lg font-semibold text-white">Verify</Text>
          </TouchableOpacity>
        </View>

        {/* Statistics */}
        <View className="px-6 pb-10">
          <View className="flex-row gap-4 mb-4">
            <StatCard title="Paper Saved" value="120" percentage="10%" />
            <StatCard title="$ Saved" value="$ 5,400" percentage="5%" />
          </View>
          <StatCard
            title="CO₂ kg"
            value="25"
            percentage="2%"
            isNegative={true}
          />
        </View>
        <RecentReceipts />
      </ScrollView>
    </SafeAreaView>
  );
}
