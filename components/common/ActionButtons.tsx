"use client";

import { Button, Space, Popconfirm } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import type { ReactNode } from "react";

interface ActionButtonsProps {
  onEdit?: () => void;
  onDelete?: () => void;
  onView?: () => void;
  onAdd?: () => void;
  deleteConfirmTitle?: string;
  extra?: ReactNode;
}

export function ActionButtons({
  onEdit,
  onDelete,
  onView,
  onAdd,
  deleteConfirmTitle = "确定删除?",
  extra,
}: ActionButtonsProps) {
  return (
    <Space>
      {onAdd && (
        <Button
          type="link"
          size="small"
          icon={<PlusOutlined />}
          onClick={onAdd}
        >
          新增
        </Button>
      )}
      {onView && (
        <Button
          type="link"
          size="small"
          icon={<EyeOutlined />}
          onClick={onView}
        >
          查看
        </Button>
      )}
      {onEdit && (
        <Button
          type="link"
          size="small"
          icon={<EditOutlined />}
          onClick={onEdit}
        >
          编辑
        </Button>
      )}
      {onDelete && (
        <Popconfirm title={deleteConfirmTitle} onConfirm={onDelete}>
          <Button type="link" size="small" danger icon={<DeleteOutlined />}>
            删除
          </Button>
        </Popconfirm>
      )}
      {extra}
    </Space>
  );
}
