import { NextResponse } from 'next/server';
import { buildApiUrl } from '@/lib/config/api';

export const dynamic = 'force-dynamic';

function extractErrorCode(payload) {
  return (
    payload?.code ||
    payload?.error?.code ||
    payload?.errors?.[0]?.code ||
    null
  );
}

function normalizeSimilarProducts(items) {
  if (!Array.isArray(items)) return [];

  return items
    .map((item) => {
      if (!item) return null;

      if (item.attributes) {
        return item;
      }

      if (typeof item === 'string' || typeof item === 'number') {
        const sku = String(item);
        return {
          id: sku,
          attributes: { sku },
        };
      }

      if (typeof item === 'object') {
        const attr = item.attributes || item.item?.attributes || null;
        if (attr) {
          return {
            id: item.id || item.item?.id || attr.sku || null,
            attributes: attr,
          };
        }

        const sku = item.sku || item.item?.sku || null;
        if (sku) {
          return {
            id: item.id || sku,
            attributes: { ...item, sku },
          };
        }
      }

      return null;
    })
    .filter(Boolean);
}

async function loadProductsBySkus(skus) {
  if (!skus.length) return [];

  const results = await Promise.allSettled(
    skus.map(async (sku) => {
      const res = await fetch(buildApiUrl(`/products/${sku}`), { cache: 'no-store' });
      if (!res.ok) return null;
      const payload = await res.json().catch(() => null);
      return payload?.data || null;
    })
  );

  return results
    .filter((result) => result.status === 'fulfilled' && result.value)
    .map((result) => result.value);
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const sku = searchParams.get('sku');

  if (!sku) {
    return NextResponse.json(
      { code: null, similar_products: [] },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(buildApiUrl(`/products/${sku}`), { cache: 'no-store' });
    const payload = await response.json().catch(() => null);
    const code = extractErrorCode(payload);

    if (code !== 'product_unavailable') {
      return NextResponse.json({
        code,
        similar_products: [],
      });
    }

    const rawSimilar =
      payload?.similar_products ||
      payload?.error?.similar_products ||
      payload?.data?.similar_products ||
      [];

    const normalized = normalizeSimilarProducts(rawSimilar);
    const fromPayload = normalized.filter((item) => item?.attributes);

    const missingSkus = normalized
      .filter((item) => !item?.attributes?.slug && !item?.attributes?.name_ru)
      .map((item) => item?.attributes?.sku)
      .filter(Boolean)
      .map((value) => Array.isArray(value) ? value[0] : value)
      .map(String);

    const fetchedProducts = await loadProductsBySkus(missingSkus.slice(0, 10));

    const seen = new Set();
    const merged = [...fromPayload, ...fetchedProducts]
      .filter((item) => {
        const rawSku = item?.attributes?.sku || item?.id;
        const sku = Array.isArray(rawSku) ? rawSku[0] : rawSku;
        const key = String(sku || '');
        if (!key || seen.has(key)) return false;
        seen.add(key);
        return true;
      })
      .slice(0, 10);

    return NextResponse.json({
      code,
      similar_products: merged,
    });
  } catch {
    return NextResponse.json({
      code: null,
      similar_products: [],
    });
  }
}
