import { View, Text } from "react-native";
import React from "react";
import { Field } from "@/services/fieldService";

interface FieldCardProps {
  field: Field;
}

const FieldCard = ({ field }: FieldCardProps) => {
  return (
    <View>
      <Text>FieldCard</Text>
    </View>
  );
};

export default FieldCard;
