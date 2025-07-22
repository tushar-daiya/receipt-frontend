import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import React, { useState } from "react";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod/dist/zod.js";
import { Controller, useForm } from "react-hook-form";
import DatePicker from "react-native-date-picker";
import { useRouter } from "expo-router";
import { useReceiptStore } from "@/lib/verify-store";

const formSchema = z.object({
  amount: z
    .string()
    .min(1, "Amount is required")
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "Amount must be a positive number",
    }),
  vendor: z.string("Vendor is required").min(1, "Vendor is required"),
  date: z.date().default(() => new Date()),
  category: z.string("Category is required").min(1, "Category is required"),
});

const Index = () => {
  const router = useRouter();
  const { formData, updateFormData, setCurrentStep } = useReceiptStore();
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: formData.amount,
      vendor: formData.vendor,
      // date: new Date(),
      category: formData.category,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log((0.05 * parseFloat(values.amount)).toLocaleString());
    updateFormData({
      amount: values.amount,
      vendor: values.vendor,
      date: values.date,
      category: values.category,
      transactionFee: (0.05 * parseFloat(values.amount)).toLocaleString(),
    });

    setCurrentStep(2);
    router.push("/verify/step2");
  }

  return (
    <View className="bg-background flex-1 px-6">
      <View>
        <Text className="text-white text-2xl font-bold">Receipt Details</Text>

        <View className="mt-4">
          <Controller
            control={control}
            name="vendor"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                onBlur={onBlur}
                autoCapitalize="none"
                editable={!isSubmitting}
                onChangeText={onChange}
                value={value}
                placeholderTextColor="#94C7AB"
                placeholder="Vendor"
                className="bg-secondary rounded-lg px-4 py-2 h-16 mt-2 text-white"
              />
            )}
          />
          {errors.vendor && (
            <Text className="text-red-500">{errors.vendor.message}</Text>
          )}
        </View>

        <View className="mt-8">
          <Controller
            control={control}
            name="category"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                onBlur={onBlur}
                autoCapitalize="none"
                editable={!isSubmitting}
                onChangeText={onChange}
                value={value}
                placeholderTextColor="#94C7AB"
                placeholder="Category"
                className="bg-secondary rounded-lg px-4 py-2 h-16 mt-2 text-white"
              />
            )}
          />
          {errors.category && (
            <Text className="text-red-500">{errors.category.message}</Text>
          )}
        </View>

        <View className="mt-8">
          <Controller
            control={control}
            name="amount"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                onBlur={onBlur}
                keyboardType="decimal-pad"
                autoCapitalize="none"
                editable={!isSubmitting}
                onChangeText={onChange}
                value={value?.toString() || ""}
                placeholderTextColor="#94C7AB"
                placeholder="Amount"
                className="bg-secondary rounded-lg px-4 py-2 h-16 mt-2 text-white"
              />
            )}
          />
          {errors.amount && (
            <Text className="text-red-500">{errors.amount.message}</Text>
          )}
        </View>

        {/* <View className="mt-8">
          <Text className="text-primaryMuted mb-2">Date</Text>
          <Controller
            control={control}
            name="date"
            render={({ field: { onChange, value } }) => (
              <>
                <Pressable
                  onPress={() => setOpen(true)}
                  className="bg-secondary rounded-lg px-4 py-2 h-16 justify-center"
                >
                  <Text className="text-white">
                    {value ? value.toLocaleDateString() : "Select Date"}
                  </Text>
                </Pressable>
                <DatePicker
                  modal
                  open={open}
                  date={value || new Date()}
                  onConfirm={(date) => {
                    console.log(date);
                    setOpen(false);
                    onChange(date);
                  }}
                  onCancel={() => {
                    setOpen(false);
                  }}
                />
              </>
            )}
          />
          {errors.date && (
            <Text className="text-red-500">{errors.date.message}</Text>
          )}
        </View> */}
      </View>

      <View className="mt-auto mb-6">
        <Pressable
          onPress={handleSubmit(onSubmit)}
          className="bg-primary rounded-full py-3 flex-row justify-center items-center"
        >
          <Text className="text-black font-semibold">Next</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default Index;
