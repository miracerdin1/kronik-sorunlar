import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Site tamamen derleme anında üretilir; Netlify gibi statik barındırmada `out/` klasörü yayınlanır.
  output: "export",
  trailingSlash: true,
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
