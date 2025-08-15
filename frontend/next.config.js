/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  pageExtensions: ['js', 'jsx'],
  output: 'export',
  images: {
    unoptimized: true
  }
}

module.exports = nextConfig
