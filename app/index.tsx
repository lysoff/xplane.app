import { View, Text, SafeAreaView } from "react-native";
import React from "react";
import { StatusBar } from "expo-status-bar";

const Home = () => {
  return (
    <>
      <SafeAreaView className="h-full bg-primary">
        <View className="h-full items-center justify-center bg-primary">
          <Text className="text-xl font-pregular text-secondary">Home</Text>
        </View>
      </SafeAreaView>
      <StatusBar style="light" />
    </>
  );
};

export default Home;
