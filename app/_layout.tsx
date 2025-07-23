import { authClient } from "@/lib/auth-client";
import { authStore } from "@/lib/auth-store";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack, usePathname } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as SplashScreen from "expo-splash-screen";
import "./globals.css";
import { useSigninStore } from "@/lib/sign-in-store";

// Configure Reanimated to suppress strict mode warnings
import { configureReanimatedLogger, ReanimatedLogLevel } from 'react-native-reanimated';

configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false, // Disable strict mode
});

const queryClient = new QueryClient();

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

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

  // Hide splash screen when loading is complete
  useEffect(() => {
    if (!isPending) {
      SplashScreen.hideAsync();
    }
  }, [isPending]);

  if (isPending) {
    // Return null to keep showing splash screen
    return null;
  }

  if (error) {
    return (
      <SafeAreaView className="flex-1 bg-background">
        <View className="flex-1 justify-center items-center px-8">
          {/* Error Icon */}
          <View className="mb-8">
            <View className="w-20 h-20 bg-red-500/10 rounded-full justify-center items-center">
              <Text className="text-red-500 text-4xl">⚠️</Text>
            </View>
          </View>

          {/* Error Content */}
          <View className="items-center mb-8">
            <Text className="text-white text-2xl font-bold mb-4 text-center">
              Oops! Something went wrong
            </Text>
            <Text className="text-gray-400 text-base text-center leading-6 mb-2">
              We're having trouble loading your session.
            </Text>
            <Text className="text-gray-500 text-sm text-center">
              This might be a temporary issue.
            </Text>
          </View>

          {/* Action Buttons */}
          <View className="w-full max-w-xs space-y-3">
            <Pressable
              onPress={() => refetch()}
              className="bg-primary rounded-xl px-6 py-4 mb-3 shadow-lg"
            >
              <Text className="text-black font-bold text-center text-base">
                Try Again
              </Text>
            </Pressable>

            <Pressable
              onPress={() => authClient.signOut()}
              className="bg-transparent border border-gray-600 rounded-xl px-6 py-4"
            >
              <Text className="text-white font-semibold text-center text-base">
                Sign Out & Re-login
              </Text>
            </Pressable>
          </View>

          {/* Helper Text */}
          <Text className="text-gray-600 text-xs text-center mt-6 leading-4">
            If the problem persists, please check your internet connection
            {"\n"}or contact support.
          </Text>
        </View>
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
