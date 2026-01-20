import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // 测试数据库连接
    await prisma.$queryRaw`SELECT 1`;

    return NextResponse.json({
      success: true,
      message: "系统运行正常",
      database: "已连接",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "数据库连接失败",
        error: error instanceof Error ? error.message : "未知错误",
      },
      { status: 500 },
    );
  }
}
