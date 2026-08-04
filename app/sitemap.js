import { BACKEND_ORIGIN, SITE_URL } from '@/lib/config/api';

export const revalidate = 86400;

const FALLBACK_ENTRIES = [
  { url: `${SITE_URL}/`, changeFrequency: 'daily', priority: 1 },
  { url: `${SITE_URL}/catalog/`, changeFrequency: 'daily', priority: 0.9 },
];

function backendSitemapUrl() {
  const origin = (BACKEND_ORIGIN || '').replace(/\/+$/, '');
  if (!origin) return null;
  return `${origin}/sitemap.xml`;
}

function parseSitemapXml(xml) {
  if (!xml || typeof xml !== 'string') return [];

  const entries = [];
  const urlBlocks = xml.match(/<url\b[^>]*>[\s\S]*?<\/url>/gi) || [];

  for (const block of urlBlocks) {
    const loc = block.match(/<loc>([\s\S]*?)<\/loc>/i)?.[1]?.trim();
    if (!loc) continue;

    const lastmod = block.match(/<lastmod>([\s\S]*?)<\/lastmod>/i)?.[1]?.trim();
    const changeFrequency = block.match(/<changefreq>([\s\S]*?)<\/changefreq>/i)?.[1]?.trim();
    const priorityRaw = block.match(/<priority>([\s\S]*?)<\/priority>/i)?.[1]?.trim();
    const priority = priorityRaw !== undefined ? Number(priorityRaw) : undefined;

    const entry = { url: loc };
    if (lastmod) {
      const parsed = new Date(lastmod);
      if (!Number.isNaN(parsed.getTime())) entry.lastModified = parsed;
    }
    if (changeFrequency) entry.changeFrequency = changeFrequency;
    if (Number.isFinite(priority)) entry.priority = priority;

    entries.push(entry);
  }

  return entries;
}

export default async function sitemap() {
  const url = backendSitemapUrl();

  if (!url) {
    console.error('sitemap: BACKEND_ORIGIN is empty, returning fallback entries');
    return FALLBACK_ENTRIES;
  }

  try {
    const response = await fetch(url, {
      headers: { Accept: 'application/xml,text/xml,*/*' },
      next: { revalidate },
    });

    if (!response.ok) {
      console.error(`sitemap: backend responded ${response.status} for ${url}`);
      return FALLBACK_ENTRIES;
    }

    const xml = await response.text();
    const entries = parseSitemapXml(xml);

    if (!entries.length) {
      console.error('sitemap: backend XML parsed to empty urlset');
      return FALLBACK_ENTRIES;
    }

    return entries;
  } catch (error) {
    console.error('sitemap: failed to load backend sitemap:', error?.message || error);
    return FALLBACK_ENTRIES;
  }
}
