import { authClient } from "@/lib/auth-client";
import { authStore } from "@/lib/auth-store";
import { useSigninStore } from "@/lib/sign-in-store";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, router } from "expo-router";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { z } from "zod";
const loginSchema = z.object({
  email: z.email("Invalid email address"),
});
const Signin = () => {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });
  const { setEmail } = useSigninStore();

  const [error, setError] = React.useState<string | null>(null);

  async function onSubmit(values: z.infer<typeof loginSchema>) {
    const { data, error } = await authClient.emailOtp.sendVerificationOtp({
      email: values.email,
      type: "sign-in",
    });
    if (error) {
      console.error("Login error:", error);
      setError(error.message || "An error occurred during login");
      return;
    }
    setEmail(values.email);
    setError(null);
    router.push("/otpVerification");
  }
  return (
    <View className="flex-1 justify-center px-10 bg-background">
      <Text className="text-2xl text-white font-bold mb-6 text-center">
        Sign In
      </Text>
      <View>
        <Text className="text-white">Email</Text>
        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              onBlur={onBlur}
              autoCapitalize="none"
              editable={!isSubmitting}
              onChangeText={onChange}
              value={value}
              placeholderTextColor="#94C7AB"
              placeholder="Enter your email"
              className="bg-secondary rounded-lg px-4 py-2 h-12 mt-2 text-white"
            />
          )}
        />
        {errors.email && (
          <Text className="text-red-500">{errors.email.message}</Text>
        )}
      </View>

      {error && <Text className="text-red-500 text-center mt-4">{error}</Text>}
      <View className="mt-6">
        <Pressable
          onPress={handleSubmit(onSubmit)}
          disabled={isSubmitting}
          className={`rounded-lg py-3 mt-4 flex-row justify-center items-center ${
            isSubmitting ? "bg-primaryMuted" : "bg-primary2"
          }`}
        >
          {isSubmitting ? (
            <>
              <ActivityIndicator size="small" color="black" className="mr-2" />
              <Text className="text-black font-semibold">Signing in...</Text>
            </>
          ) : (
            <Text className="text-black font-semibold">Sign In</Text>
          )}
        </Pressable>
      </View>
    </View>
  );
};

export default Signin;
