// app/api/categories/[categoryId]/products/route.js
export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server';

const API_BASE_URL = 'https://test.ikeya.by/api/v1';

export async function GET(request, { params }) {
  const { categoryId } = params;
  const { searchParams } = new URL(request.url);

  const page = parseInt(searchParams.get('page'), 10) || 1;
  const perPage = parseInt(searchParams.get('per_page'), 10) || 20;

  try {
    const forwardParams = new URLSearchParams();

    for (const [key, value] of searchParams.entries()) {
      if (key === 'page' || key === 'per_page') continue;
      forwardParams.append(key, value);
    }

    forwardParams.set('page', String(page));
    forwardParams.set('per_page', String(perPage));

    const url = `${API_BASE_URL}/categories/${categoryId}/products?${forwardParams.toString()}`;

    const response = await fetch(url, { cache: 'no-store' });

    if (!response.ok) {
      throw new Error(`Backend API error: ${response.status}`);
    }

    const data = await response.json();

    const minPrice = parseFloat(searchParams.get('min_price') || '0') || 0;
    const maxPrice = parseFloat(searchParams.get('max_price') || '0') || Infinity;

    // Фильтруем на фронте — бэк игнорирует min_price/max_price
    const filteredProducts = (data.data || []).filter(item => {
      const price = parseFloat(String(item.attributes?.price_byn || item.attributes?.price || 0).replace(/\s/g, ''));
      if (price <= 0) return false;
      if (searchParams.get('min_price') && price < minPrice) return false;
      if (searchParams.get('max_price') && price > maxPrice) return false;
      return true;
    });

    return NextResponse.json({
      products: filteredProducts,
      meta: data.meta || { total: 0, page: 1, per_page: perPage, total_pages: 0 }
    });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      {
        error: 'Failed to load products',
        products: [],
        meta: { total: 0, page: 1, per_page: perPage, total_pages: 0 }
      },
      { status: 500 }
    );
  }
}