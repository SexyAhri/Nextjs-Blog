import { create } from "zustand";
import type { ReactNode } from "react";

// 弹框尺寸规格
export const MODAL_SIZE = {
  small: 400, // 确认框、简单表单
  medium: 560, // 常规表单、编辑
  large: 800, // 复杂表单、数据展示
  xlarge: 1000, // 大型数据表格、多标签
} as const;

export type ModalSize = keyof typeof MODAL_SIZE;

// 弹框类型
export type ModalType = "confirm" | "form" | "view" | "custom";

// 弹框配置
export interface ModalConfig {
  type: ModalType;
  title?: string;
  content?: ReactNode;
  size?: ModalSize;
  width?: number; // 自定义宽度，优先级高于 size
  data?: Record<string, unknown>;
  onOk?: (data?: unknown) => void | Promise<void>;
  onCancel?: () => void;
  okText?: string;
  cancelText?: string;
  okType?: "primary" | "danger";
  footer?: ReactNode | null;
  closable?: boolean;
  maskClosable?: boolean;
}

interface ModalStore {
  modals: ModalConfig[];
  open: (config: ModalConfig) => void;
  close: () => void;
  closeAll: () => void;
  confirm: (config: {
    title: string;
    content: ReactNode;
    onOk?: () => void | Promise<void>;
    okText?: string;
    okType?: "primary" | "danger";
  }) => void;
}

export const useModalStore = create<ModalStore>((set, get) => ({
  modals: [],

  open: (config) => {
    set((state) => ({
      modals: [
        ...state.modals,
        {
          size: "medium",
          closable: true,
          maskClosable: false,
          ...config,
        },
      ],
    }));
  },

  close: () => {
    const { modals } = get();
    if (modals.length > 0) {
      const lastModal = modals[modals.length - 1];
      lastModal.onCancel?.();
      set((state) => ({
        modals: state.modals.slice(0, -1),
      }));
    }
  },

  closeAll: () => {
    set({ modals: [] });
  },

  confirm: (config) => {
    get().open({
      type: "confirm",
      size: "small",
      title: config.title,
      content: config.content,
      onOk: config.onOk,
      okText: config.okText || "确定",
      cancelText: "取消",
      okType: config.okType || "primary",
    });
  },
}));
