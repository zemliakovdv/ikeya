// app/services/page.js
import Breadcrumbs from '@/components/catalog/Breadcrumbs';
import ServicesBanner from '@/components/services/ServicesBanner';
import ServicesList from '@/components/services/ServicesList';
import ServicesInfo from '@/components/services/ServicesInfo';
import ServicesCosts from '@/components/services/ServicesCosts';
import ServicesHow from '@/components/services/ServicesHow';
import ServicesWhy from '@/components/services/ServicesWhy';
import ServicesOrder from '@/components/services/ServicesOrder';

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