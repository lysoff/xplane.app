import AsyncStorage from "@react-native-async-storage/async-storage";

import appwriteClient, { callbackUrl, getAvatar } from "@/lib/appwrite";
import * as WebBrowser from "expo-web-browser";
import * as cookieService from "./cookieService";
import * as googleService from "./googleService";
import { useMutation } from "@tanstack/react-query";

interface SignUpParams {
  username: string;
  email: string;
  password: string;
}

export const getCurrentUser = async () => {
  try {
    const account = await appwriteClient.getCurrentAccount();
    let user = await appwriteClient.getUser(account.email);

    if (!user) {
      const session = await appwriteClient.getCurrentSession();
      if (session.provider === "email") {
        user = await appwriteClient.createUser({
          name: account.name,
          email: account.email,
          avatar: getAvatar(account.name),
        });
      } else if (session.provider === "google") {
        const userData = await googleService.getGoogleUser(account.email);
        user = await appwriteClient.createUser(userData);
      } else {
        throw new Error("Unknown provider");
      }
    }

    const { $id: id, name, email, avatar } = user;

    await AsyncStorage.setItem(
      "user",
      JSON.stringify({ id, name, email, avatar })
    );

    appwriteClient.setUser(user);

    return user;
  } catch (e) {
    throw e;
  }
};

export const googleSignIn = async () => {
  const browserResult = (await WebBrowser.openAuthSessionAsync(
    appwriteClient.getGoogleAuthUrl(),
    callbackUrl
  )) as { url: string };

  await cookieService.handleIncomingCookie(browserResult.url);

  return getCurrentUser();
};

export const signIn = async (email: string, password: string) => {
  await appwriteClient.signIn(email, password);

  return getCurrentUser();
};

export const signUp = async ({ username, email, password }: SignUpParams) => {
  await appwriteClient.createAccount({ username, email, password });
  return signIn(email, password);
};

export const useSignUp = () =>
  useMutation({
    mutationFn: signUp,
  });

export const logout = async () => {
  try {
    await appwriteClient.logout();
  } finally {
    await cookieService.deleteCookies();
    await AsyncStorage.removeItem("user");
  }
};
