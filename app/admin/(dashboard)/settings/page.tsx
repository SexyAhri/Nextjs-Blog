"use client";

import { useState, useEffect } from "react";
import {
  Card,
  Form,
  Input,
  Button,
  App,
  Spin,
  Tabs,
  Switch,
  InputNumber,
  Image,
} from "antd";
import { SaveOutlined, PictureOutlined } from "@ant-design/icons";
import ImagePicker from "@/components/admin/ImagePicker";

const { TextArea } = Input;

export default function SettingsPage() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");
  const [bannerPickerOpen, setBannerPickerOpen] = useState(false);
  const [avatarPickerOpen, setAvatarPickerOpen] = useState(false);
  const { message } = App.useApp();

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/settings");
      const data = await res.json();
      if (data.success) {
        form.setFieldsValue({
          siteName: data.data.siteName || "我的博客",
          siteDescription:
            data.data.siteDescription || "一个基于 Next.js 的个人博客",
          siteKeywords: data.data.siteKeywords || "博客,技术,分享",
          siteUrl: data.data.siteUrl || "",
          siteAuthor: data.data.siteAuthor || "",
          siteEmail: data.data.siteEmail || "",
          siteIcp: data.data.siteIcp || "",
          siteAnalytics: data.data.siteAnalytics || "",
          postsPerPage: parseInt(data.data.postsPerPage || "10"),
          enableComments: data.data.enableComments === "true",
          enableRss: data.data.enableRss === "true",
          enableSitemap: data.data.enableSitemap === "true",
          socialGithub: data.data.socialGithub || "",
          socialTwitter: data.data.socialTwitter || "",
          socialWeibo: data.data.socialWeibo || "",
          socialEmail: data.data.socialEmail || "",
          siteProfileBanner: data.data.siteProfileBanner || "",
          siteMotto: data.data.siteMotto || "记录与分享，让技术更有温度",
          siteAvatar: data.data.siteAvatar || "",
        });
      }
    } catch (error) {
      message.error("加载失败");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values: any) => {
    setSaving(true);
    try {
      const settings = {
        ...values,
        postsPerPage: values.postsPerPage?.toString() || "10",
        enableComments: values.enableComments ? "true" : "false",
        enableRss: values.enableRss ? "true" : "false",
        enableSitemap: values.enableSitemap ? "true" : "false",
      };

      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      const data = await res.json();
      if (data.success) {
        message.success("保存成功");
      } else {
        message.error(data.error || "保存失败");
      }
    } catch (error) {
      message.error("保存失败");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Spin spinning={loading}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <div>
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 600 }}>网站设置</h2>
          <p style={{ margin: "4px 0 0", color: "#999" }}>
            配置网站的基本信息和功能选项
          </p>
        </div>
        <Button
          type="primary"
          icon={<SaveOutlined />}
          loading={saving}
          onClick={() => form.submit()}
        >
          保存设置
        </Button>
      </div>

      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={[
            { key: "basic", label: "基本设置" },
            { key: "profile", label: "个人简介" },
            { key: "seo", label: "SEO 设置" },
            { key: "display", label: "显示设置" },
            { key: "social", label: "社交媒体" },
          ]}
        />

        {/* 基本设置 */}
        <Card style={{ display: activeTab === "basic" ? "block" : "none" }}>
          <Form.Item
            label="网站名称"
            name="siteName"
            rules={[{ required: true, message: "请输入网站名称" }]}
          >
            <Input placeholder="请输入网站名称" />
          </Form.Item>
          <Form.Item
            label="网站描述"
            name="siteDescription"
            rules={[{ required: true, message: "请输入网站描述" }]}
          >
            <TextArea
              rows={3}
              placeholder="请输入网站描述"
              showCount
              maxLength={200}
            />
          </Form.Item>
          <Form.Item
            label="网站关键词"
            name="siteKeywords"
            help="多个关键词用逗号分隔"
          >
            <Input placeholder="博客,技术,分享" />
          </Form.Item>
          <Form.Item label="网站地址" name="siteUrl">
            <Input placeholder="https://example.com" />
          </Form.Item>
          <Form.Item label="网站作者" name="siteAuthor">
            <Input placeholder="请输入作者名称" />
          </Form.Item>
          <Form.Item label="联系邮箱" name="siteEmail">
            <Input type="email" placeholder="admin@example.com" />
          </Form.Item>
          <Form.Item label="ICP 备案号" name="siteIcp">
            <Input placeholder="请输入 ICP 备案号" />
          </Form.Item>
        </Card>

        {/* 个人简介 */}
        <Card style={{ display: activeTab === "profile" ? "block" : "none" }}>
          <Form.Item
            label="侧边栏背景图"
            name="siteProfileBanner"
            help="个人简介卡片顶部背景图，建议尺寸 400×120 左右"
          >
            <Input
              placeholder="点击选择或输入图片地址"
              addonAfter={
                <Button
                  type="link"
                  size="small"
                  icon={<PictureOutlined />}
                  onClick={() => setBannerPickerOpen(true)}
                >
                  选择
                </Button>
              }
            />
          </Form.Item>
          <Form.Item
            noStyle
            shouldUpdate={(prev, curr) => prev.siteProfileBanner !== curr.siteProfileBanner}
          >
            {({ getFieldValue }) => {
              const banner = getFieldValue("siteProfileBanner");
              if (!banner) return null;
              return (
                <div style={{ marginBottom: 16 }}>
                  <Image
                    src={banner}
                    alt="背景预览"
                    style={{ maxWidth: 300, maxHeight: 90, objectFit: "cover", borderRadius: 8 }}
                  />
                </div>
              );
            }}
          </Form.Item>
          <Form.Item
            label="个人格言"
            name="siteMotto"
            help="显示在侧边栏个人简介卡片中"
          >
            <TextArea
              rows={2}
              placeholder="记录与分享，让技术更有温度"
              maxLength={100}
              showCount
            />
          </Form.Item>
          <Form.Item
            label="个人头像"
            name="siteAvatar"
            help="个人简介卡片头像，建议正方形图片"
          >
            <Input
              placeholder="点击选择或输入图片地址"
              addonAfter={
                <Button
                  type="link"
                  size="small"
                  icon={<PictureOutlined />}
                  onClick={() => setAvatarPickerOpen(true)}
                >
                  选择
                </Button>
              }
            />
          </Form.Item>
          <Form.Item
            noStyle
            shouldUpdate={(prev, curr) => prev.siteAvatar !== curr.siteAvatar}
          >
            {({ getFieldValue }) => {
              const avatar = getFieldValue("siteAvatar");
              if (!avatar) return null;
              return (
                <div style={{ marginBottom: 16 }}>
                  <Image
                    src={avatar}
                    alt="头像预览"
                    width={80}
                    height={80}
                    style={{ borderRadius: "50%", objectFit: "cover" }}
                  />
                </div>
              );
            }}
          </Form.Item>
          <ImagePicker
            open={bannerPickerOpen}
            onClose={() => setBannerPickerOpen(false)}
            onSelect={(filepath) => {
              form.setFieldValue("siteProfileBanner", filepath);
              setBannerPickerOpen(false);
            }}
            value={form.getFieldValue("siteProfileBanner")}
          />
          <ImagePicker
            open={avatarPickerOpen}
            onClose={() => setAvatarPickerOpen(false)}
            onSelect={(filepath) => {
              form.setFieldValue("siteAvatar", filepath);
              setAvatarPickerOpen(false);
            }}
            value={form.getFieldValue("siteAvatar")}
          />
        </Card>

        {/* SEO 设置 */}
        <Card style={{ display: activeTab === "seo" ? "block" : "none" }}>
          <Form.Item
            label="统计代码"
            name="siteAnalytics"
            help="Google Analytics 或百度统计代码"
          >
            <TextArea
              rows={6}
              placeholder="请粘贴统计代码"
              style={{ fontFamily: "monospace" }}
            />
          </Form.Item>
          <Form.Item
            label="生成 Sitemap"
            name="enableSitemap"
            valuePropName="checked"
          >
            <Switch checkedChildren="开启" unCheckedChildren="关闭" />
          </Form.Item>
          <Form.Item label="生成 RSS" name="enableRss" valuePropName="checked">
            <Switch checkedChildren="开启" unCheckedChildren="关闭" />
          </Form.Item>
        </Card>

        {/* 显示设置 */}
        <Card style={{ display: activeTab === "display" ? "block" : "none" }}>
          <Form.Item
            label="每页文章数"
            name="postsPerPage"
            rules={[{ required: true, message: "请输入每页文章数" }]}
          >
            <InputNumber min={1} max={50} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            label="启用评论"
            name="enableComments"
            valuePropName="checked"
          >
            <Switch checkedChildren="开启" unCheckedChildren="关闭" />
          </Form.Item>
        </Card>

        {/* 社交媒体 */}
        <Card style={{ display: activeTab === "social" ? "block" : "none" }}>
          <Form.Item label="GitHub" name="socialGithub">
            <Input placeholder="https://github.com/username" prefix="🐙" />
          </Form.Item>
          <Form.Item label="Twitter" name="socialTwitter">
            <Input placeholder="https://twitter.com/username" prefix="🐦" />
          </Form.Item>
          <Form.Item label="微博" name="socialWeibo">
            <Input placeholder="https://weibo.com/username" prefix="📱" />
          </Form.Item>
          <Form.Item label="邮箱" name="socialEmail">
            <Input placeholder="contact@example.com" prefix="📧" />
          </Form.Item>
        </Card>
      </Form>
    </Spin>
  );
}
