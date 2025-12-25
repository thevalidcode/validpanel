"use client";
import { useAppContext } from "@/context/useAppContext";
import { normalizeApiError } from "@/utils/normalizeApiErrors";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useGetSettings() {
  const { api, adminInfo } = useAppContext();
  return useQuery({
    queryKey: ["settings"],
    queryFn: async () => {
      const res = await api.get<{ setting: Record<string, any> }>(
        `/setting/admin`
      );
      if (!res.data) throw new Error("Failed to fetch settings");
      return res.data.setting;
    },
    enabled: !!adminInfo,
  });
}

export function useUpdateSettings() {
  const { api } = useAppContext();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      const res = await api.put(`/setting`, data);
      if (!res.data) throw new Error("Failed to update settings");
      return res.data;
    },
    onSuccess: () => {
      toast.success("Settings updated successfully");
      queryClient.invalidateQueries({ queryKey: ["settings"] });
    },
    onError: (error: unknown) => {
      const errorMsg = normalizeApiError(error, "Failed to update settings");
      toast.error(errorMsg);
    },
  });
}
