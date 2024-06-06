import { View, Text, SafeAreaView, TextInput, Alert } from "react-native";
import React, { useState } from "react";
import Button from "@/components/Button";
import { createField } from "@/services/fieldService";
import { router } from "expo-router";

interface CreateFieldForm {
  name: string;
  icon: string;
}

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

    router.back();
  };

  return (
    <SafeAreaView className="h-full w-full bg-primary items-center justify-center">
      <View className="h-full w-full">
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
          <Text className="text-gray-500 text-xl">Icon</Text>
          <TextInput
            value={form.icon}
            onChangeText={(e) => setForm({ ...form, icon: e })}
            className="text-white text-xl rounded-xl border-2 p-5 border-solid border-gray-700 w-full"
          />
        </View>

        <View className="flex-row w-full py-5">
          <Button containerStyles="mr-5" onPress={handleSubmit}>
            Create
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Create;
