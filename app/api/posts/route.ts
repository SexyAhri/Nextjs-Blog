import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET - 获取已发布的文章列表（前台）
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "10");
    const categoryId = searchParams.get("categoryId");
    const tagId = searchParams.get("tagId");
    const search = searchParams.get("search");

    const skip = (page - 1) * pageSize;

    // 构建查询条件
    const where: any = {
      published: true,
    };

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (tagId) {
      where.tags = {
        some: {
          tagId,
        },
      };
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { content: { contains: search, mode: "insensitive" } },
        { excerpt: { contains: search, mode: "insensitive" } },
      ];
    }

    // 获取文章列表
    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        include: {
          author: {
            select: { id: true, name: true, email: true },
          },
          category: {
            select: { id: true, name: true, slug: true },
          },
          tags: {
            include: {
              tag: {
                select: { id: true, name: true, slug: true },
              },
            },
          },
        },
        orderBy: { publishedAt: "desc" },
        skip,
        take: pageSize,
      }),
      prisma.post.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: posts,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "获取文章列表失败",
      },
      { status: 500 },
    );
  }
}
