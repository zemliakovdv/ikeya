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
import './globals.css'
import Script from 'next/script'

// export const viewport = {
//   width: 1200,
//   initialScale: 1,
// }

export const metadata = {
  title: 'IKEYA - Интернет-магазин мебели',
  description: 'Интернет-магазин мебели и товаров для дома',
}



export default function RootLayout({ children }) {
  return (
    <html lang="ru">
      <head>
        <link
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css"
          rel="stylesheet"
          integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap"
          rel="stylesheet"
        />
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
              email: "support@ikeya.by",
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
      <body>
        <AuthProvider>
          <CartProvider>
            <AuthModalsProvider>
              <FavoritesProvider>
                <Header />
                {children}
                <Footer />
                <MobileBottomNav />
              </FavoritesProvider>
            </AuthModalsProvider>
          </CartProvider>
        </AuthProvider>

        {/* Плавающая кнопка чата */}
        <FloatingChatButton />

        <CookieBanner />

        <Script
          src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.11.8/dist/umd/popper.min.js"
          strategy="lazyOnload"
        />
        <Script
          src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.min.js"
          strategy="lazyOnload"
        />
        <Script
          src="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  )
}