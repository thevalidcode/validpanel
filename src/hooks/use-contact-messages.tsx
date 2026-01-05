import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAppContext } from "@/context/useAppContext";
import { normalizeApiError } from "@/utils/normalizeApiErrors";
import { toast } from "sonner";
import type { ContactMessage, UpdateContactStatusPayload } from "@/types";

export function useContactMessages() {
  const { api, adminInfo } = useAppContext();

  return useQuery({
    queryKey: ["contactMessages"],
    queryFn: async () => {
      const res = await api.get<ContactMessage[]>("/contact/admin");
      if (!res.data) throw new Error("Failed to fetch contact messages");
      return res.data;
    },
    enabled: !!adminInfo,
  });
}

export function useContactMessage(uid: string) {
  const { api, adminInfo } = useAppContext();

  return useQuery({
    queryKey: ["contactMessage", uid],
    queryFn: async () => {
      const res = await api.get<ContactMessage>(`/contact/admin/${uid}`);
      if (!res.data) throw new Error("Failed to fetch contact message");
      return res.data;
    },
    enabled: !!adminInfo && !!uid,
  });
}

export function useUpdateContactStatus() {
  const { api } = useAppContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      uid,
      data,
    }: {
      uid: string;
      data: UpdateContactStatusPayload;
    }) => {
      const res = await api.patch(`/contact/admin/${uid}`, data);
      if (!res.data) throw new Error("Failed to update contact message status");
      return res.data;
    },
    onSuccess: (_, { uid }) => {
      toast.success("Status updated successfully");
      queryClient.invalidateQueries({ queryKey: ["contactMessages"] });
      queryClient.invalidateQueries({ queryKey: ["contactMessage", uid] });
    },
    onError: (error: unknown) => {
      const errorMsg = normalizeApiError(
        error,
        "Failed to update status. Please try again."
      );
      toast.error(errorMsg);
    },
  });
}

export function useDeleteContactMessage() {
  const { api } = useAppContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (uid: string) => {
      const res = await api.delete(`/contact/admin/${uid}`);
      if (!res.data) throw new Error("Failed to delete contact message");
      return res.data;
    },
    onSuccess: () => {
      toast.success("Message deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["contactMessages"] });
    },
    onError: (error: unknown) => {
      const errorMsg = normalizeApiError(
        error,
        "Failed to delete message. Please try again."
      );
      toast.error(errorMsg);
    },
  });
}
