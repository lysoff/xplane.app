import { SafeAreaView, Text } from "react-native";
import React from "react";
import { randomTimestamps } from "@/utils/randomTimestamps";

const Score = () => {
  const timestamps = randomTimestamps();

  console.log({ timestamps });

  return (
    <SafeAreaView className="h-full bg-primary items-center">
      <Text className="text-white">Soon</Text>
    </SafeAreaView>
  );
};

export default Score;
