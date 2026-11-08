/** @type {import('next').NextConfig} */
const nextConfig = {
  // The homepage was reviewed at /test before it replaced the old one
  async redirects() {
    return [{ source: '/test', destination: '/', permanent: false }]
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'plus.unsplash.com' },
    ],
  },
}
module.exports = nextConfig
