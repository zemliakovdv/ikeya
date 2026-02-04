// app/layout.js
import Header from '@/components/layout/Header/Header'
import Footer from '@/components/layout/Footer/Footer'
import ClientScripts from '@/components/ClientScripts'
import './globals.css'
import Script from 'next/script'

export const metadata = {
  title: 'IKEYA - Интернет-магазин мебели',
  description: 'Интернет-магазин мебели и товаров для дома',
}

export default function RootLayout({ children }) {
  return (
    <html lang="ru">
      <head>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css" />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.css" />
        <link rel="stylesheet" href="/assets/css/pvz.css" />
        <link rel="stylesheet" href="/assets/css/profile.css" />
        <link rel="stylesheet" href="/assets/css/main.css" />
      </head>
      <body>
        <Header />
        {children}
        <Footer />
        
        {/* Библиотеки загружаются ДО наших скриптов */}
        <Script 
          src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.11.8/dist/umd/popper.min.js" 
          strategy="beforeInteractive" 
        />
        <Script 
          src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.min.js" 
          strategy="beforeInteractive" 
        />
        <Script 
          src="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js" 
          strategy="beforeInteractive" 
        />
        
        {/* ТВОИ СКРИПТЫ ТЕПЕРЬ ЗДЕСЬ */}
        <ClientScripts />
      </body>
    </html>
  )
}
