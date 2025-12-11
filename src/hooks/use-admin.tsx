"use client";
import { useAppContext } from "@/context/useAppContext";
import type { Admin, AdminStatus } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
// Custom hook for admin-related queries and mutations
// Naming follows the convention: useAdmins for fetching, useCreateUser/useUpdateUser for mutations

interface NewAdmin {
  email: string;
  password: string;
  fullName: string;
  ref?: number;
}

export function useCreateAdmin() {
  const { api, handleSetAdminInfo } = useAppContext();
  return useMutation({
    mutationKey: ["createAdmin"],
    mutationFn: async (newAdmin: NewAdmin) => {
      // Prepare payload with correct types and explicit interface for type safety
      const payload: {
        email: string;
        password: string;
        fullName: string;
        ref?: number;
      } = {
        email: newAdmin.email,
        password: newAdmin.password,
        fullName: newAdmin.fullName,
      };

      // Only add ref if it's a valid number
      if (newAdmin.ref && !isNaN(Number(newAdmin.ref))) {
        payload.ref = Number(newAdmin.ref);
      }

      const res = await api.post(`/admins`, payload);

      if (!res.data.admin) {
        // Log the response for debugging
        console.error("Admin creation failed. Response:", res.data);
        throw new Error(
          "Failed to create admin: No admin object returned from server."
        );
      }
      return res.data;
    },

    onSuccess: (data) => {
      toast.success("Admin created successfully");
      handleSetAdminInfo({
        ...data.admin,
      });
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
          errorMsg = "Failed to create admin";
        }
      } else if (error instanceof Error) {
        errorMsg = error.message;
      }
      toast.error(errorMsg);
    },
  });
}

interface LoginProps {
  email: string;
  password: string;
}
export function useAdminLogin() {
  const { api, handleSetAdminInfo } = useAppContext();
  const router = useNavigate();
  return useMutation({
    mutationKey: ["adminLogins"],
    mutationFn: async (data: LoginProps) => {
      const res = await api.post(`/admins/me`, {
        email: data.email,
        password: data.password,
      });

      if (!res.data) {
        throw new Error(
          "Failed to login admin: No response data received from server."
        );
      }
      return res.data;
    },
    onSuccess: async (data) => {
      handleSetAdminInfo({
        ...data.admin,
      });
      // Redirect to the appropriate dashboard. The admin session is now active.
      router("/stores");
    },
    onError: (error: unknown) => {
      // Enhanced error extraction for better admin feedback
      let errorMsg = "An unexpected error occurred during login.";
      if (error instanceof AxiosError) {
        const data = error.response?.data;
        if (typeof data === "string") {
          errorMsg = data;
        } else if (data?.error) {
          errorMsg = data.error;
        } else if (data?.message) {
          errorMsg = data.message;
        } else {
          errorMsg =
            "Failed to login admin: Server returned an unknown error format.";
        }
      } else if (error instanceof Error) {
        errorMsg = error.message;
      }
      toast.error(errorMsg);
    },
  });
}

// get admins
export function useGetAdmins() {
  const { api } = useAppContext();
  return useQuery({
    queryKey: ["admins"],
    queryFn: async () => {
      // The 'withCredentials' option is now set globally in the API context.
      const res = await api.get<Admin[]>(`/admins`, {});
      if (!res.data) throw new Error("Failed to fetch admin");
      return res.data;
    },
  });
}

// ! get admin by id`
export function useGetAdminById(id: string) {
  const { api } = useAppContext();
  return useQuery({
    queryKey: ["admin", id],
    queryFn: async () => {
      const res = await api.get(`/admins/${id}`);
      if (!res.data) throw new Error("Failed to fetch admin");
      `
        return res.data;`;
    },
  });
}

interface DeleteAdminsProps {
  uids: string[];
}

//! delete multiple admins
export function useDeleteMultipleAdmins() {
  const { api } = useAppContext();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: DeleteAdminsProps) => {
      const res = await api.delete(`/admins/multiple`, { data });
      if (!res.data) throw new Error("Failed to delete admins");
      return res.data;
    },
    onSuccess: () => {
      toast.success("Admins deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["admins"] });
    },
    onError: (error: unknown) => {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.error || "Failed to delete admins");
      } else {
        toast.error("Failed to delete admins");
      }
    },
  });
}

//! delete a single admin

interface DeleteAdminProps {
  uid: string;
}
export const useDeleteASingleAdmin = () => {
  const { api } = useAppContext();
  return useMutation({
    mutationFn: async (data: DeleteAdminProps) => {
      const res = await api.delete(`/admins`, {
        data: { uid: data.uid },
      });
      if (!res.data) throw new Error("Failed to delete admin");
      return res.data;
    },
    onSuccess: () => {
      toast.success("Admin deleted successfully");
    },
    onError: (error: unknown) => {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.error || "Failed to delete admin");
      } else {
        toast.error("Failed to delete admin");
      }
    },
  });
};

// update admin info
interface UpdateAdminProps {
  adminname?: string;
  email?: string;
  apiKey?: string;
  fullName?: string;
  image?: string;
  status?: AdminStatus;
}

export function useUpdateAdmin() {
  const { api, handleSetAdminInfo } = useAppContext();

  return useMutation({
    mutationFn: async (data: UpdateAdminProps) => {
      const res = await api.patch(`/admins`, data);
      if (!res.data) throw new Error("Failed to update admin");
      return res.data;
    },
    onSuccess: (updatedAdmin: any) => {
      toast.success("Admin updated successfully");
      handleSetAdminInfo({
        ...updatedAdmin.admin,
      });
    },
    onError: (error: unknown) => {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.error || "Failed to update admin");
      } else {
        toast.error("Failed to update admin");
      }
    },
  });
}

interface UpdateAdminByAdminProps {
  apiKey?: string;
  adminname?: string;
  email?: string;
  fullName?: string;
  balance?: string;
}

export function useUpdateAdminByAdmin() {
  const { api } = useAppContext();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: UpdateAdminByAdminProps) => {
      const res = await api.patch(`/admins/admin`, data);
      if (!res.data) throw new Error("Failed to update admin");
      return res.data;
    },
    onSuccess: () => {
      toast.success("Admin updated successfully");
      queryClient.invalidateQueries({ queryKey: ["admins"] });
    },
    onError: (error: unknown) => {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.error || "Failed to update admin");
      } else {
        toast.error("Failed to update admin");
      }
    },
  });
}

interface ForgetPasswordProps {
  email: string;
}

export function useForgotPassword() {
  const { api } = useAppContext();
  return useMutation({
    mutationFn: async (data: ForgetPasswordProps) => {
      const res = await api.post(`/admins/forgot-password`, data);
      if (!res.data) throw new Error("Failed to send email");
      return res.data;
    },
    onError: (error: unknown) => {
      if (error instanceof AxiosError) {
        console.error(error.response?.data?.error || "Failed to send email");
      } else {
        console.error("Failed send email");
      }
    },
  });
}

interface ResetPasswordProps {
  token: string;
  password: string;
}

export function useResetPassword() {
  const { api } = useAppContext();
  return useMutation({
    mutationFn: async (data: ResetPasswordProps) => {
      const res = await api.post(`/admins/reset-password`, data);
      if (!res.data) throw new Error("Failed to reset password");
      return res.data;
    },
    onError: (error: unknown) => {
      if (error instanceof AxiosError) {
        console.error(
          error.response?.data?.error || "Failed to reset password"
        );
      } else {
        console.error("Failed to reset password");
      }
    },
  });
}
