"use client";

import { useAppContext } from "@/context/useAppContext";
import type {
  KnowledgeBaseArticle,
  KnowledgeBaseListResponse,
  KnowledgeBasePublicListResponse,
  KnowledgeBaseStatus,
} from "@/types";
import { normalizeApiError } from "@/utils/normalizeApiErrors";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface KnowledgeBaseAdminFilters {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  status?: KnowledgeBaseStatus;
  isFeatured?: boolean;
}

interface KnowledgeBasePublicFilters {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  isFeatured?: boolean;
}

export interface KnowledgeBasePayload {
  title: string;
  slug?: string;
  summary?: string | null;
  contentHtml: string;
  coverImage?: string | null;
  category?: string | null;
  tags?: string[];
  status?: KnowledgeBaseStatus;
  isFeatured?: boolean;
  position?: number;
  publishedAt?: string | null;
}

export function useGetKnowledgeBaseAdmin(filters?: KnowledgeBaseAdminFilters) {
  const { api, adminInfo } = useAppContext();

  const page = filters?.page ?? 1;
  const limit = filters?.limit ?? 20;

  return useQuery({
    queryKey: [
      "knowledge-base-admin",
      adminInfo?.uid,
      page,
      limit,
      filters?.search || "",
      filters?.category || "",
      filters?.status || "",
      typeof filters?.isFeatured === "boolean"
        ? String(filters.isFeatured)
        : "",
    ],
    queryFn: async () => {
      const res = await api.get<KnowledgeBaseListResponse>(
        "/knowledge-base/admin",
        {
          params: {
            page,
            limit,
            ...(filters?.search ? { search: filters.search } : {}),
            ...(filters?.category ? { category: filters.category } : {}),
            ...(filters?.status ? { status: filters.status } : {}),
            ...(typeof filters?.isFeatured === "boolean"
              ? { isFeatured: filters.isFeatured }
              : {}),
          },
        },
      );
      return res.data;
    },
    enabled: !!adminInfo?.uid,
  });
}

export function useGetKnowledgeBaseArticleAdmin(uid: string) {
  const { api, adminInfo } = useAppContext();

  return useQuery({
    queryKey: ["knowledge-base-admin-article", adminInfo?.uid, uid],
    queryFn: async () => {
      const res = await api.get<{ article: KnowledgeBaseArticle }>(
        `/knowledge-base/admin/${uid}`,
      );
      return res.data.article;
    },
    enabled: !!adminInfo?.uid && !!uid,
  });
}

export function useCreateKnowledgeBaseAdmin() {
  const { api } = useAppContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["create-knowledge-base-admin"],
    mutationFn: async (payload: KnowledgeBasePayload) => {
      const res = await api.post<{
        success: boolean;
        article: KnowledgeBaseArticle;
      }>("/knowledge-base/admin", payload);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Knowledge base article created successfully");
      queryClient.invalidateQueries({ queryKey: ["knowledge-base-admin"] });
      queryClient.invalidateQueries({ queryKey: ["knowledge-base-public"] });
    },
    onError: (error: unknown) => {
      toast.error(
        normalizeApiError(error, "Failed to create knowledge base article"),
      );
    },
  });
}

export function useUpdateKnowledgeBaseAdmin() {
  const { api } = useAppContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["update-knowledge-base-admin"],
    mutationFn: async ({
      uid,
      payload,
    }: {
      uid: string;
      payload: KnowledgeBasePayload;
    }) => {
      const res = await api.patch<{
        success: boolean;
        article: KnowledgeBaseArticle;
      }>(`/knowledge-base/admin/${uid}`, payload);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Knowledge base article updated successfully");
      queryClient.invalidateQueries({ queryKey: ["knowledge-base-admin"] });
      queryClient.invalidateQueries({
        queryKey: ["knowledge-base-admin-article"],
      });
      queryClient.invalidateQueries({ queryKey: ["knowledge-base-public"] });
      queryClient.invalidateQueries({
        queryKey: ["knowledge-base-public-article"],
      });
    },
    onError: (error: unknown) => {
      toast.error(
        normalizeApiError(error, "Failed to update knowledge base article"),
      );
    },
  });
}

export function useDeleteKnowledgeBaseAdmin() {
  const { api } = useAppContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["delete-knowledge-base-admin"],
    mutationFn: async (uid: string) => {
      const res = await api.delete<{ success: boolean }>(
        `/knowledge-base/admin/${uid}`,
      );
      return res.data;
    },
    onSuccess: () => {
      toast.success("Knowledge base article deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["knowledge-base-admin"] });
      queryClient.invalidateQueries({ queryKey: ["knowledge-base-public"] });
    },
    onError: (error: unknown) => {
      toast.error(
        normalizeApiError(error, "Failed to delete knowledge base article"),
      );
    },
  });
}

export function useGetKnowledgeBasePublic(
  filters?: KnowledgeBasePublicFilters,
) {
  const { api } = useAppContext();

  const page = filters?.page ?? 1;
  const limit = filters?.limit ?? 12;

  return useQuery({
    queryKey: [
      "knowledge-base-public",
      page,
      limit,
      filters?.search || "",
      filters?.category || "",
      typeof filters?.isFeatured === "boolean"
        ? String(filters.isFeatured)
        : "",
    ],
    queryFn: async () => {
      const res = await api.get<KnowledgeBasePublicListResponse>(
        "/knowledge-base",
        {
          params: {
            page,
            limit,
            ...(filters?.search ? { search: filters.search } : {}),
            ...(filters?.category ? { category: filters.category } : {}),
            ...(typeof filters?.isFeatured === "boolean"
              ? { isFeatured: filters.isFeatured }
              : {}),
          },
        },
      );
      return res.data;
    },
  });
}

export function useGetKnowledgeBaseArticlePublic(slug: string) {
  const { api } = useAppContext();

  return useQuery({
    queryKey: ["knowledge-base-public-article", slug],
    queryFn: async () => {
      const res = await api.get<{ article: KnowledgeBaseArticle }>(
        `/knowledge-base/${slug}`,
      );
      return res.data.article;
    },
    enabled: !!slug,
  });
}
