"use client";
import { useAppContext } from "@/context/useAppContext";
import type { User, Admin } from "@/types";
import { normalizeApiError } from "@/utils/normalizeApiErrors";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface VerifySessionCodeProps {
  sessionCode: string;
}

type Role = "USER" | "ADMIN";
type AuthResponse = User | Admin;

export function useVerifySessionCode(role: Role = "USER") {
  const { handleSetUserInfo, handleSetAdminInfo } = useAppContext();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: async (data: VerifySessionCodeProps) => {
      const res = await axios.post<{ user: AuthResponse }>(
        `https://auth.validpanel.com/api/auth/core/session/verify`,
        { ...data, role },
        {
          withCredentials: true,
        }
      );
      if (!res.data.user) throw new Error("Failed to verify session code");
      return res.data.user;
    },
    onSuccess: (data: AuthResponse) => {
      toast.success("User authenticated successfully");
      if (role === "USER") {
        handleSetUserInfo(data as User);
        navigate("/analytics");
      } else {
        handleSetAdminInfo(data as Admin);
        navigate("/admin/overview");
      }
    },
    onError: (error: unknown) => {
      const errorMsg = normalizeApiError(
        error,
        "Failed to verify session code"
      );
      toast.error(errorMsg);
    },
  });
}
