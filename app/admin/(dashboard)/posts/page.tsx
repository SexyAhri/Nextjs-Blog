"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Row, Col, Tag, Button, Space, App } from "antd";
import {
  FileTextOutlined,
  CheckCircleOutlined,
  EditOutlined,
  PlusOutlined,
  EyeOutlined,
  DeleteOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { MetricCard, DataTable, ActionButtons } from "@/components/common";
import Link from "next/link";

interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  published: boolean;
  featured: boolean;
  categoryId?: string;
  category?: { id: string; name: string };
  tags?: Array<{ tag: { id: string; name: string } }>;
  author: { name: string; email: string };
  viewCount: number;
  createdAt: string;
  updatedAt: string;
}

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const router = useRouter();
  const { message, modal } = App.useApp();

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/posts");
      const data = await res.json();
      if (data.success) {
        setPosts(data.data);
      }
    } catch (error) {
      message.error("加载失败");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id: string) => {
    modal.confirm({
      title: "确认删除",
      content: "确定要删除这篇文章吗？",
      okText: "确定",
      cancelText: "取消",
      okButtonProps: { danger: true },
      onOk: async () => {
        try {
          const res = await fetch(`/api/admin/posts/${id}`, {
            method: "DELETE",
          });
          const data = await res.json();
          if (data.success) {
            message.success("删除成功");
            loadPosts();
          } else {
            message.error(data.error || "删除失败");
          }
        } catch (error) {
          message.error("删除失败");
        }
      },
    });
  };

  const handleBatchDelete = () => {
    modal.confirm({
      title: "批量删除",
      content: (
        <div>
          <p>确定要删除选中的 {selectedRowKeys.length} 篇文章吗？</p>
          <p style={{ color: "#ff4d4f", fontSize: 12 }}>⚠️ 此操作不可恢复</p>
        </div>
      ),
      okText: "确定删除",
      cancelText: "取消",
      okButtonProps: { danger: true },
      onOk: async () => {
        try {
          const results = await Promise.all(
            selectedRowKeys.map((id) =>
              fetch(`/api/admin/posts/${id}`, { method: "DELETE" }),
            ),
          );
          const successCount = results.filter(
            (r) => r.ok || r.status === 200,
          ).length;
          message.success(`成功删除 ${successCount} 篇文章`);
          setSelectedRowKeys([]);
          loadPosts();
        } catch (error) {
          message.error("批量删除失败");
        }
      },
    });
  };

  const handleBatchPublish = async (publish: boolean) => {
    try {
      const results = await Promise.all(
        selectedRowKeys.map((id) =>
          fetch(`/api/admin/posts/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ published: publish }),
          }),
        ),
      );
      const successCount = results.filter(
        (r) => r.ok || r.status === 200,
      ).length;
      message.success(
        `成功${publish ? "发布" : "取消发布"} ${successCount} 篇文章`,
      );
      setSelectedRowKeys([]);
      loadPosts();
    } catch (error) {
      message.error("批量操作失败");
    }
  };

  const publishedCount = posts.filter((p) => p.published).length;
  const draftCount = posts.filter((p) => !p.published).length;

  const rowSelection = {
    selectedRowKeys,
    onChange: (keys: React.Key[]) => setSelectedRowKeys(keys as string[]),
  };

  const columns = [
    {
      title: "标题",
      dataIndex: "title",
      key: "title",
      width: "30%",
      render: (text: string, record: Post) => (
        <div>
          <div style={{ fontWeight: 500 }}>{text}</div>
          <div style={{ fontSize: 12, color: "#999", marginTop: 4 }}>
            作者: {record.author?.name || record.author?.email}
          </div>
        </div>
      ),
    },
    {
      title: "分类",
      dataIndex: ["category", "name"],
      key: "category",
      width: "12%",
      render: (text: string) =>
        text || <span style={{ color: "#999" }}>未分类</span>,
    },
    {
      title: "状态",
      dataIndex: "published",
      key: "published",
      width: "10%",
      render: (published: boolean) => (
        <Tag
          icon={published ? <CheckCircleOutlined /> : <EditOutlined />}
          color={published ? "success" : "warning"}
        >
          {published ? "已发布" : "草稿"}
        </Tag>
      ),
    },
    {
      title: "浏览",
      dataIndex: "viewCount",
      key: "viewCount",
      width: "10%",
      render: (count: number) => `${count} 次`,
    },
    {
      title: "创建时间",
      dataIndex: "createdAt",
      key: "createdAt",
      width: "15%",
      render: (date: string) =>
        new Date(date).toLocaleDateString("zh-CN", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
    },
    {
      title: "操作",
      key: "action",
      width: "13%",
      render: (_: any, record: Post) => (
        <Space size="small">
          <Button
            type="link"
            size="small"
            onClick={() => router.push(`/admin/posts/${record.id}/edit`)}
          >
            编辑
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => window.open(`/posts/${record.slug}`, "_blank")}
          >
            查看
          </Button>
          <Button
            type="link"
            size="small"
            danger
            onClick={() => handleDelete(record.id)}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={8}>
          <MetricCard
            title="总文章数"
            value={posts.length}
            icon={<FileTextOutlined />}
            color="#1890ff"
          />
        </Col>
        <Col xs={24} sm={8}>
          <MetricCard
            title="已发布"
            value={publishedCount}
            icon={<CheckCircleOutlined />}
            color="#52c41a"
          />
        </Col>
        <Col xs={24} sm={8}>
          <MetricCard
            title="草稿"
            value={draftCount}
            icon={<EditOutlined />}
            color="#faad14"
          />
        </Col>
      </Row>

      <DataTable
        cardTitle="文章列表"
        cardExtra={
          <Space>
            <Button icon={<ReloadOutlined />} onClick={loadPosts}>
              刷新
            </Button>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => router.push("/admin/posts/new")}
            >
              写新文章
            </Button>
          </Space>
        }
        columns={columns}
        dataSource={posts}
        rowKey="id"
        loading={loading}
        rowSelection={rowSelection}
        style={{ marginTop: 16 }}
        cardChildren={
          selectedRowKeys.length > 0 && (
            <div
              style={{
                marginBottom: 16,
                padding: 12,
                background: "#f0f5ff",
                borderRadius: 8,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span style={{ color: "#1890ff", fontWeight: 500 }}>
                已选择 {selectedRowKeys.length} 项
              </span>
              <Space>
                <Button
                  size="small"
                  icon={<CheckCircleOutlined />}
                  onClick={() => handleBatchPublish(true)}
                >
                  批量发布
                </Button>
                <Button
                  size="small"
                  icon={<EditOutlined />}
                  onClick={() => handleBatchPublish(false)}
                >
                  取消发布
                </Button>
                <Button
                  size="small"
                  danger
                  icon={<DeleteOutlined />}
                  onClick={handleBatchDelete}
                >
                  批量删除
                </Button>
                <Button size="small" onClick={() => setSelectedRowKeys([])}>
                  取消选择
                </Button>
              </Space>
            </div>
          )
        }
      />
    </div>
  );
}
