// app/api/search/route.js
export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server';

import { buildApiUrl } from '@/lib/config/api';

export async function GET(request) {
  const { searchParams } = new URL(request.url);

  try {
    const forwardParams = new URLSearchParams();

    for (const [key, value] of searchParams.entries()) {
      forwardParams.append(key, value);
    }

    const url = buildApiUrl(`/search/suggest?${forwardParams.toString()}`);

    const response = await fetch(url, { cache: 'no-store' });

    if (!response.ok) {
      throw new Error(`Backend API error: ${response.status}`);
    }

    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error('Search API Error:', error);
    return NextResponse.json(
      { products: { data: [] }, meta: { total: 0, page: 1, per_page: 50, total_pages: 0 } },
      { status: 500 }
    );
  }
}