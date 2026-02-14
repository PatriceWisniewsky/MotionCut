import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Transpile workspace packages for Remotion Player + shared types
  transpilePackages: ["@motioncut/video-engine", "@motioncut/video-types"],

  // Turbopack config (Next.js 16+ uses Turbopack by default)
  turbopack: {},

  // Allow images from Supabase Storage
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.supabase.co",
      },
    ],
  },
};

export default nextConfig;
