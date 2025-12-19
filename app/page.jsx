import { Header, Footer } from '@/components/layout';
import StartSlider from '@/components/StartSlider';
import PopularCategory from '@/components/PopularCategory';
import ProductsTabs from '@/components/ProductsTabs/ProductsTabs';
import PromoBlock from '@/components/PromoBlock';
import WeRecomendTabs from '@/components/WeRecomendTabs';
import AdsBanner from '@/components/AdsBanner';
import NewTabs from '@/components/NewTabs';
import Blog from '@/components/Blog';
import Seo from '@/components/Seo';

export default function Home() {
    return (
        <>
            <Header />
            <main className="main">
                <StartSlider />
                <PopularCategory />
                <ProductsTabs />
                <PromoBlock />
                <WeRecomendTabs />
                <AdsBanner />
                <NewTabs />
                <Blog />
                <Seo />
            </main>
            <Footer />
        </>
    );
}
