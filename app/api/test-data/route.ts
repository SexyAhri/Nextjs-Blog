import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // 查询数据库中的数据
    const [userCount, postCount, categoryCount, tagCount] = await Promise.all([
      prisma.user.count(),
      prisma.post.count(),
      prisma.category.count(),
      prisma.tag.count(),
    ]);

    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
    });

    const posts = await prisma.post.findMany({
      select: {
        id: true,
        title: true,
        slug: true,
        published: true,
        createdAt: true,
      },
    });

    const categories = await prisma.category.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
      },
    });

    const tags = await prisma.tag.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: "数据查询成功",
      data: {
        counts: {
          users: userCount,
          posts: postCount,
          categories: categoryCount,
          tags: tagCount,
        },
        users,
        posts,
        categories,
        tags,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "数据查询失败",
        error: error instanceof Error ? error.message : "未知错误",
      },
      { status: 500 },
    );
  }
}
