import { View, Text, SafeAreaView } from "react-native";
import React from "react";
import { StatusBar } from "expo-status-bar";
import { Link, Redirect } from "expo-router";
import { useGlobalContext } from "@/context/GlobalContext";

const Welcome = () => {
  const { isLoading, isLogged } = useGlobalContext();

  if (!isLoading && isLogged) return <Redirect href="/home" />;

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
        </View>
      </SafeAreaView>
      <StatusBar style="light" />
    </>
  );
};

export default Welcome;
