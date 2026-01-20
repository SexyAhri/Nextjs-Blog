"use client";

import { useRef } from "react";
import {
  Layout,
  Breadcrumb,
  Dropdown,
  Avatar,
  Switch,
  Space,
  theme,
  App,
} from "antd";
import {
  UserOutlined,
  LogoutOutlined,
  SunOutlined,
  MoonOutlined,
} from "@ant-design/icons";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "@/app/providers";
import { useSession, signOut } from "next-auth/react";

const { Header: AntHeader } = Layout;

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { themeMode, setThemeMode } = useTheme();
  const { token } = theme.useToken();
  const switchRef = useRef<HTMLElement>(null);
  const { data: session } = useSession();
  const { message, modal } = App.useApp();

  const user = session?.user;

  const getBreadcrumbItems = () => {
    const items = [{ title: "首页", path: "/admin" }];

    if (pathname.startsWith("/admin/posts")) {
      items.push({ title: "文章管理", path: "/admin/posts" });
      if (pathname.includes("/new")) {
        items.push({ title: "写新文章", path: "/admin/posts/new" });
      } else if (pathname.includes("/edit")) {
        items.push({ title: "编辑文章", path: pathname });
      }
    } else if (pathname.startsWith("/admin/categories")) {
      items.push({ title: "分类管理", path: "/admin/categories" });
    } else if (pathname.startsWith("/admin/tags")) {
      items.push({ title: "标签管理", path: "/admin/tags" });
    } else if (pathname.startsWith("/admin/media")) {
      items.push({ title: "媒体库", path: "/admin/media" });
    } else if (pathname.startsWith("/admin/settings")) {
      items.push({ title: "网站设置", path: "/admin/settings" });
    } else if (pathname.startsWith("/admin/profile")) {
      items.push({ title: "个人信息", path: "/admin/profile" });
    }

    return items.map((item, index) => ({
      title:
        index < items.length - 1 ? (
          <a
            onClick={() => router.push(item.path)}
            style={{ cursor: "pointer" }}
          >
            {item.title}
          </a>
        ) : (
          item.title
        ),
    }));
  };

  const handleThemeChange = async (checked: boolean) => {
    const newTheme = checked ? "dark" : "light";
    setThemeMode(newTheme);
  };

  const handleMenuClick = ({ key }: { key: string }) => {
    if (key === "profile") {
      router.push("/admin/profile");
    } else if (key === "logout") {
      modal.confirm({
        title: "确认退出",
        content: "确定要退出登录吗？",
        okText: "确定",
        cancelText: "取消",
        onOk: async () => {
          try {
            await signOut({ callbackUrl: "/admin/login" });
            message.success("退出登录成功");
          } catch (error) {
            console.error("Logout error:", error);
            message.error("退出登录失败");
          }
        },
      });
    }
  };

  const userMenuItems = [
    { key: "profile", icon: <UserOutlined />, label: "个人信息" },
    { type: "divider" as const },
    { key: "logout", icon: <LogoutOutlined />, label: "退出登录" },
  ];

  return (
    <AntHeader
      style={{
        padding: "0 24px",
        height: 64,
        lineHeight: "64px",
        background: token.colorBgContainer,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottom: `1px solid ${token.colorBorderSecondary}`,
      }}
    >
      <Breadcrumb items={getBreadcrumbItems()} />

      <Space size="middle">
        <span ref={switchRef}>
          <Switch
            checkedChildren={<MoonOutlined />}
            unCheckedChildren={<SunOutlined />}
            checked={themeMode === "dark"}
            onChange={handleThemeChange}
          />
        </span>
        <Dropdown
          menu={{ items: userMenuItems, onClick: handleMenuClick }}
          placement="bottomRight"
        >
          <Space style={{ cursor: "pointer" }}>
            <Avatar
              size={32}
              src={user?.image}
              style={{ backgroundColor: "#2563eb" }}
            >
              {user?.name?.charAt(0).toUpperCase() || "V"}
            </Avatar>
            <span style={{ color: token.colorText, fontWeight: 500 }}>
              {user?.name || "Ahri"}
            </span>
          </Space>
        </Dropdown>
      </Space>
    </AntHeader>
  );
}
