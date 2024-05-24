import { View, Text, SafeAreaView, TextInput } from "react-native";
import React from "react";
import { StatusBar } from "expo-status-bar";
import Button from "../../components/Button";
import { Link, router } from "expo-router";

const SignUp = () => {
  return (
    <>
      <SafeAreaView className="h-full bg-primary  items-center justify-center">
        <View className="h-full items-center justify-center bg-primary w-[300px]">
          <Text className="text-xl font-pregular text-secondary">
            Welcome to XPlane
          </Text>

          <View className="flex-col gap-y-2 my-2 w-full">
            <Text className="text-gray-500 text-xl">Email</Text>
            <TextInput className="text-white text-xl rounded-xl border-2 p-5 border-solid border-gray-700 w-full" />
          </View>

          <View className="flex-col gap-y-2 my-2 w-full">
            <Text className="text-gray-500 text-xl">Password</Text>
            <TextInput
              secureTextEntry={true}
              className="text-white text-xl rounded-xl border-2 p-5 border-solid border-gray-700 w-full"
            />
          </View>

          <View className="flex-col gap-y-2 my-2 w-full">
            <Text className="text-gray-500 text-xl">Confirm Password:</Text>
            <TextInput
              secureTextEntry={true}
              className="text-white text-xl rounded-xl border-2 p-5 border-solid border-gray-700 w-full"
            />
          </View>

          <View className="flex-row w-full py-5">
            <Button containerStyles="mr-5" onPress={() => router.back()}>
              Sign Up
            </Button>
            <Link className="text-secondary flex-shrink" href="/signin">
              Already have an account? Sign in
            </Link>
          </View>
        </View>
      </SafeAreaView>
      <StatusBar style="light" />
    </>
  );
};

export default SignUp;
