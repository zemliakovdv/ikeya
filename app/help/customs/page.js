// app/help/customs/page.js
import HelpLayout from '@/components/help/HelpLayout';
import CustomsContent from '@/components/help/customs/CustomsContent';

export const metadata = {
  title: 'Таможенная пошлина | IKEYA',
  description: 'Информация о таможенной пошлине при заказе товаров в интернет-магазине IKEYA с доставкой по Беларуси.',
  alternates: { canonical: 'https://ikeya.by/help/customs' },
  openGraph: {
    title: 'Таможенная пошлина | IKEYA',
    description: 'Информация о таможенной пошлине при заказе товаров в интернет-магазине IKEYA с доставкой по Беларуси.',
    url: 'https://ikeya.by/help/customs',
    siteName: 'IKEYA',
    images: [{ url: 'https://ikeya.by/assets/img/no-image.jpg', width: 1200, height: 630, alt: 'Таможенная пошлина | IKEYA' }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Таможенная пошлина | IKEYA',
    description: 'Информация о таможенной пошлине при заказе товаров в интернет-магазине IKEYA с доставкой по Беларуси.',
    images: ['https://ikeya.by/assets/img/no-image.jpg'],
    url: 'https://ikeya.by/help/customs',
  },
};

export default function CustomsPage() {
  return (
    <HelpLayout breadcrumbs={[{ name: 'Таможенная пошлина', href: null }]}>
      <CustomsContent />
    </HelpLayout>
  );
}