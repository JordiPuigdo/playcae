/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "example.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "stplaycaeprodweu01.blob.core.windows.net",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "localhost",
        port: "7034",
        pathname: "/**",
      },
    ],
  },

  // Redirecciones para normalizar el dominio
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'playcae.com',
          },
        ],
        destination: 'https://www.playcae.com/:path*',
        permanent: true,
      },
    ];
  },

  // Headers de seguridad y SEO
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
