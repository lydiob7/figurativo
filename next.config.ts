import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      new URL('https://imgs.search.brave.com/**'),
      {
        protocol: 'https',
        hostname: 'cdn.wallapop.com',
        pathname: '/images/**',
      },
    ],
  },
}

export default nextConfig
