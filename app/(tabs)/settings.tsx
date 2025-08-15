import { authClient } from "@/lib/auth-client";
import { authStore } from "@/lib/auth-store";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  SafeAreaView,
  StatusBar,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const SettingsScreen = () => {
  const router = useRouter();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const { setSession, setUser } = authStore();
  const LogoutAlert = () => {
    return Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Logout",
          style: "destructive",
          onPress: async () => {
            const { data, error } = await authClient.signOut();
            if (error) {
              Alert.alert("Error", "Failed to logout. Please try again.");
            }
            setSession(null);
            setUser(null);
            Alert.alert("Success", "You have been logged out successfully.");
          },
        },
      ],
      { cancelable: true }
    );
  };
  const menuItems = [
    {
      title: "Wallet",
      hasArrow: true,
      onPress: () => router.push("/wallet"),
    },
    {
      title: "Gas",
      rightText: "100 $",
      onPress: () => console.log("Gas pressed"),
    },
    {
      title: "FAQ",
      hasArrow: true,
      onPress: () => console.log("FAQ pressed"),
    },
    {
      title: "Support / Contact Us",
      hasArrow: true,
      onPress: () => console.log("Support pressed"),
    },
    {
      title: "Rate",
      hasArrow: true,
      onPress: () => console.log("Rate pressed"),
    },
    {
      title: "Delete Account",
      hasArrow: true,
      onPress: () => {
        console.log("Delete Account pressed");
        Alert.alert("Delete Account");
      },
    },
    {
      title: "Legal",
      hasArrow: true,
      onPress: () => console.log("Legal pressed"),
    },
    {
      title: "Logout",
      hasArrow: true,
      onPress: LogoutAlert,
    },
  ];

  const renderMenuItem = (
    item: {
      title: string;
      hasArrow?: boolean;
      rightText?: string;
      onPress: () => void;
    },
    index: number
  ) => {
    if (item.title === "Notifications") {
      return (
        <View
          key={index}
          className="flex-row items-center justify-between px-5 py-4"
        >
          <Text className="text-base text-white">{item.title}</Text>
          <Switch
            value={notificationsEnabled}
            onValueChange={setNotificationsEnabled}
            trackColor={{ false: "#767577", true: "#ffffff" }}
            thumbColor={notificationsEnabled ? "#ffffff" : "#f4f3f4"}
            ios_backgroundColor="#767577"
          />
        </View>
      );
    }

    return (
      <TouchableOpacity
        key={index}
        className="flex-row items-center justify-between px-5 py-4"
        onPress={item.onPress}
        activeOpacity={0.7}
      >
        <Text className="text-base text-white">{item.title}</Text>
        <View className="flex-row items-center">
          {item.rightText && (
            <Text className="text-base text-white mr-2">{item.rightText}</Text>
          )}
          {item.hasArrow && (
            <Ionicons
              name="chevron-forward"
              size={20}
              color="#ffffff"
              className="opacity-70"
            />
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <StatusBar barStyle="default" backgroundColor="#12211A" />

      {/* Header */}
      <View className="flex-row items-center justify-between px-5 py-4 bg-background">
        <View className="w-8" />
        <Text className="text-xl font-semibold text-white">Settings</Text>
        <View className="w-8" />
      </View>

      <View className="flex-1 pt-5">
        {/* Wallet */}
        {renderMenuItem(menuItems[0], 0)}

        {renderMenuItem(menuItems[1], 1)}

        <View className="flex-row items-center justify-between px-5 py-4">
          <Text className="text-base text-white">Notifications</Text>
          <Switch
            value={notificationsEnabled}
            onValueChange={setNotificationsEnabled}
            trackColor={{ false: "#767577", true: "#ffffff" }}
            thumbColor={notificationsEnabled ? "#ffffff" : "#f4f3f4"}
            ios_backgroundColor="#767577"
          />
        </View>

        {/* Rest of menu items */}
        {menuItems
          .slice(2)
          .map((item, index) => renderMenuItem(item, index + 2))}
      </View>
    </SafeAreaView>
  );
};

export default SettingsScreen;
