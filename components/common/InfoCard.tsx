"use client";

import { Card, theme } from "antd";
import type { ReactNode } from "react";

interface InfoCardProps {
  title: string;
  icon: ReactNode;
  color?: string;
  items: Array<{ label: string; value: string | number }>;
}

export function InfoCard({
  title,
  icon,
  color = "#1890ff",
  items,
}: InfoCardProps) {
  const { token } = theme.useToken();

  return (
    <Card size="small" style={{ borderRadius: 12, height: "100%" }}>
      <div style={{ display: "flex", alignItems: "center", marginBottom: 16 }}>
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: 10,
            background: `${color}15`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 20,
            color: color,
          }}
        >
          {icon}
        </div>
        <span
          style={{
            marginLeft: 12,
            color: token.colorText,
            fontSize: 16,
            fontWeight: 600,
          }}
        >
          {title}
        </span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {items.map((item, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "8px 12px",
              background: token.colorFillQuaternary,
              borderRadius: 8,
            }}
          >
            <span style={{ color: token.colorTextSecondary, fontSize: 13 }}>
              {item.label}
            </span>
            <span
              style={{
                color: token.colorText,
                fontSize: 13,
                fontFamily: "monospace",
                fontWeight: 500,
                maxWidth: "60%",
                textAlign: "right",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}
