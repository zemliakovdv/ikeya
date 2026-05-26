// app/help/how-to-order/page.js
import HelpLayout from '@/components/help/HelpLayout';
import HowToOrderContent from '@/components/help/how-to-order/HowToOrderContent';

export const metadata = {
  title: 'Как сделать заказ | IKEYA',
  description: 'Инструкция по оформлению заказа в интернет-магазине IKEYA. Выбирайте товары, добавляйте в корзину и оформляйте заказ с доставкой по Беларуси.',
  alternates: { canonical: 'https://ikeya.by/help/how-to-order' },
  openGraph: {
    title: 'Как сделать заказ | IKEYA',
    description: 'Инструкция по оформлению заказа в интернет-магазине IKEYA. Выбирайте товары, добавляйте в корзину и оформляйте заказ с доставкой по Беларуси.',
    url: 'https://ikeya.by/help/how-to-order',
    siteName: 'IKEYA',
    images: [{ url: 'https://ikeya.by/assets/img/no-image.jpg', width: 1200, height: 630, alt: 'Как сделать заказ | IKEYA' }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Как сделать заказ | IKEYA',
    description: 'Инструкция по оформлению заказа в интернет-магазине IKEYA. Выбирайте товары, добавляйте в корзину и оформляйте заказ с доставкой по Беларуси.',
    images: ['https://ikeya.by/assets/img/no-image.jpg'],
    url: 'https://ikeya.by/help/how-to-order',
  },
};

export default function HowToOrderPage() {
  return (
    <HelpLayout breadcrumbs={[{ name: 'Как сделать заказ', href: null }]}>
      <HowToOrderContent />
    </HelpLayout>
  );
}