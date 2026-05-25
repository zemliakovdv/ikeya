// lib/utils/paymentUrl.js

import { BACKEND_ORIGIN, buildBackendUrl } from '@/lib/config/api';

/**
 * Заменяет хост в payment_url на правильный.
 * Бэкенд иногда генерирует ссылку с localhost — фиксим на фронте.
 *
 * @param {string|null} url
 * @returns {string|null}
 */
export function resolvePaymentUrl(url) {
  if (!url) return null;
  try {
    const parsed = new URL(url);
    const origin = BACKEND_ORIGIN || buildBackendUrl('/');
    const correct = new URL(origin.endsWith('/') ? origin : `${origin}/`);
    parsed.protocol = correct.protocol;
    parsed.hostname = correct.hostname;
    parsed.port = correct.port;
    return parsed.toString();
  } catch {
    return url;
  }
}