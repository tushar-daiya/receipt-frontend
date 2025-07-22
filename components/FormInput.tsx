import React from 'react';
import { View, Text, TextInput, TextInputProps } from 'react-native';

interface FormInputProps extends TextInputProps {
  label: string;
  error?: string;
  containerClassName?: string;
  labelClassName?: string;
  inputClassName?: string;
}

export const FormInput: React.FC<FormInputProps> = ({
  label,
  error,
  containerClassName = '',
  labelClassName = '',
  inputClassName = '',
  ...props
}) => {
  return (
    <View className={`mb-4 ${containerClassName}`}>
      <Text className={`text-white mb-2 font-medium ${labelClassName}`}>
        {label}
      </Text>
      <TextInput
        className={`bg-gray-800 text-white px-4 py-3 rounded-lg border ${
          error ? 'border-red-500' : 'border-gray-600'
        } focus:border-blue-500 ${inputClassName}`}
        placeholderTextColor="#9CA3AF"
        {...props}
      />
      {error && (
        <Text className="text-red-500 text-sm mt-1">{error}</Text>
      )}
    </View>
  );
};
