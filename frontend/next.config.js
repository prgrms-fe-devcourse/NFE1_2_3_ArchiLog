import nextRemoveImports from "next-remove-imports";


// NO배포
// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   reactStrictMode: true,
// };

// const removeImports = nextRemoveImports();

// export default removeImports(nextConfig);

// 배포용
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',  
  images: {
    unoptimized: true  
  }
}

module.exports = nextConfig