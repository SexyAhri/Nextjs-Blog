"use client";

import Link from "next/link";
import {
  GithubOutlined,
  TwitterOutlined,
  MailOutlined,
} from "@ant-design/icons";

export default function BlogFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="blog-footer">
      <div className="blog-footer-container">
        <div className="blog-footer-content">
          {/* Copyright */}
          <div className="blog-footer-section">
            <p>© {currentYear} VixenAhri</p>
          </div>

          {/* Links */}
          <div className="blog-footer-section">
            <ul>
              <li>
                <Link href="/">首页</Link>
              </li>
              <li>
                <Link href="/categories">分类</Link>
              </li>
              <li>
                <Link href="/archive">归档</Link>
              </li>
              <li>
                <Link href="/about">关于</Link>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div className="blog-footer-section">
            <div className="blog-footer-social">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
              >
                <GithubOutlined />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
              >
                <TwitterOutlined />
              </a>
              <a href="mailto:contact@example.com" aria-label="Email">
                <MailOutlined />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
