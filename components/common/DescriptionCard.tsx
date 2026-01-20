"use client";

import { Card, Descriptions } from "antd";
import type { DescriptionsProps } from "antd";
import type { ReactNode } from "react";

interface DescriptionItem {
  label: string;
  value: ReactNode;
  span?: number;
}

interface DescriptionCardProps {
  title?: string;
  items: DescriptionItem[];
  column?: number;
  size?: "small" | "middle" | "default";
  bordered?: boolean;
  extra?: ReactNode;
  layout?: DescriptionsProps["layout"];
}

export function DescriptionCard({
  title,
  items,
  column = 2,
  size = "small",
  bordered = false,
  extra,
  layout = "horizontal",
}: DescriptionCardProps) {
  const cardSize = size === "middle" ? "default" : size;
  return (
    <Card title={title} size={cardSize} extra={extra}>
      <Descriptions
        column={column}
        size={size}
        bordered={bordered}
        layout={layout}
      >
        {items.map((item, index) => (
          <Descriptions.Item key={index} label={item.label} span={item.span}>
            {item.value}
          </Descriptions.Item>
        ))}
      </Descriptions>
    </Card>
  );
}
