import { getCachedCategories } from '@/lib/api/ikea.js'

export async function GET() {
  try {
    const categories = await getCachedCategories()
    return Response.json(categories)
  } catch (e) {
    return Response.json([], { status: 500 })
  }
}