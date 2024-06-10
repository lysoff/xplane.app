import * as api from "@/lib/appwrite";
import { Models } from "react-native-appwrite";

export type Score = Models.Document & {
  date: Date;
  success: boolean;
  comment: string;
  fields: string; // $id
  users: string; // $id
};

export const createScore = async ({
  success,
  comment,
  fields,
}: Pick<Score, "success" | "comment" | "fields">) => {
  return api.createScore({ success, comment, fields });
};
