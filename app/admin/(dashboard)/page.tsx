"use client";

import { useState, useEffect } from "react";
import { Row, Col, Spin, Card, Table, Tag, Button, Space } from "antd";
import {
  FileTextOutlined,
  CheckCircleOutlined,
  FolderOutlined,
  TagOutlined,
  PlusOutlined,
  PictureOutlined,
} from "@ant-design/icons";
import { MetricCard } from "@/components/common";
import Link from "next/link";
import { formatDate } from "@/lib/utils";

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    postCount: 0,
    categoryCount: 0,
    tagCount: 0,
    publishedCount: 0,
    draftCount: 0,
  });
  const [recentPosts, setRecentPosts] = useState<any[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [postsRes, categoriesRes, tagsRes] = await Promise.all([
        fetch("/api/admin/posts"),
        fetch("/api/admin/categories"),
        fetch("/api/admin/tags"),
      ]);

      const postsData = await postsRes.json();
      const categoriesData = await categoriesRes.json();
      const tagsData = await tagsRes.json();

      if (postsData.success) {
        const posts = postsData.data;
        setRecentPosts(posts.slice(0, 5));
        setStats({
          postCount: posts.length,
          categoryCount: categoriesData.success
            ? categoriesData.data.length
            : 0,
          tagCount: tagsData.success ? tagsData.data.length : 0,
          publishedCount: posts.filter((p: any) => p.published).length,
          draftCount: posts.filter((p: any) => !p.published).length,
        });
      }
    } catch (error) {
      console.error("Failed to load data:", error);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: "标题",
      dataIndex: "title",
      key: "title",
      render: (text: string, record: any) => (
        <Link
          href={`/admin/posts/${record.id}/edit`}
          style={{ color: "#1890ff" }}
        >
          {text}
        </Link>
      ),
    },
    {
      title: "分类",
      dataIndex: ["category", "name"],
      key: "category",
      width: 120,
      render: (text: string) =>
        text || <span style={{ color: "#999" }}>-</span>,
    },
    {
      title: "状态",
      dataIndex: "published",
      key: "published",
      width: 70,
      render: (published: boolean) => (
        <Tag color={published ? "success" : "warning"} style={{ margin: 0 }}>
          {published ? "已发布" : "草稿"}
        </Tag>
      ),
    },
    {
      title: "浏览",
      dataIndex: "viewCount",
      key: "viewCount",
      width: 120,
      render: (count: number) => count,
    },
    {
      title: "时间",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 120,
      render: (date: Date) => new Date(date).toLocaleDateString("zh-CN"),
    },
  ];

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: 100 }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div>
      {/* 统计卡片 + 快速操作 */}
      <Row gutter={12}>
        <Col xs={12} lg={5}>
          <MetricCard
            title="文章"
            value={stats.postCount}
            icon={<FileTextOutlined />}
            color="#1890ff"
          />
        </Col>
        <Col xs={12} lg={5}>
          <MetricCard
            title="已发布"
            value={stats.publishedCount}
            icon={<CheckCircleOutlined />}
            color="#52c41a"
          />
        </Col>
        <Col xs={12} lg={5}>
          <MetricCard
            title="分类"
            value={stats.categoryCount}
            icon={<FolderOutlined />}
            color="#1890ff"
          />
        </Col>
        <Col xs={12} lg={5}>
          <MetricCard
            title="标签"
            value={stats.tagCount}
            icon={<TagOutlined />}
            color="#faad14"
          />
        </Col>
        <Col xs={24} lg={4}>
          <Card size="small" styles={{ body: { padding: 12 } }}>
            <Space orientation="vertical" style={{ width: "100%" }} size={6}>
              <Link href="/admin/posts/new">
                <Button
                  type="primary"
                  block
                  size="small"
                  icon={<PlusOutlined />}
                >
                  写新文章
                </Button>
              </Link>
              <Link href="/admin/media">
                <Button block size="small" icon={<PictureOutlined />}>
                  媒体库
                </Button>
              </Link>
              <Link href="/admin/categories">
                <Button block size="small" icon={<FolderOutlined />}>
                  分类管理
                </Button>
              </Link>
              <Link href="/admin/tags">
                <Button block size="small" icon={<TagOutlined />}>
                  标签管理
                </Button>
              </Link>
            </Space>
          </Card>
        </Col>
      </Row>

      {/* 最近文章 */}
      <Card
        title="最近文章"
        size="small"
        style={{ marginTop: 12 }}
        extra={
          <Link href="/admin/posts">
            <Button type="link" size="small">
              查看全部
            </Button>
          </Link>
        }
        styles={{ body: { padding: recentPosts.length === 0 ? 24 : 0 } }}
      >
        {recentPosts.length === 0 ? (
          <div style={{ textAlign: "center", padding: "30px 0" }}>
            <FileTextOutlined
              style={{ fontSize: 36, color: "#d9d9d9", marginBottom: 12 }}
            />
            <p style={{ color: "#999", marginBottom: 12 }}>还没有文章</p>
            <Link href="/admin/posts/new">
              <Button type="primary" size="small">
                写新文章
              </Button>
            </Link>
          </div>
        ) : (
          <Table
            columns={columns}
            dataSource={recentPosts}
            rowKey="id"
            pagination={false}
            size="small"
          />
        )}
      </Card>
    </div>
  );
}
