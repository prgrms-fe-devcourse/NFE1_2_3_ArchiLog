import type { NextConfig } from "next";

const removeImports = require('next-remove-imports')();
const nextConfig: NextConfig = {
  /* config options here */
};
module.exports = removeImports({
  ...nextConfig
});

export default nextConfig;