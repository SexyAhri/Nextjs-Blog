"use client";

import { useState, useEffect } from "react";
import { Row, Col, Card, Spin, Table, Select } from "antd";
import {
  EyeOutlined,
  UserOutlined,
  FileTextOutlined,
  RiseOutlined,
} from "@ant-design/icons";
import { MetricCard } from "@/components/common";
import Link from "next/link";

interface StatsData {
  totalViews: number;
  uniqueVisitors: number;
  topPosts: Array<{
    id: string;
    title: string;
    slug: string;
    viewCount: number;
  }>;
  referers: Array<{ referer: string; count: number }>;
  dailyStats: Array<{ date: string; count: number }>;
}

export default function StatsPage() {
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(7);
  const [stats, setStats] = useState<StatsData | null>(null);

  useEffect(() => {
    loadStats();
  }, [days]);

  const loadStats = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/stats?days=${days}`);
      const data = await res.json();
      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error("Failed to load stats:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !stats) {
    return (
      <div style={{ textAlign: "center", padding: 100 }}>
        <Spin size="large" />
      </div>
    );
  }

  const topPostsColumns = [
    {
      title: "文章",
      dataIndex: "title",
      key: "title",
      ellipsis: true,
      render: (text: string, record: any) => (
        <Link href={`/posts/${record.slug}`} target="_blank">
          {text}
        </Link>
      ),
    },
    {
      title: "浏览量",
      dataIndex: "viewCount",
      key: "viewCount",
      width: 100,
    },
  ];

  const refererColumns = [
    {
      title: "来源",
      dataIndex: "referer",
      key: "referer",
      ellipsis: true,
      render: (text: string) => {
        try {
          const url = new URL(text);
          return url.hostname;
        } catch {
          return text || "直接访问";
        }
      },
    },
    {
      title: "次数",
      dataIndex: "count",
      key: "count",
      width: 80,
    },
  ];

  const dailyColumns = [
    { title: "日期", dataIndex: "date", key: "date" },
    { title: "访问量", dataIndex: "count", key: "count" },
  ];

  return (
    <div>
      <div
        style={{
          marginBottom: 16,
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <h2 style={{ margin: 0 }}>访问统计</h2>
        <Select
          value={days}
          onChange={setDays}
          style={{ width: 120 }}
          options={[
            { value: 7, label: "最近 7 天" },
            { value: 14, label: "最近 14 天" },
            { value: 30, label: "最近 30 天" },
          ]}
        />
      </div>

      <Row gutter={12}>
        <Col xs={12} sm={6}>
          <MetricCard
            title="总访问量"
            value={stats.totalViews}
            icon={<EyeOutlined />}
            color="#1890ff"
          />
        </Col>
        <Col xs={12} sm={6}>
          <MetricCard
            title="独立访客"
            value={stats.uniqueVisitors}
            icon={<UserOutlined />}
            color="#52c41a"
          />
        </Col>
        <Col xs={12} sm={6}>
          <MetricCard
            title="日均访问"
            value={Math.round(stats.totalViews / days)}
            icon={<RiseOutlined />}
            color="#faad14"
          />
        </Col>
        <Col xs={12} sm={6}>
          <MetricCard
            title="热门文章"
            value={stats.topPosts.length}
            icon={<FileTextOutlined />}
            color="#722ed1"
          />
        </Col>
      </Row>

      <Row gutter={12} style={{ marginTop: 12 }}>
        <Col xs={24} lg={12}>
          <Card title="每日访问" size="small">
            <Table
              columns={dailyColumns}
              dataSource={stats.dailyStats}
              rowKey="date"
              size="small"
              pagination={false}
            />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="热门文章 TOP 10" size="small">
            <Table
              columns={topPostsColumns}
              dataSource={stats.topPosts}
              rowKey="id"
              size="small"
              pagination={false}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={12} style={{ marginTop: 12 }}>
        <Col xs={24}>
          <Card title="访问来源" size="small">
            <Table
              columns={refererColumns}
              dataSource={stats.referers}
              rowKey="referer"
              size="small"
              pagination={false}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
