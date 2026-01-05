import { useMutation } from "@tanstack/react-query";
import { useAppContext } from "@/context/useAppContext";
import { normalizeApiError } from "@/utils/normalizeApiErrors";
import { toast } from "sonner";

export interface ContactMessage {
  firstName: string;
  lastName: string;
  email: string;
  message: string;
}

export function useSendContactMessage() {
  const { api } = useAppContext();

  return useMutation({
    mutationKey: ["contactMessage"],
    mutationFn: async (data: ContactMessage) => {
      const res = await api.post("/contact", data);
      if (!res.data) throw new Error("Failed to send contact message");
      return res.data;
    },
    onSuccess: () => {
      toast.success("Message sent successfully! We'll respond within 24 hours.");
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
