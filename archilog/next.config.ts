import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

const removeImports = require('next-remove-imports')();
module.exports = removeImports({});


export default nextConfig;