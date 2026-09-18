/** @type {import('next').NextConfig} */
const isStatic = process.env.STATIC_EXPORT === '1';

const nextConfig = {
  reactStrictMode: true,
  // STATIC_EXPORT=1 produces a fully static ./out folder for DreamHost shared hosting.
  // Without it, the app builds normally for Vercel.
  ...(isStatic ? { output: 'export', images: { unoptimized: true } } : {}),
  trailingSlash: isStatic,
  images: {
    formats: ['image/avif', 'image/webp'],
    unoptimized: isStatic,
  },
  poweredByHeader: false,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? { exclude: ['error', 'warn'] } : false,
  },
};

export default nextConfig;
