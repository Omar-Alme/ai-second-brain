import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      // Needed for server-action file uploads (default is 1MB).
      // https://nextjs.org/docs/app/api-reference/config/next-config-js/serverActions#bodysizelimit
      bodySizeLimit: "20mb",
    },
  },
};

export default nextConfig;
