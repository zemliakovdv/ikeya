import { getCachedCategories } from '@/lib/api/ikea'

export async function GET() {
  try {
    const categories = await getCachedCategories()
    return Response.json(categories)
  } catch (e) {
    return Response.json([], { status: 500 })
  }
}
