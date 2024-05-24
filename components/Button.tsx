import { Text, TouchableOpacity } from "react-native";
import React from "react";

interface ButtonProps {
  children: string;
  containerStyles?: string;
  textStyles?: string;
  onPress?: () => void;
}

const Button = ({
  children,
  containerStyles = "",
  textStyles = "",
  onPress,
}: ButtonProps) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={`bg-secondary p-3 rounded-xl min-w-[150px] items-center ${containerStyles}`}
    >
      <Text className={`text-xl text-primary ${textStyles}`}>{children}</Text>
    </TouchableOpacity>
  );
};

export default Button;
