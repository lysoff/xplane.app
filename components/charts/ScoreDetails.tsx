import { View, Text } from "react-native";
import React from "react";

interface ScoreDetailsProps {
  pageNumber: number;
}

const ScoreDetails = ({ pageNumber }: ScoreDetailsProps) => {
  return (
    <View>
      <Text className="text-white font-psemibold text-2xl">
        Day {pageNumber}
      </Text>
    </View>
  );
};

export default ScoreDetails;
