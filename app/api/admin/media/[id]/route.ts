import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { unlink } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

// DELETE - 删除媒体文件
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "未授权" }, { status: 401 });
    }

    const { id } = await params;

    // 查找媒体文件
    const media = await prisma.media.findUnique({
      where: { id },
    });

    if (!media) {
      return NextResponse.json(
        { success: false, error: "媒体文件不存在" },
        { status: 404 },
      );
    }

    // 删除物理文件
    const filepath = join(process.cwd(), "public", media.filepath);
    if (existsSync(filepath)) {
      await unlink(filepath);
    }

    // 删除数据库记录
    await prisma.media.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete media:", error);
    return NextResponse.json(
      { success: false, error: "删除失败" },
      { status: 500 },
    );
  }
}

// PUT - 更新媒体文件信息
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "未授权" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { alt, title } = body;

    const media = await prisma.media.update({
      where: { id },
      data: {
        alt,
        title,
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json({ success: true, data: media });
  } catch (error) {
    console.error("Failed to update media:", error);
    return NextResponse.json(
      { success: false, error: "更新失败" },
      { status: 500 },
    );
  }
}
