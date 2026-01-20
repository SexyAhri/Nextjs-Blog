import { prisma } from "./prisma";

interface OperationLogData {
  userId?: string;
  userName?: string;
  action: "create" | "update" | "delete" | "upload";
  module: "post" | "category" | "tag" | "media" | "setting";
  target?: string;
  targetId?: string;
  detail?: string;
  ip?: string;
  userAgent?: string;
}

interface LoginLogData {
  userId?: string;
  userName?: string;
  email?: string;
  success: boolean;
  ip?: string;
  userAgent?: string;
  location?: string;
  message?: string;
}

export async function logOperation(data: OperationLogData) {
  try {
    await prisma.operationLog.create({ data });
  } catch (error) {
    console.error("Failed to log operation:", error);
  }
}

export async function logLogin(data: LoginLogData) {
  try {
    await prisma.loginLog.create({ data });
  } catch (error) {
    console.error("Failed to log login:", error);
  }
}

export function getClientInfo(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for") ||
    request.headers.get("x-real-ip") ||
    "unknown";
  const userAgent = request.headers.get("user-agent") || "unknown";
  return { ip, userAgent };
}
