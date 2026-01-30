import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

export async function GET(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    const limit = rateLimit(`search:${ip}`, { window: 60, max: 30 });
    if (!limit.success) {
      return NextResponse.json(
        { success: false, error: "搜索过于频繁，请稍后再试" },
        { status: 429 }
      );
    }

    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q");

    if (!q || q.length < 2) {
      return NextResponse.json({ success: true, data: [] });
    }

    const posts = await prisma.post.findMany({
      where: {
        published: true,
        OR: [
          { title: { contains: q, mode: "insensitive" } },
          { content: { contains: q, mode: "insensitive" } },
          { excerpt: { contains: q, mode: "insensitive" } },
        ],
      },
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        publishedAt: true,
        createdAt: true,
        coverImage: true,
        author: { select: { name: true } },
        category: { select: { name: true, slug: true } },
        tags: {
          include: {
            tag: { select: { name: true, slug: true } },
          },
        },
      },
      orderBy: { publishedAt: "desc" },
      take: 20,
    });

    return NextResponse.json({ success: true, data: posts });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "搜索失败" },
      { status: 500 },
    );
  }
}
