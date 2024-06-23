import { View, Text, SafeAreaView, NativeModules } from "react-native";
import React from "react";
import { StatusBar } from "expo-status-bar";
import { Link, Redirect } from "expo-router";
import { useGlobalContext } from "@/context/GlobalContext";
import Button from "@/components/Button";

console.log(NativeModules.LockScreenMenuModule);

const Welcome = () => {
  const { isLoading, isLogged } = useGlobalContext();

  if (!isLoading && isLogged) return <Redirect href="/home" />;

  const setButtons = () => {
    NativeModules.LockScreenMenuModule.setButtons("Wowweew!");
    // NativeModules.LockScreenMenuModule.increment((value: any) =>
    //   console.log({ value })
    // );
  };
  return (
    <>
      <SafeAreaView className="h-full bg-primary">
        <View className="h-full items-center justify-center bg-primary">
          <Text className="text-xl font-pregular text-secondary">
            Welcome to Xplane
          </Text>
          <Link className="text-gray-500" href="/signin">
            Login or Signup
          </Link>

          <Button onPress={setButtons}>Set Buttons</Button>
        </View>
      </SafeAreaView>
      <StatusBar style="light" />
    </>
  );
};

export default Welcome;
