import { Text } from "react-native";
import React, { useCallback, useState } from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
import { colors } from "@/constants/colors";
import { FieldType, Icons } from "./charts/ScorePoint";

interface ScoreButtonFilterProps {
  field: FieldType;
  onPress: (field: FieldType) => Promise<void>;
}

const ScoreButtonFilter = ({ field, onPress }: ScoreButtonFilterProps) => {
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

  const Icon = Icons[field];

  return (
    <TouchableOpacity
      disabled={disabled}
      onPress={handlePress}
      className="m-3 border-2 flex-col justify-center items-center border-secondary-200 border-opacity-60 w-[50px] h-[50px] rounded-full"
    >
      <Icon
        strokeOpacity={0.6}
        strokeWidth={2}
        stroke={colors.secondary[200]}
      />
    </TouchableOpacity>
  );
};

export default ScoreButtonFilter;
