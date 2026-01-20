import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import PostForm from "@/components/admin/PostForm";

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const post = await prisma.post.findUnique({
    where: { id },
    include: {
      category: true,
      tags: {
        include: {
          tag: true,
        },
      },
    },
  });

  if (!post) {
    notFound();
  }

  // 转换数据格式以匹配编辑器
  const postData = {
    ...post,
    categoryId: post.categoryId || undefined,
    tagIds: post.tags.map((pt) => pt.tag.id),
  };

  return <PostForm post={postData} />;
}
