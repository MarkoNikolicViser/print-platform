/** @type {import('next').NextConfig} */

import path from "path";

const STRAPI_API_BASE = process.env.NEXT_PUBLIC_API_URL;

const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },

  webpack: (config) => {
    // Common alias pattern in Next.js projects:
    // '@' -> project root
    config.resolve.alias["@"] = path.resolve(process.cwd());
    return config;
  },

async rewrites() {
  return [
    {
      source: "/strapi/:path*",
      destination: `${STRAPI_API_BASE}/:path*`,
    },
  ];
}

};

export default nextConfig;