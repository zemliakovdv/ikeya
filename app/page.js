import StartSlider from '@components/home/StartSlider'
import PopularCategory from '@components/home/PopularCategory'
import ProductTabsSection from '@/components/home/ProductTabsSection'
import PromoBlock from '@components/home/PromoBlock'
import AdsBanner from '@components/home/AdsBanner'
import BlogSection from '@/components/home/BlogSection'
import SeoSection from '@/components/home/SeoSection'

// Данные для "Хиты продаж"
const salesTabs = [
  { id: 'beds', label: 'Кровати и матрасы' },
  { id: 'sofas', label: 'Диваны и кресла' },
  { id: 'tables', label: 'Столы и стулья' }
]

const salesProducts = {
  beds: [
    {
      id: 'sales-beds-1',
      title: 'SLATTUM',
      description: 'Каркас кровати с обивкой, Vissle темно-серый, 140x200 см',
      price: '135.00',
      images: [
        '/assets/img/main-page/sales-hist/hits-1.png',
        '/assets/img/main-page/sales-hist/hits-2.png',
        '/assets/img/main-page/sales-hist/hits-3.png'
      ],
      badges: ['hit', 'promo']
    },
    // ... добавьте остальные товары
  ],
  sofas: [
    // ... товары для дивановов
  ],
  tables: [
    // ... товары для столов
  ]
}

// Данные для "Рекомендованные товары"
const recommendedTabs = [
  { id: 'beds', label: 'Кровати и матрасы' },
  { id: 'sofas', label: 'Диваны и кресла' },
  { id: 'lighting', label: 'Освещение' }
]

const recommendedProducts = {
  beds: [
    {
      id: 'rec-beds-1',
      title: 'STOCKHOLM 2025',
      description: 'Стул, дуб/ротанг',
      price: '135.00',
      images: ['/assets/img/main-page/sales-hist/hits-1.png'],
      badges: ['hit', 'promo']
    },
    // ... добавьте остальные товары
  ],
  sofas: [],
  lighting: []
}

// Данные для "Новинки"
const newTabs = [
  { id: 'beds', label: 'Освещение' },
  { id: 'sofas', label: 'Диваны и кресла' },
  { id: 'lighting', label: 'Освещение' }
]

const newProducts = {
  beds: [
    {
      id: 'new-beds-1',
      title: 'STOCKHOLM 2025',
      description: 'Стул, дуб/ротанг',
      price: '135.00',
      images: [
        '/assets/img/main-page/news/new-1.png',
        '/assets/img/main-page/news/new-2.png'
      ],
      badges: ['hit', 'promo', 'new']
    },
    // ... добавьте остальные товары
  ],
  sofas: [],
  lighting: []
}

export default function Home() {
  return (
    <main className="main">
      <StartSlider />
      <PopularCategory />

      {/* Хиты продаж */}
      <ProductTabsSection
        title="Хиты продаж"
        tabs={salesTabs}
        tabProducts={salesProducts}
        sectionClass="sales-tabs"
      />

      <PromoBlock />

      {/* Рекомендованные товары */}
      <ProductTabsSection
        title="Рекомендованные товары"
        tabs={recommendedTabs}
        tabProducts={recommendedProducts}
        sectionClass="recommended-tabs"
      />

      <AdsBanner />

      {/* Новинки */}
      <ProductTabsSection
        title="Новинки"
        tabs={newTabs}
        tabProducts={newProducts}
        sectionClass="new-tabs"
        showNewBadge={true}
      />

      <BlogSection />
      <SeoSection />
      {/* Остальные секции добавим по мере конвертации */}
    </main>
  )
}
