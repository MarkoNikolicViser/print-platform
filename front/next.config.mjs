/** @type {import('next').NextConfig} */

import path from "path";

const STRAPI_API_BASE = "https://tranquil-wonder-8d0bf7e262.strapiapp.com";

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

  /**
   * Proxy API requests:
   * /api/*  ->  https://tranquil-wonder-8d0bf7e262.strapiapp.com/api/*
   */
 
async rewrites() {
  return [
    {
      source: "/strapi/:path*",
      destination: "https://tranquil-wonder-8d0bf7e262.strapiapp.com/api/:path*",
    },
  ];
}

};

export default nextConfig;