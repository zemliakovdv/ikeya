/** @type {import('next').NextConfig} */
const rawBackendOrigin =
  process.env.BACKEND_ORIGIN ||
  process.env.NEXT_PUBLIC_BACKEND_ORIGIN ||
  process.env.NEXT_PUBLIC_SITE_URL ||
  '';

if (!rawBackendOrigin && process.env.NODE_ENV === 'production') {
  throw new Error(
    '[next.config] BACKEND_ORIGIN / NEXT_PUBLIC_BACKEND_ORIGIN / NEXT_PUBLIC_SITE_URL is required for production build'
  );
}

const backendOrigin = (rawBackendOrigin || 'http://localhost:3000').replace(/\/$/, '');

const nextConfig = {
  output: 'standalone',
  trailingSlash: true,
images: {
  unoptimized: true,
  dangerouslyAllowSVG: true,
  remotePatterns: [
    {
      protocol: 'http',
      hostname: '**',
    },
    {
      protocol: 'https', 
      hostname: '**',
    },
  ],
},
  // Проксируем /api/v1/* через Next.js сервер на бэкенд.
  // Браузер делает fetch на /api/v1/... (относительный путь),
  // Next.js сервер перенаправляет на реальный бэкенд.
  // Это решает проблему обрыва скролла на продакшене.
  async rewrites() {
    return [
      {
        source: '/api/v1/:path*',
        destination: `${backendOrigin}/api/v1/:path*`,
      },
    ];
  },

  webpack: (config) => {
    config.module.rules.push({
      test: /\.json$/,
      type: 'json'
    });
    return config;
  }
}

module.exports = nextConfig