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
  const switchRef = useRef<HTMLSpanElement>(null);
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

  // 创建涟漪效果（与前台一致）
  const createRipple = (x: number, y: number, toLight: boolean) => {
    const rippleContainer = document.createElement("div");
    rippleContainer.className = "theme-ripple-container";
    rippleContainer.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 99999;
      overflow: hidden;
    `;

    const rippleColor = toLight
      ? "rgba(79, 110, 247, 0.6)"
      : "rgba(255, 255, 255, 0.5)";

    for (let i = 0; i < 3; i++) {
      const ripple = document.createElement("div");
      ripple.className = "theme-ripple";
      ripple.style.cssText = `
        position: absolute;
        left: ${x}px;
        top: ${y}px;
        width: 0;
        height: 0;
        border-radius: 50%;
        transform: translate(-50%, -50%);
        border: 3px solid ${rippleColor};
        box-shadow: 0 0 10px ${rippleColor};
        animation: ripple-wave 0.8s ease-out forwards;
        animation-delay: ${i * 0.12}s;
      `;
      rippleContainer.appendChild(ripple);
    }

    document.body.appendChild(rippleContainer);
    setTimeout(() => rippleContainer.remove(), 1200);
  };

  // 圆形扩散切换主题（与前台一致）
  const handleThemeChange = (checked: boolean) => {
    const newTheme = checked ? "dark" : "light";
    const toLight = !checked;

    const switchEl = switchRef.current;
    const rect = switchEl?.getBoundingClientRect();
    const x = rect ? rect.left + rect.width / 2 : window.innerWidth / 2;
    const y = rect ? rect.top + rect.height / 2 : 0;

    createRipple(x, y, toLight);

    if (!document.startViewTransition) {
      setThemeMode(newTheme);
      return;
    }

    const maxRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    document.documentElement.style.setProperty("--theme-x", `${x}px`);
    document.documentElement.style.setProperty("--theme-y", `${y}px`);
    document.documentElement.style.setProperty("--theme-r", `${maxRadius}px`);

    document.startViewTransition(() => {
      setThemeMode(newTheme);
    });
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
