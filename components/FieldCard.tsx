import { View, Text } from "react-native";
import React from "react";
import { Field } from "@/services/fieldService";
import { MaterialCommunityIcons } from "@expo/vector-icons";

interface FieldCardProps {
  field: Field;
}

const FieldCard = ({ field }: FieldCardProps) => {
  return (
    <View className="gap-2 w-full flex-row items-center border-b-0 p-2 border-secondary">
      <MaterialCommunityIcons
        name={field.icon as any}
        size={30}
        color="#FF9C01"
      />
      <Text className="text-secondary text-xl">{field.name}</Text>
    </View>
  );
};

export default FieldCard;
