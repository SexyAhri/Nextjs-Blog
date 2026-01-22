import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cache, CACHE_TTL } from "@/lib/cache";

// GET - 获取所有标签（前台）
export async function GET() {
  try {
    const result = await cache.cached(
      "tags:all",
      async () => {
        const tags = await prisma.tag.findMany({
          include: {
            _count: {
              select: {
                posts: {
                  where: {
                    post: { published: true },
                  },
                },
              },
            },
          },
          orderBy: { name: "asc" },
        });

        return { success: true, data: tags };
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
        error: error instanceof Error ? error.message : "获取标签列表失败",
      },
      { status: 500 },
    );
  }
}
