const CYRILLIC_RE = /[а-яё]/i;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function hasCyrillicChars(value = '') {
  return CYRILLIC_RE.test(String(value));
}

export function isEmailFormatValid(value = '') {
  const email = String(value).trim();
  if (!email) return false;
  if (hasCyrillicChars(email)) return false;
  if (email.includes('..')) return false;
  return EMAIL_RE.test(email);
}
