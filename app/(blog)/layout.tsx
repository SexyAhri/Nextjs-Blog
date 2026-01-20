import BlogHeader from "@/components/blog/BlogHeader";
import BlogFooter from "@/components/blog/BlogFooter";

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="blog-layout">
      <BlogHeader />
      <main className="blog-main">{children}</main>
      <BlogFooter />
    </div>
  );
}
