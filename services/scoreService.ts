import appwriteClient from "@/lib/appwrite";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Models } from "react-native-appwrite";
import { Field } from "./fieldService";

export type Score = Models.Document & {
  date: Date;
  success: boolean;
  comment: string;
  fields: string | Field; // $id
  users: string; // $id
};

export const useCreateScore = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: appwriteClient.createScore.bind(appwriteClient),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["scores"] });
    },
  });
};

export const useListScore = () => {
  return useQuery({
    queryKey: ["scores"],
    queryFn: appwriteClient.listScores.bind(appwriteClient),
  });
};
