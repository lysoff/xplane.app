import * as WebBrowser from "expo-web-browser";

import {
  Account,
  Client,
  Databases,
  ID,
  OAuthProvider,
  Query,
} from "react-native-appwrite";
import { handleIncomingCookie } from "./handleIncomingCoolkie";

export const config = {
  endpoint: "https://cloud.appwrite.io/v1",
  projectId: "665b17750024b892b938",
  platform: "xplane.app",
  databaseId: "665d63df0010618ae94e",
  userCollectionId: "665d63fd0025274ccc61",
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

    const currentAccount = await getCurrentAccount();

    let user = await getUser(currentAccount.email);

    if (!user) {
      const session = await account.getSession("current");

      const googleUser = await getGoogleUser(session.providerAccessToken);

      user = await createUser({
        email: googleUser.email,
        name: googleUser.name,
        avatar: googleUser.picture,
      });
    }

    return user;
  } catch (e) {
    console.log(e);
  }
};

export const getUser = async (email: string) => {
  const users = await databases.listDocuments<any>(
    config.databaseId,
    config.userCollectionId,
    [Query.equal("email", email)]
  );

  return users.total ? users.documents[0] : null;
};

export const getGoogleUser = async (token: string) => {
  const res = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.json();
};

export const logout = async () => {
  return account.deleteSession("current");
};

export const getAvatar = ({ username = "" }) => {
  return `https://cloud.appwrite.io/v1/avatars/initials?name=${username}&width=96&height=96&project=console`;
};

export const registerUser = async ({
  email,
  password,
  username,
}: CreateAccountParams) => {
  try {
    await account.create(ID.unique(), email, password, username);

    await account.createEmailPasswordSession(email, password);

    return createUser({
      email,
      name: username,
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
  name: string;
}

export const createUser = async ({ name, email, avatar }: CreateUserParams) => {
  return databases.createDocument(
    config.databaseId,
    config.userCollectionId,
    ID.unique(),
    {
      name,
      email,
      avatar,
    }
  );
};

export const getCurrentAccount = async () => {
  return account.get();
};

export const signIn = async (email: string, password: string) => {
  const session = await account.createEmailPasswordSession(email, password);

  return getCurrentAccount();
};
