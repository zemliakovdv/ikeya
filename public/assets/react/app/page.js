import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { StartSlider } from '@/components/sections/StartSlider'
import { PopularCategories } from '@/components/sections/PopularCategories'
import { ProductsTabs } from '@/components/products/ProductsTabs'
import { PromoBlock } from '@/components/sections/PromoBlock'
import { AdsBanner } from '@/components/sections/AdsBanner'
import { BlogSection } from '@/components/sections/BlogSection'
import { SeoSection } from '@/components/sections/SeoSection'

import {
  headerTopMenu,
  headerCategories,
  startSlides,
  popularCategories,
  hitsTabs,
  hitsProductsByKey,
  promoProducts,
  adsBannerSlides,
  blogPosts,
  seoVisibleContent,
  seoHiddenContent,
  footerSocialLinks,
  footerNavigationColumns,
  footerLegalInfo,
} from '@/data/mockData'

export default function HomePage() {
  return (
    <>
      <Header
        topMenu={headerTopMenu}
        categories={headerCategories}
        favoritesCount={0}
        cartCount={14}
      />

      <main>
        <StartSlider slides={startSlides} />
        
        <PopularCategories categories={popularCategories} />
        
        <ProductsTabs
          title="Хиты продаж"
          tabs={hitsTabs}
          productsByKey={hitsProductsByKey}
        />
        
        <PromoBlock
          leftBannerHref="#"
          leftBannerSrc="/assets/img/main-page/promo-block/left-banner.png"
          leftBannerAlt="Промо-баннер"
          products={promoProducts}
        />
        
        <ProductsTabs
          title="Мы рекомендуем"
          tabs={hitsTabs}
          productsByKey={hitsProductsByKey}
        />
        
        <AdsBanner slides={adsBannerSlides} />
        
        <ProductsTabs
          title="Новинки"
          tabs={hitsTabs}
          productsByKey={hitsProductsByKey}
        />
        
        <BlogSection title="Советы и лайфхакти" posts={blogPosts} />
        
        <SeoSection
          title="SEO текст"
          visibleContent={seoVisibleContent}
          hiddenContent={seoHiddenContent}
        />
      </main>

      <Footer
        logoSrc="/assets/img/logo.svg"
        logoAlt="IKEYA"
        socialLinks={footerSocialLinks}
        navigationColumns={footerNavigationColumns}
        paymentImageSrc="/assets/img/icons/payments.svg"
        paymentImageAlt="Платежные системы"
        legalInfo={footerLegalInfo}
      />
    </>
  )
}
