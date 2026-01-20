import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXTAUTH_URL || "https://blog.vixenahri.cn";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/api/admin/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
