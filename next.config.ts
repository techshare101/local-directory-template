import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // This app is fully data-driven from Supabase on every request, so we want
  // classic dynamic rendering (per-request) rather than static/cache-components
  // prerendering that would try to bake a Supabase fetch into the build.
  cacheComponents: false,
  partialPrefetching: false,
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
