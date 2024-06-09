import React from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

const FieldsLayout = () => {
  return (
    <>
      <Stack>
        <Stack.Screen name="fields" options={{ headerShown: false }} />
        <Stack.Screen name="create" options={{ headerShown: false }} />
        <Stack.Screen name="edit/[id]" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="light" />
    </>
  );
};

export default FieldsLayout;
