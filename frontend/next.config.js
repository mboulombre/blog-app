// frontend/next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // ignore ESLint lors du build sur Vercel
  },
};

module.exports = nextConfig;
