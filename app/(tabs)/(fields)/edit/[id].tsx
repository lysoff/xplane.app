import React from "react";
import { router, useLocalSearchParams } from "expo-router";
import { useUpdateField, useField } from "@/services/fieldService";
import FieldForm, { FieldFormParams } from "@/components/FieldForm";
import Loader from "@/components/Loader";
import { SafeAreaView } from "react-native-safe-area-context";

const Edit = () => {
  const { id } = useLocalSearchParams();

  const { data: field, isLoading } = useField(String(id));
  const { mutateAsync: updateField } = useUpdateField();

  const handleSave = async ({ $id, name, icon }: FieldFormParams) => {
    await updateField({
      id: String($id),
      updatedPart: {
        name,
        icon,
      },
    });

    router.back();
  };

  return (
    <SafeAreaView className="h-full w-full bg-primary items-center justify-center">
      {isLoading && <Loader isLoading={true} />}
      {field && (
        <FieldForm
          title="Edit the field"
          buttonText="Update"
          onSave={handleSave}
          field={field}
        />
      )}
    </SafeAreaView>
  );
};

export default Edit;
