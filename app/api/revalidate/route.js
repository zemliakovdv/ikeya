import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';

const ALLOWED_PREFIX = '/catalog/seo/';
const SITEMAP_PATH = '/sitemap.xml';

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
  return path.startsWith(ALLOWED_PREFIX);
}

function collectCandidatePaths(payload) {
  const candidates = [];

  if (Array.isArray(payload?.paths)) {
    candidates.push(...payload.paths);
  }

  if (payload?.type === 'seo_catalog_page' && typeof payload?.slug === 'string' && payload.slug.trim()) {
    candidates.push(`${ALLOWED_PREFIX}${payload.slug.trim()}`);
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
