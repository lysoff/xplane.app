import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  Alert,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import Button from "@/components/Button";
import { createField } from "@/services/fieldService";
import { router } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { colors } from "@/constants/colors";

interface CreateFieldForm {
  name: string;
  icon: string;
}

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

const Create = () => {
  const [form, setForm] = useState<CreateFieldForm>({
    name: "",
    icon: "",
  });

  const handleSubmit = async () => {
    if (!form.name || !form.icon) {
      Alert.alert("Fill out the form");
    }

    await createField(form.name, form.icon);

    router.replace("/fields");
  };

  const handleIconPick = (icon: string) => {
    setForm({ ...form, icon });
  };

  return (
    <SafeAreaView className="h-full w-full bg-primary items-center justify-center">
      <View className="h-full w-full p-10">
        <Text className="text-xl font-pregular text-secondary">
          Create a field
        </Text>

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
            Create
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Create;
