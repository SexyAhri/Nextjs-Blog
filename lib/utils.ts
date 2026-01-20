import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Tailwind CSS 类名合并工具
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// 生成 slug
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[\s_]+/g, "-")
    .replace(/[^\w\-\u4e00-\u9fa5]+/g, "")
    .replace(/\-\-+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
}

// 格式化日期
export function formatDate(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// 截取摘要
export function truncate(text: string, length: number = 150): string {
  if (text.length <= length) return text;
  return text.slice(0, length) + "...";
}

// 计算阅读时间（分钟）
export function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const wordCount = content.trim().split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
}
