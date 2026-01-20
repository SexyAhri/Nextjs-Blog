import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET - 获取所有设置
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "未授权" }, { status: 401 });
    }

    const settings = await prisma.setting.findMany();

    // 转换为键值对对象
    const settingsObj: Record<string, string> = {};
    settings.forEach((setting) => {
      settingsObj[setting.key] = setting.value;
    });

    return NextResponse.json({ success: true, data: settingsObj });
  } catch (error) {
    console.error("Failed to fetch settings:", error);
    return NextResponse.json(
      { success: false, error: "获取设置失败" },
      { status: 500 },
    );
  }
}

// POST - 批量更新设置
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "未授权" }, { status: 401 });
    }

    const body = await request.json();

    // 批量更新设置
    const updates = Object.entries(body).map(([key, value]) =>
      prisma.setting.upsert({
        where: { key },
        update: { value: value as string },
        create: { key, value: value as string },
      }),
    );

    await Promise.all(updates);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to update settings:", error);
    return NextResponse.json(
      { success: false, error: "更新设置失败" },
      { status: 500 },
    );
  }
}
