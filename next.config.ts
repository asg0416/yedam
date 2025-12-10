import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // output: "export", // Disabled to enable Server Actions for on-demand revalidation
  images: {
    loader: "custom",
    loaderFile: "./lib/imageLoader.ts",
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  typescript: {
    // ignoreBuildErrors: true,
  },
};

export default nextConfig;
