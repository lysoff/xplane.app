import { MaterialCommunityIcons } from "@expo/vector-icons";
import { View, Text, Image } from "react-native";

interface EmptyStateProps {
  title: string;
  subtitle: string;
}

const EmptyState = ({ title, subtitle }: EmptyStateProps) => {
  return (
    <View className="flex justify-center items-center px-4">
      <MaterialCommunityIcons name="note-alert" />

      <Text className="text-sm font-pmedium text-gray-100">{title}</Text>
      <Text className="text-xl text-center font-psemibold text-white mt-2">
        {subtitle}
      </Text>
    </View>
  );
};

export default EmptyState;
