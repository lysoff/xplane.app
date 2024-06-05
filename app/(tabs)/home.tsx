import { View, SafeAreaView, Image, Text } from "react-native";
import React from "react";
import { StatusBar } from "expo-status-bar";
import Button from "../../components/Button";
import { router } from "expo-router";
import { useGlobalContext } from "@/context/GlobalContext";
import * as authService from "@/services/authService";

const Home = () => {
  const { userInfo, setUserInfo, setIsLogged } = useGlobalContext();

  const handleLogout = async () => {
    await authService.logout();

    setUserInfo(null);
    setIsLogged(false);

    router.push("/signin");
  };

  return (
    <>
      <SafeAreaView className="h-full bg-primary  items-center justify-center">
        <View className="h-full items-center justify-center bg-primary w-[300px]">
          {userInfo && (
            <View className="items-center justify-center">
              <Image
                source={{ uri: userInfo.avatar }}
                className="w-[100px] h-[100px] border"
                resizeMode="contain"
              />
              <Text className="text-secondary-100">{userInfo.name}</Text>
              <Text className="text-secondary-200 text-sm">
                {userInfo.email}
              </Text>
            </View>
          )}
          <View className="flex-row w-full py-5">
            <Button containerStyles="mr-5" onPress={handleLogout}>
              Logout
            </Button>
          </View>
        </View>
      </SafeAreaView>
      <StatusBar style="light" />
    </>
  );
};

export default Home;
