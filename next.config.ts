/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  images: {
    domains: ["localhost", "blog.vixenahri.cn"],
    unoptimized: true,
  },
};

export default nextConfig;
