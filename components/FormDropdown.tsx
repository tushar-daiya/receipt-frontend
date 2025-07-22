import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

interface DropdownOption {
  label: string;
  value: string;
}

interface FormDropdownProps {
  label: string;
  value: string;
  onValueChange: (value: string) => void;
  options: DropdownOption[];
  placeholder?: string;
  error?: string;
  containerClassName?: string;
}

export const FormDropdown: React.FC<FormDropdownProps> = ({
  label,
  value,
  onValueChange,
  options,
  placeholder = 'Select an option',
  error,
  containerClassName = '',
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  
  const selectedOption = options.find(option => option.value === value);

  return (
    <View className={`mb-4 ${containerClassName}`}>
      <Text className="text-white mb-2 font-medium">
        {label}
      </Text>
      
      <View className="relative">
        <TouchableOpacity
          className={`bg-gray-800 px-4 py-3 rounded-lg border ${
            error ? 'border-red-500' : 'border-gray-600'
          } flex-row justify-between items-center`}
          onPress={() => setIsOpen(!isOpen)}
        >
          <Text className={`${
            selectedOption ? 'text-white' : 'text-gray-400'
          }`}>
            {selectedOption ? selectedOption.label : placeholder}
          </Text>
          <Text className="text-gray-400 text-lg">
            {isOpen ? '▲' : '▼'}
          </Text>
        </TouchableOpacity>
        
        {isOpen && (
          <View className="absolute top-full left-0 right-0 bg-gray-800 border border-gray-600 rounded-lg mt-1 z-10 max-h-48">
            {options.map((option) => (
              <TouchableOpacity
                key={option.value}
                className="px-4 py-3 border-b border-gray-700 last:border-b-0"
                onPress={() => {
                  onValueChange(option.value);
                  setIsOpen(false);
                }}
              >
                <Text className={`${
                  option.value === value ? 'text-blue-400' : 'text-white'
                }`}>
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
      
      {error && (
        <Text className="text-red-500 text-sm mt-1">{error}</Text>
      )}
    </View>
  );
};
