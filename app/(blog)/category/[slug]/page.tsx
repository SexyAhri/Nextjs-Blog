"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Pagination, Spin, Empty } from "antd";
import { FolderOutlined } from "@ant-design/icons";
import PostCard from "@/components/blog/PostCard";
import BlogSidebar from "@/components/blog/BlogSidebar";

interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  coverImage?: string;
  publishedAt: string;
  viewCount: number;
  author: {
    name: string;
  };
  category?: {
    name: string;
    slug: string;
  };
  tags?: Array<{
    tag: {
      name: string;
      slug: string;
    };
  }>;
}

export default function CategoryPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [posts, setPosts] = useState<Post[]>([]);
  const [categoryName, setCategoryName] = useState("");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const pageSize = 10;

  useEffect(() => {
    if (slug) {
      loadCategory();
      loadPosts();
    }
  }, [slug, page]);

  const loadCategory = async () => {
    try {
      const res = await fetch("/api/categories");
      const data = await res.json();
      if (data.success) {
        const category = data.data.find((c: any) => c.slug === slug);
        if (category) {
          setCategoryName(category.name);
        }
      }
    } catch (error) {
      console.error("Failed to load category:", error);
    }
  };

  const loadPosts = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/categories");
      const categoriesData = await res.json();
      if (categoriesData.success) {
        const category = categoriesData.data.find((c: any) => c.slug === slug);
        if (category) {
          const postsRes = await fetch(
            `/api/posts?categoryId=${category.id}&page=${page}&pageSize=${pageSize}`,
          );
          const postsData = await postsRes.json();
          if (postsData.success) {
            setPosts(postsData.data);
            setTotal(postsData.pagination.total);
          }
        }
      }
    } catch (error) {
      console.error("Failed to load posts:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="blog-container">
      <div className="blog-content-inner">
        <div className="blog-posts">
          {/* Category Header */}
          <div className="category-header">
            <FolderOutlined style={{ fontSize: 32, color: "#722ed1" }} />
            <h1>{categoryName || "分类"}</h1>
            <p>共 {total} 篇文章</p>
          </div>

          {loading ? (
            <div style={{ textAlign: "center", padding: 100 }}>
              <Spin size="large" />
            </div>
          ) : posts.length === 0 ? (
            <Empty description="该分类下暂无文章" />
          ) : (
            <>
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}

              {total > pageSize && (
                <div className="blog-pagination">
                  <Pagination
                    current={page}
                    total={total}
                    pageSize={pageSize}
                    onChange={setPage}
                    showSizeChanger={false}
                    showTotal={(t) => `共 ${t} 篇文章`}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>
      <aside className="blog-aside">
        <BlogSidebar />
      </aside>
    </div>
  );
}
