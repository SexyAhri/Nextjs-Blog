import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cache, CACHE_TTL } from "@/lib/cache";

// GET - 获取所有分类（前台）
export async function GET() {
  try {
    const result = await cache.cached(
      "categories:all",
      async () => {
        const categories = await prisma.category.findMany({
          include: {
            _count: {
              select: {
                posts: {
                  where: { published: true },
                },
              },
            },
          },
          orderBy: { name: "asc" },
        });

        return { success: true, data: categories };
      },
      CACHE_TTL.LONG // 5分钟缓存
    );

    return NextResponse.json(result, {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "获取分类列表失败",
      },
      { status: 500 },
    );
  }
}
