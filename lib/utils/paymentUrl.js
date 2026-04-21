// lib/utils/paymentUrl.js

const API_BASE_URL = 'https://test.ikeya.by';

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
    const correct = new URL(API_BASE_URL);
    parsed.protocol = correct.protocol;
    parsed.hostname = correct.hostname;
    parsed.port = correct.port; // у https://test.ikeya.by порт пустой
    return parsed.toString();
  } catch {
    return url;
  }
}