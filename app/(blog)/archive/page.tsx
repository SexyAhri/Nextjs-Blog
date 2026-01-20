"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Spin, Empty } from "antd";

interface Post {
  id: string;
  title: string;
  slug: string;
  publishedAt: string;
}

interface ArchiveGroup {
  year: number;
  months: {
    month: number;
    posts: Post[];
  }[];
}

export default function ArchivePage() {
  const [archives, setArchives] = useState<ArchiveGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    loadArchives();
  }, []);

  const loadArchives = async () => {
    try {
      const res = await fetch("/api/posts?pageSize=1000");
      const data = await res.json();
      if (data.success) {
        const posts = data.data as Post[];
        setTotal(posts.length);

        // 按年月分组
        const grouped = posts.reduce(
          (acc: Record<string, Record<string, Post[]>>, post) => {
            const date = new Date(post.publishedAt);
            const year = date.getFullYear();
            const month = date.getMonth() + 1;

            if (!acc[year]) acc[year] = {};
            if (!acc[year][month]) acc[year][month] = [];
            acc[year][month].push(post);

            return acc;
          },
          {},
        );

        // 转换为数组格式
        const result: ArchiveGroup[] = Object.entries(grouped)
          .map(([year, months]) => ({
            year: parseInt(year),
            months: Object.entries(months)
              .map(([month, posts]) => ({
                month: parseInt(month),
                posts: posts.sort(
                  (a, b) =>
                    new Date(b.publishedAt).getTime() -
                    new Date(a.publishedAt).getTime(),
                ),
              }))
              .sort((a, b) => b.month - a.month),
          }))
          .sort((a, b) => b.year - a.year);

        setArchives(result);
      }
    } catch (error) {
      console.error("Failed to load archives:", error);
    } finally {
      setLoading(false);
    }
  };

  const getMonthName = (month: number) => {
    const months = [
      "一月",
      "二月",
      "三月",
      "四月",
      "五月",
      "六月",
      "七月",
      "八月",
      "九月",
      "十月",
      "十一月",
      "十二月",
    ];
    return months[month - 1];
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getMonth() + 1}月${date.getDate()}日`;
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
        <h1>归档</h1>
        <p>共 {total} 篇文章</p>
      </div>

      {archives.length === 0 ? (
        <Empty description="暂无文章" />
      ) : (
        <div className="archive-list">
          {archives.map((yearGroup) => (
            <div key={yearGroup.year} className="archive-year">
              <h2 className="archive-year-title">{yearGroup.year}</h2>
              {yearGroup.months.map((monthGroup) => (
                <div key={monthGroup.month} className="archive-month">
                  <h3 className="archive-month-title">
                    {getMonthName(monthGroup.month)}
                    <span className="archive-month-count">
                      ({monthGroup.posts.length})
                    </span>
                  </h3>
                  <ul className="archive-posts">
                    {monthGroup.posts.map((post) => (
                      <li key={post.id}>
                        <span className="archive-post-date">
                          {formatDate(post.publishedAt)}
                        </span>
                        <Link
                          href={`/posts/${post.slug}`}
                          className="archive-post-title"
                        >
                          {post.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
