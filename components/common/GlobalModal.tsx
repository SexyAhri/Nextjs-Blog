"use client";

import { Modal, Button, Space } from "antd";
import { useModalStore, MODAL_SIZE } from "@/store/modal";

export function GlobalModal() {
  const { modals, close } = useModalStore();

  if (modals.length === 0) return null;

  return (
    <>
      {modals.map((modal, index) => {
        const width = modal.width || MODAL_SIZE[modal.size || "medium"];

        return (
          <Modal
            key={index}
            open={true}
            title={modal.title}
            width={width}
            onCancel={close}
            closable={modal.closable}
            maskClosable={modal.maskClosable}
            footer={
              modal.footer !== undefined ? (
                modal.footer
              ) : (
                <Space>
                  <Button onClick={close}>{modal.cancelText || "取消"}</Button>
                  <Button
                    type="primary"
                    danger={modal.okType === "danger"}
                    onClick={async () => {
                      await modal.onOk?.();
                      close();
                    }}
                  >
                    {modal.okText || "确定"}
                  </Button>
                </Space>
              )
            }
            zIndex={1000 + index}
            centered
            destroyOnHidden
          >
            {modal.content}
          </Modal>
        );
      })}
    </>
  );
}
