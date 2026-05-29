import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // Disable type checking during build to save memory
    ignoreBuildErrors: true,
  },
  // Disable browser source maps in production to save memory
  productionBrowserSourceMaps: false,
  experimental: {
    // Force exactly 1 build/compilation CPU worker to prevent OOM on 512MB RAM Render containers
    cpus: 1,
    // Optimize memory during Webpack/Turbopack compilation
    webpackMemoryOptimizations: true,
    // Disable Webpack build worker process to run compilation in the main process and save memory
    webpackBuildWorker: false,
  },
};

export default nextConfig;
