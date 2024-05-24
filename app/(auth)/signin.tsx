import { View, Text, SafeAreaView } from "react-native";
import React from "react";
import { StatusBar } from "expo-status-bar";
import Button from "../../components/Button";
import { router } from "expo-router";

const SignIn = () => {
  return (
    <>
      <SafeAreaView className="h-full bg-primary">
        <View className="h-full items-center justify-center bg-primary">
          <Text className="text-xl font-pregular text-secondary">SignIn</Text>
          <Button onPress={() => router.back()}>SignIn</Button>
        </View>
      </SafeAreaView>
      <StatusBar style="light" />
    </>
  );
};

export default SignIn;
