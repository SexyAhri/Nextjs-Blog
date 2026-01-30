"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Card, Tag, Spin } from "antd";
import {
  ClockCircleOutlined,
  FolderOutlined,
  FireOutlined,
  FileTextOutlined,
  TagsOutlined,
} from "@ant-design/icons";

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
  viewCount?: number;
}

export default function BlogSidebar() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<TagItem[]>([]);
  const [recentPosts, setRecentPosts] = useState<RecentPost[]>([]);
  const [hotPosts, setHotPosts] = useState<RecentPost[]>([]);
  const [postCount, setPostCount] = useState(0);
  const [commentCount, setCommentCount] = useState(0);
  const [motto, setMotto] = useState("记录与分享，让技术更有温度");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [bannerUrl, setBannerUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSidebarData();
  }, []);

  const loadSidebarData = async () => {
    try {
      const [categoriesRes, tagsRes, postsRes, hotRes, profileRes] = await Promise.all([
        fetch("/api/categories"),
        fetch("/api/tags"),
        fetch("/api/posts?pageSize=5"),
        fetch("/api/posts?pageSize=5&sort=hot"),
        fetch("/api/settings/profile"),
      ]);

      const [categoriesData, tagsData, postsData, hotData, profileData] = await Promise.all([
        categoriesRes.json(),
        tagsRes.json(),
        postsRes.json(),
        hotRes.json(),
        profileRes.json(),
      ]);

      if (categoriesData.success) setCategories(categoriesData.data);
      if (tagsData.success) setTags(tagsData.data.slice(0, 15));
      if (postsData.success) {
        setRecentPosts(postsData.data);
        setPostCount(postsData.pagination?.total || postsData.data.length);
      }
      if (hotData.success) setHotPosts(hotData.data);
      if (profileData.success) {
        setPostCount(profileData.postCount);
        setCommentCount(profileData.commentCount || 0);
        setMotto(profileData.motto || motto);
        setAvatarUrl(profileData.avatarUrl || null);
        setBannerUrl(profileData.bannerUrl || null);
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
      month: "2-digit",
      day: "2-digit",
    });
  };

  // 时间进度
  const now = new Date();
  const dayProgress = ((now.getHours() * 60 + now.getMinutes()) / (24 * 60)) * 100;
  const weekProgress = ((now.getDay() || 7) / 7) * 100;
  const monthProgress = (now.getDate() / new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()) * 100;
  const yearProgress = ((now.getMonth() * 31 + now.getDate()) / 365) * 100;

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: 40 }}>
        <Spin />
      </div>
    );
  }

  return (
    <div className="blog-sidebar">
      {/* 个人简介 */}
      <Card className="blog-sidebar-card sidebar-profile">
        <div
          className="sidebar-profile-banner"
          style={
            bannerUrl
              ? {
                  backgroundImage: `url(${bannerUrl})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }
              : undefined
          }
        />
        <div className="sidebar-profile-avatar">
          {avatarUrl ? (
            <Image src={avatarUrl} alt="头像" width={80} height={80} style={{ objectFit: "cover" }} />
          ) : (
            <span className="sidebar-profile-avatar-icon">V</span>
          )}
        </div>
        <div className="sidebar-profile-content">
          <p className="sidebar-profile-motto">{motto}</p>
          <div className="sidebar-profile-stats">
            <div className="sidebar-profile-stat">
              <span className="sidebar-profile-stat-num">{postCount}</span>
              <span className="sidebar-profile-stat-label">文章数</span>
            </div>
            <div className="sidebar-profile-stat-divider" />
            <div className="sidebar-profile-stat">
              <span className="sidebar-profile-stat-num">
                {commentCount.toLocaleString()}
              </span>
              <span className="sidebar-profile-stat-label">评论量</span>
            </div>
          </div>
        </div>
      </Card>

      {/* 时间进度 */}
      <Card
        title={
          <span className="sidebar-card-title">
            <ClockCircleOutlined /> 时间进度
          </span>
        }
        className="blog-sidebar-card"
      >
        <div className="sidebar-progress-list">
          <div className="sidebar-progress-item">
            <span>今日</span>
            <div className="sidebar-progress-bar">
              <div className="sidebar-progress-fill" style={{ width: `${dayProgress}%` }} />
            </div>
            <span>{Math.round(dayProgress)}%</span>
          </div>
          <div className="sidebar-progress-item">
            <span>本周</span>
            <div className="sidebar-progress-bar">
              <div className="sidebar-progress-fill" style={{ width: `${weekProgress}%` }} />
            </div>
            <span>{Math.round(weekProgress)}%</span>
          </div>
          <div className="sidebar-progress-item">
            <span>本月</span>
            <div className="sidebar-progress-bar">
              <div className="sidebar-progress-fill" style={{ width: `${monthProgress}%` }} />
            </div>
            <span>{Math.round(monthProgress)}%</span>
          </div>
          <div className="sidebar-progress-item">
            <span>今年</span>
            <div className="sidebar-progress-bar">
              <div className="sidebar-progress-fill" style={{ width: `${yearProgress}%` }} />
            </div>
            <span>{Math.round(yearProgress)}%</span>
          </div>
        </div>
      </Card>

      {/* Categories */}
      <Card
        title={
          <span className="sidebar-card-title">
            <FolderOutlined /> 分类
          </span>
        }
        className="blog-sidebar-card"
      >
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

      {/* Hot Posts */}
      <Card
        title={
          <span className="sidebar-card-title">
            <FireOutlined /> 热门文章
          </span>
        }
        className="blog-sidebar-card"
      >
        <div className="blog-sidebar-list">
          {hotPosts.map((post) => (
            <Link
              key={post.id}
              href={`/posts/${post.slug}`}
              className="blog-sidebar-item blog-sidebar-hot-item"
            >
              <span className="blog-sidebar-post-title">{post.title}</span>
              <span className="blog-sidebar-date">
                {post.viewCount || 0} 阅读 · {formatDate(post.publishedAt)}
              </span>
            </Link>
          ))}
        </div>
      </Card>

      {/* Recent Posts */}
      <Card
        title={
          <span className="sidebar-card-title">
            <FileTextOutlined /> 最新文章
          </span>
        }
        className="blog-sidebar-card"
      >
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
      <Card
        title={
          <span className="sidebar-card-title">
            <TagsOutlined /> 标签
          </span>
        }
        className="blog-sidebar-card"
      >
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
