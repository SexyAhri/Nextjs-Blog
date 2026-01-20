import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateSlug } from "@/lib/utils";

// PUT - 更新标签
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { success: false, error: "未授权" },
        { status: 401 },
      );
    }

    const { id } = await params;
    const body = await request.json();
    const { name, slug } = body;

    if (!name || !slug) {
      return NextResponse.json(
        { success: false, error: "名称和 slug 不能为空" },
        { status: 400 },
      );
    }

    // 检查 slug 是否被其他标签使用
    const existing = await prisma.tag.findFirst({
      where: {
        slug,
        NOT: { id },
      },
    });

    if (existing) {
      return NextResponse.json(
        { success: false, error: "URL 别名已被使用" },
        { status: 400 },
      );
    }

    const tag = await prisma.tag.update({
      where: { id },
      data: {
        name,
        slug: generateSlug(slug),
      },
    });

    return NextResponse.json({
      success: true,
      data: tag,
      message: "标签更新成功",
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "更新标签失败",
      },
      { status: 500 },
    );
  }
}

// DELETE - 删除标签
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { success: false, error: "未授权" },
        { status: 401 },
      );
    }

    const { id } = await params;

    // 检查是否有文章使用此标签
    const postsCount = await prisma.postTag.count({
      where: { tagId: id },
    });

    if (postsCount > 0) {
      return NextResponse.json(
        {
          success: false,
          error: `无法删除，还有 ${postsCount} 篇文章使用此标签`,
        },
        { status: 400 },
      );
    }

    await prisma.tag.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "标签删除成功",
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "删除标签失败",
      },
      { status: 500 },
    );
  }
}
