// app/layout.js
import Header from '@/components/layout/Header/Header'
import Footer from '@/components/layout/Footer/FooterServer'
import MobileBottomNav from '@/components/layout/MobileBottomNav'
import { CartProvider } from '@/contexts/CartContext'
import { AuthProvider } from '@/contexts/AuthContext'
import { AuthModalsProvider } from '@/components/auth/AuthModalsHost'
import FloatingChatButton from '@/components/FloatingChatButton'
import { FavoritesProvider } from '@/contexts/FavoritesContext';
import CookieBanner from '@/components/cookie/CookieBanner';
import CatalogRouteLoader from '@/components/ui/CatalogRouteLoader';
import BootstrapClient from '@/components/BootstrapClient'
import { ProfileCountsProvider } from '@/components/profile/ProfileCountsContext';
import { Suspense } from 'react'
import './globals.css'
import Script from 'next/script'
import { Inter } from 'next/font/google'

// export const viewport = {
//   width: 1200,
//   initialScale: 1,
// }

export const metadata = {
  title: 'IKEYA - Интернет-магазин мебели',
  description: 'Интернет-магазин мебели и товаров для дома',
}

const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  display: 'optional',
})



export default function RootLayout({ children }) {
  return (
    <html lang="ru">
      <head>
        <link rel="stylesheet" href="/assets/css/bootstrap.min.css" />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css" />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.css" />
        <link rel="stylesheet" href="/assets/css/profile.css" />
        <link rel="stylesheet" href="/assets/css/pvz.css" />
        <link rel="stylesheet" href="/assets/css/article.css" />
        <link rel="stylesheet" href="/assets/css/content-pages.css" />
        <link rel="stylesheet" href="/assets/css/help.css" />
        <link rel="stylesheet" href="/assets/css/main.css" />
        <link rel="stylesheet" href="/assets/css/responsive.css" />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "IKEYA",
              description: "Интернет-магазин товаров для дома",
              url: "https://ikeya.by",
              logo: "https://ikeya.by/assets/img/logo.svg",
              image: "https://ikeya.by/assets/img/logo.svg",
              email: "info@ikeya.by",
              telephone: "+375445794444",
              sameAs: [
                "https://www.instagram.com/shopbyshop_by?igsh=MWRoazFqbGE5ZHlibg%3D%3D",
                "https://t.me/ShopByShopBelarus",
              ],
              address: {
                "@type": "PostalAddress",
                streetAddress: "ул. Сухаревская, д.16, пом. 6",
                addressLocality: "Минск",
                addressRegion: "Минская область",
                addressCountry: "BY",
                postalCode: "220019",
              },
            }),
          }}
        />
      </head>
      <body className={inter.className}>
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-9LDCJ9F23H"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-9LDCJ9F23H');
          `}
        </Script>

        {/* Yandex.Metrika counter */}
        <Script id="yandex-metrika" strategy="afterInteractive">
          {`
            (function(m,e,t,r,i,k,a){
                m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
                m[i].l=1*new Date();
                for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
                k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)
            })(window, document,'script','https://mc.yandex.ru/metrika/tag.js?id=111125185', 'ym');

            ym(111125185, 'init', {ssr:true, webvisor:true, clickmap:true, ecommerce:"dataLayer", referrer: document.referrer, url: location.href, accurateTrackBounce:true, trackLinks:true});
          `}
        </Script>
        <noscript>
          <div>
            <img
              src="https://mc.yandex.ru/watch/111125185"
              style={{ position: 'absolute', left: '-9999px' }}
              alt=""
            />
          </div>
        </noscript>

        <AuthProvider>
          <ProfileCountsProvider>
            <CartProvider>
              <AuthModalsProvider>
                <FavoritesProvider>
                  <Header />
                  <Suspense fallback={null}>
                    <CatalogRouteLoader />
                  </Suspense>
                  {children}
                  <Footer />
                  <MobileBottomNav />
                </FavoritesProvider>
              </AuthModalsProvider>
            </CartProvider>
          </ProfileCountsProvider>
        </AuthProvider>

        {/* Плавающая кнопка чата */}
        <FloatingChatButton />

        <CookieBanner />

        {/* Bootstrap JS (bundle с Popper) через npm */}
        <BootstrapClient />

        <Script
          src="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js"
          strategy="lazyOnload"
        />
      </body>
    </html>
  )
}