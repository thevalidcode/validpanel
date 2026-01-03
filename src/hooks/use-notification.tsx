"use client";
import { useAppContext } from "@/context/useAppContext";
import type { Notification } from "@/types";
import { normalizeApiError } from "@/utils/normalizeApiErrors";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
// Custom hook for notifications-related queries and mutations

export function useGetUserNotifications(page: number = 1, limit: number = 20) {
  const { api, userInfo } = useAppContext();
  return useQuery({
    queryKey: ["notifications", userInfo?.uid],
    queryFn: async () => {
      const res = await api.get<{ notifications: Notification[] }>(
        `/notifications/me?page=${page}&limit=${limit}`
      );
      if (!res.data) throw new Error("Failed to fetch notifications");
      return res.data.notifications;
    },
    enabled: !!userInfo,
    retry: 1,
  });
}

export function useGetUserUnreadNotificationCount() {
  const { api, userInfo } = useAppContext();
  return useQuery({
    queryKey: ["notifications-count", userInfo?.uid],
    queryFn: async () => {
      const res = await api.get<{ unreadCount: number }>(
        `/notifications/unread-count`
      );
      if (!res.data) throw new Error("Failed to fetch notifications");
      return res.data.unreadCount;
    },
    enabled: !!userInfo,
    retry: 1,
  });
}

export function useMarkNotificationAsRead() {
  const { api, userInfo } = useAppContext();
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["notifications-mark-as-read"],
    mutationFn: async (uid: string) => {
      const res = await api.patch<{ success: string }>(
        `/notifications/${uid}/mark-as-read`
      );
      if (!res.data) throw new Error("Failed to mark notification as read");
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["notifications", userInfo?.uid],
      });
      queryClient.invalidateQueries({
        queryKey: ["notifications-count", userInfo?.uid],
      });
    },
    onError: (error) => {
      const errorMsg = normalizeApiError(
        error,
        "Failed to mark notification as read"
      );
      toast.error(errorMsg);
    },
  });
}

export function useGetNotifications(page: number = 1, limit: number = 20) {
  const { api } = useAppContext();
  return useQuery({
    queryKey: ["notifications-all"],
    queryFn: async () => {
      const res = await api.get<{ notifications: Notification[] }>(
        `/notifications?page=${page}&limit=${limit}`
      );
      if (!res.data) throw new Error("Failed to fetch notifications");
      return res.data.notifications;
    },
  });
}
