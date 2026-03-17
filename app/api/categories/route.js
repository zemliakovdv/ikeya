// app/api/categories/route.js
import { NextResponse } from 'next/server'
import { getCachedCategories } from '@/lib/api/ikea'

export async function GET() {
  try {
    const categories = await getCachedCategories()
    return NextResponse.json(categories)
  } catch (e) {
    return NextResponse.json([], { status: 500 })
  }
}