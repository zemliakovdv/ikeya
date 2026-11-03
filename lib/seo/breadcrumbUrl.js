import { SITE_URL } from '@/lib/config/api';

/**
 * Absolute BreadcrumbList item URL with a trailing slash.
 * Matches production trailingSlash redirects (308 → 200).
 */
export function toBreadcrumbListItemUrl(href) {
  if (href === null || href === undefined) return undefined;

  const raw = String(href).trim();
  if (!raw) return undefined;

  const siteOrigin = String(SITE_URL || 'https://ikeya.by').replace(/\/+$/, '') || 'https://ikeya.by';

  let absolute;
  if (/^https?:\/\//i.test(raw)) {
    absolute = raw;
  } else {
    const path = raw.startsWith('/') ? raw : `/${raw}`;
    absolute = `${siteOrigin}${path}`;
  }

  try {
    const url = new URL(absolute);
    if (!url.pathname.endsWith('/')) {
      url.pathname = `${url.pathname}/`;
    }
    return url.toString();
  } catch {
    return absolute.endsWith('/') ? absolute : `${absolute}/`;
  }
}
