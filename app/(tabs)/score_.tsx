import { SafeAreaView, Text } from "react-native";
import React from "react";
import { randomTimestamps } from "@/utils/randomTimestamps";
import * as scale from "d3-scale";
import { ConsoleColor } from "@/utils/utils";

const Score = () => {
  const timestamps = randomTimestamps();

  console.log({ timestamps });

  const x = scale
    .scaleTime()
    .range([0, 300])
    .domain([timestamps.start, timestamps.end]);

  console.log(x.ticks());

  for (const value of timestamps.array) {
    console.log(ConsoleColor.FgGreen, x(value));
  }

  console.log(x.invert(200));

  return (
    <SafeAreaView className="h-full bg-primary items-center">
      <Text className="text-white">Soon</Text>
    </SafeAreaView>
  );
};

export default Score;
