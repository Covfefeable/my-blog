/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: process.env.NEXT_DIST_DIR || ".next",
  output: "standalone",
  experimental: {
    serverComponentsExternalPackages: ["sanitize-html"],
  },
  images: {
    remotePatterns: [],
  },
};

export default nextConfig;
