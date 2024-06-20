import React from "react";
import { router } from "expo-router";
import { useCreateField } from "@/services/fieldService";
import FieldForm, { FieldFormParams } from "@/components/FieldForm";
import { SafeAreaView } from "react-native-safe-area-context";

const Create = () => {
  const { mutateAsync: createField } = useCreateField();

  const handleSave = async ({ name, icon }: FieldFormParams) => {
    await createField({ name, icon, active: true });

    router.back();
  };

  return (
    <SafeAreaView className="h-full w-full bg-primary items-center justify-center">
      <FieldForm
        title="Create a field"
        buttonText="Create"
        onSave={handleSave}
      />
    </SafeAreaView>
  );
};

export default Create;
