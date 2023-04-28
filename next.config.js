/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: "/:path*",
        destination: "https://www.closingdoors.nyc/chat",
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
