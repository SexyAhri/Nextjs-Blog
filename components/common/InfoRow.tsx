"use client";

import { theme } from "antd";

interface InfoRowProps {
  label: string;
  value: string | number;
  labelWidth?: string;
}

export function InfoRow({ label, value, labelWidth }: InfoRowProps) {
  const { token } = theme.useToken();

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        marginBottom: 12,
      }}
    >
      <span style={{ color: token.colorTextSecondary, width: labelWidth }}>
        {label}
      </span>
      <span style={{ color: token.colorText, flex: 1, textAlign: "right" }}>
        {value}
      </span>
    </div>
  );
}
