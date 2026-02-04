// app/page.js
import StartSlider from '@/components/home/StartSlider';
import PopularCategoriesSection from '@/components/home/PopularCategoriesSection';
import BestsellersSection from '@/components/home/BestsellersSection';
import ProductTabsSection from '@/components/home/ProductTabsSection';
import PromoBlock from '@/components/home/PromoBlock';
import AdsBanner from '@/components/home/AdsBanner';
import BlogSection from '@/components/home/BlogSection';
import SeoSection from '@/components/home/SeoSection';

// Данные для "Рекомендованные товары"
const recommendedTabs = [
  { id: 'beds', label: 'Кровати и матрасы' },
  { id: 'sofas', label: 'Диваны и кресла' },
  { id: 'lighting', label: 'Освещение' }
];

const recommendedProducts = {
  beds: [
    {
      id: 'rec-beds-1',
      title: 'STOCKHOLM 2025',
      description: 'Стул, дуб/ротанг',
      price: '135.00',
      images: ['/assets/img/main-page/sales-hist/hits-1.png'],
      badges: ['hit', 'promo'],
      url: '#'
    },
  ],
  sofas: [],
  lighting: []
};

// Данные для "Новинки"
const newTabs = [
  { id: 'beds', label: 'Освещение' },
  { id: 'sofas', label: 'Диваны и кресла' },
  { id: 'lighting', label: 'Освещение' }
];

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
      badges: ['hit', 'promo', 'new'],
      url: '#'
    },
  ],
  sofas: [],
  lighting: []
};

export default function Home() {
  return (
    <main className="main">
      <StartSlider />
      <PopularCategoriesSection />

      {/* Хиты продаж */}
      <BestsellersSection />

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
    </main>
  );
}
