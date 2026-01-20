import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET - 获取所有分类（前台）
export async function GET() {
  try {
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

    return NextResponse.json({
      success: true,
      data: categories,
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
