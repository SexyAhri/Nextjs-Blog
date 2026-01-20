import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("开始初始化数据...");

  // 创建管理员用户
  const hashedPassword = await hash(
    process.env.ADMIN_PASSWORD || "admin123",
    12,
  );

  const admin = await prisma.user.upsert({
    where: { email: process.env.ADMIN_EMAIL || "admin@example.com" },
    update: {},
    create: {
      email: process.env.ADMIN_EMAIL || "admin@example.com",
      name: "管理员",
      password: hashedPassword,
      role: "admin",
    },
  });

  console.log("✓ 管理员用户创建成功:", admin.email);

  // 创建默认分类
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: "technology" },
      update: {},
      create: {
        name: "技术",
        slug: "technology",
        description: "技术相关文章",
      },
    }),
    prisma.category.upsert({
      where: { slug: "life" },
      update: {},
      create: {
        name: "生活",
        slug: "life",
        description: "生活随笔",
      },
    }),
    prisma.category.upsert({
      where: { slug: "thinking" },
      update: {},
      create: {
        name: "思考",
        slug: "thinking",
        description: "个人思考与感悟",
      },
    }),
  ]);

  console.log("✓ 默认分类创建成功:", categories.length, "个");

  // 创建默认标签
  const tags = await Promise.all([
    prisma.tag.upsert({
      where: { slug: "javascript" },
      update: {},
      create: { name: "JavaScript", slug: "javascript" },
    }),
    prisma.tag.upsert({
      where: { slug: "typescript" },
      update: {},
      create: { name: "TypeScript", slug: "typescript" },
    }),
    prisma.tag.upsert({
      where: { slug: "react" },
      update: {},
      create: { name: "React", slug: "react" },
    }),
    prisma.tag.upsert({
      where: { slug: "nextjs" },
      update: {},
      create: { name: "Next.js", slug: "nextjs" },
    }),
  ]);

  console.log("✓ 默认标签创建成功:", tags.length, "个");

  // 创建示例文章
  const post = await prisma.post.upsert({
    where: { slug: "welcome-to-my-blog" },
    update: {},
    create: {
      title: "欢迎来到我的博客",
      slug: "welcome-to-my-blog",
      content: `# 欢迎来到我的博客

这是第一篇文章，用于测试博客系统的功能。

## 功能特性

- Markdown 支持
- 代码高亮
- 分类和标签
- 评论系统
- 响应式设计

## 技术栈

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- PostgreSQL
- Prisma

开始你的写作之旅吧！`,
      excerpt: "这是第一篇文章，用于测试博客系统的功能。",
      published: true,
      publishedAt: new Date(),
      authorId: admin.id,
      categoryId: categories[0].id,
      tags: {
        create: [{ tagId: tags[2].id }, { tagId: tags[3].id }],
      },
    },
  });

  console.log("✓ 示例文章创建成功:", post.title);

  // 创建默认设置
  const settings = await Promise.all([
    prisma.setting.upsert({
      where: { key: "site_name" },
      update: {},
      create: { key: "site_name", value: "My Blog" },
    }),
    prisma.setting.upsert({
      where: { key: "site_description" },
      update: {},
      create: { key: "site_description", value: "一个基于 Next.js 的个人博客" },
    }),
    prisma.setting.upsert({
      where: { key: "posts_per_page" },
      update: {},
      create: { key: "posts_per_page", value: "10" },
    }),
  ]);

  console.log("✓ 默认设置创建成功:", settings.length, "个");

  console.log("\n✅ 数据初始化完成！");
}

main()
  .catch((e) => {
    console.error("❌ 初始化失败:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
