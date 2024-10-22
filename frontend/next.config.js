import nextRemoveImports from "next-remove-imports";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};

const removeImports = nextRemoveImports();

export default removeImports(nextConfig);
