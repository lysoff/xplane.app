import { FieldType } from "@/constants/icons";
import appwriteClient from "@/lib/appwrite";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Models } from "react-native-appwrite";

export type Field = Models.Document & {
  name: string;
  active: boolean;
  icon: FieldType;
};

export const useField = (id: string) =>
  useQuery({
    queryKey: ["fields", id],
    queryFn: () => appwriteClient.getField(id),
  });

export const useFields = (activeOnly = false) =>
  useQuery({
    queryKey: ["fields", { activeOnly }],
    queryFn: () => appwriteClient.listFields(activeOnly),
  });

export const useCreateField = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: appwriteClient.createField.bind(appwriteClient),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fields"] });
    },
  });
};

export const useDeleteField = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: appwriteClient.deleteField.bind(appwriteClient),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fields"] });
    },
  });
};

export const useUpdateField = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: appwriteClient.updateField.bind(appwriteClient),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fields"] });
    },
  });
};
