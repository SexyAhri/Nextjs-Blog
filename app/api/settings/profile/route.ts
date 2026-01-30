import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const [settings, postCount, commentCount] = await Promise.all([
      prisma.setting.findMany({
        where: { key: { in: ["siteUrl", "siteMotto", "siteAvatar", "siteProfileBanner"] } },
      }),
      prisma.post.count({ where: { published: true } }),
      prisma.comment.count({ where: { approved: true } }),
    ]);

    const settingsMap: Record<string, string> = {};
    settings.forEach((s) => {
      settingsMap[s.key] = s.value;
    });

    return NextResponse.json({
      success: true,
      siteUrl: settingsMap.siteUrl || "",
      motto: settingsMap.siteMotto || "记录与分享，让技术更有温度",
      postCount,
      commentCount,
      avatarUrl: settingsMap.siteAvatar || null,
      bannerUrl: settingsMap.siteProfileBanner || null,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      siteUrl: "",
      motto: "记录与分享，让技术更有温度",
      postCount: 0,
      commentCount: 0,
    });
  }
}
