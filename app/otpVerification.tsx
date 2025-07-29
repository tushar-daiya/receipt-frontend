import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import React, { useRef, useState } from "react";
import z from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { authStore } from "@/lib/auth-store";
import { authClient } from "@/lib/auth-client";
import { router } from "expo-router";
import { useSigninStore } from "@/lib/sign-in-store";

const otpSchema = z.object({
  otp: z
    .string()
    .length(6, "OTP must be 6 digits")
    .regex(/^\d+$/, "OTP must be numeric"),
});
const OtpVerification = () => {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(otpSchema),
  });
  const { email, setEmail } = useSigninStore();
  const [error, setError] = useState<string | null>(null);
  async function onSubmit(values: z.infer<typeof otpSchema>) {
    if (!email) {
      setError("No email found. Please try signing in again.");
      return;
    }
    setError(null);
    try {
      const { data, error } = await authClient.emailOtp.verifyEmail({
        email: email,
        otp: values.otp,
      });
      if (error) {
        console.error("OTP verification error:", error);
        setError(error.message || "An error occurred during OTP verification");
        return;
      }
      setEmail(null);
      // Redirect to home page after successful verification
      router.replace("/");
    } catch (error) {
      console.error("Unexpected error during OTP verification:", error);
      setError("An unexpected error occurred. Please try again later.");
    }
  }
  return (
    <View className="flex-1 justify-center bg-background px-10">
      <Text className="text-2xl text-white font-bold mb-2">
        OTP Verification
      </Text>
      <Text className="text-white mb-4">
        Please enter the OTP sent to your registered email.
      </Text>
      <Controller
        control={control}
        name="otp"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            keyboardType="number-pad"
            className="bg-secondary rounded-lg px-4 py-2 h-12 mt-2 text-white"
            placeholder="Enter OTP"
            placeholderTextColor={"#94C7AB"}
          />
        )}
      />
      {errors.otp && (
        <Text className="text-red-500 mt-2">{errors.otp.message}</Text>
      )}
      {error && <Text className="text-red-500 text-center mt-4">{error}</Text>}
      <View className="mt-6">
        <Pressable
          onPress={handleSubmit(onSubmit)}
          disabled={isSubmitting}
          className="rounded-lg py-3 bg-primary2 flex-row justify-center items-center"
        >
          <Text className="text-black">
            {isSubmitting ? "Verifying..." : "Verify OTP"}
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

export default OtpVerification;

const styles = StyleSheet.create({});
