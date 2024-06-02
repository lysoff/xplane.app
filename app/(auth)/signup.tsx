import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  KeyboardAvoidingView,
  ScrollView,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import Button from "../../components/Button";
import { Link, router } from "expo-router";
import { Icon } from "@/constants/icons";
import { createAccount, getCurrentUser } from "@/lib/appwrite";

const SignUp = () => {
  useEffect(() => {
    getCurrentUser();
  }, []);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = async () => {
    if (!form.email || !form.password || !form.username) {
      Alert.alert("Fill out all fields");
      return;
    }

    try {
      await createAccount({
        email: form.email,
        password: form.password,
        username: form.username,
      });
    } catch (e) {
      Alert.alert((e as any).message);
    }
  };

  return (
    <>
      <SafeAreaView className="h-full bg-primary  items-center justify-center">
        <ScrollView
          contentContainerStyle={{
            height: "100%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <KeyboardAvoidingView behavior="padding">
            <View className="h-full items-center justify-center bg-primary w-[300px]">
              <Text className="text-xl font-pregular text-secondary">
                Welcome to XPlane
              </Text>

              <View className="flex-col gap-y-2 my-2 w-full">
                <Text className="text-gray-500 text-xl">Username</Text>
                <TextInput
                  value={form.username}
                  onChangeText={(e) => setForm({ ...form, username: e })}
                  className="text-white text-xl rounded-xl border-2 p-5 border-solid border-gray-700 w-full"
                />
              </View>

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

              <View className="flex-col gap-y-2 my-2 w-full">
                <Text className="text-gray-500 text-xl">Confirm Password:</Text>
                <View className="flex-row pr-2 items-center rounded-xl border-2 border-solid border-gray-700 w-full">
                  <TextInput
                    value={form.confirmPassword}
                    onChangeText={(e) =>
                      setForm({ ...form, confirmPassword: e })
                    }
                    secureTextEntry={!showConfirmPassword}
                    className="flex-1 p-5 mr-2 text-white text-xl "
                  />
                  <Icon
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                    name={!showConfirmPassword ? "eye" : "eye-off"}
                    size={24}
                    color="#666"
                  />
                </View>
              </View>

              <View className="flex-row w-full py-5">
                <Button containerStyles="mr-5" onPress={handleSubmit}>
                  Sign Up
                </Button>
                <Link className="text-secondary flex-shrink" href="/signin">
                  Already have an account? Sign in
                </Link>
              </View>
            </View>
          </KeyboardAvoidingView>
        </ScrollView>
      </SafeAreaView>
      <StatusBar style="light" />
    </>
  );
};

export default SignUp;
