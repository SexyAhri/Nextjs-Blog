"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Spin, Tag, Divider } from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { marked } from "marked";
import CommentSection from "@/components/blog/CommentSection";

interface PostDetail {
  id: string;
  title: string;
  content: string;
  excerpt?: string;
  coverImage?: string;
  publishedAt: string;
  viewCount: number;
  author: {
    name: string;
  };
  category?: {
    name: string;
    slug: string;
  };
  tags?: Array<{
    tag: {
      name: string;
      slug: string;
    };
  }>;
  prevPost?: {
    title: string;
    slug: string;
  };
  nextPost?: {
    title: string;
    slug: string;
  };
  relatedPosts?: Array<{
    id: string;
    title: string;
    slug: string;
    excerpt?: string;
    coverImage?: string;
    publishedAt: string;
  }>;
}

interface TocItem {
  id: string;
  text: string;
  level: number;
}

export default function PostDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [post, setPost] = useState<PostDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    if (slug) {
      loadPost();
    }
  }, [slug]);

  // 监听滚动，高亮当前目录项
  useEffect(() => {
    const handleScroll = () => {
      const headings = document.querySelectorAll(
        ".post-detail-content h1, .post-detail-content h2, .post-detail-content h3",
      );
      let currentId = "";

      headings.forEach((heading) => {
        const rect = heading.getBoundingClientRect();
        if (rect.top <= 100) {
          currentId = heading.id;
        }
      });

      setActiveId(currentId);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const loadPost = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/posts/${slug}`);
      const data = await res.json();
      if (data.success) {
        setPost(data.data);
      }
    } catch (error) {
      console.error("Failed to load post:", error);
    } finally {
      setLoading(false);
    }
  };

  // 解析内容并生成带 id 的标题
  const { renderedContent, toc } = useMemo(() => {
    if (!post?.content) return { renderedContent: "", toc: [] };

    const tocItems: TocItem[] = [];

    // 检查是否已经是 HTML
    const isHtml =
      /<[a-z][\s\S]*>/i.test(post.content) &&
      (post.content.includes("<p>") ||
        post.content.includes("<h") ||
        post.content.includes("<div"));

    let html = isHtml ? post.content : (marked(post.content) as string);

    // 为标题添加 id 并提取目录
    let headingIndex = 0;
    html = html.replace(/<h([1-3])>(.*?)<\/h\1>/gi, (match, level, text) => {
      const id = `heading-${headingIndex++}`;
      const cleanText = text.replace(/<[^>]*>/g, ""); // 移除 HTML 标签
      tocItems.push({ id, text: cleanText, level: parseInt(level) });
      return `<h${level} id="${id}">${text}</h${level}>`;
    });

    return { renderedContent: html, toc: tocItems };
  }, [post?.content]);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("zh-CN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const top = element.offsetTop - 80;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  if (loading) {
    return (
      <div className="blog-container">
        <div style={{ textAlign: "center", padding: 100 }}>
          <Spin size="large" />
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="blog-container">
        <div style={{ textAlign: "center", padding: 100 }}>
          <h2 style={{ marginBottom: 16 }}>文章不存在</h2>
          <Link href="/" style={{ color: "#2563eb" }}>
            返回首页
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="blog-container">
      <div className="post-detail-wrapper">
        {/* 目录 */}
        {toc.length > 0 && (
          <aside className="post-toc">
            <div className="post-toc-title">目录</div>
            <nav className="post-toc-nav">
              {toc.map((item) => (
                <a
                  key={item.id}
                  className={`post-toc-item post-toc-level-${item.level} ${activeId === item.id ? "active" : ""}`}
                  onClick={() => scrollToHeading(item.id)}
                >
                  {item.text}
                </a>
              ))}
            </nav>
          </aside>
        )}

        <article className="post-detail">
          {/* Cover Image */}
          {post.coverImage && (
            <div className="post-detail-cover">
              <Image
                src={post.coverImage}
                alt={post.title}
                width={1200}
                height={600}
                style={{ objectFit: "cover" }}
                priority
              />
            </div>
          )}

          {/* Header */}
          <header className="post-detail-header">
            <h1 className="post-detail-title">{post.title}</h1>

            <div className="post-detail-meta">
              <span className="post-detail-meta-item">{post.author.name}</span>
              <span className="post-detail-meta-item">
                {formatDate(post.publishedAt)}
              </span>
              <span className="post-detail-meta-item">
                {post.viewCount} 阅读
              </span>
              {post.category && (
                <span className="post-detail-meta-item">
                  <Link href={`/category/${post.category.slug}`}>
                    {post.category.name}
                  </Link>
                </span>
              )}
            </div>

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="post-detail-tags">
                {post.tags.map((item) => (
                  <Link key={item.tag.slug} href={`/tag/${item.tag.slug}`}>
                    <Tag>{item.tag.name}</Tag>
                  </Link>
                ))}
              </div>
            )}
          </header>

          <Divider />

          {/* Content */}
          <div
            className="post-detail-content"
            dangerouslySetInnerHTML={{ __html: renderedContent }}
          />

          {/* Navigation */}
          {(post.prevPost || post.nextPost) && (
            <div className="post-navigation">
              {post.prevPost ? (
                <Link
                  href={`/posts/${post.prevPost.slug}`}
                  className="post-navigation-item prev"
                >
                  <LeftOutlined />
                  <div>
                    <div className="post-navigation-label">上一篇</div>
                    <div className="post-navigation-title">
                      {post.prevPost.title}
                    </div>
                  </div>
                </Link>
              ) : (
                <div />
              )}
              {post.nextPost && (
                <Link
                  href={`/posts/${post.nextPost.slug}`}
                  className="post-navigation-item next"
                >
                  <div>
                    <div className="post-navigation-label">下一篇</div>
                    <div className="post-navigation-title">
                      {post.nextPost.title}
                    </div>
                  </div>
                  <RightOutlined />
                </Link>
              )}
            </div>
          )}

          {/* Related Posts */}
          {post.relatedPosts && post.relatedPosts.length > 0 && (
            <div className="related-posts">
              <h3>相关文章</h3>
              <div className="related-posts-grid">
                {post.relatedPosts.map((relatedPost) => (
                  <Link
                    key={relatedPost.id}
                    href={`/posts/${relatedPost.slug}`}
                    className="related-post-card"
                  >
                    {relatedPost.coverImage && (
                      <div className="related-post-image">
                        <Image
                          src={relatedPost.coverImage}
                          alt={relatedPost.title}
                          width={300}
                          height={150}
                          style={{ objectFit: "cover" }}
                        />
                      </div>
                    )}
                    <div className="related-post-content">
                      <h4>{relatedPost.title}</h4>
                      {relatedPost.excerpt && <p>{relatedPost.excerpt}</p>}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Comments */}
          <Divider />
          <CommentSection slug={slug} />
        </article>
      </div>
    </div>
  );
}
