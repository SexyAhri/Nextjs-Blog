"use client";

import { useEffect, useState } from "react";
import { Pagination, Spin, Empty } from "antd";
import PostCard from "@/components/blog/PostCard";
import BlogSidebar from "@/components/blog/BlogSidebar";
import { FireOutlined, ThunderboltOutlined } from "@ant-design/icons";

interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  coverImage?: string;
  publishedAt: string;
  viewCount: number;
  likeCount?: number;
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

type SortType = "latest" | "hot" | "liked";

export default function HomePage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [sort, setSort] = useState<SortType>("latest");

  useEffect(() => {
    fetch("/api/settings/display")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.postsPerPage) {
          setPageSize(parseInt(data.postsPerPage) || 10);
        }
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    loadPosts();
  }, [page, pageSize, sort]);

  const loadPosts = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/posts?page=${page}&pageSize=${pageSize}&sort=${sort}`
      );
      const data = await res.json();
      if (data.success) {
        setPosts(data.data);
        setTotal(data.pagination.total);
      }
    } catch (error) {
      console.error("Failed to load posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const sortTabs = [
    { key: "latest" as SortType, label: "最新文章", icon: null },
    { key: "hot" as SortType, label: "热门文章", icon: <FireOutlined /> },
    { key: "liked" as SortType, label: "点赞最多", icon: <ThunderboltOutlined /> },
  ];

  return (
    <div className="blog-container">
      <div className="blog-content-inner">
        <div className="blog-posts">
          {/* 文章筛选标签 */}
          <div className="article-tabs">
            {sortTabs.map((tab) => (
              <button
                key={tab.key}
                className={`article-tab ${sort === tab.key ? "active" : ""}`}
                onClick={() => {
                  setSort(tab.key);
                  setPage(1);
                }}
              >
                {tab.icon && <span className="article-tab-icon">{tab.icon}</span>}
                {tab.label}
              </button>
            ))}
          </div>

          {/* 文章列表 */}
          {loading ? (
            <div className="article-loading">
              <Spin size="large" />
            </div>
          ) : posts.length === 0 ? (
            <Empty description="暂无文章" />
          ) : (
            <>
              <div className="article-list">
                {posts.map((post) => (
                  <PostCard key={post.id} post={post} variant="standard" />
                ))}
              </div>

              {total > pageSize && (
                <div className="blog-pagination">
                  <Pagination
                    current={page}
                    total={total}
                    pageSize={pageSize}
                    onChange={setPage}
                    showSizeChanger={false}
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
