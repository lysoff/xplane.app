import { Text, TouchableOpacity } from "react-native";
import React from "react";

interface ButtonProps {
  children: string;
  containerStyles?: string;
  textStyles?: string;
  onPress?: () => void;
  disabled?: boolean;
}

const Button = ({
  children,
  containerStyles = "",
  textStyles = "",
  disabled = false,
  onPress,
}: ButtonProps) => {
  return (
    <TouchableOpacity
      disabled={disabled}
      onPress={onPress}
      className={`${
        disabled ? "bg-gray-400" : "bg-secondary"
      } p-3 rounded-xl min-w-[150px] items-center ${containerStyles}`}
    >
      <Text className={`text-xl text-primary ${textStyles}`}>{children}</Text>
    </TouchableOpacity>
  );
};

export default Button;
