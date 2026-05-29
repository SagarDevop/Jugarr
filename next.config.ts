import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // Disable type checking during build to save memory
    ignoreBuildErrors: true,
  },
  // Disable browser source maps in production to save memory
  productionBrowserSourceMaps: false,
  experimental: {
    // Optimize memory during Webpack/Turbopack compilation
    webpackMemoryOptimizations: true,
  },
};

export default nextConfig;
