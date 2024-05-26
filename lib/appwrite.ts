import { Account, Client, Databases, ID } from "react-native-appwrite";

export const config = {
  endpoint: "https://cloud.appwrite.io/v1",
  projectId: "6651db3e003aa6805d01",
  platform: "xplane.app",
  databaseId: "6652fed20036526fb80f",
  userCollectionId: "6652fee6001c46b622b3",
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

const a = {
  $createdAt: "2024-05-26T09:45:48.502+00:00",
  $id: "665304cc6d79930f84c4",
  $updatedAt: "2024-05-26T09:45:48.502+00:00",
  clientCode: "",
  clientEngine: "",
  clientEngineVersion: "",
  clientName: "",
  clientType: "",
  clientVersion: "",
  countryCode: "uz",
  countryName: "Uzbekistan",
  current: true,
  deviceBrand: "Apple",
  deviceModel: "",
  deviceName: "",
  expire: "2025-05-26T09:45:48.448+00:00",
  factors: ["password"],
  ip: "82.215.127.157",
  mfaUpdatedAt: "",
  osCode: "IOS",
  osName: "iOS",
  osVersion: "",
  provider: "email",
  providerAccessToken: "",
  providerAccessTokenExpiry: "",
  providerRefreshToken: "",
  providerUid: "ivan.lysov@gmail.com",
  secret: "",
  userId: "665304c9001568634ec5",
};
