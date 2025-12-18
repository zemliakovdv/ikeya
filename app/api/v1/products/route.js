import { NextResponse } from 'next/server'

// Моковые данные товаров
const products = [
  {
    id: 1,
    title: "SLATTUM",
    description: "Каркас кровати с обивкой, Vissle темно-серый, 140x200 см",
    price: 135,
    currencySuffix: "р.",
    images: [
      { id: 1, src: "/assets/img/main-page/sales-hist/hits-1.png", alt: "Товар 1" },
      { id: 2, src: "/assets/img/main-page/sales-hist/hits-2.png", alt: "Товар 2" },
      { id: 3, src: "/assets/img/main-page/sales-hist/hits-3.png", alt: "Товар 3" },
    ],
    isHit: true,
    promoLabel: "-10% промокод IKEYA",
    category: "beds",
  },
  {
    id: 2,
    title: "STOCKHOLM 2025",
    description: "Стул, дуб/ротанг",
    price: 89,
    currencySuffix: "р.",
    images: [
      { id: 1, src: "/assets/img/main-page/news/new-1.png", alt: "Товар" },
      { id: 2, src: "/assets/img/main-page/news/new-2.png", alt: "Товар" },
    ],
    isNew: true,
    isHit: true,
    promoLabel: "-10% промокод IKEYA",
    category: "lighting",
  },
  // Добавь больше товаров по аналогии
]

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get('category')
  
  if (category) {
    const filtered = products.filter(p => p.category === category)
    return NextResponse.json(filtered)
  }
  
  return NextResponse.json(products)
}
