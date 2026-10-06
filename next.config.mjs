/** @type {import('next').NextConfig} */
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
        destination: 'https://api.infoeight.com/:path*',
      },
      {
        source: '/api',
        destination: 'https://api.infoeight.com/',
      },
    ];
  },
};

export default nextConfig;