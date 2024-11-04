import type { NextConfig } from "next";

const removeImports = require('next-remove-imports')();
const nextConfig: NextConfig = {
  /* config options here */
};
module.exports = removeImports({
  // output: 'export',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
        pathname: '/v0/b/**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  ...nextConfig
});

export default nextConfig;