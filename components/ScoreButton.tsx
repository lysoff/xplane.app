import { View, Text } from "react-native";
import React, { useCallback } from "react";
import { Field } from "@/services/fieldService";
import { TouchableOpacity } from "react-native-gesture-handler";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { colors } from "@/constants/colors";

interface ScoreButtonProps {
  field: Field;
  onPress: (field: Field) => Promise<void>;
}

const ScoreButton = ({ field, onPress }: ScoreButtonProps) => {
  const handlePress = useCallback(() => onPress(field), [field]);

  return (
    <TouchableOpacity
      onPress={handlePress}
      className="m-3 border-2 flex-col justify-center items-center border-secondary-200 w-[100px] h-[100px] rounded-full"
    >
      <MaterialCommunityIcons
        name={field.icon as any}
        size={30}
        color={colors.secondary[200]}
      />
      <Text className="text-secondary">{field.name}</Text>
    </TouchableOpacity>
  );
};

export default ScoreButton;
