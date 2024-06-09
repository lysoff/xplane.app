import React from "react";
import { router, useLocalSearchParams } from "expo-router";
import { updateField, useField } from "@/services/fieldService";
import FieldForm, { FieldFormParams } from "@/components/FieldForm";
import Loader from "@/components/Loader";
import { SafeAreaView } from "react-native-safe-area-context";

const Edit = () => {
  const { id } = useLocalSearchParams();

  const { data, loading } = useField(String(id));

  const handleSave = async ({ $id, name, icon }: FieldFormParams) => {
    await updateField(String($id), {
      name,
      icon,
    });

    router.back();
  };

  return (
    <SafeAreaView className="h-full w-full bg-primary items-center justify-center">
      {loading && <Loader isLoading={true} />}
      {data && (
        <FieldForm
          title="Edit the field"
          buttonText="Update"
          onSave={handleSave}
          field={data}
        />
      )}
    </SafeAreaView>
  );
};

export default Edit;
