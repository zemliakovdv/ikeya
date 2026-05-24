function isIkeyaBackendHostname(hostname) {
  if (!hostname) return false;
  return (
    hostname === 'ikeya.by' ||
    hostname.endsWith('.ikeya.by') ||
    hostname === 'localhost' ||
    hostname === '127.0.0.1'
  );
}

export function normalizeOrigin(value) {
  if (!value || typeof value !== 'string') return '';
  return value.trim().replace(/\/+$/, '');
}

export function normalizeApiBase(value) {
  if (!value || typeof value !== 'string') return '/api/v1';

  let base = value.trim().replace(/\/+$/, '');
  if (!base) return '/api/v1';

  if (base.startsWith('/')) {
    if (base.endsWith('/api/v1')) return base;
    return `${base}/api/v1`.replace(/\/api\/v1\/api\/v1$/, '/api/v1');
  }

  base = base.replace(/(\/api\/v1)+$/, '/api/v1');

  if (base.endsWith('/api/v1')) {
    return base;
  }

  return `${base}/api/v1`;
}

export function joinUrl(base, path) {
  const cleanBase = (base || '').replace(/\/+$/, '');
  const cleanPath = String(path || '').replace(/^\/+/, '');

  if (!cleanPath) return cleanBase;
  if (!cleanBase) return `/${cleanPath}`;

  return `${cleanBase}/${cleanPath}`;
}

function isExternalUrl(value) {
  return /^https?:\/\//i.test(String(value || '').trim());
}

function stripApiV1Prefix(path) {
  let normalized = String(path || '').trim();

  if (normalized.startsWith('/api/v1/')) {
    normalized = normalized.slice('/api/v1'.length);
  } else if (normalized === '/api/v1') {
    normalized = '/';
  } else if (normalized.startsWith('api/v1/')) {
    normalized = `/${normalized.slice('api/v1'.length)}`;
  } else if (normalized === 'api/v1') {
    normalized = '/';
  }

  if (!normalized.startsWith('/')) {
    normalized = `/${normalized}`;
  }

  return normalized;
}

const isServer = typeof window === 'undefined';

const SERVER_BACKEND_ORIGIN =
  process.env.BACKEND_ORIGIN ||
  process.env.NEXT_PUBLIC_BACKEND_ORIGIN ||
  process.env.NEXT_PUBLIC_SITE_URL ||
  '';

const CLIENT_BACKEND_ORIGIN =
  process.env.NEXT_PUBLIC_BACKEND_ORIGIN ||
  process.env.NEXT_PUBLIC_SITE_URL ||
  '';

const SELECTED_BACKEND_ORIGIN = isServer
  ? SERVER_BACKEND_ORIGIN
  : CLIENT_BACKEND_ORIGIN;

export const BACKEND_ORIGIN = normalizeOrigin(SELECTED_BACKEND_ORIGIN);

export const API_BASE_URL = normalizeApiBase(
  isServer
    ? (
        process.env.BACKEND_API_BASE_URL ||
        process.env.API_BASE_URL ||
        (BACKEND_ORIGIN ? `${BACKEND_ORIGIN}/api/v1` : process.env.NEXT_PUBLIC_API_BASE_URL)
      )
    : (
        process.env.NEXT_PUBLIC_API_BASE_URL ||
        process.env.NEXT_PUBLIC_API_URL ||
        (BACKEND_ORIGIN ? `${BACKEND_ORIGIN}/api/v1` : '/api/v1')
      )
);

export const IMAGES_BASE_URL = normalizeOrigin(
  process.env.NEXT_PUBLIC_IMAGE_URL ||
    process.env.NEXT_PUBLIC_IMAGES_BASE_URL ||
    BACKEND_ORIGIN
);

export const SITE_URL = normalizeOrigin(
  process.env.NEXT_PUBLIC_SITE_URL || BACKEND_ORIGIN
);

export function buildApiUrl(endpoint) {
  if (!endpoint) return API_BASE_URL;

  const value = String(endpoint).trim();
  if (!value) return API_BASE_URL;
  if (isExternalUrl(value)) return value;

  const [pathPart, queryPart] = value.split('?');
  const path = stripApiV1Prefix(pathPart);
  const suffix = queryPart ? `?${queryPart}` : '';

  if (API_BASE_URL.startsWith('/')) {
    return `${joinUrl(API_BASE_URL, path.replace(/^\//, ''))}${suffix}`;
  }

  const base = API_BASE_URL.replace(/\/api\/v1$/, '');
  const apiBase = base.endsWith('/api/v1') ? API_BASE_URL : normalizeApiBase(API_BASE_URL);

  return `${joinUrl(apiBase, path.replace(/^\//, ''))}${suffix}`;
}

export function buildBackendUrl(path) {
  if (!path) return BACKEND_ORIGIN || '';

  const value = String(path).trim();
  if (!value) return BACKEND_ORIGIN || '';
  if (isExternalUrl(value)) return value;

  const origin =
    process.env.NEXT_PUBLIC_BACKEND_ORIGIN ||
    BACKEND_ORIGIN ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    '';

  if (!origin) {
    return value.startsWith('/') ? value : `/${value}`;
  }

  return joinUrl(normalizeOrigin(origin), value);
}

function collectKnownOrigins() {
  return [
    BACKEND_ORIGIN,
    IMAGES_BASE_URL,
    normalizeOrigin(process.env.NEXT_PUBLIC_BACKEND_ORIGIN || ''),
    normalizeOrigin(process.env.NEXT_PUBLIC_IMAGE_URL || ''),
    normalizeOrigin(process.env.NEXT_PUBLIC_SITE_URL || ''),
  ]
    .map(normalizeOrigin)
    .filter(Boolean);
}

export function stripBackendOrigin(path) {
  if (!path || typeof path !== 'string') return path;

  const result = path.trim();

  if (isExternalUrl(result)) {
    try {
      const url = new URL(result);
      if (isIkeyaBackendHostname(url.hostname)) {
        return `${url.pathname}${url.search}${url.hash}`.replace(/^\//, '');
      }
    } catch {
      return result;
    }
  }

  const origins = collectKnownOrigins();
  for (const origin of origins) {
    const prefix = `${origin}/`;
    if (result.startsWith(prefix)) {
      return result.slice(prefix.length);
    }
    if (result === origin) {
      return '';
    }
  }

  return result;
}

export function buildAssetUrl(path) {
  if (!path) return null;

  const value = String(path).trim();
  if (!value) return null;

  if (isExternalUrl(value)) {
    try {
      const url = new URL(value);
      if (isIkeyaBackendHostname(url.hostname)) {
        const base = IMAGES_BASE_URL || BACKEND_ORIGIN;
        if (base) {
          return joinUrl(base, `${url.pathname}${url.search}${url.hash}`.replace(/^\//, ''));
        }
      }
      return value;
    } catch {
      return value;
    }
  }

  const base = IMAGES_BASE_URL || BACKEND_ORIGIN;
  if (!base) return value;

  return joinUrl(base, value.startsWith('/') ? value.slice(1) : value);
}
