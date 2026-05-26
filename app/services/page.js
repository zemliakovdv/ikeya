// app/services/page.js
import Breadcrumbs from '@/components/catalog/Breadcrumbs';
import ServicesBanner from '@/components/services/ServicesBanner';
import ServicesList from '@/components/services/ServicesList';
import ServicesInfo from '@/components/services/ServicesInfo';
import ServicesCosts from '@/components/services/ServicesCosts';
import ServicesHow from '@/components/services/ServicesHow';
import ServicesWhy from '@/components/services/ServicesWhy';
import ServicesOrder from '@/components/services/ServicesOrder';

export const metadata = {
  title: 'Услуги | IKEYA',
  description: 'Услуги интернет-магазина IKEYA — сборка мебели, доставка, подъём на этаж и другие сервисы по всей Беларуси.',
  alternates: { canonical: 'https://ikeya.by/services' },
  openGraph: {
    title: 'Услуги | IKEYA',
    description: 'Услуги интернет-магазина IKEYA — сборка мебели, доставка, подъём на этаж и другие сервисы по всей Беларуси.',
    url: 'https://ikeya.by/services',
    siteName: 'IKEYA',
    images: [{ url: 'https://ikeya.by/assets/img/no-image.jpg', width: 1200, height: 630, alt: 'Услуги IKEYA' }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Услуги | IKEYA',
    description: 'Услуги интернет-магазина IKEYA — сборка мебели, доставка, подъём на этаж и другие сервисы по всей Беларуси.',
    images: ['https://ikeya.by/assets/img/no-image.jpg'],
    url: 'https://ikeya.by/services',
  },
};

const breadcrumbs = [
  { name: 'Главная', href: '/' },
  { name: 'Услуги', href: null },
];

export default function ServicesPage() {
  return (
    <main className="uslugi">
      <div className="uslugi-wrapper">
        <Breadcrumbs items={breadcrumbs} />
        <ServicesBanner />
        <ServicesList />
        <ServicesInfo />
        <ServicesCosts />
        <ServicesHow />
        <ServicesWhy />
        <ServicesOrder />
      </div>
    </main>
  );
}