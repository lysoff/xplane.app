import * as appwrite from "@/lib/appwrite";
import * as WebBrowser from "expo-web-browser";
import * as cookieService from "./cookieService";
import * as googleService from "./googleService";

interface SignUpParams {
  username: string;
  email: string;
  password: string;
}

export const signUp = async ({ username, email, password }: SignUpParams) => {
  await appwrite.createAccount({ username, email, password });
  await appwrite.signIn(email, password);

  const user = {
    email,
    name: username,
    avatar: appwrite.getAvatar(username),
  };

  await appwrite.createUser(user);

  return user;
};

export const signIn = async (email: string, password: string) => {
  await appwrite.signIn(email, password);

  return appwrite.getUser(email);
};

export const googleSignIn = async () => {
  const browserResult = (await WebBrowser.openAuthSessionAsync(
    appwrite.googleAuthUrl,
    appwrite.callbackUrl
  )) as { url: string };

  await cookieService.handleIncomingCookie(
    browserResult.url,
    appwrite.config.endpoint
  );

  let user = await getCurrentUser();

  if (!user) {
    const session = await appwrite.getSession();
    const googleUser = await googleService.getGoogleUser(
      session.providerAccessToken
    );

    user = await appwrite.createUser({
      email: googleUser.email,
      name: googleUser.name,
      avatar: googleUser.picture,
    });
  }

  return user;
};

export const logout = async () => {
  await appwrite.logout();
  await cookieService.deleteCookies();
};

export const getCurrentUser = async () => {
  const account = await appwrite.getCurrentAccount();

  return appwrite.getUser(account.email);
};
