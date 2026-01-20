import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { success: false, error: "未授权" },
        { status: 401 },
      );
    }

    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get("days") || "7");

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    startDate.setHours(0, 0, 0, 0);

    // 获取每日访问量
    const pageViews = await prisma.pageView.groupBy({
      by: ["createdAt"],
      where: { createdAt: { gte: startDate } },
      _count: true,
    });

    // 总访问量
    const totalViews = await prisma.pageView.count({
      where: { createdAt: { gte: startDate } },
    });

    // 独立访客（按 IP 去重）
    const uniqueVisitors = await prisma.pageView.groupBy({
      by: ["ip"],
      where: { createdAt: { gte: startDate } },
    });

    // 热门文章
    const topPosts = await prisma.post.findMany({
      where: { published: true },
      orderBy: { viewCount: "desc" },
      take: 10,
      select: {
        id: true,
        title: true,
        slug: true,
        viewCount: true,
      },
    });

    // 最近访问来源
    const referers = await prisma.pageView.groupBy({
      by: ["referer"],
      where: {
        createdAt: { gte: startDate },
        referer: { not: "" },
      },
      _count: true,
      orderBy: { _count: { referer: "desc" } },
      take: 10,
    });

    // 按日期汇总
    const dailyStats: Record<string, number> = {};
    for (let i = 0; i < days; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const key = date.toISOString().split("T")[0];
      dailyStats[key] = 0;
    }

    pageViews.forEach((pv) => {
      const key = new Date(pv.createdAt).toISOString().split("T")[0];
      if (dailyStats[key] !== undefined) {
        dailyStats[key] += pv._count;
      }
    });

    return NextResponse.json({
      success: true,
      data: {
        totalViews,
        uniqueVisitors: uniqueVisitors.length,
        topPosts,
        referers: referers.map((r) => ({
          referer: r.referer,
          count: r._count,
        })),
        dailyStats: Object.entries(dailyStats)
          .map(([date, count]) => ({ date, count }))
          .reverse(),
      },
    });
  } catch (error) {
    console.error("Stats error:", error);
    return NextResponse.json(
      { success: false, error: "获取统计失败" },
      { status: 500 },
    );
  }
}
