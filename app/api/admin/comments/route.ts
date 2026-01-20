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
    const status = searchParams.get("status"); // pending, approved, all

    const where: any = {};
    if (status === "pending") {
      where.approved = false;
    } else if (status === "approved") {
      where.approved = true;
    }

    const comments = await prisma.comment.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        post: { select: { title: true, slug: true } },
      },
    });

    return NextResponse.json({ success: true, data: comments });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "获取评论失败" },
      { status: 500 },
    );
  }
}
