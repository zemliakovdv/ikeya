import Script from 'next/script';
import Header from './components/Header';
import Footer from './components/Footer'; 

export const metadata = {
  title: 'IKEYA - Мебель для дома',
  description: 'Интернет-магазин мебели IKEYA',
}

export default function RootLayout({ children }) {
  return (
    <html lang="ru">
      <head>
        {/* Bootstrap CSS */}
        <link
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css"
          rel="stylesheet"
          crossOrigin="anonymous"
        />

        {/* Swiper CSS */}
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css"
        />

        {/* Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />

        {/* Main CSS */}
        <link rel="stylesheet" href="/assets/css/main.css" />
      </head>

      <body>
        <Header />
        {children}
        <Footer />

        {/* ✅ ПЕРЕМЕСТИЛ СКРИПТЫ В КОНЕЦ + ИЗМЕНИЛ strategy */}
        <Script
          src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js"
          strategy="afterInteractive"
        />

        <Script
          src="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  )
}
