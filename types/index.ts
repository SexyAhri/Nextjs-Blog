import { Post, Category, Tag, User, Comment } from "@prisma/client";

// 扩展的文章类型（包含关联数据）
export type PostWithRelations = Post & {
  author: User;
  category: Category | null;
  tags: Array<{
    tag: Tag;
  }>;
  _count?: {
    comments: number;
  };
};

// 分类统计
export type CategoryWithCount = Category & {
  _count: {
    posts: number;
  };
};

// 标签统计
export type TagWithCount = Tag & {
  _count: {
    posts: number;
  };
};

// 评论树形结构
export type CommentWithReplies = Comment & {
  replies: CommentWithReplies[];
};

// API 响应类型
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// 分页响应
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

// 表单数据类型
export interface PostFormData {
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  coverImage?: string;
  published: boolean;
  categoryId?: string;
  tags: string[];
}

export interface CategoryFormData {
  name: string;
  slug: string;
  description?: string;
}

export interface TagFormData {
  name: string;
  slug: string;
}
