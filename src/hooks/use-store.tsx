"use client";
import { useAppContext } from "@/context/useAppContext";
import type { Store, StoreStatus, StoreType } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";
// Custom hook for store-related queries and mutations
// Naming follows the convention: useStores for fetching, useCreateUser/useUpdateUser for mutations

interface NewStore {
  description?: string;
  name: string;
  type: StoreType;
  domain: string;
  subscriptionId: number;
  logoUrl?: string;
  color?: string;
}

export function useCreateStore() {
  const { api, userInfo } = useAppContext();
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["createStore"],
    mutationFn: async (newStore: NewStore) => {
      const res = await api.post(`/stores`, newStore);
      if (!res.data.store) {
        // Log the response for debugging
        console.error("Store creation failed. Response:", res.data);
        throw new Error(
          "Failed to create store: No store object returned from server."
        );
      }
      return res.data;
    },

    onSuccess: () => {
      toast.success("Store created successfully");
      queryClient.invalidateQueries({ queryKey: ["stores", userInfo?.uid] });
    },
    onError: (error: unknown) => {
      // Enhanced error extraction to handle various backend formats
      let errorMsg = "An unexpected error occurred";
      if (error instanceof AxiosError) {
        // Try to extract error from common backend formats
        const data = error.response?.data;
        if (typeof data === "string") {
          errorMsg = data;
        } else if (data?.error) {
          errorMsg = data.error;
        } else if (data?.message) {
          errorMsg = data.message;
        } else {
          errorMsg = "Failed to create store";
        }
      } else if (error instanceof Error) {
        errorMsg = error.message;
      }
      toast.error(errorMsg);
    },
  });
}

// get stores
export function useGetUserStores() {
  const { api, userInfo } = useAppContext();
  return useQuery({
    queryKey: ["stores", userInfo?.uid],
    queryFn: async () => {
      const res = await api.get<Store[]>(`/stores/me`);
      if (!res.data) throw new Error("Failed to fetch stores");
      return res.data;
    },
  });
}

// ! get store by uid for authenticated users
export function useGetUserStoreByUid(uid: string) {
  const { api, userInfo } = useAppContext();
  return useQuery({
    queryKey: ["stores", userInfo?.uid, uid],
    queryFn: async () => {
      const res = await api.get<{ store: Store }>(`/stores/${uid}`);
      if (!res.data) throw new Error("Failed to fetch store");
      return res.data.store;
    },
  });
}

//! delete user store
export const useDeleteUserStore = () => {
  const { api } = useAppContext();
  return useMutation({
    mutationFn: async (uid: string) => {
      const res = await api.delete(`/stores/${uid}`, {
        data: { uid },
      });
      if (!res.data) throw new Error("Failed to delete store");
      return res.data;
    },
    onSuccess: () => {
      toast.success("Store deleted successfully");
    },
    onError: (error: unknown) => {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.error || "Failed to delete store");
      } else {
        toast.error("Failed to delete store");
      }
    },
  });
};

// update store info
interface UpdateStoreProps {
  description?: string;
  name?: string;
  domain: string;
  status: StoreStatus;
  subscriptionId: number;
  logoUrl?: string;
  color?: string;
}

export function useUpdateStore(uid: string) {
  const { api } = useAppContext();

  return useMutation({
    mutationFn: async (data: UpdateStoreProps) => {
      const res = await api.put(`/stores/${uid}`, data);
      if (!res.data) throw new Error("Failed to update store");
      return res.data;
    },
    onSuccess: () => {
      toast.success("Store updated successfully");
    },
    onError: (error: unknown) => {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.error || "Failed to update store");
      } else {
        toast.error("Failed to update store");
      }
    },
  });
}
