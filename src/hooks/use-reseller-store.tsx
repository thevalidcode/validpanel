"use client";

import { useAppContext } from "@/context/useAppContext";
import type {
  ResellerStore,
  ResellerStoreListResponse,
  StoreType,
} from "@/types";
import { normalizeApiError } from "@/utils/normalizeApiErrors";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useGetResellerStoresAdmin(params?: {
  page?: number;
  limit?: number;
  search?: string;
  type?: StoreType;
  isActive?: boolean;
}) {
  const { api, adminInfo } = useAppContext();

  const page = params?.page ?? 1;
  const limit = params?.limit ?? 20;

  return useQuery({
    queryKey: [
      "admin-reseller-stores",
      page,
      limit,
      params?.search || "",
      params?.type || "",
      typeof params?.isActive === "boolean" ? String(params.isActive) : "",
    ],
    queryFn: async () => {
      const res = await api.get<ResellerStoreListResponse>(
        "/reseller-stores/admin",
        {
          params: {
            page,
            limit,
            ...(params?.search ? { search: params.search } : {}),
            ...(params?.type ? { type: params.type } : {}),
            ...(typeof params?.isActive === "boolean"
              ? { isActive: params.isActive }
              : {}),
          },
        },
      );
      return res.data;
    },
    enabled: !!adminInfo?.uid,
  });
}

interface CreateResellerStorePayload {
  name: string;
  url: string;
  image?: string | null;
  type: StoreType;
  isActive?: boolean;
}

export function useCreateResellerStoreAdmin() {
  const { api } = useAppContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["create-admin-reseller-store"],
    mutationFn: async (payload: CreateResellerStorePayload) => {
      const res = await api.post<{
        success: boolean;
        resellerStore: ResellerStore;
      }>("/reseller-stores/admin", payload);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Reseller store created successfully");
      queryClient.invalidateQueries({ queryKey: ["admin-reseller-stores"] });
    },
    onError: (error: unknown) => {
      toast.error(normalizeApiError(error, "Failed to create reseller store"));
    },
  });
}

interface UpdateResellerStorePayload {
  uid: string;
  name?: string;
  url?: string;
  image?: string | null;
  isActive?: boolean;
}

export function useUpdateResellerStoreAdmin() {
  const { api } = useAppContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["update-admin-reseller-store"],
    mutationFn: async ({ uid, ...payload }: UpdateResellerStorePayload) => {
      const res = await api.patch<{
        success: boolean;
        resellerStore: ResellerStore;
      }>(`/reseller-stores/admin/${uid}`, payload);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Reseller store updated successfully");
      queryClient.invalidateQueries({ queryKey: ["admin-reseller-stores"] });
    },
    onError: (error: unknown) => {
      toast.error(normalizeApiError(error, "Failed to update reseller store"));
    },
  });
}

export function useDeleteResellerStoreAdmin() {
  const { api } = useAppContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["delete-admin-reseller-store"],
    mutationFn: async (uid: string) => {
      const res = await api.delete<{ success: boolean }>(
        `/reseller-stores/admin/${uid}`,
      );
      return res.data;
    },
    onSuccess: () => {
      toast.success("Reseller store deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["admin-reseller-stores"] });
    },
    onError: (error: unknown) => {
      toast.error(normalizeApiError(error, "Failed to delete reseller store"));
    },
  });
}
