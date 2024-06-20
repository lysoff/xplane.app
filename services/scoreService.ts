import * as api from "@/lib/appwrite";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Models } from "react-native-appwrite";

export type Score = Models.Document & {
  date: Date;
  success: boolean;
  comment: string;
  fields: string; // $id
  users: string; // $id
};

export const useCreateScore = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: api.createScore,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["scores"] });
    },
  });
};

export const useListScore = () => {
  return useQuery({
    queryKey: ["scores"],
    queryFn: api.listScores,
  });
};
