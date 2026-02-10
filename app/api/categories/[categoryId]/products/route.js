// app/api/categories/[categoryId]/products/route.js
import { NextResponse } from 'next/server';
import { getCategoryProducts } from '@/lib/api/ikea';

export async function GET(request, { params }) {
  const { categoryId } = params;
  const { searchParams } = new URL(request.url);
  
  const page = parseInt(searchParams.get('page')) || 1;
  const perPage = parseInt(searchParams.get('per_page')) || 20;

  try {
    const result = await getCategoryProducts(categoryId, page, perPage);
    
    return NextResponse.json({
      products: result.data,
      meta: result.meta
    });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to load products', products: [], meta: { total: 0 } },
      { status: 500 }
    );
  }
}
