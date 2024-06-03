import * as WebBrowser from "expo-web-browser";

import {
  Account,
  Client,
  Databases,
  ID,
  OAuthProvider,
} from "react-native-appwrite";
import { handleIncomingCookie } from "./handleIncomingCoolkie";

export const config = {
  endpoint: "https://cloud.appwrite.io/v1",
  projectId: "665b17750024b892b938",
  platform: "xplane.app",
  databaseId: "--",
  userCollectionId: "--",
};

export const client = new Client();

client
  .setEndpoint(config.endpoint)
  .setProject(config.projectId)
  .setPlatform(config.platform);

const account = new Account(client);
const databases = new Databases(client);

interface CreateAccountParams {
  email: string;
  password: string;
  username: string;
}

export const googleSignIn = async () => {
  try {
    const sessionURL = account.createOAuth2Session(OAuthProvider.Google);

    const callbackUrl = `appwrite-callback-${config.projectId}://`;

    if (sessionURL instanceof URL) {
      const browserResult = (await WebBrowser.openAuthSessionAsync(
        sessionURL.toString(),
        callbackUrl
      )) as any;

      const cookieResult = await handleIncomingCookie(
        browserResult.url,
        config.endpoint
      );

      if (!cookieResult) {
        return;
      }
    }

    return getCurrentUser();
  } catch (e) {
    console.log(e);
  }
};

export const logout = async () => {
  return account.deleteSession("current");
};

export const getAvatar = ({ username = "" }) => {
  return `https://cloud.appwrite.io/v1/avatars/initials?name=${username}&width=96&height=96&project=console`;
};

export const createAccount = async ({
  email,
  password,
  username,
}: CreateAccountParams) => {
  try {
    const newAccount = await account.create(
      ID.unique(),
      email,
      password,
      username
    );

    const session = await account.createEmailPasswordSession(email, password);
    client.setSession(session.$id);

    await createUser({
      email,
      username,
      avatar: getAvatar({ username }),
    });
  } catch (e) {
    console.log(e);
    throw e;
  }
};

interface CreateUserParams {
  email: string;
  avatar: string;
  username: string;
}

export const createUser = async ({
  username,
  email,
  avatar,
}: CreateUserParams) => {
  return databases.createDocument(
    config.databaseId,
    config.userCollectionId,
    ID.unique(),
    {
      username,
      email,
      avatar,
    }
  );
};

export const getCurrentUser = async () => {
  return account.get();
};

export const signIn = async (email: string, password: string) => {
  const session = await account.createEmailPasswordSession(email, password);

  return getCurrentUser();
};
