import Script from 'next/script';
import Modals from '@/components/Modals';

export default function RootLayout({ children }) {
    return (
        <html lang="ru">
            <head>
                <link rel="stylesheet" href="/assets/css/main.css"/>
            </head>
            <body>
                {children}
                <Modals />
                <Script 
                    src="/assets/js/main.js"
                    strategy="lazyOnload"
                />
            </body>
        </html>
    );
}
