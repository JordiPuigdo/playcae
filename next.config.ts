/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["example.com", "images.unsplash.com"],
  },

  // Redireccionamientos 301: www → non-www (canónico)
  async redirects() {
    return [
      // Redirige www.playcae.com → playcae.com
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "www.playcae.com",
          },
        ],
        destination: "https://playcae.com/:path*",
        permanent: true, // 301
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
