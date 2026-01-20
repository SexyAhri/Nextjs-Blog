"use client";

import { theme } from "antd";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { token } = theme.useToken();

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: token.colorBgLayout,
      }}
    >
      {children}
    </div>
  );
}
