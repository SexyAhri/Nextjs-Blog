"use client";

import { Tag } from "antd";

interface StatusTagProps {
  status: string;
  activeText?: string;
  inactiveText?: string;
}

export function StatusTag({
  status,
  activeText = "正常",
  inactiveText = "停用",
}: StatusTagProps) {
  const isActive =
    status === "active" ||
    status === "success" ||
    status === "running" ||
    status === "published";
  return (
    <Tag color={isActive ? "success" : "error"}>
      {isActive ? activeText : inactiveText}
    </Tag>
  );
}

interface TypeTagProps {
  type: string;
  options: Record<string, { label: string; color: string }>;
}

export function TypeTag({ type, options }: TypeTagProps) {
  const opt = options[type];
  return opt ? <Tag color={opt.color}>{opt.label}</Tag> : <Tag>{type}</Tag>;
}
