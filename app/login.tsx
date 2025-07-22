import React from "react";
import { z } from "zod";
import {
  ActivityIndicator,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Link } from "expo-router";
import { authClient } from "@/lib/auth-client";
const loginSchema = z.object({
  email: z.email("Invalid email address"),
  password: z
    .string("Password is required")
    .min(6, "Password must be at least 6 characters")
    .max(100),
});
const login = () => {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const [error, setError] = React.useState<string | null>(null);

  async function onSubmit(values: z.infer<typeof loginSchema>) {
    const { data, error } = await authClient.signIn.email({
      email: values.email,
      password: values.password,
    });
    if (error) {
      console.error("Login error:", error);
      setError(error.message || "An error occurred during login");
      return;
    }
  }
  return (
    <View className="flex-1 justify-center px-10 bg-background">
      <Text className="text-2xl text-white font-bold mb-6 text-center">
        Login
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
      <View className="mt-4">
        <Text className="text-white">Password</Text>
        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              autoCapitalize="none"
              secureTextEntry
              onBlur={onBlur}
              editable={!isSubmitting}
              onChangeText={onChange}
              value={value}
              placeholderTextColor="#94C7AB"
              placeholder="Enter your password"
              className="bg-secondary rounded-lg px-4 py-2 h-12 mt-2 text-white"
            />
          )}
        />
        {errors.password && (
          <Text className="text-red-500">{errors.password.message}</Text>
        )}
      </View>
      {error && <Text className="text-red-500 text-center mt-4">{error}</Text>}
      <View className="mt-6">
        <Pressable
          onPress={handleSubmit(onSubmit)}
          disabled={isSubmitting}
          className={`rounded-lg py-3 mt-4 flex-row justify-center items-center ${
            isSubmitting ? "bg-primaryMuted" : "bg-primary"
          }`}
        >
          {isSubmitting ? (
            <>
              <ActivityIndicator size="small" color="black" className="mr-2" />
              <Text className="text-black font-semibold">Signing in...</Text>
            </>
          ) : (
            <Text className="text-black font-semibold">Login</Text>
          )}
        </Pressable>
      </View>
      <View className="mt-4">
        <Text className="text-white text-center">
          Don't have an account?{" "}
          <Link className="text-primary font-semibold" href={"/signup"} replace>
            Sign Up
          </Link>
        </Text>
      </View>
    </View>
  );
};

export default login;
