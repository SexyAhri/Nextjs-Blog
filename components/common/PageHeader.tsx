"use client";

import { Space, Tag, Button } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import type { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  tags?: Array<{ label: string; color?: string }>;
  extra?: ReactNode;
  onBack?: () => void;
}

export function PageHeader({
  title,
  subtitle,
  tags,
  extra,
  onBack,
}: PageHeaderProps) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 24,
      }}
    >
      <Space size="middle">
        {onBack && (
          <Button
            type="text"
            icon={<ArrowLeftOutlined />}
            onClick={onBack}
            style={{ padding: "4px 8px" }}
          />
        )}
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 20, fontWeight: 600 }}>{title}</span>
            {tags?.map((tag, index) => (
              <Tag key={index} color={tag.color}>
                {tag.label}
              </Tag>
            ))}
          </div>
          {subtitle && (
            <div style={{ color: "#999", fontSize: 14, marginTop: 4 }}>
              {subtitle}
            </div>
          )}
        </div>
      </Space>
      {extra && <div>{extra}</div>}
    </div>
  );
}
