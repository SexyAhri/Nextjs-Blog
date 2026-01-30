"use client";

import Link from "next/link";
import { useState } from "react";
import { Input } from "antd";
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

  const handleSearch = () => {
    if (searchValue.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchValue)}`);
      setSearchValue("");
    }
  };

  const toggleTheme = () => {
    setThemeMode(themeMode === "light" ? "dark" : "light");
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
          <button
            className="blog-theme-toggle"
            onClick={toggleTheme}
            aria-label={themeMode === "light" ? "切换到暗色模式" : "切换到亮色模式"}
          >
            {themeMode === "light" ? <MoonOutlined /> : <SunOutlined />}
          </button>
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
