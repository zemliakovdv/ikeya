
import StartSlider from '../components/main-page/StartSlider';
import PopularCategories from '../components/main-page/PopularCategories';
import SalesHits from '../components/main-page/SalesHits';
import PromoBlock from '../components/main-page/PromoBlock';
import WeRecommend from '../components/main-page/WeRecommend';
import AdsBanner from '../components/main-page/AdsBanner';
import NewProducts from '../components/main-page/NewProducts';
import BlogSection from '../components/main-page/BlogSection';
import SeoSection from '../components/main-page/SeoSection';
import CatalogModal from '../modals/CatalogModal';

export default function Home() {
  return (
    <>
      <main className="main">
        <StartSlider />
        <PopularCategories />
        <SalesHits />
        <PromoBlock />
        <WeRecommend />
        <AdsBanner />
        <NewProducts />
        <BlogSection />
        <SeoSection />
      </main>
      <CatalogModal />
    </>
  );
}
