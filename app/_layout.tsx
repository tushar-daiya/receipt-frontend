import { authClient } from "@/lib/auth-client";
import { authStore } from "@/lib/auth-store";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, Pressable, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import "./globals.css";
const queryClient = new QueryClient();
export default function RootLayout() {
  const { data, error, isPending, refetch } = authClient.useSession();
  const { session, user, setSession, setUser, isFirstTime } = authStore();

  // Update Zustand store when session data changes
  useEffect(() => {
    if (data) {
      setSession(data.session);
      setUser(data.user);
    } else {
      setSession(null);
      setUser(null);
    }
  }, [data, setSession, setUser]);

  if (isPending) {
    return (
      <SafeAreaView className="flex-1 bg-background justify-center items-center">
        <ActivityIndicator size="large" color="white" />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView className="flex-1 bg-background justify-center items-center">
        <Text className="text-white text-lg mb-4">Something went wrong</Text>
        <Text className="text-gray-400 text-center mb-6 px-4">
          Unable to load your session. Please try again.
        </Text>

        <Pressable
          onPress={() => authClient.signOut()}
          className="bg-primary rounded-lg px-6 py-3 mb-3"
        >
          <Text className="text-black font-semibold">Sign Out & Re-login</Text>
        </Pressable>

        <Pressable
          onPress={() => refetch()}
          className="bg-secondary rounded-lg px-6 py-3"
        >
          <Text className="text-white font-semibold">Retry</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaView className="flex-1 dark:bg-background bg-white">
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Protected guard={!!!session}>
            <Stack.Screen name="initial" />
            <Stack.Screen name="login" />
            <Stack.Screen name="signup" />
          </Stack.Protected>
          <Stack.Protected guard={!!session}>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="verify" />
          </Stack.Protected>
        </Stack>
      </SafeAreaView>
    </QueryClientProvider>
  );
}
