/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    domains: ["avatars.dicebear.com"],
    unoptimized: true,
  },
};

module.exports = nextConfig;
