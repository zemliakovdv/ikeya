import Script from 'next/script';
import Modals from '@/components/Modals';
import AuthProvider from '@/components/providers/AuthProvider';

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
                <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css" />
                <link rel="stylesheet" href="/assets/css/main.css"/>
            </head>
            <body>
                <AuthProvider>
                    {children}
                    <Modals />
                </AuthProvider>
                <Script 
                    src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.11.8/dist/umd/popper.min.js"
                    integrity="sha384-I7E8VVD/ismYTF4hNIPjVp/Zjvgyol6VFvRkX/vR+Vc4jQkC+hVqc2pM8ODewa9r"
                    crossOrigin="anonymous"
                    strategy="beforeInteractive"
                />
                <Script 
                    src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.min.js"
                    integrity="sha384-G/EV+4j2dNv+tEPo3++6LCgdCROaejBqfUeNjuKAiuXbjrxilcCdDz6ZAVfHWe1Y"
                    crossOrigin="anonymous"
                    strategy="beforeInteractive"
                />
                <Script 
                    src="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js"
                    strategy="beforeInteractive"
                />
                <Script 
                    src="/assets/js/main.js"
                    strategy="lazyOnload"
                />
            </body>
        </html>
    );
}
