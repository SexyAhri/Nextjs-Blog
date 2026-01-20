"use client";

import { Form, Input } from "antd";

const { TextArea } = Input;

interface FormItemConfig {
  name: string;
  label: string;
  type: "input" | "textarea";
  required?: boolean;
  placeholder?: string;
  help?: string;
}

interface FormItemsProps {
  items: FormItemConfig[];
}

export function FormItems({ items }: FormItemsProps) {
  return (
    <>
      {items.map((item) => {
        if (item.type === "textarea") {
          return (
            <Form.Item
              key={item.name}
              label={item.label}
              name={item.name}
              rules={
                item.required
                  ? [{ required: true, message: `请输入${item.label}` }]
                  : undefined
              }
              help={item.help}
            >
              <TextArea
                rows={3}
                placeholder={item.placeholder || `请输入${item.label}`}
              />
            </Form.Item>
          );
        }

        return (
          <Form.Item
            key={item.name}
            label={item.label}
            name={item.name}
            rules={
              item.required
                ? [{ required: true, message: `请输入${item.label}` }]
                : undefined
            }
            help={item.help}
          >
            <Input placeholder={item.placeholder || `请输入${item.label}`} />
          </Form.Item>
        );
      })}
    </>
  );
}
