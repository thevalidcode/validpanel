export type KnowledgeBaseStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";

export interface KnowledgeBaseAuthor {
  uid: string;
  fullName: string;
}

export interface KnowledgeBaseArticle {
  uid: string;
  title: string;
  slug: string;
  summary?: string | null;
  contentHtml: string;
  coverImage?: string | null;
  category?: string | null;
  tags: string[];
  status: KnowledgeBaseStatus;
  isFeatured: boolean;
  position: number;
  publishedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  author?: KnowledgeBaseAuthor | null;
}

export interface KnowledgeBasePublicListItem {
  uid: string;
  title: string;
  slug: string;
  summary?: string | null;
  coverImage?: string | null;
  category?: string | null;
  tags: string[];
  status: KnowledgeBaseStatus;
  isFeatured: boolean;
  publishedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface KnowledgeBaseListResponse {
  knowledgeBase: KnowledgeBaseArticle[];
  meta: {
    total: number;
    page: number;
    pages: number;
    limit: number;
  };
}

export interface KnowledgeBasePublicListResponse {
  knowledgeBase: KnowledgeBasePublicListItem[];
  meta: {
    total: number;
    page: number;
    pages: number;
    limit: number;
  };
}
