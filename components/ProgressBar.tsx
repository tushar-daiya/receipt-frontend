import React from "react";
import { View, Text } from "react-native";
import { useReceiptStore } from "@/lib/verify-store";

interface ProgressBarProps {
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ className = "" }) => {
  const { currentStep, getTotalSteps, getProgress } = useReceiptStore();
  const totalSteps = getTotalSteps();
  const progress = getProgress();

  return (
    <View className={`w-full px-6 pb-8 ${className}`}>
      {/* Progress Info */}
      <View className="flex-row justify-between items-center mb-2">
        <Text className="text-white text-sm">
          {currentStep}/{totalSteps}
        </Text>
      </View>

      {/* Progress Bar */}
      <View className="w-full h-2 bg-border rounded-full overflow-hidden">
        <View
          className="h-full bg-primary rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </View>
    </View>
  );
};
