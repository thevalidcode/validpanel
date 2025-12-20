"use client";
import { useAppContext } from "@/context/useAppContext";
import type { Store, StoreStatus, StoreType } from "@/types";
import { normalizeApiError } from "@/utils/normalizeApiErrors";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
// Custom hook for store-related queries and mutations

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
      const errorMsg = normalizeApiError(error, "Failed to create store");
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
      const res = await api.get<{ stores: Store[] }>(`/stores/me`);
      if (!res.data) throw new Error("Failed to fetch stores");
      return res.data.stores;
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
  const { api, userInfo } = useAppContext();
  const queryClient = useQueryClient();
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
      queryClient.invalidateQueries({ queryKey: ["stores", userInfo?.uid] });
    },
    onError: (error: unknown) => {
      const errorMsg = normalizeApiError(error, "Failed to delete store");
      toast.error(errorMsg);
    },
  });
};

// update store info
interface UpdateStoreProps {
  description?: string | null;
  name?: string;
  status?: StoreStatus;
  logoUrl?: string;
  color?: string;
}

export function useUpdateStore() {
  const { api, userInfo } = useAppContext();

  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      uid,
      data,
    }: {
      uid: string;
      data: UpdateStoreProps;
    }) => {
      const res = await api.put(`/stores/${uid}`, data);
      if (!res.data) throw new Error("Failed to update store");
      return res.data;
    },
    onSuccess: () => {
      toast.success("Store updated successfully");
      queryClient.invalidateQueries({ queryKey: ["stores", userInfo?.uid] });
    },
    onError: (error: unknown) => {
      const errorMsg = normalizeApiError(error, "Failed to update store");
      toast.error(errorMsg);
    },
  });
}
