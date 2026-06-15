import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';

const LEGACY_SEO_PREFIX = '/catalog/seo/';
const CATALOG_PREFIX = '/catalog/';
const SITEMAP_PATH = '/sitemap.xml';

function isLegacySeoCatalogPath(path) {
  return /^\/catalog\/seo\/[^/]+\/?$/.test(path);
}

function isSingleSeoCatalogPath(path) {
  return /^\/catalog\/[^/]+\/?$/.test(path);
}

function buildLegacySeoPath(slug) {
  return `${LEGACY_SEO_PREFIX}${slug}`;
}

function buildSeoCatalogPath(slug) {
  return `${CATALOG_PREFIX}${slug}`;
}

function getSlugFromLegacySeoPath(path) {
  const match = path.match(/^\/catalog\/seo\/([^/]+)\/?$/);
  return match?.[1] || '';
}

function getConfiguredSecret() {
  return process.env.REVALIDATE_SECRET || process.env.NEXT_REVALIDATE_SECRET || '';
}

function isAllowedPath(path) {
  if (typeof path !== 'string') return false;
  if (!path) return false;
  if (!path.startsWith('/')) return false;
  if (path.includes('..')) return false;
  if (/^https?:\/\//i.test(path)) return false;
  if (path === SITEMAP_PATH) return true;
  return isLegacySeoCatalogPath(path) || isSingleSeoCatalogPath(path);
}

function collectCandidatePaths(payload) {
  const candidates = [];

  if (typeof payload?.path === 'string') {
    const path = payload.path.trim();

    if (path) {
      candidates.push(path);

      if (isLegacySeoCatalogPath(path)) {
        const slug = getSlugFromLegacySeoPath(path);

        if (slug) {
          candidates.push(buildSeoCatalogPath(slug));
        }
      }
    }
  }

  if (Array.isArray(payload?.paths)) {
    candidates.push(...payload.paths);
  }

  if (payload?.type === 'seo_catalog_page' && typeof payload?.slug === 'string' && payload.slug.trim()) {
    const slug = payload.slug.trim();
    candidates.push(buildLegacySeoPath(slug));
    candidates.push(buildSeoCatalogPath(slug));
  }

  if (payload?.sitemap === true) {
    candidates.push(SITEMAP_PATH);
  }

  return candidates;
}

function splitPaths(paths) {
  const revalidated = [];
  const skipped = [];
  const seen = new Set();

  for (const rawPath of paths) {
    const path = typeof rawPath === 'string' ? rawPath.trim() : '';

    if (!isAllowedPath(path)) {
      skipped.push(rawPath);
      continue;
    }

    if (seen.has(path)) {
      continue;
    }

    seen.add(path);
    revalidated.push(path);
  }

  return { revalidated, skipped };
}

export async function GET() {
  return NextResponse.json(
    { ok: false, error: 'Method not allowed' },
    { status: 405 }
  );
}

export async function POST(request) {
  const configuredSecret = getConfiguredSecret();

  if (!configuredSecret) {
    return NextResponse.json(
      { ok: false, error: 'Revalidate secret is not configured' },
      { status: 500 }
    );
  }

  let payload;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: 'Invalid JSON body' },
      { status: 400 }
    );
  }

  if (payload?.secret !== configuredSecret) {
    return NextResponse.json(
      { ok: false, error: 'Invalid secret' },
      { status: 401 }
    );
  }

  try {
    const candidates = collectCandidatePaths(payload);
    const { revalidated, skipped } = splitPaths(candidates);

    if (revalidated.length === 0) {
      return NextResponse.json(
        { ok: false, error: 'No valid paths to revalidate', skipped },
        { status: 400 }
      );
    }

    for (const path of revalidated) {
      revalidatePath(path);
    }

    return NextResponse.json({
      ok: true,
      revalidated,
      skipped,
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : 'Failed to revalidate paths',
      },
      { status: 500 }
    );
  }
}
