import { Field } from "@/services/fieldService";
import { Score } from "@/services/scoreService";
import {
  Account,
  Client,
  Databases,
  ID,
  Models,
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

export type User = Models.Document & {
  name: string;
  email: string;
  avatar: string;
};

interface CreateAccountParams {
  email: string;
  password: string;
  username: string;
}

interface CreateUserParams {
  email: string;
  avatar: string;
  name: string;
}
interface CreateFieldParams {
  name: string;
  icon: string;
  active: boolean;
}

interface CreateScoreParams {
  success: boolean;
  comment: string;
  fields: string; //$id
}
interface DeleteFieldParams {
  id: string;
}
interface UpdateFieldParams {
  id: string;
  updatedPart: any;
}

export const callbackUrl = `appwrite-callback-${config.projectId}://`;

export const getAvatar = (username = "") => {
  return `${config.endpoint}/avatars/initials?name=${username}&width=96&height=96&project=console`;
};
class AppwriteClient {
  client: Client;
  account: Account;
  databases: Databases;

  user: User | null = null;

  constructor() {
    this.client = new Client();

    this.client
      .setEndpoint(config.endpoint)
      .setProject(config.projectId)
      .setPlatform(config.platform);

    this.account = new Account(this.client);
    this.databases = new Databases(this.client);
  }

  setUser(user: User) {
    this.user = user;
  }

  getGoogleAuthUrl() {
    return String(this.account.createOAuth2Session(OAuthProvider.Google));
  }

  async getCurrentAccount() {
    return this.account.get();
  }

  async getCurrentSession() {
    return this.account.getSession("current");
  }

  async getUser(email: string) {
    const users = await this.databases.listDocuments<User>(
      config.databaseId,
      config.usersCollectionId,
      [Query.equal("email", email)]
    );

    return users.total ? users.documents[0] : null;
  }

  async logout() {
    this.user = null;
    return this.account.deleteSession("current");
  }

  async createAccount({ email, password, username }: CreateAccountParams) {
    try {
      await this.account.create(ID.unique(), email, password, username);
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  async createUser({ name, email, avatar }: CreateUserParams) {
    return this.databases.createDocument<User>(
      config.databaseId,
      config.usersCollectionId,
      ID.unique(),
      {
        name,
        email,
        avatar,
      }
    );
  }

  async signIn(email: string, password: string) {
    // Adds cookie
    return this.account.createEmailPasswordSession(email, password);
  }

  async createField({ name, icon, active = true }: CreateFieldParams) {
    if (!this.user) {
      throw new Error("createField: No user provided");
    }

    try {
      return await this.databases.createDocument(
        config.databaseId,
        config.fieldsCollectionId,
        ID.unique(),
        {
          name,
          active,
          icon,
          users: this.user.$id,
        }
      );
    } catch (e) {
      console.log(e);
    }
  }

  async createScore({ success, comment, fields }: CreateScoreParams) {
    try {
      if (!this.user) {
        throw new Error("createScore: No user provided");
      }

      return await this.databases.createDocument(
        config.databaseId,
        config.scoreCollectionId,
        ID.unique(),
        {
          date: new Date().toISOString(),
          success,
          comment,
          fields,
          users: this.user.$id,
        }
      );
    } catch (e) {
      console.log(e);
    }
  }

  async listScores() {
    if (!this.user) {
      throw new Error("listScores: No user provided");
    }

    const res = await this.databases.listDocuments<Score>(
      config.databaseId,
      config.scoreCollectionId,
      [Query.limit(1000), Query.equal("users", this.user.$id)]
    );

    return res.documents;
  }

  async deleteField({ id }: DeleteFieldParams) {
    try {
      return await this.databases.deleteDocument(
        config.databaseId,
        config.fieldsCollectionId,
        id
      );
    } catch (e) {
      console.log(e);
    }
  }

  async listFields(activeOnly: boolean) {
    if (!this.user) {
      throw new Error("listFields: No user provided");
    }
    const query = [Query.equal("users", this.user.$id)];
    if (activeOnly) query.push(Query.equal("active", true));

    const res = await this.databases.listDocuments<Field>(
      config.databaseId,
      config.fieldsCollectionId,
      query
    );

    return res.documents;
  }

  async updateField({ id, updatedPart }: UpdateFieldParams) {
    try {
      return this.databases.updateDocument(
        config.databaseId,
        config.fieldsCollectionId,
        id,
        updatedPart
      );
    } catch (e) {
      console.log(e);
    }
  }

  async getField(id: string) {
    try {
      return this.databases.getDocument<Field>(
        config.databaseId,
        config.fieldsCollectionId,
        id
      );
    } catch (e) {
      console.log(e);
    }
  }
}
const client = new AppwriteClient();
export default client;
