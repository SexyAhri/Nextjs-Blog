"use client";

import { Layout, theme } from "antd";

const { Footer: AntFooter } = Layout;

const CURRENT_YEAR = new Date().getFullYear();

export function Footer() {
  const { token } = theme.useToken();

  return (
    <AntFooter
      style={{
        textAlign: "center",
        padding: "16px 24px",
        background: "transparent",
        color: token.colorTextTertiary,
        fontSize: 13,
      }}
    >
      © {CURRENT_YEAR} VixenAhri Blog
    </AntFooter>
  );
}
