import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Gzip/Brotli compress responses at the Next.js server layer.
  compress: true,
  // Do not leak the framework in the X-Powered-By response header.
  poweredByHeader: false,
  // React strict mode helps surface unsafe double effects during
  // development (relevant since AdUnit guards against double-push).
  reactStrictMode: true,
  images: {
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
