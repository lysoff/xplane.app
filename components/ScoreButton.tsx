import { View, Text } from "react-native";
import React, { useCallback, useState } from "react";
import { Field } from "@/services/fieldService";
import { TouchableOpacity } from "react-native-gesture-handler";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { colors } from "@/constants/colors";

interface ScoreButtonProps {
  field: Field;
  onPress: (field: Field) => Promise<void>;
}

const ScoreButton = ({ field, onPress }: ScoreButtonProps) => {
  const [disabled, setDisabed] = useState(false);

  const handlePress = useCallback(async () => {
    try {
      setDisabed(true);
      await onPress(field);
    } catch (e) {
      console.log(e);
    } finally {
      setDisabed(false);
    }
  }, [field]);

  return (
    <TouchableOpacity
      disabled={disabled}
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
