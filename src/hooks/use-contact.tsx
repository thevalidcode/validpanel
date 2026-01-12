import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAppContext } from "@/context/useAppContext";
import { normalizeApiError } from "@/utils/normalizeApiErrors";
import { toast } from "sonner";
import type {
  ContactMessage,
  ContactReply,
  UpdateContactStatusPayload,
  SendContactReplyPayload,
} from "@/types";

export interface CreateContactMessage {
  firstName: string;
  lastName: string;
  email: string;
  message: string;
}

// Public: Send contact message
export function useSendContactMessage() {
  const { api } = useAppContext();

  return useMutation({
    mutationKey: ["contactMessage"],
    mutationFn: async (data: CreateContactMessage) => {
      const res = await api.post("/contact", data);
      if (!res.data) throw new Error("Failed to send contact message");
      return res.data;
    },
    onSuccess: () => {
      toast.success(
        "Message sent successfully! We'll respond within 24 hours."
      );
    },
    onError: (error: unknown) => {
      const errorMsg = normalizeApiError(
        error,
        "Failed to send message. Please try again."
      );
      toast.error(errorMsg);
    },
  });
}

// Admin: Get all contact messages with reply count
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

// Admin: Get single contact message with all replies
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

// Admin: Update contact message status
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
    onSuccess: (_, { uid, data }) => {
      toast.success("Status updated successfully");
      queryClient.setQueryData<ContactMessage[]>(["contactMessages"], (old) =>
        old
          ? old.map((m) => (m.uid === uid ? { ...m, status: data.status } : m))
          : old
      );
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

// Admin: Delete contact message
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

// Admin: Send reply to contact message
export function useSendContactReply(uid: string) {
  const { api } = useAppContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: SendContactReplyPayload) => {
      const res = await api.post(`/contact/admin/${uid}/reply`, data);
      if (!res.data) throw new Error("Failed to send reply");
      return res.data;
    },
    onSuccess: () => {
      toast.success("Reply sent successfully");
      queryClient.invalidateQueries({ queryKey: ["contactMessage", uid] });
      queryClient.invalidateQueries({ queryKey: ["contactReplies", uid] });
      queryClient.invalidateQueries({ queryKey: ["contactMessages"] });
    },
    onError: (error: unknown) => {
      const errorMsg = normalizeApiError(
        error,
        "Failed to send reply. Please try again."
      );
      toast.error(errorMsg);
    },
  });
}

// Admin: Get all replies for a contact message
export function useContactReplies(uid: string) {
  const { api, adminInfo } = useAppContext();

  return useQuery({
    queryKey: ["contactReplies", uid],
    queryFn: async () => {
      const res = await api.get<ContactReply[]>(
        `/contact/admin/${uid}/replies`
      );
      if (!res.data) throw new Error("Failed to fetch replies");
      return res.data;
    },
    enabled: !!adminInfo && !!uid,
  });
}

// Admin: Delete a reply
export function useDeleteContactReply(messageUid: string) {
  const { api } = useAppContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (replyUid: string) => {
      const res = await api.delete(`/contact/admin/replies/${replyUid}`);
      if (!res.data) throw new Error("Failed to delete reply");
      return res.data;
    },
    onSuccess: () => {
      toast.success("Reply deleted successfully");
      queryClient.invalidateQueries({
        queryKey: ["contactMessage", messageUid],
      });
      queryClient.invalidateQueries({
        queryKey: ["contactReplies", messageUid],
      });
    },
    onError: (error: unknown) => {
      const errorMsg = normalizeApiError(
        error,
        "Failed to delete reply. Please try again."
      );
      toast.error(errorMsg);
    },
  });
}
