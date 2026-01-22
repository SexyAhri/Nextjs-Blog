"use client";

import Script from "next/script";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function Analytics() {
  const [gaId, setGaId] = useState<string | null>(null);
  const pathname = usePathname();

  // 加载 Google Analytics 配置
  useEffect(() => {
    fetch("/api/settings/analytics")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.code) {
          // 提取 Google Analytics ID
          const match = data.code.match(/G-[A-Z0-9]+/);
          if (match) {
            setGaId(match[0]);
          }
        }
      })
      .catch(console.error);
  }, []);

  // 记录页面访问到数据库
  useEffect(() => {
    // 排除管理后台
    if (pathname.startsWith("/admin")) return;

    fetch("/api/stats", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path: pathname }),
    }).catch(() => {
      // 静默失败
    });
  }, [pathname]);

  if (!gaId) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${gaId}');
        `}
      </Script>
    </>
  );
}
