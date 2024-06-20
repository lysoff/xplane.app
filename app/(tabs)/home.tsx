import {
  View,
  SafeAreaView,
  Image,
  Text,
  TouchableOpacity,
} from "react-native";
import React, { useCallback, useMemo } from "react";
import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";
import { useGlobalContext } from "@/context/GlobalContext";
import * as authService from "@/services/authService";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { colors } from "@/constants/colors";
import { Field, useFields } from "@/services/fieldService";
import ScoreButton from "@/components/ScoreButton";
import { createScore } from "@/services/scoreService";

const Home = () => {
  const { userInfo, setUserInfo, setIsLogged } = useGlobalContext();

  const { data } = useFields();
  const fields = useMemo(() => {
    if (!data) return null;

    return data.filter((item) => item.active);
  }, [data]);

  const handlePress = useCallback(async (field: Field) => {
    try {
      await createScore({
        fields: field.$id,
        success: true,
        comment: "Score added",
      });
    } catch (e) {
      console.log(e);
    }
  }, []);

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
          <View className="p-10 w-full flex-row">
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
        <View className="flex-row flex-wrap gap-6 p-10">
          {fields &&
            fields.map((field) => (
              <ScoreButton
                key={field.name}
                field={field}
                onPress={handlePress}
              />
            ))}
        </View>
      </SafeAreaView>
      <StatusBar style="light" />
    </>
  );
};

export default Home;
