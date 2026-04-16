/** @type {import('next').NextConfig} */
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
        destination: 'https://test.ikeya.by/api/v1/:path*',
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