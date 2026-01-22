// 定时发布调度器
// 在服务端启动时运行，每分钟检查一次待发布的文章

let isRunning = false;
let intervalId: NodeJS.Timeout | null = null;

export async function checkScheduledPosts() {
  if (typeof window !== "undefined") return; // 只在服务端运行
  
  try {
    const { prisma } = await import("@/lib/prisma");
    const now = new Date();

    const postsToPublish = await prisma.post.findMany({
      where: {
        published: false,
        scheduledAt: {
          lte: now,
          not: null,
        },
      },
    });

    if (postsToPublish.length > 0) {
      console.log(`[Scheduler] Found ${postsToPublish.length} posts to publish`);
      
      for (const post of postsToPublish) {
        await prisma.post.update({
          where: { id: post.id },
          data: {
            published: true,
            publishedAt: post.scheduledAt,
            scheduledAt: null,
          },
        });
        console.log(`[Scheduler] Published: ${post.title}`);
      }
    }
  } catch (error) {
    console.error("[Scheduler] Error:", error);
  }
}

export function startScheduler() {
  if (isRunning || typeof window !== "undefined") return;
  
  isRunning = true;
  console.log("[Scheduler] Started - checking every minute");
  
  // 立即检查一次
  checkScheduledPosts();
  
  // 每分钟检查一次
  intervalId = setInterval(checkScheduledPosts, 60 * 1000);
}

export function stopScheduler() {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
  isRunning = false;
  console.log("[Scheduler] Stopped");
}
