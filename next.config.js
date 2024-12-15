/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  env: {
    HUGGING_FACE_TOKEN: process.env.HUGGING_FACE_TOKEN,
  }
};

module.exports = nextConfig;