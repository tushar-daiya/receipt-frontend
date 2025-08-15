import { authClient } from "@/lib/auth-client";
import { useSigninStore } from "@/lib/sign-in-store";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, router } from "expo-router";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  Keyboard,
  Pressable,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { z } from "zod";
const signupSchema = z.object({
  fullName: z.string("Full name is required").min(1, "Full name is required"),
  username: z.string("Username is required").min(1, "Username is required"),
  email: z.email("Invalid email address"),
  password: z
    .string("Password is required")
    .min(6, "Password must be at least 6 characters long")
    .max(100),
});
const signup = () => {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(signupSchema),
  });
  const { setEmail } = useSigninStore();
  const [error, setError] = React.useState<string | null>(null);
  async function onSubmit(values: z.infer<typeof signupSchema>) {
    const { data, error } = await authClient.signUp.email({
      name: values.fullName,
      email: values.email,
      password: values.password,
      username: values.username,
    });
    if (error) {
      console.error("Signup error:", error);
      setError(error.message || "An error occurred during signup");
      return;
    }
    setEmail(values.email);
    setError(null);
    router.push("/otpVerification");
  }
  return (
    //disable keyboard dismiss on press outside
    //
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View className="flex-1 justify-center px-10 bg-background">
        <Text className="text-2xl text-white font-bold mb-6 text-center">
          Signup
        </Text>
        <View>
          <Text className="text-white">Full Name</Text>
          <Controller
            control={control}
            name="fullName"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                autoCapitalize="words"
                editable={!isSubmitting}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                placeholderTextColor="#94C7AB"
                placeholder="Enter your name"
                className="bg-secondary rounded-lg px-4 py-2 h-12 mt-2 text-white"
              />
            )}
          />
          {errors.fullName && (
            <Text className="text-red-500">{errors.fullName.message}</Text>
          )}
        </View>
        <View className="mt-4">
          <Text className="text-white">Username</Text>
          <Controller
            control={control}
            name="username"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                editable={!isSubmitting}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                placeholderTextColor="#94C7AB"
                placeholder="Enter your username"
                className="bg-secondary rounded-lg px-4 py-2 h-12 mt-2 text-white"
              />
            )}
          />
          {errors.username && (
            <Text className="text-red-500">{errors.username.message}</Text>
          )}
        </View>
        <View className="mt-4">
          <Text className="text-white">Email</Text>
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                autoCapitalize="none"
                editable={!isSubmitting}
                onBlur={onBlur}
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
                editable={!isSubmitting}
                secureTextEntry
                onBlur={onBlur}
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
        {error && (
          <Text className="text-red-500 text-center mt-4">{error}</Text>
        )}
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
                <ActivityIndicator
                  size="small"
                  color="black"
                  className="mr-2"
                />
                <Text className="text-black font-semibold">Signing up...</Text>
              </>
            ) : (
              <Text className="text-black font-semibold">Signup</Text>
            )}
          </Pressable>
        </View>
        <View className="mt-4">
          <Text className="text-white text-center">
            Already have an account?{" "}
            <Link
              className="text-primary font-semibold"
              href={"/login"}
              replace
            >
              Login
            </Link>
          </Text>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default signup;
