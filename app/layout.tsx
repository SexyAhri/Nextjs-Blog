import type { Metadata } from "next";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { Providers } from "./providers";
import "./globals.css";
import "./blog-simple.css";
import "./admin.css";

export const metadata: Metadata = {
  title: "My Blog",
  description: "个人博客管理系统",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <AntdRegistry>
          <Providers>{children}</Providers>
        </AntdRegistry>
      </body>
    </html>
  );
}
