/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 828, 1080, 1440, 1920, 2400],
    imageSizes: [96, 160, 256, 384],
    minimumCacheTTL: 31536000,
  },
}

export default nextConfig
