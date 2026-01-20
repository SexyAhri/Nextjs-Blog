"use client";

import { Card, Statistic, Progress } from "antd";
import type { StatisticProps } from "antd";
import type { ReactNode } from "react";

interface StatCardProps extends Omit<StatisticProps, "title"> {
  title: string;
  showProgress?: boolean;
  progressStatus?: "success" | "exception" | "normal" | "active";
  height?: number | string;
  icon?: ReactNode;
}

export function StatCard({
  title,
  value,
  suffix,
  prefix,
  styles,
  showProgress = false,
  progressStatus,
  height,
  icon,
  ...rest
}: StatCardProps) {
  const numValue =
    typeof value === "number" ? value : parseFloat(String(value));
  const percent = suffix === "%" ? numValue : undefined;

  return (
    <Card size="small" style={{ height }}>
      <Statistic
        title={title}
        value={value}
        suffix={suffix}
        prefix={icon || prefix}
        styles={styles}
        {...rest}
      />
      {showProgress && percent !== undefined && (
        <Progress
          percent={Math.round(percent)}
          showInfo={false}
          status={progressStatus}
          style={{ marginTop: 8 }}
        />
      )}
    </Card>
  );
}
