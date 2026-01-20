"use client";

import { useState, useEffect } from "react";
import { Table, Tag, Button, Space, App, Tabs, Card } from "antd";
import {
  CheckOutlined,
  CloseOutlined,
  DeleteOutlined,
  MessageOutlined,
} from "@ant-design/icons";

interface Comment {
  id: string;
  author: string;
  email: string;
  content: string;
  approved: boolean;
  createdAt: string;
  post?: { title: string; slug: string };
}

export default function CommentsPage() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("pending");
  const { message, modal } = App.useApp();

  useEffect(() => {
    loadComments(activeTab);
  }, [activeTab]);

  const loadComments = async (status: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/comments?status=${status}`);
      const data = await res.json();
      if (data.success) {
        setComments(data.data);
      }
    } catch (error) {
      message.error("加载失败");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string, approved: boolean) => {
    try {
      const res = await fetch(`/api/admin/comments/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ approved }),
      });
      const data = await res.json();
      if (data.success) {
        message.success(approved ? "已通过" : "已拒绝");
        loadComments(activeTab);
      }
    } catch (error) {
      message.error("操作失败");
    }
  };

  const handleDelete = (id: string) => {
    modal.confirm({
      title: "确认删除",
      content: "确定要删除这条评论吗？",
      okText: "确定",
      cancelText: "取消",
      okButtonProps: { danger: true },
      onOk: async () => {
        try {
          const res = await fetch(`/api/admin/comments/${id}`, {
            method: "DELETE",
          });
          const data = await res.json();
          if (data.success) {
            message.success("已删除");
            loadComments(activeTab);
          }
        } catch (error) {
          message.error("删除失败");
        }
      },
    });
  };

  const columns = [
    {
      title: "评论内容",
      dataIndex: "content",
      key: "content",
      ellipsis: true,
      render: (text: string, record: Comment) => (
        <div>
          <div style={{ fontWeight: 500 }}>{record.author}</div>
          <div style={{ fontSize: 12, color: "#666" }}>{record.email}</div>
          <div style={{ marginTop: 4 }}>{text}</div>
        </div>
      ),
    },
    {
      title: "文章",
      dataIndex: ["post", "title"],
      key: "post",
      width: 200,
      ellipsis: true,
    },
    {
      title: "状态",
      dataIndex: "approved",
      key: "approved",
      width: 80,
      render: (approved: boolean) => (
        <Tag color={approved ? "success" : "warning"}>
          {approved ? "已通过" : "待审核"}
        </Tag>
      ),
    },
    {
      title: "时间",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 160,
      render: (date: string) => new Date(date).toLocaleString("zh-CN"),
    },
    {
      title: "操作",
      key: "action",
      width: 150,
      render: (_: any, record: Comment) => (
        <Space size="small">
          {!record.approved && (
            <Button
              type="link"
              size="small"
              icon={<CheckOutlined />}
              onClick={() => handleApprove(record.id, true)}
            >
              通过
            </Button>
          )}
          {record.approved && (
            <Button
              type="link"
              size="small"
              icon={<CloseOutlined />}
              onClick={() => handleApprove(record.id, false)}
            >
              拒绝
            </Button>
          )}
          <Button
            type="link"
            size="small"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  const pendingCount = comments.filter((c) => !c.approved).length;

  return (
    <Card>
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={[
          {
            key: "pending",
            label: (
              <span>
                <MessageOutlined /> 待审核
                {activeTab !== "pending" && pendingCount > 0 && (
                  <Tag color="red" style={{ marginLeft: 8 }}>
                    {pendingCount}
                  </Tag>
                )}
              </span>
            ),
          },
          { key: "approved", label: "已通过" },
          { key: "all", label: "全部" },
        ]}
      />
      <Table
        columns={columns}
        dataSource={comments}
        rowKey="id"
        loading={loading}
        size="small"
        pagination={{ pageSize: 15 }}
      />
    </Card>
  );
}
