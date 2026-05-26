import { Suspense } from 'react';
import StartSliderServer from '@/components/home/StartSliderServer';
import PopularCategoriesSection from '@/components/home/PopularCategoriesSection';
import BestsellersSection from '@/components/home/BestsellersSection';
import PromoBlockServer from '@/components/home/PromoBlockServer';
import AdsBanner from '@/components/home/AdsBanner';
import BlogSection from '@/components/home/BlogSection';
import SeoSection from '@/components/home/SeoSection';
import NewArrivalsSection from '@/components/home/NewArrivalsSection';
import RecommendedSection from '@/components/home/RecommendedSection';
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
      openGraph: { title: seo.title, description: seo.description },
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

function SectionSkeleton({ title }) {
  return (
    <section style={{ padding: '40px 0' }}>
      <div className="container">
        <div className="row">
          <div className="col-12">
            {title && (
              <div style={{ width: 200, height: 32, background: '#f0f0f0', borderRadius: 6, marginBottom: 24 }} />
            )}
            <div style={{ display: 'flex', gap: 16 }}>
              {[1,2,3,4,5].map(i => (
                <div key={i} style={{ flex: 1, height: 280, background: '#f0f0f0', borderRadius: 8 }} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default async function Home() {
  let seoText = null;
  try {
    const { meta } = await getMainSliderBanners();
    seoText = meta?.seo?.seo_text || null;
  } catch {}

  return (
    <main className="main">
      <StartSliderServer />
      <Suspense fallback={<SectionSkeleton />}>
        <PopularCategoriesSection />
      </Suspense>
      <Suspense fallback={<SectionSkeleton title="Хиты продаж" />}>
        <BestsellersSection />
      </Suspense>
      <Suspense fallback={<div style={{ minHeight: 200 }} />}>
        <PromoBlockServer />
      </Suspense>
      <Suspense fallback={<SectionSkeleton title="Рекомендованные товары" />}>
        <RecommendedSection />
      </Suspense>
      <AdsBanner />
      <Suspense fallback={<SectionSkeleton title="Новинки" />}>
        <NewArrivalsSection />
      </Suspense>
      <Suspense fallback={null}>
        <BlogSection />
      </Suspense>
      <Suspense fallback={null}>
        <SeoSection seoText={seoText} />
      </Suspense>
    </main>
  );
}