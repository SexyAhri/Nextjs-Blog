import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { success: false, error: "未授权" },
        { status: 401 },
      );
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type") || "operation"; // operation | login
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "20");

    if (type === "login") {
      const [logs, total] = await Promise.all([
        prisma.loginLog.findMany({
          orderBy: { createdAt: "desc" },
          skip: (page - 1) * pageSize,
          take: pageSize,
        }),
        prisma.loginLog.count(),
      ]);
      return NextResponse.json({
        success: true,
        data: logs,
        total,
        page,
        pageSize,
      });
    } else {
      const [logs, total] = await Promise.all([
        prisma.operationLog.findMany({
          orderBy: { createdAt: "desc" },
          skip: (page - 1) * pageSize,
          take: pageSize,
        }),
        prisma.operationLog.count(),
      ]);
      return NextResponse.json({
        success: true,
        data: logs,
        total,
        page,
        pageSize,
      });
    }
  } catch (error) {
    console.error("Failed to fetch logs:", error);
    return NextResponse.json(
      { success: false, error: "获取日志失败" },
      { status: 500 },
    );
  }
}
