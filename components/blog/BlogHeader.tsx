"use client";

import Link from "next/link";
import { useState } from "react";
import { Input } from "antd";
import { SearchOutlined, MenuOutlined, CloseOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";

export default function BlogHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const router = useRouter();

  const handleSearch = () => {
    if (searchValue.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchValue)}`);
      setSearchValue("");
    }
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

        {/* Search */}
        <div className="blog-search">
          <Input
            placeholder="搜索..."
            prefix={<SearchOutlined style={{ color: "#999" }} />}
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onPressEnter={handleSearch}
            style={{ width: 180 }}
          />
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
