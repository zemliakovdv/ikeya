const BELARUS_COUNTRY_CODE = '375';
const BELARUS_LOCAL_DIGITS = 9;

export function extractBelarusPhoneDigits(value = '') {
  let digits = String(value).replace(/\D/g, '');

  if (digits.startsWith(BELARUS_COUNTRY_CODE)) {
    digits = digits.slice(BELARUS_COUNTRY_CODE.length);
  }

  return digits.slice(0, BELARUS_LOCAL_DIGITS);
}

export function isBelarusPhoneComplete(digits = '') {
  return extractBelarusPhoneDigits(digits).length === BELARUS_LOCAL_DIGITS;
}

export function toBelarusPhoneApiValue(digits = '') {
  const local = extractBelarusPhoneDigits(digits);
  if (local.length !== BELARUS_LOCAL_DIGITS) return '';
  return `${BELARUS_COUNTRY_CODE}${local}`;
}

export function formatBelarusPhoneLocalMask(digits = '') {
  const local = extractBelarusPhoneDigits(digits);
  const mask = '(__) ___-__-__';
  let i = 0;

  return mask.replace(/_/g, () => local[i++] ?? '_');
}

export function formatBelarusPhoneFullMask(digits = '') {
  return `+${BELARUS_COUNTRY_CODE} ${formatBelarusPhoneLocalMask(digits)}`;
}
export function formatBelarusPhone(raw) {
  if (!raw) return '—';

  const digits = String(raw).replace(/\D/g, '');
  if (!digits) return '—';

  const normalized = digits.length === 9 ? `375${digits}` : digits;

  if (normalized.length === 12 && normalized.startsWith('375')) {
    return `+${normalized.slice(0, 3)} (${normalized.slice(3, 5)}) ${normalized.slice(5, 8)}-${normalized.slice(8, 10)}-${normalized.slice(10, 12)}`;
  }

  return `+${normalized}`;
}
