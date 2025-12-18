// PM2 ecosystem конфигурация для IKEYA Frontend
module.exports = {
  apps: [
    {
      name: 'ikea_front',
      script: 'npm',
      args: 'start',
      cwd: '/home/deploy/apps/ikea_front',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
        BASE_PATH: '/ikea_front',
      },
      error_file: '/home/deploy/apps/ikea_front/logs/error.log',
      out_file: '/home/deploy/apps/ikea_front/logs/out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      autorestart: true,
      max_restarts: 10,
      min_uptime: '10s',
      watch: false,
      max_memory_restart: '500M',
    },
  ],
}

