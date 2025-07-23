import { authClient } from "@/lib/auth-client";
import { authStore } from "@/lib/auth-store";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack, usePathname } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, Pressable, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import "./globals.css";
import { useSigninStore } from "@/lib/sign-in-store";

const queryClient = new QueryClient();

export default function RootLayout() {
  const pathname = usePathname();
  const { data, error, isPending, refetch } = authClient.useSession();
  const { session, setSession, setUser } = authStore();
  const { email } = useSigninStore();

  // Update Zustand store when session data changes
  useEffect(() => {
    if (pathname === "/otpVerification") {
      return;
    }
    if (data) {
      setSession(data.session);
      setUser(data.user);
    } else {
      setSession(null);
      setUser(null);
    }
  }, [data, setSession, setUser]);

  console.log("Session Data:", data);

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
          {/* Unauthenticated routes - accessible when NO session */}
          <Stack.Protected guard={!!!session}>
            <Stack.Protected guard={!!email}>
              <Stack.Screen name="otpVerification" />
            </Stack.Protected>
            <Stack.Screen name="initial" />
            <Stack.Screen name="signup" />
            <Stack.Screen name="login" />
            <Stack.Screen name="signin" />

            {/* OTP Verification - accessible when no session BUT email is set */}
          </Stack.Protected>

          {/* Authenticated routes - accessible when session exists */}
          <Stack.Protected guard={!!session}>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="verify" />
          </Stack.Protected>
        </Stack>
      </SafeAreaView>
    </QueryClientProvider>
  );
}
