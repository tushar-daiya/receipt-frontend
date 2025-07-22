import React from 'react';
import { TouchableOpacity, Text, TouchableOpacityProps } from 'react-native';

interface FormButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  textClassName?: string;
}

export const FormButton: React.FC<FormButtonProps> = ({
  title,
  variant = 'primary',
  size = 'md',
  className = '',
  textClassName = '',
  disabled,
  ...props
}) => {
  const getVariantStyles = () => {
    if (disabled) return 'bg-gray-600';
    
    switch (variant) {
      case 'primary':
        return 'bg-blue-500 active:bg-blue-600';
      case 'secondary':
        return 'bg-gray-700 active:bg-gray-600';
      case 'outline':
        return 'bg-transparent border-2 border-blue-500 active:bg-blue-500/20';
      default:
        return 'bg-blue-500 active:bg-blue-600';
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return 'py-2 px-4';
      case 'md':
        return 'py-3 px-6';
      case 'lg':
        return 'py-4 px-8';
      default:
        return 'py-3 px-6';
    }
  };

  const getTextStyles = () => {
    const baseStyles = 'font-semibold text-center';
    const colorStyles = disabled ? 'text-gray-400' : 'text-white';
    const sizeStyles = size === 'sm' ? 'text-sm' : size === 'lg' ? 'text-lg' : 'text-base';
    
    return `${baseStyles} ${colorStyles} ${sizeStyles}`;
  };

  return (
    <TouchableOpacity
      className={`rounded-lg ${getVariantStyles()} ${getSizeStyles()} ${className}`}
      disabled={disabled}
      {...props}
    >
      <Text className={`${getTextStyles()} ${textClassName}`}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};
