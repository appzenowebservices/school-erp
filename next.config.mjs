/** @type {import('next').NextConfig} */
// ERP base URLs are env-driven (see config/server.js). Defaults are LOCAL so a
// dev/test build can never proxy to production by accident.
const API_BASE = (process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:4010').replace(/\/+$/, '');

const nextConfig = {
  images: {
    domains: [
      'localhost',
      'infoeight-s3-new.s3.ap-south-1.amazonaws',
      'infoeight-s3-new.s3.ap-south-1.amazonaws.com'
    ],
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${API_BASE}/:path*`,
      },
      {
        source: '/api',
        destination: `${API_BASE}/`,
      },
    ];
  },
};

export default nextConfig;
