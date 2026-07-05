const CYRILLIC_NAME_PATTERN = /^[А-ЯЁа-яё -]+$/;
const HAS_CYRILLIC_LETTER_PATTERN = /[А-ЯЁа-яё]/;

export function normalizePersonName(value = '') {
  return String(value).trim();
}

export function isValidPersonName(value = '') {
  const normalized = normalizePersonName(value);
  return (
    normalized.length > 0 &&
    CYRILLIC_NAME_PATTERN.test(normalized) &&
    HAS_CYRILLIC_LETTER_PATTERN.test(normalized)
  );
}
