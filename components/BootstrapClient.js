'use client';

// components/BootstrapClient.js
// Подключает Bootstrap JS (bundle с Popper) на клиенте после монтирования.
// Заменяет CDN-скрипты popper.min.js и bootstrap.min.js.

import { useEffect } from 'react';

export default function BootstrapClient() {
  useEffect(() => {
    import('bootstrap/dist/js/bootstrap.bundle.min.js');
  }, []);

  return null;
}