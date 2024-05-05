const isProd = process.env.ENVIRONMENT === 'production';

/** @type {import('next').NextConfig} */
const nextConfig = isProd ? {
  output: "export",
  basePath: '/NoPixel-MiniGames-4.0',
  assetPrefix: '/NoPixel-MiniGames-4.0',
  images: {
    unoptimized: true,
  }
} : {};

export default nextConfig;
