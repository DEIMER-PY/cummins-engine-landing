import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Landing 100% estática: `next build` genera ./out listo para cualquier hosting.
  output: "export",
  images: { unoptimized: true },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
