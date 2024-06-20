import { FieldType } from "@/components/charts/ScorePoint";
import * as api from "@/lib/appwrite";
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
    queryFn: () => api.getField(id),
  });

export const useFields = () =>
  useQuery({
    queryKey: ["fields"],
    queryFn: api.listFields,
  });

export const useCreateField = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: api.createField,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fields"] });
    },
  });
};

export const useDeleteField = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: api.deleteField,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fields"] });
    },
  });
};

export const useUpdateField = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: api.updateField,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fields"] });
    },
  });
};
