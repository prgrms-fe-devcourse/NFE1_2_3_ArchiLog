import type { NextConfig } from "next";

const removeImports = require('next-remove-imports')();
const nextConfig: NextConfig = {
  /* config options here */
};
module.exports = removeImports({
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
        pathname: '/v0/b/**',
      },
    ],
  },
  ...nextConfig
});

export default nextConfig;