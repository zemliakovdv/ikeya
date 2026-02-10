// app/api/products/route.js
import { NextResponse } from 'next/server';

const API_BASE_URL = 'http://45.135.234.22/api/v1';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const page = searchParams.get('page') || 1;
  const perPage = searchParams.get('per_page') || 20;

  try {
    const response = await fetch(
      `${API_BASE_URL}/products?page=${page}&per_page=${perPage}`,
      { cache: 'no-store' }
    );

    if (!response.ok) {
      throw new Error('API Error');
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
