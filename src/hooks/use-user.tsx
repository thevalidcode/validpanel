"use client";
import type { TimeRange } from "@/client/components/analytics/PlatformActivity";
import { useAppContext } from "@/context/useAppContext";
import type { User, Store, StoreType, UserStatus } from "@/types";
import { normalizeApiError } from "@/utils/normalizeApiErrors";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export type UserAnalyticsResponse = {
  stores: {
    total: {
      value: number;
      change: string;
    };
    active: {
      value: number;
      change: string;
    };
  };
  subscription: {
    currentPlan: string;
    nextBillingDate: string | null; // ISO string from backend
    features: {
      name: string;
      value: number | null;
    }[];
  };
  platformEvents: Record<TimeRange, { name: string; value: number }[]>;
  allStores: Store[];
};
// Custom hook for user-related queries and mutations

interface NewUser {
  email: string;
  password: string;
  fullName: string;
  ref?: number;
}

export function useCreateUser() {
  const { api, handleSetUserInfo } = useAppContext();
  return useMutation({
    mutationKey: ["createUser"],
    mutationFn: async (newUser: NewUser) => {
      // Prepare payload with correct types and explicit interface for type safety
      const payload: {
        email: string;
        password: string;
        fullName: string;
        ref?: number;
      } = {
        email: newUser.email,
        password: newUser.password,
        fullName: newUser.fullName,
      };

      // Only add ref if it's a valid number
      if (newUser.ref && !isNaN(Number(newUser.ref))) {
        payload.ref = Number(newUser.ref);
      }

      const res = await api.post(`/users`, payload);

      if (!res.data.user) {
        // Log the response for debugging
        console.error("User creation failed. Response:", res.data);
        throw new Error(
          "Failed to create user: No user object returned from server."
        );
      }
      return res.data;
    },

    onSuccess: (data) => {
      handleSetUserInfo({
        ...data.user,
      });
    },
    onError: (error: unknown) => {
      const errorMsg = normalizeApiError(error, "Failed to create user");
      toast.error(errorMsg);
    },
  });
}

interface LoginProps {
  email: string;
  password: string;
}
export function useUserLogin() {
  const { api, handleSetUserInfo } = useAppContext();
  const router = useNavigate();
  return useMutation({
    mutationKey: ["userLogins"],
    mutationFn: async (data: LoginProps) => {
      const res = await api.post(`/users/me`, {
        email: data.email,
        password: data.password,
      });

      if (!res.data) {
        throw new Error(
          "Failed to login user: No response data received from server."
        );
      }
      return res.data;
    },
    onSuccess: async (data) => {
      handleSetUserInfo({
        ...data.user,
      });
      // Redirect to the appropriate dashboard. The user session is now active.
      router("/stores");
    },
    onError: (error: unknown) => {
      const errorMsg = normalizeApiError(error, "Failed to login user");
      toast.error(errorMsg);
    },
  });
}

export interface UserWithStoreCount {
  id: number;
  uid: string;
  email: string;
  image: string;
  fullName: string;
  status: UserStatus;
  storesCount: number;
}

// get users
export function useGetUsers() {
  const { api, adminInfo } = useAppContext();
  return useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await api.get<UserWithStoreCount[]>(`/users`);
      if (!res.data) throw new Error("Failed to fetch users");
      return res.data;
    },
    enabled: !!adminInfo,
  });
}

// get user analytics
export function useGetUserAnalytics() {
  const { api, userInfo } = useAppContext();
  return useQuery({
    queryKey: ["userAnalytics", userInfo?.uid],
    queryFn: async () => {
      const res = await api.get(`/users/analytics`);
      if (!res.data) throw new Error("Failed to fetch user analytics");
      return res.data as UserAnalyticsResponse;
    },
    enabled: !!userInfo,
  });
}

// ! get user by id`
export function useGetUserById(id: string) {
  const { api } = useAppContext();
  return useQuery({
    queryKey: ["user", id],
    queryFn: async () => {
      const res = await api.get(`/users/${id}`);
      if (!res.data) throw new Error("Failed to fetch user");
      return res.data;
    },
  });
}

interface UidsProps {
  uids: string[];
}

//! delete multiple users
export function useDeleteMultipleUsers() {
  const { api } = useAppContext();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: UidsProps) => {
      const res = await api.delete(`/users/multiple`, { data });
      if (!res.data) throw new Error("Failed to delete users");
      return res.data;
    },
    onSuccess: () => {
      toast.success("Users deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error: unknown) => {
      const errorMsg = normalizeApiError(error, "Failed to delete users");
      toast.error(errorMsg);
    },
  });
}

// ban multiple users
export function useBanMultipleUsers() {
  const { api } = useAppContext();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: UidsProps) => {
      const res = await api.patch(`/users/ban-multiple`, data);
      if (!res.data) throw new Error("Failed to ban users");
      return res.data;
    },
    onSuccess: () => {
      toast.success("Users banned successfully");
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error: unknown) => {
      const errorMsg = normalizeApiError(error, "Failed to ban users");
      toast.error(errorMsg);
    },
  });
}

// activate multiple users
export function useActivateMultipleUsers() {
  const { api } = useAppContext();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: UidsProps) => {
      const res = await api.patch(`/users/activate-multiple`, data);
      if (!res.data) throw new Error("Failed to activate users");
      return res.data;
    },
    onSuccess: () => {
      toast.success("Users activated successfully");
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error: unknown) => {
      const errorMsg = normalizeApiError(error, "Failed to activate users");
      toast.error(errorMsg);
    },
  });
}

//! delete a single user
interface DeleteUserProps {
  uid: string;
}
export const useDeleteASingleUser = () => {
  const { api } = useAppContext();
  return useMutation({
    mutationFn: async (data: DeleteUserProps) => {
      const res = await api.delete(`/users`, {
        data: { uid: data.uid },
      });
      if (!res.data) throw new Error("Failed to delete user");
      return res.data;
    },
    onSuccess: () => {
      toast.success("User deleted successfully");
    },
    onError: (error: unknown) => {
      const errorMsg = normalizeApiError(error, "Failed to delete user");
      toast.error(errorMsg);
    },
  });
};

// update user info
interface UpdateUserProps {
  username?: string;
  fullName?: string;
  image?: string;
  phoneNumber?: string;
}

export function useUpdateUser() {
  const { api, handleSetUserInfo } = useAppContext();

  return useMutation({
    mutationFn: async (data: UpdateUserProps) => {
      const res = await api.patch(`/users`, data);
      if (!res.data) throw new Error("Failed to update user");
      return res.data.user;
    },
    onSuccess: (updatedUser: User) => {
      toast.success("User updated successfully");
      handleSetUserInfo({
        ...updatedUser,
      });
    },
    onError: (error: unknown) => {
      const errorMsg = normalizeApiError(error, "Failed to update user");
      toast.error(errorMsg);
    },
  });
}

interface UpdateUserByAdminProps {
  apiKey?: string;
  username?: string;
  email?: string;
  fullName?: string;
  balance?: string;
}

export function useUpdateUserByAdmin() {
  const { api } = useAppContext();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: UpdateUserByAdminProps) => {
      const res = await api.patch(`/users/admin`, data);
      if (!res.data) throw new Error("Failed to update user");
      return res.data;
    },
    onSuccess: () => {
      toast.success("User updated successfully");
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error: unknown) => {
      const errorMsg = normalizeApiError(error, "Failed to update user");
      toast.error(errorMsg);
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
      const res = await api.post(`/users/forgot-password`, data);
      if (!res.data) throw new Error("Failed to send email");
      return res.data;
    },
    onError: (error: unknown) => {
      const errorMsg = normalizeApiError(error, "Failed to send email");
      toast.error(errorMsg);
    },
  });
}

interface ResetPasswordProps {
  token: string;
  email: string;
  password: string;
}

export function useResetPassword() {
  const { api } = useAppContext();
  return useMutation({
    mutationFn: async (data: ResetPasswordProps) => {
      const res = await api.post(`/users/reset-password`, data);
      if (!res.data) throw new Error("Failed to reset password");
      return res.data;
    },
    onError: (error: unknown) => {
      const errorMsg = normalizeApiError(error, "Failed to reset password");
      toast.error(errorMsg);
    },
  });
}

interface OnboardingSetupStoreProps {
  type: StoreType;
  subscriptionId: number;
  logoUrl?: string;
  color: string;
  domain: string;
  name: string;
}

export function useOnboardingSetupStore() {
  const { api, handleSetUserInfo } = useAppContext();
  return useMutation({
    mutationFn: async (data: OnboardingSetupStoreProps) => {
      const res = await api.post<{
        message: string;
        user: User;
        store: Store;
        onboardingStep: "COMPLETE";
      }>(`/users/onboarding/setup`, data);
      if (!res.data) throw new Error("Failed to setup store");
      return res.data;
    },
    onSuccess: (data) => {
      handleSetUserInfo({
        ...data.user,
      });
    },
    onError: (error: unknown) => {
      const errorMsg = normalizeApiError(error, "Failed to setup store");
      toast.error(errorMsg);
    },
  });
}
