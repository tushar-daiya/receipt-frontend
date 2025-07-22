import images from "@/constants/images";
import { Tabs } from "expo-router";
import { Image } from "react-native";
// import { Home, Plus, CreditCard, User } from "lucide-react-native";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#1A3326", // Dark green background
          elevation: 0,
          gridAutoColumns: "1fr",
          shadowOpacity: 0,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
          borderTopColor: "#264533",
        },
        tabBarActiveTintColor: "#FFFFFF", // White for active icons
        tabBarInactiveTintColor: "#94C7AB", // Gray for inactive icons
        tabBarShowLabel: false, // Hide labels to match the design
        tabBarIconStyle: {
          marginTop: 0,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <Image source={images.home_icon} className="w-6 h-6" />
            // <Home color={color} size={size || 24} />
          ),
        }}
      />

      {/* <Tabs.Screen
        name="add"
        options={{
          title: "Add",
          tabBarIcon: ({ color, size }) => (
            <Plus color={color} size={size || 24} />
          ),
        }}
      /> */}

      <Tabs.Screen
        name="wallet"
        options={{
          title: "Wallet",
          tabBarIcon: ({ color, size }) => (
            <Image source={images.home_icon} className="w-6 h-6" />
            // <CreditCard color={color} size={size || 24} />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => (
            <Image source={images.home_icon} className="w-6 h-6" />
            // <User color={color} size={size || 24} />
          ),
          animation: "fade",
        }}
      />
    </Tabs>
  );
}
