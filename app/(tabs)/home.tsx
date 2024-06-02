import { View, SafeAreaView } from "react-native";
import React from "react";
import { StatusBar } from "expo-status-bar";
import Button from "../../components/Button";
import { deleteCookies } from "@/lib/handleIncomingCoolkie";
import { router } from "expo-router";
import { logout } from "@/lib/appwrite";
import { useGlobalContext } from "@/context/GlobalContext";

const Home = () => {
  const { setUserInfo, setIsLogged } = useGlobalContext();

  const handleLogout = async () => {
    await logout();
    await deleteCookies();

    setUserInfo(null);
    setIsLogged(false);

    router.push("/signin");
  };

  return (
    <>
      <SafeAreaView className="h-full bg-primary  items-center justify-center">
        <View className="h-full items-center justify-center bg-primary w-[300px]">
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
