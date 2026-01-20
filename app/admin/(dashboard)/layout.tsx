"use client";

import { Layout, theme } from "antd";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Spin } from "antd";

const { Content } = Layout;

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { token } = theme.useToken();
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const router = useRouter();

  // 判断是否是文章编辑页面
  const isPostEditPage =
    pathname.includes("/posts/") &&
    (pathname.includes("/edit") || pathname.includes("/new"));

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/admin/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: token.colorBgLayout,
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <Layout style={{ height: "100vh", overflow: "hidden" }}>
      <Sidebar />
      <Layout
        style={{ display: "flex", flexDirection: "column", overflow: "hidden" }}
      >
        <Header />
        <Content
          style={{
            margin: isPostEditPage ? 0 : 12,
            padding: isPostEditPage ? 0 : 12,
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            flex: 1,
          }}
        >
          <div
            key={pathname}
            className="page-content"
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
          >
            {children}
          </div>
        </Content>
        <Footer />
      </Layout>
    </Layout>
  );
}
