/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@/components", "@/app"],
};

// Using ES Module syntax instead of CommonJS
export default nextConfig;
