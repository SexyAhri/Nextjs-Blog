"use client";

import { useState, useEffect } from "react";
import {
  Modal,
  Upload,
  Image,
  Button,
  Space,
  App,
  Empty,
  Spin,
  Row,
  Col,
  Card,
  Input,
} from "antd";
import { UploadOutlined, SearchOutlined } from "@ant-design/icons";

interface Media {
  id: string;
  filename: string;
  filepath: string;
  mimetype: string;
  size: number;
  type: string;
  alt?: string;
  title?: string;
  createdAt: string;
}

interface ImagePickerProps {
  open: boolean;
  onClose: () => void;
  onSelect: (filepath: string) => void;
  value?: string;
}

export default function ImagePicker({
  open,
  onClose,
  onSelect,
  value,
}: ImagePickerProps) {
  const [media, setMedia] = useState<Media[]>([]);
  const [filteredMedia, setFilteredMedia] = useState<Media[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | undefined>(value);
  const [searchText, setSearchText] = useState("");
  const { message } = App.useApp();

  useEffect(() => {
    if (open) {
      loadMedia();
      setSelectedImage(value);
    }
  }, [open, value]);

  useEffect(() => {
    if (searchText) {
      const filtered = media.filter(
        (item) =>
          item.filename.toLowerCase().includes(searchText.toLowerCase()) ||
          item.title?.toLowerCase().includes(searchText.toLowerCase()) ||
          item.alt?.toLowerCase().includes(searchText.toLowerCase()),
      );
      setFilteredMedia(filtered);
    } else {
      setFilteredMedia(media);
    }
  }, [searchText, media]);

  const loadMedia = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/media?type=image");
      const data = await res.json();
      if (data.success) {
        setMedia(data.data);
        setFilteredMedia(data.data);
      }
    } catch (error) {
      message.error("加载失败");
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (file: File) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/admin/media", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.success) {
        message.success("上传成功");
        loadMedia();
      } else {
        message.error(data.error || "上传失败");
      }
    } catch (error) {
      message.error("上传失败");
    } finally {
      setUploading(false);
    }
    return false;
  };

  const handleSelect = () => {
    if (selectedImage) {
      onSelect(selectedImage);
      onClose();
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + " KB";
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  };

  return (
    <Modal
      title="选择图片"
      open={open}
      onCancel={onClose}
      onOk={handleSelect}
      okText="确定"
      cancelText="取消"
      width={900}
      okButtonProps={{ disabled: !selectedImage }}
    >
      <div style={{ marginBottom: 16 }}>
        <Space style={{ width: "100%", justifyContent: "space-between" }}>
          <Input
            placeholder="搜索图片..."
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 300 }}
          />
          <Upload
            beforeUpload={handleUpload}
            showUploadList={false}
            accept="image/*"
            multiple
          >
            <Button
              type="primary"
              icon={<UploadOutlined />}
              loading={uploading}
            >
              上传图片
            </Button>
          </Upload>
        </Space>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: 50 }}>
          <Spin size="large" />
        </div>
      ) : filteredMedia.length === 0 ? (
        <Empty description="暂无图片" style={{ padding: 50 }} />
      ) : (
        <div style={{ maxHeight: 500, overflowY: "auto" }}>
          <Row gutter={[16, 16]}>
            {filteredMedia.map((item) => (
              <Col xs={12} sm={8} md={6} key={item.id}>
                <Card
                  hoverable
                  onClick={() => setSelectedImage(item.filepath)}
                  style={{
                    border:
                      selectedImage === item.filepath
                        ? "2px solid #1890ff"
                        : "1px solid #d9d9d9",
                  }}
                  cover={
                    <div
                      style={{
                        height: 120,
                        overflow: "hidden",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: "#f5f5f5",
                      }}
                    >
                      <Image
                        src={item.filepath}
                        alt={item.alt || item.filename}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                        preview={false}
                      />
                    </div>
                  }
                >
                  <Card.Meta
                    title={
                      <div
                        style={{
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          fontSize: 12,
                        }}
                      >
                        {item.title || item.filename}
                      </div>
                    }
                    description={
                      <div style={{ fontSize: 11 }}>
                        {formatFileSize(item.size)}
                      </div>
                    }
                  />
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      )}
    </Modal>
  );
}
