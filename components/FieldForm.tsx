import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  Alert,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import Button from "./Button";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { colors } from "@/constants/colors";

const ICONS = [
  "dog",
  "cat",
  "shield",
  "run",
  "flower",
  "sleep",
  "pen",
  "circle",
  "note",
];

export interface FieldFormParams {
  $id?: string;
  name: string;
  icon: string;
}

interface FieldFormProps {
  title: string;
  buttonText: string;
  onSave: (form: FieldFormParams) => Promise<void>;
  field?: FieldFormParams;
}

const FieldForm = ({ title, buttonText, onSave, field }: FieldFormProps) => {
  const [form, setForm] = useState<FieldFormParams>(
    field || {
      name: "",
      icon: "",
    }
  );

  const handleSubmit = async () => {
    if (!form.name || !form.icon) {
      Alert.alert("Fill out the form");
    }

    await onSave(form);
  };

  const handleIconPick = (icon: string) => {
    setForm({ ...form, icon });
  };

  return (
    <View className="h-full w-full p-10">
      <Text className="text-xl font-pregular text-secondary">{title}</Text>

      <View className="flex-col gap-y-2 my-2 w-full">
        <Text className="text-gray-500 text-xl">Name</Text>
        <TextInput
          value={form.name}
          onChangeText={(e) => setForm({ ...form, name: e })}
          className="text-white text-xl rounded-xl border-2 p-5 border-solid border-gray-700 w-full"
        />
      </View>

      <View className="flex-col gap-y-2 my-2 w-full">
        <Text className="text-gray-500 text-xl">Choose icon</Text>
        <View className="flex-row flex-wrap gap-4">
          {ICONS.map((icon: any) => (
            <TouchableOpacity
              key={icon}
              className="p-3"
              onPress={() => handleIconPick(icon)}
              style={{
                borderColor:
                  icon === form.icon
                    ? colors.secondary.DEFAULT
                    : colors.gray[100],
                borderWidth: 2,
                borderRadius: 50,
              }}
            >
              <MaterialCommunityIcons
                name={icon}
                size={26}
                color={
                  icon === form.icon
                    ? colors.secondary.DEFAULT
                    : colors.gray[100]
                }
              />
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View className="flex-row w-full py-5">
        <Button
          disabled={!form.name || !form.icon}
          containerStyles="mr-5"
          onPress={handleSubmit}
        >
          {buttonText}
        </Button>
      </View>
    </View>
  );
};

export default FieldForm;
