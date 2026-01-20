"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Spin } from "antd";
import { FolderOutlined } from "@ant-design/icons";

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  _count: { posts: number };
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const res = await fetch("/api/categories");
      const data = await res.json();
      if (data.success) {
        setCategories(data.data);
      }
    } catch (error) {
      console.error("Failed to load categories:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="blog-container">
        <div style={{ textAlign: "center", padding: 80 }}>
          <Spin size="large" />
        </div>
      </div>
    );
  }

  return (
    <div className="blog-container">
      <div className="page-header">
        <h1>分类</h1>
        <p>共 {categories.length} 个分类</p>
      </div>

      <div className="categories-grid">
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/category/${category.slug}`}
            className="category-card"
          >
            <FolderOutlined className="category-icon" />
            <h3>{category.name}</h3>
            <span className="category-count">
              {category._count.posts} 篇文章
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
