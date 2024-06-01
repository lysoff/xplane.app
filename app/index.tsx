import { View, Text, SafeAreaView } from "react-native";
import React from "react";
import { StatusBar } from "expo-status-bar";
import { Link } from "expo-router";

const Home = () => {
  return (
    <>
      <SafeAreaView className="h-full bg-primary">
        <View className="h-full items-center justify-center bg-primary">
          <Text className="text-xl font-pregular text-secondary">Home</Text>
          <Link className="text-gray-500" href="/signin">
            Test OAuth
          </Link>
        </View>
      </SafeAreaView>
      <StatusBar style="light" />
    </>
  );
};

export default Home;
