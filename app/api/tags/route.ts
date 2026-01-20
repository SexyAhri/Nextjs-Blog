import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET - 获取所有标签（前台）
export async function GET() {
  try {
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

    return NextResponse.json({
      success: true,
      data: tags,
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
