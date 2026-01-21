"use client";

import Script from "next/script";
import { useEffect, useState } from "react";

export default function Analytics() {
  const [gaId, setGaId] = useState<string | null>(null);

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
