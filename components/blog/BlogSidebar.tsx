"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, Tag, Spin } from "antd";

interface Category {
  id: string;
  name: string;
  slug: string;
  _count: { posts: number };
}

interface TagItem {
  id: string;
  name: string;
  slug: string;
  _count: { posts: number };
}

interface RecentPost {
  id: string;
  title: string;
  slug: string;
  publishedAt: string;
}

export default function BlogSidebar() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<TagItem[]>([]);
  const [recentPosts, setRecentPosts] = useState<RecentPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSidebarData();
  }, []);

  const loadSidebarData = async () => {
    try {
      const [categoriesRes, tagsRes, postsRes] = await Promise.all([
        fetch("/api/categories"),
        fetch("/api/tags"),
        fetch("/api/posts?pageSize=5"),
      ]);

      const [categoriesData, tagsData, postsData] = await Promise.all([
        categoriesRes.json(),
        tagsRes.json(),
        postsRes.json(),
      ]);

      if (categoriesData.success) {
        setCategories(categoriesData.data);
      }
      if (tagsData.success) {
        setTags(tagsData.data.slice(0, 15));
      }
      if (postsData.success) {
        setRecentPosts(postsData.data);
      }
    } catch (error) {
      console.error("Failed to load sidebar data:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("zh-CN", {
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: 40 }}>
        <Spin />
      </div>
    );
  }

  return (
    <div className="blog-sidebar">
      {/* Categories */}
      <Card title="分类" className="blog-sidebar-card">
        <div className="blog-sidebar-list">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/category/${category.slug}`}
              className="blog-sidebar-item"
            >
              <span>{category.name}</span>
              <span className="blog-sidebar-count">
                {category._count.posts}
              </span>
            </Link>
          ))}
        </div>
      </Card>

      {/* Recent Posts */}
      <Card title="最新文章" className="blog-sidebar-card">
        <div className="blog-sidebar-list">
          {recentPosts.map((post) => (
            <Link
              key={post.id}
              href={`/posts/${post.slug}`}
              className="blog-sidebar-item"
            >
              <span className="blog-sidebar-post-title">{post.title}</span>
              <span className="blog-sidebar-date">
                {formatDate(post.publishedAt)}
              </span>
            </Link>
          ))}
        </div>
      </Card>

      {/* Tags */}
      <Card title="标签" className="blog-sidebar-card">
        <div className="blog-sidebar-tags">
          {tags.map((tag) => (
            <Link key={tag.id} href={`/tag/${tag.slug}`}>
              <Tag>{tag.name}</Tag>
            </Link>
          ))}
        </div>
      </Card>
    </div>
  );
}
