"use client";

import { useRef } from "react";
import Link from "next/link";
import { useState } from "react";
import { Input, Switch } from "antd";
import {
  SearchOutlined,
  MenuOutlined,
  CloseOutlined,
  SunOutlined,
  MoonOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { useTheme } from "@/app/providers";

export default function BlogHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const router = useRouter();
  const { themeMode, setThemeMode } = useTheme();
  const switchRef = useRef<HTMLSpanElement>(null);

  const handleSearch = () => {
    if (searchValue.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchValue)}`);
      setSearchValue("");
    }
  };

  // 创建涟漪效果（参考 db-admin-dashboard）
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

  // 圆形扩散切换主题（参考 db-admin-dashboard）
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

  const menuItems = [
    { label: "首页", href: "/" },
    { label: "分类", href: "/categories" },
    { label: "归档", href: "/archive" },
    { label: "关于", href: "/about" },
  ];

  return (
    <header className="blog-header">
      <div className="blog-header-container">
        {/* Logo */}
        <Link href="/" className="blog-logo">
          <span className="blog-logo-text">VixenAhri</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="blog-nav desktop-nav">
          {menuItems.map((item) => (
            <Link key={item.href} href={item.href} className="blog-nav-link">
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Search & Theme Toggle */}
        <div className="blog-header-actions">
          <div className="blog-search">
            <Input
              placeholder="搜索文章..."
              prefix={<SearchOutlined style={{ color: "var(--blog-text-muted)" }} />}
              value={searchValue}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchValue(e.target.value)}
              onPressEnter={handleSearch}
            />
          </div>
          <span ref={switchRef} className="blog-theme-toggle-wrap">
            <Switch
              checkedChildren={<MoonOutlined />}
              unCheckedChildren={<SunOutlined />}
              checked={themeMode === "dark"}
              onChange={handleThemeChange}
              aria-label={themeMode === "light" ? "切换到暗色模式" : "切换到亮色模式"}
            />
          </span>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="mobile-menu-button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="菜单"
        >
          {mobileMenuOpen ? <CloseOutlined /> : <MenuOutlined />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <nav className="blog-nav mobile-nav">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="blog-nav-link"
              onClick={() => setMobileMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
