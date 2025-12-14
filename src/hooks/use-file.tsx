"use client";

import { useAppContext } from "@/context/useAppContext";
import type { UploadLog, CollectionName } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

export const usePreviousImages = (collection: CollectionName) => {
  const { api, userInfo } = useAppContext();

  return useQuery<UploadLog[]>({
    queryKey: ["previousImages", userInfo?.uid, collection],
    queryFn: async () => {
      const res = await api.get<{ images: UploadLog[] }>(
        `/files/image/logs?collection=${collection}`
      );
      if (!res.data) throw new Error("Failed to fetch previous images");
      return res.data.images;
    },
  });
};

export interface UploadImageProps {
  file: File; // the image
  collection: CollectionName;
}

export function useUploadImage() {
  const { api, userInfo } = useAppContext();
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["uploadImage", userInfo?.uid],

    mutationFn: async ({ file, collection }: UploadImageProps) => {
      // Build the multipart form
      const formData = new FormData();
      formData.append("image", file);
      formData.append("collection", collection);

      const res = await api.post(`/files/image`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (!res.data) {
        throw new Error("Invalid server response");
      }

      return res.data;
    },
    onSuccess: (file) => {
      queryClient.invalidateQueries({
        queryKey: ["previousImages", userInfo?.uid, file.collection],
      });
    },

    onError: (error) => {
      let message = "Failed to upload image";

      if (error instanceof AxiosError) {
        message = error.response?.data?.error || error.message;
      } else if (error instanceof Error) {
        message = error.message;
      }

      toast.error(message);
    },
  });
}
