// app/api/products/route.js
import { NextResponse } from 'next/server';

const API_BASE_URL = 'http://45.135.234.22/api/v1';

export async function GET(request) {
  const { searchParams } = new URL(request.url);

  const page = parseInt(searchParams.get('page'), 10) || 1;
  const perPage = parseInt(searchParams.get('per_page'), 10) || 20;

  // (на всякий случай) если потом захочешь сортировку/фильтры в общем списке
  const sort = searchParams.get('sort');

  try {
    let url = `${API_BASE_URL}/products?page=${page}&per_page=${perPage}`;
    if (sort) url += `&sort=${encodeURIComponent(sort)}`;

    const response = await fetch(url, { cache: 'no-store' });

    if (!response.ok) {
      throw new Error(`Backend API error: ${response.status}`);
    }

    const data = await response.json();

    return NextResponse.json({
      products: data.data || [],
      meta: data.meta || {}
    });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ products: [], meta: {} }, { status: 500 });
  }
}