import { View, Text, SafeAreaView, TextInput, Alert } from "react-native";
import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import Button from "../../components/Button";
import { Link, router } from "expo-router";
import { Icon } from "../../constants/icons";
import { googleSignIn, signIn } from "@/lib/appwrite";
import * as WebBrowser from "expo-web-browser";
import { useGlobalContext } from "@/context/GlobalContext";

WebBrowser.maybeCompleteAuthSession();

const SignIn = () => {
  const { setIsLogged, setUserInfo } = useGlobalContext();

  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const login = (user: any) => {
    setUserInfo(user);
    setIsLogged(true);

    router.replace("/home");
  };

  const handleSubmit = async () => {
    if (!form.email || !form.password) {
      Alert.alert("Fill out the form");
      return;
    }

    const user = await signIn(form.email, form.password);

    login(user);
  };

  const handleGoogle = async () => {
    const user = await googleSignIn();

    login(user);
  };

  return (
    <>
      <SafeAreaView className="h-full bg-primary  items-center justify-center">
        <View className="h-full items-center justify-center bg-primary w-[300px]">
          <Text className="text-xl font-pregular text-secondary">
            Welcome to XPlane
          </Text>

          <View className="flex-col gap-y-2 my-2 w-full">
            <Text className="text-gray-500 text-xl">Email</Text>
            <TextInput
              value={form.email}
              onChangeText={(e) => setForm({ ...form, email: e })}
              className="text-white text-xl rounded-xl border-2 p-5 border-solid border-gray-700 w-full"
            />
          </View>

          <View className="flex-col gap-y-2 my-2 w-full">
            <Text className="text-gray-500 text-xl">Password</Text>
            <View className="flex-row pr-2 items-center rounded-xl border-2 border-solid border-gray-700 w-full">
              <TextInput
                value={form.password}
                onChangeText={(e) => setForm({ ...form, password: e })}
                secureTextEntry={!showPassword}
                className="flex-1 p-5 mr-2 text-white text-xl "
              />
              <Icon
                onPress={() => setShowPassword(!showPassword)}
                name={!showPassword ? "eye" : "eye-off"}
                size={24}
                color="#666"
              />
            </View>
          </View>

          <View className="flex-row w-full py-5">
            <Button containerStyles="mr-5" onPress={handleSubmit}>
              Sign In
            </Button>
            <Link className="text-secondary flex-shrink" href="/signup">
              Don't have an account? Sign up
            </Link>
          </View>
          <View className="flex-row w-full py-5">
            <Button containerStyles="mr-5" onPress={handleGoogle}>
              Google
            </Button>
          </View>
        </View>
      </SafeAreaView>
      <StatusBar style="light" />
    </>
  );
};

export default SignIn;
