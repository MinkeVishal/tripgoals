import type { NextConfig } from 'next';

const appwriteHost = new URL(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT ?? 'https://cloud.appwrite.io/v1')
  .hostname;

const securityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
];

const nextConfig: NextConfig = {
  cacheComponents: true,
  turbopack: { root: process.cwd() },
  images: {
    remotePatterns: [{ protocol: 'https', hostname: appwriteHost }],
    formats: ['image/avif', 'image/webp'],
    // Appwrite files are immutable (new upload = new id), so optimised copies can live for a month.
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
  experimental: {
    // Vercel caps request bodies at 4.5 MB; images are compressed client-side before upload.
    serverActions: { bodySizeLimit: '4mb' },
  },
  async headers() {
    return [{ source: '/:path*', headers: securityHeaders }];
  },
};

export default nextConfig;
