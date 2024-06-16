/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: false,
  env: {
    api: 'http://localhost:5001/api/',
  },
  experimental: {
    // serverActions: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '**',
      },
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/profile/:params*',
        destination: '/profile',
      },
    ];
  }
};

module.exports = nextConfig;
