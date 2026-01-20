import Link from "next/link";
import Image from "next/image";
import { Tag } from "antd";

interface PostCardProps {
  post: {
    id: string;
    title: string;
    slug: string;
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
  };
}

export default function PostCard({ post }: PostCardProps) {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("zh-CN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <article className="post-card">
      {/* Cover Image */}
      {post.coverImage && (
        <Link href={`/posts/${post.slug}`} className="post-card-image">
          <Image
            src={post.coverImage}
            alt={post.title}
            width={800}
            height={400}
            style={{ objectFit: "cover" }}
          />
        </Link>
      )}

      {/* Content */}
      <div className="post-card-content">
        {/* Meta */}
        <div className="post-card-meta">
          <span className="post-card-meta-item">{post.author.name}</span>
          <span className="post-card-meta-item">
            {formatDate(post.publishedAt)}
          </span>
          {post.category && (
            <span className="post-card-meta-item">
              <Link href={`/category/${post.category.slug}`}>
                {post.category.name}
              </Link>
            </span>
          )}
        </div>

        {/* Title */}
        <Link href={`/posts/${post.slug}`}>
          <h2 className="post-card-title">{post.title}</h2>
        </Link>

        {/* Excerpt */}
        {post.excerpt && <p className="post-card-excerpt">{post.excerpt}</p>}

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="post-card-tags">
            {post.tags.map((item) => (
              <Link key={item.tag.slug} href={`/tag/${item.tag.slug}`}>
                <Tag>{item.tag.name}</Tag>
              </Link>
            ))}
          </div>
        )}

        {/* Read More */}
        <Link href={`/posts/${post.slug}`} className="post-card-readmore">
          继续阅读 →
        </Link>
      </div>
    </article>
  );
}
