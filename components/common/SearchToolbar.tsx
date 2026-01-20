"use client";

import { Space, Input, Select, Button, DatePicker, theme } from "antd";
import {
  SearchOutlined,
  ReloadOutlined,
  PlusOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import type { ReactNode } from "react";

const { RangePicker } = DatePicker;

interface SearchToolbarProps {
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  statusValue?: string;
  onStatusChange?: (value: string | undefined) => void;
  statusOptions?: { value: string; label: string }[];
  onReset?: () => void;
  onAdd?: () => void;
  addText?: string;
  showDateRange?: boolean;
  showClear?: boolean;
  onClear?: () => void;
  extra?: ReactNode;
}

export function SearchToolbar({
  searchPlaceholder = "请输入搜索内容",
  searchValue,
  onSearchChange,
  statusValue,
  onStatusChange,
  statusOptions = [
    { value: "active", label: "正常" },
    { value: "disabled", label: "停用" },
  ],
  onReset,
  onAdd,
  addText = "新增",
  showDateRange = false,
  showClear = false,
  onClear,
  extra,
}: SearchToolbarProps) {
  const { token } = theme.useToken();

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "16px 20px",
        background: `linear-gradient(135deg, ${token.colorBgContainer} 0%, ${token.colorBgLayout} 100%)`,
        borderRadius: 12,
        border: `1px solid ${token.colorBorderSecondary}`,
        boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
      }}
    >
      <Space size={12} wrap>
        {onSearchChange && (
          <Input
            placeholder={searchPlaceholder}
            prefix={
              <SearchOutlined
                style={{ color: token.colorPrimary, fontSize: 16 }}
              />
            }
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            style={{
              width: 260,
              borderRadius: 8,
            }}
            allowClear
            size="middle"
          />
        )}
        {onStatusChange && (
          <Select
            placeholder="筛选状态"
            value={statusValue}
            onChange={onStatusChange}
            style={{ width: 120, borderRadius: 8 }}
            allowClear
            options={statusOptions}
            size="middle"
          />
        )}
        {showDateRange && <RangePicker style={{ borderRadius: 8 }} />}
        {onReset && (
          <Button
            icon={<ReloadOutlined />}
            onClick={onReset}
            style={{ borderRadius: 8 }}
          >
            重置
          </Button>
        )}
        {showClear && onClear && (
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={onClear}
            style={{ borderRadius: 8 }}
          >
            清空
          </Button>
        )}
        {extra}
      </Space>
      <Space size={12}>
        {onAdd && (
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={onAdd}
            size="middle"
            style={{
              borderRadius: 8,
              boxShadow: `0 2px 8px ${token.colorPrimary}30`,
              fontWeight: 500,
            }}
          >
            {addText}
          </Button>
        )}
      </Space>
    </div>
  );
}
