/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: 'export',
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  // Next.js 15 specific optimizations
  experimental: {
    // Enable new features if needed
  },
};

module.exports = nextConfig;
