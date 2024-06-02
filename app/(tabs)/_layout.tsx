import React from "react";
import { useGlobalContext } from "@/context/GlobalContext";
import { Redirect, Stack } from "expo-router";

const _layout = () => {
  const { isLogged } = useGlobalContext();

  if (!isLogged) return <Redirect href="/signin" />;

  return (
    <Stack>
      <Stack.Screen name="home" options={{ headerShown: false }} />
    </Stack>
  );
};

export default _layout;
