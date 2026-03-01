import StartSlider from '@/components/home/StartSlider';
import PopularCategoriesSection from '@/components/home/PopularCategoriesSection';
import BestsellersSection from '@/components/home/BestsellersSection';
import PromoBlockServer from '@/components/home/PromoBlockServer';
import AdsBanner from '@/components/home/AdsBanner';
import BlogSection from '@/components/home/BlogSection';
import SeoSection from '@/components/home/SeoSection';
import NewArrivalsSection from '@/components/home/NewArrivalsSection';
import RecommendedSection from '@/components/home/RecommendedSection';
import { getMainSliderBanners } from '@/lib/api/ikea';

export async function generateMetadata() {
  const { meta } = await getMainSliderBanners();
  const seo = meta.seo || {};

  return {
    title: seo.title || 'IKEYA – интернет-магазин мебели и товаров для дома',
    description: seo.description || 'Купить мебель в Минске с доставкой по Беларуси',
    keywords: seo.keywords,
    robots: seo.robots,
    openGraph: {
      title: seo.title,
      description: seo.description,
    },
  };
}

export default async function Home() {
  const { meta } = await getMainSliderBanners();
  const seo = meta?.seo || {};
  const seoText = seo.seo_text || null;

  return (
    <main className="main">
      <StartSlider />
      <PopularCategoriesSection />
      <BestsellersSection />
      <PromoBlockServer />
      <RecommendedSection />
      <AdsBanner />
      <NewArrivalsSection />
      <BlogSection />
      <SeoSection seoText={seoText} />
    </main>
  );
}
