import { Suspense } from 'react';
import StartSliderServer from '@/components/home/StartSliderServer';
import PopularCategoriesSection from '@/components/home/PopularCategoriesSection';
import BestsellersSection from '@/components/home/BestsellersSection';
import AdsBanner from '@/components/home/AdsBanner';
import BlogSection from '@/components/home/BlogSection';
import SeoSection from '@/components/home/SeoSection';
import NewArrivalsSection from '@/components/home/NewArrivalsSection';
import RecommendedSection from '@/components/home/RecommendedSection';
import UnsubscribeResultModal from '@/components/marketing/UnsubscribeResultModal';
import { getMainSliderBanners } from '@/lib/api/ikea';

export const dynamic = 'force-dynamic';

export async function generateMetadata() {
  try {
    const { meta } = await getMainSliderBanners();
    const seo = meta?.seo || {};
    return {
      title: seo.title || 'IKEYA – интернет-магазин мебели и товаров для дома',
      description: seo.description || 'Купить мебель в Минске с доставкой по Беларуси',
      keywords: seo.keywords,
      robots: seo.robots,
      alternates: { canonical: 'https://ikeya.by' },
      openGraph: {
        title: seo.title || 'IKEYA – интернет-магазин мебели и товаров для дома',
        description: seo.description || 'Купить мебель в Минске с доставкой по Беларуси',
        url: 'https://ikeya.by',
        siteName: 'IKEYA',
        images: [{ url: 'https://ikeya.by/assets/img/no-image.jpg', width: 1200, height: 630, alt: 'IKEYA' }],
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title: seo.title || 'IKEYA – интернет-магазин мебели и товаров для дома',
        description: seo.description || 'Купить мебель в Минске с доставкой по Беларуси',
        images: ['https://ikeya.by/assets/img/no-image.jpg'],
        url: 'https://ikeya.by',
      },
    };
  } catch {
    return {
      title: 'IKEYA – интернет-магазин мебели и товаров для дома',
      description: 'Купить мебель в Минске с доставкой по Беларуси',
      alternates: { canonical: 'https://ikeya.by' },
      openGraph: {
        title: 'IKEYA – интернет-магазин мебели и товаров для дома',
        description: 'Купить мебель в Минске с доставкой по Беларуси',
        url: 'https://ikeya.by',
        siteName: 'IKEYA',
        images: [{ url: 'https://ikeya.by/assets/img/no-image.jpg', width: 1200, height: 630, alt: 'IKEYA' }],
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title: 'IKEYA – интернет-магазин мебели и товаров для дома',
        description: 'Купить мебель в Минске с доставкой по Беларуси',
        images: ['https://ikeya.by/assets/img/no-image.jpg'],
        url: 'https://ikeya.by',
      },
    };
  }
}

export default async function Home() {
  let seoText = null;
  try {
    const { meta } = await getMainSliderBanners();
    seoText = meta?.seo?.seo_text || null;
  } catch { }

  return (
    <main className="main">
      <Suspense fallback={null}>
        <UnsubscribeResultModal />
      </Suspense>
      <StartSliderServer />
      <PopularCategoriesSection />
      <BestsellersSection />
      <AdsBanner />
      <RecommendedSection />
      <NewArrivalsSection />
      <BlogSection />
      <SeoSection seoText={seoText} />
    </main>
  );
}
