import * as fieldApi from "@/lib/appwrite";
import useAppwrite from "@/lib/useAppwrite";
import { Models } from "react-native-appwrite";

export type Field = Models.Document & {
  name: string;
  active: boolean;
  icon: string;
};

export const useFields = () => useAppwrite<Field>(fieldApi.listFields);

export const createField = async (name: string, icon: string) => {
  return fieldApi.createField({ name, icon, active: true });
};
