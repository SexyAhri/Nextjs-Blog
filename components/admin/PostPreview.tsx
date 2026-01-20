"use client";

import { Modal, Typography, Tag, Space, Divider } from "antd";
import {
  CalendarOutlined,
  UserOutlined,
  FolderOutlined,
  TagOutlined,
  EyeOutlined,
} from "@ant-design/icons";

const { Title, Paragraph, Text } = Typography;

interface PostPreviewProps {
  open: boolean;
  onClose: () => void;
  post: {
    title: string;
    content: string;
    excerpt?: string;
    coverImage?: string;
    category?: { name: string };
    tags?: Array<{ tag: { name: string } }>;
    author?: { name: string; email: string };
    createdAt?: string;
    viewCount?: number;
  };
}

export default function PostPreview({ open, onClose, post }: PostPreviewProps) {
  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width={900}
      title={
        <Space>
          <EyeOutlined />
          <span>文章预览</span>
        </Space>
      }
      styles={{
        body: {
          maxHeight: "70vh",
          overflowY: "auto",
        },
      }}
    >
      <div style={{ padding: "20px 0" }}>
        {/* 封面图片 */}
        {post.coverImage && (
          <div
            style={{
              marginBottom: 24,
              borderRadius: 8,
              overflow: "hidden",
            }}
          >
            <img
              src={post.coverImage}
              alt={post.title}
              style={{
                width: "100%",
                maxHeight: 400,
                objectFit: "cover",
              }}
            />
          </div>
        )}

        {/* 标题 */}
        <Title level={1} style={{ marginBottom: 16, fontSize: 32 }}>
          {post.title}
        </Title>

        {/* 元信息 */}
        <Space
          split={<Divider type="vertical" />}
          style={{ marginBottom: 24, color: "#666" }}
        >
          {post.author && (
            <Space size={4}>
              <UserOutlined />
              <Text type="secondary">{post.author.name}</Text>
            </Space>
          )}
          {post.createdAt && (
            <Space size={4}>
              <CalendarOutlined />
              <Text type="secondary">
                {new Date(post.createdAt).toLocaleDateString("zh-CN", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </Text>
            </Space>
          )}
          {post.category && (
            <Space size={4}>
              <FolderOutlined />
              <Text type="secondary">{post.category.name}</Text>
            </Space>
          )}
          {post.viewCount !== undefined && (
            <Space size={4}>
              <EyeOutlined />
              <Text type="secondary">{post.viewCount} 次浏览</Text>
            </Space>
          )}
        </Space>

        {/* 标签 */}
        {post.tags && post.tags.length > 0 && (
          <div style={{ marginBottom: 24 }}>
            <Space size={[0, 8]} wrap>
              <TagOutlined style={{ color: "#999" }} />
              {post.tags.map((item, index) => (
                <Tag key={index} color="blue">
                  {item.tag.name}
                </Tag>
              ))}
            </Space>
          </div>
        )}

        {/* 摘要 */}
        {post.excerpt && (
          <div
            style={{
              padding: 16,
              background: "#f5f5f5",
              borderLeft: "4px solid #722ed1",
              marginBottom: 24,
              borderRadius: 4,
            }}
          >
            <Text style={{ fontSize: 15, lineHeight: 1.6 }}>
              {post.excerpt}
            </Text>
          </div>
        )}

        <Divider />

        {/* 正文内容 */}
        <div
          className="post-preview-content"
          dangerouslySetInnerHTML={{ __html: post.content }}
          style={{
            fontSize: 16,
            lineHeight: 1.8,
            color: "#333",
          }}
        />
      </div>
    </Modal>
  );
}
