import { Feather } from "@expo/vector-icons";
import { Tabs, useRouter } from "expo-router";
// import { Home, Plus, CreditCard, User } from "lucide-react-native";

export default function TabLayout() {
  const router = useRouter();
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
          tabBarIcon: ({ color, size, focused }) => (
            <Feather name="home" color={color} size={size || 24} />
          ),
        }}
      />

      <Tabs.Screen
        name="add"
        options={{
          title: "Add",
          tabBarIcon: ({ color, size }) => (
            <Feather name="plus" color={color} size={size || 24} />
          ),
        }}
        listeners={{
          tabPress: (e) => {
            e.preventDefault();
            router.push("/verify");
          },
        }}
      />

      <Tabs.Screen
        name="cards"
        options={{
          title: "Cards",
          tabBarIcon: ({ color, size }) => (
            <Feather name="credit-card" color={color} size={size || 24} />
          ),
        }}
      />

      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color, size }) => (
            <Feather name="user" color={color} size={size || 24} />
          ),
          animation: "fade",
        }}
      />
    </Tabs>
  );
}
