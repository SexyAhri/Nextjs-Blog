"use client";

import { useState } from "react";
import { Drawer, Button, Form, Row, theme, ConfigProvider } from "antd";
import { FullscreenOutlined, FullscreenExitOutlined } from "@ant-design/icons";
import type { FormInstance, FormProps } from "antd";
import type { ReactNode } from "react";

interface FormDrawerProps {
  title: string;
  open: boolean;
  onClose: () => void;
  onSubmit?: () => void;
  width?: string;
  children: ReactNode;
  form?: FormInstance;
  formProps?: Omit<FormProps, "form">;
  submitText?: string;
  cancelText?: string;
  loading?: boolean;
  footer?: ReactNode;
  labelLayout?: "top" | "left" | "hidden"; // label位置：上方、左侧、隐藏，默认左侧
}

export function FormDrawer({
  title,
  open,
  onClose,
  onSubmit,
  width = "50vw",
  children,
  form,
  formProps,
  submitText = "确定",
  cancelText = "取消",
  loading = false,
  footer,
  labelLayout = "left",
}: FormDrawerProps) {
  const { token } = theme.useToken();
  const [isFullscreen, setIsFullscreen] = useState(true);

  // 根据 labelLayout 设置 Form 属性
  const formLayout = labelLayout === "top" ? "vertical" : "horizontal";
  const labelCol =
    labelLayout === "hidden"
      ? { span: 0 }
      : labelLayout === "left"
        ? { span: 6 }
        : undefined;
  const wrapperCol =
    labelLayout === "hidden"
      ? { span: 24 }
      : labelLayout === "left"
        ? { span: 18 }
        : undefined;

  // 默认 footer
  const defaultFooter = (
    <div style={{ display: "flex", justifyContent: "center", gap: 12 }}>
      <Button onClick={onClose}>{cancelText}</Button>
      <Button type="primary" onClick={onSubmit} loading={loading}>
        {submitText}
      </Button>
    </div>
  );

  return (
    <Drawer
      title={title}
      open={open}
      onClose={onClose}
      styles={{
        wrapper: { width: isFullscreen ? "100vw" : width },
        header: {
          background: token.colorPrimaryBg,
          borderBottom: `1px solid ${token.colorPrimaryBorder}`,
          padding: "8px 16px",
        },
        body: {
          overflow: "auto",
          flex: 1,
          minHeight: 0,
        },
        footer: {
          padding: "8px 16px",
          borderTop: `1px solid ${token.colorBorderSecondary}`,
        },
      }}
      extra={
        <Button
          type="text"
          icon={
            isFullscreen ? <FullscreenExitOutlined /> : <FullscreenOutlined />
          }
          onClick={() => setIsFullscreen(!isFullscreen)}
        />
      }
      footer={footer !== undefined ? footer : defaultFooter}
    >
      {open && form ? (
        <Form
          form={form}
          layout={formLayout}
          labelCol={labelCol}
          wrapperCol={wrapperCol}
          {...formProps}
        >
          <Row gutter={16}>{children}</Row>
        </Form>
      ) : open ? (
        children
      ) : null}
    </Drawer>
  );
}

// 详情抽屉
interface DetailDrawerProps {
  title: string;
  open: boolean;
  onClose: () => void;
  width?: string;
  children: ReactNode;
  footer?: ReactNode;
}

export function DetailDrawer({
  title,
  open,
  onClose,
  width = "50vw",
  children,
  footer,
}: DetailDrawerProps) {
  const { token } = theme.useToken();
  const [isFullscreen, setIsFullscreen] = useState(true);

  return (
    <Drawer
      title={title}
      open={open}
      onClose={onClose}
      styles={{
        wrapper: { width: isFullscreen ? "100vw" : width },
        header: {
          background: token.colorPrimaryBg,
          borderBottom: `1px solid ${token.colorPrimaryBorder}`,
          padding: "8px 16px",
        },
        body: {
          overflow: "auto",
          flex: 1,
          minHeight: 0,
        },
        footer: {
          padding: "8px 16px",
          borderTop: `1px solid ${token.colorBorderSecondary}`,
        },
      }}
      extra={
        <Button
          type="text"
          icon={
            isFullscreen ? <FullscreenExitOutlined /> : <FullscreenOutlined />
          }
          onClick={() => setIsFullscreen(!isFullscreen)}
        />
      }
      footer={footer}
    >
      {children}
    </Drawer>
  );
}

// 查看抽屉（表单只读模式）
interface ViewDrawerProps {
  title: string;
  open: boolean;
  onClose: () => void;
  width?: string;
  children: ReactNode;
  form?: FormInstance;
  labelLayout?: "top" | "left" | "hidden";
}

export function ViewDrawer({
  title,
  open,
  onClose,
  width = "50vw",
  children,
  form,
  labelLayout = "left",
}: ViewDrawerProps) {
  const { token } = theme.useToken();
  const [isFullscreen, setIsFullscreen] = useState(true);

  const formLayout = labelLayout === "top" ? "vertical" : "horizontal";
  const labelCol =
    labelLayout === "hidden"
      ? { span: 0 }
      : labelLayout === "left"
        ? { span: 6 }
        : undefined;
  const wrapperCol =
    labelLayout === "hidden"
      ? { span: 24 }
      : labelLayout === "left"
        ? { span: 18 }
        : undefined;

  return (
    <Drawer
      title={title}
      open={open}
      onClose={onClose}
      styles={{
        wrapper: { width: isFullscreen ? "100vw" : width },
        header: {
          background: token.colorPrimaryBg,
          borderBottom: `1px solid ${token.colorPrimaryBorder}`,
          padding: "8px 16px",
        },
        body: {
          overflow: "auto",
          flex: 1,
          minHeight: 0,
        },
        footer: {
          padding: "8px 16px",
          borderTop: `1px solid ${token.colorBorderSecondary}`,
        },
      }}
      extra={
        <Button
          type="text"
          icon={
            isFullscreen ? <FullscreenExitOutlined /> : <FullscreenOutlined />
          }
          onClick={() => setIsFullscreen(!isFullscreen)}
        />
      }
      footer={
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Button onClick={onClose}>关闭</Button>
        </div>
      }
    >
      {open && (
        <ConfigProvider
          theme={{
            components: {
              Input: { colorBgContainerDisabled: "transparent" },
              Select: { colorBgContainerDisabled: "transparent" },
              TreeSelect: { colorBgContainerDisabled: "transparent" },
              InputNumber: { colorBgContainerDisabled: "transparent" },
              DatePicker: { colorBgContainerDisabled: "transparent" },
            },
          }}
        >
          {form ? (
            <Form
              form={form}
              layout={formLayout}
              labelCol={labelCol}
              wrapperCol={wrapperCol}
              disabled
            >
              <Row gutter={16}>{children}</Row>
            </Form>
          ) : (
            children
          )}
        </ConfigProvider>
      )}
    </Drawer>
  );
}
