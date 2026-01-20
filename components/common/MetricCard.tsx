"use client";

import { Card, Progress, theme } from "antd";
import type { ReactNode } from "react";

interface MetricCardProps {
  title: string;
  value: string | number;
  suffix?: string;
  icon: ReactNode;
  percent?: number;
  color?: string;
}

export function MetricCard({
  title,
  value,
  suffix,
  icon,
  percent = 0,
  color = "#1890ff",
}: MetricCardProps) {
  const { token } = theme.useToken();

  return (
    <Card
      size="small"
      style={{
        borderRadius: 12,
        height: "100%",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", marginBottom: 12 }}>
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
            color: token.colorTextSecondary,
            fontSize: 14,
          }}
        >
          {title}
        </span>
      </div>

      <div
        style={{
          fontSize: 28,
          fontWeight: 600,
          color: token.colorText,
          fontFamily: "monospace",
        }}
      >
        {value}
        <span
          style={{
            fontSize: 14,
            color: token.colorTextSecondary,
            marginLeft: 4,
            fontWeight: 400,
          }}
        >
          {suffix}
        </span>
      </div>

      <Progress
        percent={percent}
        showInfo={false}
        strokeColor={color}
        railColor={token.colorBorderSecondary}
        style={{ marginTop: 12 }}
        size="small"
      />
    </Card>
  );
}
