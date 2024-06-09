import * as api from "@/lib/appwrite";
import useAppwrite from "@/lib/useAppwrite";
import { Models } from "react-native-appwrite";

export type Field = Models.Document & {
  name: string;
  active: boolean;
  icon: string;
};

export const useFields = () => useAppwrite<Field>(api.listFields);

export const createField = async (name: string, icon: string) => {
  return api.createField({ name, icon, active: true });
};

export const deleteField = async (id: string) => {
  return api.deleteField({ id });
};

export const updateField = async (id: string, updated: Partial<Field>) => {
  return api.updateField(id, updated);
};
