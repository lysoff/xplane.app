import {
  View,
  SafeAreaView,
  Image,
  Text,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { StatusBar } from "expo-status-bar";
import Button from "../../components/Button";
import { router } from "expo-router";
import { useGlobalContext } from "@/context/GlobalContext";
import * as authService from "@/services/authService";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { colors } from "@/constants/colors";

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
      <SafeAreaView className="h-full bg-primary items-center">
        {userInfo && (
          <View className="p-4 w-full flex-row">
            <View className="flex-1">
              <Image
                source={{ uri: userInfo.avatar }}
                className="w-[60px] h-[60px]"
                resizeMode="contain"
                style={{ borderRadius: 50 }}
              />
              <Text className="text-gray-200 text-xl font-psemibold">
                {userInfo.name}
              </Text>
              <Text className="text-gray-200 text-sm">{userInfo.email}</Text>
            </View>
            <View>
              <TouchableOpacity onPress={handleLogout}>
                <MaterialCommunityIcons
                  name="exit-to-app"
                  color={colors.gray[100]}
                  size={30}
                />
              </TouchableOpacity>
            </View>
          </View>
        )}
      </SafeAreaView>
      <StatusBar style="light" />
    </>
  );
};

export default Home;
