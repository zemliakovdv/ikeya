// app/api/categories/[categoryId]/products/route.js
import { NextResponse } from 'next/server';

const API_BASE_URL = 'http://45.135.234.22/api/v1';

export async function GET(request, { params }) {
  const { categoryId } = params;
  const { searchParams } = new URL(request.url);
  
  const page = parseInt(searchParams.get('page')) || 1;
  const perPage = parseInt(searchParams.get('per_page')) || 20;

  try {
    // ✅ ПРЯМО К БЭКЕНДУ — без лишних обёрток
    const url = `${API_BASE_URL}/categories/${categoryId}/products?page=${page}&per_page=${perPage}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Backend API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    return NextResponse.json({
      products: data.data || [],
      meta: data.meta || { total: 0, page: 1, per_page: perPage }
    });
    
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to load products', 
        products: [], 
        meta: { total: 0 } 
      },
      { status: 500 }
    );
  }
}
