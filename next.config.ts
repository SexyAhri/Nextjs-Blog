/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "blog.vixenahri.cn", pathname: "/**" },
      { protocol: "http", hostname: "localhost", pathname: "/**" },
      { protocol: "http", hostname: "127.0.0.1", pathname: "/**" },
    ],
    // Docker standalone 部署时建议启用，避免 Alpine 下 sharp 兼容问题
    unoptimized: true,
  },
};

export default nextConfig;
