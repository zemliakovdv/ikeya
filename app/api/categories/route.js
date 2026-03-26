// app/api/categories/route.js
export const dynamic = 'force-dynamic'

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