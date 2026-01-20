"use client";

import {
  Form,
  Input,
  Select,
  InputNumber,
  TreeSelect,
  Radio,
  Switch,
  Col,
} from "antd";
import type { Rule } from "antd/es/form";
import type { CSSProperties } from "react";

const { TextArea } = Input;

// 下划线样式
const underlineStyle: CSSProperties = {
  borderBottom: "1px solid #d9d9d9",
  borderRadius: 0,
};

interface BaseFormItemProps {
  name: string;
  label: string;
  required?: boolean;
  rules?: Rule[];
  placeholder?: string;
  span?: number; // 占几列，默认1列（共3列，span=1占8格，span=2占16格，span=3占24格）
}

// 包装组件，处理列布局
function FormCol({
  span = 1,
  children,
}: {
  span?: number;
  children: React.ReactNode;
}) {
  const colSpan = span * 8; // 1列=8, 2列=16, 3列=24
  return <Col span={colSpan}>{children}</Col>;
}

// 文本输入
export function InputItem({
  name,
  label,
  required,
  rules,
  placeholder,
  span = 1,
}: BaseFormItemProps) {
  return (
    <FormCol span={span}>
      <Form.Item
        name={name}
        label={label}
        rules={required ? [{ required: true }, ...(rules || [])] : rules}
      >
        <Input
          variant="borderless"
          style={underlineStyle}
          placeholder={placeholder || `请输入${label}`}
        />
      </Form.Item>
    </FormCol>
  );
}

// 多行文本（保留完整边框）
export function TextAreaItem({
  name,
  label,
  required,
  rules,
  rows = 2,
  span = 3,
}: BaseFormItemProps & { rows?: number }) {
  return (
    <FormCol span={span}>
      <Form.Item
        name={name}
        label={label}
        rules={required ? [{ required: true }, ...(rules || [])] : rules}
        labelCol={span === 3 ? { span: 2 } : undefined}
        wrapperCol={span === 3 ? { span: 22 } : undefined}
      >
        <TextArea rows={rows} placeholder={`请输入${label}`} />
      </Form.Item>
    </FormCol>
  );
}

// 数字输入
export function NumberItem({
  name,
  label,
  required,
  min = 0,
  span = 1,
}: BaseFormItemProps & { min?: number }) {
  return (
    <FormCol span={span}>
      <Form.Item
        name={name}
        label={label}
        rules={required ? [{ required: true }] : undefined}
      >
        <InputNumber
          variant="borderless"
          style={{ ...underlineStyle, width: "100%" }}
          min={min}
        />
      </Form.Item>
    </FormCol>
  );
}

// 下拉选择
interface SelectItemProps extends BaseFormItemProps {
  options: { value: any; label: string }[];
  mode?: "multiple" | "tags";
}

export function SelectItem({
  name,
  label,
  required,
  options,
  mode,
  placeholder,
  span = 1,
}: SelectItemProps) {
  return (
    <FormCol span={span}>
      <Form.Item
        name={name}
        label={label}
        rules={required ? [{ required: true }] : undefined}
      >
        <Select
          variant="borderless"
          style={underlineStyle}
          mode={mode}
          options={options}
          placeholder={placeholder || `请选择${label}`}
          allowClear
        />
      </Form.Item>
    </FormCol>
  );
}

// 状态选择
export function StatusSelect({
  name = "status",
  label = "状态",
  span = 1,
}: {
  name?: string;
  label?: string;
  span?: number;
}) {
  return (
    <FormCol span={span}>
      <Form.Item name={name} label={label}>
        <Select
          variant="borderless"
          style={underlineStyle}
          options={[
            { value: "active", label: "正常" },
            { value: "disabled", label: "停用" },
          ]}
        />
      </Form.Item>
    </FormCol>
  );
}

// 树形选择
interface TreeSelectItemProps extends BaseFormItemProps {
  treeData: any[];
}

export function TreeSelectItem({
  name,
  label,
  required,
  treeData,
  placeholder,
  span = 1,
}: TreeSelectItemProps) {
  return (
    <FormCol span={span}>
      <Form.Item
        name={name}
        label={label}
        rules={required ? [{ required: true }] : undefined}
      >
        <TreeSelect
          variant="borderless"
          style={underlineStyle}
          treeData={treeData}
          allowClear
          placeholder={placeholder || `请选择${label}`}
        />
      </Form.Item>
    </FormCol>
  );
}

// 单选组
interface RadioGroupItemProps extends BaseFormItemProps {
  options: { value: any; label: string }[];
  onChange?: (value: any) => void;
}

export function RadioGroupItem({
  name,
  label,
  required,
  options,
  onChange,
  span = 1,
}: RadioGroupItemProps) {
  return (
    <FormCol span={span}>
      <Form.Item
        name={name}
        label={label}
        rules={required ? [{ required: true }] : undefined}
      >
        <Radio.Group
          onChange={onChange ? (e) => onChange(e.target.value) : undefined}
        >
          {options.map((opt) => (
            <Radio key={opt.value} value={opt.value}>
              {opt.label}
            </Radio>
          ))}
        </Radio.Group>
      </Form.Item>
    </FormCol>
  );
}

// 开关
export function SwitchItem({
  name,
  label,
  span = 1,
}: {
  name: string;
  label: string;
  span?: number;
}) {
  return (
    <FormCol span={span}>
      <Form.Item name={name} label={label} valuePropName="checked">
        <Switch />
      </Form.Item>
    </FormCol>
  );
}

// 备注
export function RemarkItem({ span = 3 }: { span?: number }) {
  return <TextAreaItem name="remark" label="备注" rows={2} span={span} />;
}

// 排序
export function SortItem({ span = 1 }: { span?: number }) {
  return (
    <NumberItem name="sort" label="显示排序" required min={0} span={span} />
  );
}

// 表单分组（简洁分隔线样式）
import { Row, theme } from "antd";

interface FormGroupProps {
  title: string;
  children: React.ReactNode;
}

export function FormGroup({ title, children }: FormGroupProps) {
  const { token } = theme.useToken();

  return (
    <Col span={24} style={{ marginBottom: 8 }}>
      {/* 分组标题 */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginBottom: 16,
          gap: 8,
        }}
      >
        <div
          style={{
            width: 3,
            height: 14,
            background: token.colorPrimary,
            borderRadius: 2,
          }}
        />
        <span
          style={{
            fontSize: 14,
            fontWeight: 500,
            color: token.colorText,
          }}
        >
          {title}
        </span>
        <div
          style={{
            flex: 1,
            height: 1,
            background: token.colorBorderSecondary,
            marginLeft: 8,
          }}
        />
      </div>
      {/* 表单内容 */}
      <Row gutter={16}>{children}</Row>
    </Col>
  );
}
