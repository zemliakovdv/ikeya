import Breadcrumbs from '@/components/catalog/Breadcrumbs';
import ContactsContent from '@/components/contacts/ContactsContent';

export const metadata = {
  title: 'Контакты | IKEYA',
  description:
    'Контакты интернет-магазина IKEYA: телефон, email, юридический адрес ООО «БелкаБокс» в Минске и режим работы поддержки.',
  alternates: { canonical: 'https://ikeya.by/contacts' },
  openGraph: {
    title: 'Контакты | IKEYA',
    description:
      'Контакты интернет-магазина IKEYA: телефон, email, юридический адрес ООО «БелкаБокс» в Минске и режим работы поддержки.',
    url: 'https://ikeya.by/contacts',
    siteName: 'IKEYA',
    images: [{ url: 'https://ikeya.by/assets/img/no-image.jpg', width: 1200, height: 630, alt: 'Контакты | IKEYA' }],
    type: 'website',
  },
};

const BREADCRUMBS = [
  { name: 'Главная', href: '/' },
  { name: 'Контакты', href: null },
];

export default function ContactsPage() {
  return (
    <main className="help-page contacts-page">
      <Breadcrumbs items={BREADCRUMBS} />
      <section className="help-section">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="help-content">
                <ContactsContent />
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
