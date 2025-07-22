import images from "@/constants/images";
import { router } from "expo-router";
import React from "react";
import {
  Image,
  ImageSourcePropType,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

const initialScreen = () => {
  return (
    <View className="flex-1 bg-background px-6 py-8">
      <Card
        title="Save money"
        description="Get cashback on every purchase"
        image={images.initial_1}
      />
      <Card
        title="Cut CO₂"
        description="Reduce paper waste and your carbon footprint"
        image={images.initial_2}
      />
      <Card
        title="Immutable trust"
        description="Securely store your receipts on the blockchain"
        image={images.initial_3}
      />
      <Pressable
        onPress={() => router.push("/signin")}
        className="bg-primary rounded-lg px-6 py-3 mt-5"
      >
        <Text className="text-black font-semibold text-center">
          Get Started
        </Text>
      </Pressable>
    </View>
  );
};

function Card({
  title,
  description,
  image,
}: {
  title: string;
  description: string;
  image: ImageSourcePropType;
}) {
  return (
    <View className="mt-5 flex-1">
      <Image source={image} className="w-full rounded-2xl overflow-hidden" />
      <Text className="mt-4 text-white font-bold">{title}</Text>
      <Text className="mt-3 text-primaryMuted font-medium">{description}</Text>
    </View>
  );
}

export default initialScreen;

const styles = StyleSheet.create({});
