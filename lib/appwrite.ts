import {
  Account,
  Client,
  Databases,
  ID,
  OAuthProvider,
  Query,
} from "react-native-appwrite";

export const config = {
  endpoint: "https://cloud.appwrite.io/v1",
  projectId: "665b17750024b892b938",
  platform: "xplane.app",
  databaseId: "665d63df0010618ae94e",
  usersCollectionId: "665d63fd0025274ccc61",
  fieldsCollectionId: "665d91ee0034ca85b682",
  scoreCollectionId: "665d93e200152243b51e",
};

export const client = new Client();

client
  .setEndpoint(config.endpoint)
  .setProject(config.projectId)
  .setPlatform(config.platform);

const account = new Account(client);
const databases = new Databases(client);

export const googleAuthUrl = String(
  account.createOAuth2Session(OAuthProvider.Google)
);
export const callbackUrl = `appwrite-callback-${config.projectId}://`;
interface CreateAccountParams {
  email: string;
  password: string;
  username: string;
}

export const getUser = async (email: string) => {
  const users = await databases.listDocuments<any>(
    config.databaseId,
    config.usersCollectionId,
    [Query.equal("email", email)]
  );

  return users.total ? users.documents[0] : null;
};

export const logout = async () => {
  return account.deleteSession("current");
};

export const getAvatar = (username = "") => {
  return `${config.endpoint}/avatars/initials?name=${username}&width=96&height=96&project=console`;
};

export const createAccount = async ({
  email,
  password,
  username,
}: CreateAccountParams) => {
  try {
    await account.create(ID.unique(), email, password, username);
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
    config.usersCollectionId,
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

export const getSession = async () => {
  return account.getSession("current");
};

export const signIn = async (email: string, password: string) => {
  return account.createEmailPasswordSession(email, password);
};

interface CreateFieldParams {
  name: string;
  icon: string;
  active: boolean;
}

export const createField = async ({
  name,
  icon,
  active = true,
}: CreateFieldParams) => {
  try {
    const account = await getCurrentAccount();
    const user = await getUser(account.email);

    return await databases.createDocument(
      config.databaseId,
      config.fieldsCollectionId,
      ID.unique(),
      {
        name,
        active,
        icon,
        users: user.$id,
      }
    );
  } catch (e) {
    console.log(e);
  }
};

interface DeleteFieldParams {
  id: string;
}

export const deleteField = async ({ id }: DeleteFieldParams) => {
  try {
    return await databases.deleteDocument(
      config.databaseId,
      config.fieldsCollectionId,
      id
    );
  } catch (e) {
    console.log(e);
  }
};

export const listFields = async () => {
  const account = await getCurrentAccount();
  const user = await getUser(account.email);

  const res = await databases.listDocuments(
    config.databaseId,
    config.fieldsCollectionId,
    [Query.equal("users", user.$id)]
  );

  return res.documents;
};

export const updateField = async (id: string, updatedPart: any) => {
  try {
    return databases.updateDocument(
      config.databaseId,
      config.fieldsCollectionId,
      id,
      updatedPart
    );
  } catch (e) {
    console.log(e);
  }
};

export const getField = async (id: string) => {
  try {
    return databases.getDocument(
      config.databaseId,
      config.fieldsCollectionId,
      id
    );
  } catch (e) {
    console.log(e);
  }
};
