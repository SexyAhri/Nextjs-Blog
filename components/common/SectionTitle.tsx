"use client";

import { theme } from "antd";
import type { ReactNode } from "react";

interface SectionTitleProps {
  icon?: ReactNode;
  color?: string;
  children: ReactNode;
}

export function SectionTitle({
  icon,
  color = "#1890ff",
  children,
}: SectionTitleProps) {
  const { token } = theme.useToken();

  if (icon) {
    return (
      <div style={{ display: "flex", alignItems: "center", marginBottom: 20 }}>
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
          {children}
        </span>
      </div>
    );
  }

  return (
    <div style={{ marginBottom: 8, fontWeight: 500, color: token.colorText }}>
      {children}
    </div>
  );
}
