// prettier-ignore
import "@walletconnect/react-native-compat";

import { authClient } from "@/lib/auth-client";
import { authStore } from "@/lib/auth-store";
import { appKitModal, wagmiConfig } from "@/lib/wallet-config";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { Stack, usePathname } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { WagmiProvider } from "wagmi";
import "./globals.css";

const queryClient = new QueryClient();

SplashScreen.preventAutoHideAsync();

console.log("AppKit Initialized:", appKitModal);

function InnerLayout() {
  const pathname = usePathname();
  const { data, error, isPending, refetch } = authClient.useSession() || {};
  const { session, setSession, setUser } = authStore();
  console.log("session", session);
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
  }, [data, setSession, setUser, pathname]);

  useEffect(() => {
    if (!isPending) {
      SplashScreen.hideAsync();
    }
  }, [isPending]);

  if (isPending) {
    return null;
  }

  if (error) {
    return (
      <SafeAreaView className="flex-1 bg-background">
        <View className="flex-1 justify-center items-center px-8">
          <View className="mb-8">
            <View className="w-20 h-20 bg-red-500/10 rounded-full justify-center items-center">
              <Text className="text-red-500 text-4xl">⚠️</Text>
            </View>
          </View>
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
          <View className="w-full max-w-xs space-y-3">
            <Pressable
              onPress={() => refetch()}
              className="bg-primary2 rounded-xl px-6 py-4 mb-3 shadow-lg"
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
          <Text className="text-gray-600 text-xs text-center mt-6 leading-4">
            If the problem persists, please check your internet connection
            {"\n"}or contact support.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 dark:bg-background bg-white">
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Protected guard={!session}>
          <Stack.Screen name="initial" />
          <Stack.Screen name="signup" />
          <Stack.Screen name="login" />
          <Stack.Screen name="signin" />

          <Stack.Screen name="otpVerification" />
        </Stack.Protected>
        <Stack.Protected guard={!!session}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="verify" />
        </Stack.Protected>
      </Stack>
    </SafeAreaView>
  );
}

export default function RootLayout() {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        {/* <AppKit /> */}
        <InnerLayout />
      </QueryClientProvider>
    </WagmiProvider>
  );
}
