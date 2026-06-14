import Link from 'next/link';
import Breadcrumbs from '@/components/catalog/Breadcrumbs';
import { getLegalPages } from '@/lib/api/content';

const BUYER_LEGAL_SLUGS = [
  'webpay-services-payment-ikeya-by',
  'delivery-international-logistics-ikeya-by',
  'returns-and-exchange-ikeya-by',
];

const LEGAL_FALLBACK_HREF = '/help/personal-data-consent-ikeya-by/';

export const metadata = {
  title: 'Помощь | IKEYA',
};

function HelpTileIcon({ type }) {
  const commonProps = {
    width: 24,
    height: 24,
    viewBox: '0 0 24 24',
    fill: 'none',
    xmlns: 'http://www.w3.org/2000/svg',
    'aria-hidden': 'true',
  };

  switch (type) {
    case 'order':
      return (
        <svg {...commonProps}>
          <path d="M8 7.75H16" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
          <path d="M8 12H13.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
          <path d="M8 16.25H11.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
          <path d="M6.75 3.75H14.9C17.58 3.75 19.25 5.65 19.25 8.33V15.67C19.25 18.35 17.58 20.25 14.9 20.25H9.1C6.42 20.25 4.75 18.35 4.75 15.67V5.75C4.75 4.65 5.65 3.75 6.75 3.75Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
          <path d="M14.5 3.75V6.1C14.5 7.07 15.29 7.85 16.25 7.85H19.03" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
        </svg>
      );
    case 'delivery':
      return (
        <svg {...commonProps}>
          <path d="M3.75 7.75C3.75 6.09 5.09 4.75 6.75 4.75H12.25V15.5H6.75C5.09 15.5 3.75 14.16 3.75 12.5V7.75Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
          <path d="M12.25 8.25H15.64C16.19 8.25 16.7 8.54 17.01 9.01L19.16 12.22C19.38 12.55 19.5 12.94 19.5 13.34V15.5H12.25V8.25Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
          <path d="M7.5 19.25C8.47 19.25 9.25 18.47 9.25 17.5C9.25 16.53 8.47 15.75 7.5 15.75C6.53 15.75 5.75 16.53 5.75 17.5C5.75 18.47 6.53 19.25 7.5 19.25Z" stroke="currentColor" strokeWidth="1.7" />
          <path d="M15.75 19.25C16.72 19.25 17.5 18.47 17.5 17.5C17.5 16.53 16.72 15.75 15.75 15.75C14.78 15.75 14 16.53 14 17.5C14 18.47 14.78 19.25 15.75 19.25Z" stroke="currentColor" strokeWidth="1.7" />
        </svg>
      );
    case 'payment':
      return (
        <svg {...commonProps}>
          <rect x="3.75" y="6.25" width="16.5" height="11.5" rx="2.25" stroke="currentColor" strokeWidth="1.7" />
          <path d="M3.75 10.25H20.25" stroke="currentColor" strokeWidth="1.7" />
          <path d="M7.5 14.25H10.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
          <path d="M14.25 14.25H16.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
        </svg>
      );
    case 'returns':
      return (
        <svg {...commonProps}>
          <path d="M9 7H16.25C17.91 7 19.25 8.34 19.25 10V16.25C19.25 17.91 17.91 19.25 16.25 19.25H10C8.34 19.25 7 17.91 7 16.25V9" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
          <path d="M8.75 4.75L4.75 8.75L8.75 12.75" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M4.75 8.75H13.25" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
        </svg>
      );
    case 'customs':
      return (
        <svg {...commonProps}>
          <path d="M12 3.75L18.75 6.75V11.25C18.75 15.18 16.08 18.84 12 20.25C7.92 18.84 5.25 15.18 5.25 11.25V6.75L12 3.75Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
          <path d="M9.25 11.75L11 13.5L14.75 9.75" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'legal':
      return (
        <svg {...commonProps}>
          <path d="M7.5 4.75H14.58C15.14 4.75 15.67 4.98 16.06 5.38L18.62 7.94C19.02 8.33 19.25 8.86 19.25 9.42V17.25C19.25 18.35 18.35 19.25 17.25 19.25H7.5C6.4 19.25 5.5 18.35 5.5 17.25V6.75C5.5 5.65 6.4 4.75 7.5 4.75Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
          <path d="M14.5 4.9V7.5C14.5 8.33 15.17 9 16 9H18.6" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
          <path d="M8.5 12H16" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
          <path d="M8.5 15.25H13.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
        </svg>
      );
    default:
      return null;
  }
}

export default async function HelpPage() {
  const legalPages = await getLegalPages();
  const legalItems = legalPages
    .filter((page) => !BUYER_LEGAL_SLUGS.includes(page.attributes.slug))
    .map((page) => `/help/${page.attributes.slug}`);

  const legalHref = legalItems[0] || LEGAL_FALLBACK_HREF;

  const tiles = [
    { title: 'Как оформить заказ', href: '/help/how-to-order', icon: 'order' },
    { title: 'Условия доставки', href: '/help/delivery', icon: 'delivery' },
    { title: 'Оплата', href: '/help/payment', icon: 'payment' },
    { title: 'Как вернуть товар', href: '/help/returns', icon: 'returns' },
    { title: 'Таможенное оформление', href: '/help/customs', icon: 'customs' },
    { title: 'Правовая информация', href: legalHref, icon: 'legal' },
  ];

  return (
    <main className="help-page help-home">
      <Breadcrumbs items={[{ name: 'Главная', href: '/' }, { name: 'Помощь', href: null }]} />
      <section className="help-section">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="help-home__content">
                <div className="help-hub__header">
                  <h1>Нужна помощь?</h1>
                </div>

                <div className="help-hub__grid">
                  {tiles.map((tile) => (
                    <Link key={tile.href} href={tile.href} className="help-hub__tile">
                      <span className="help-hub__tile-icon">
                        <HelpTileIcon type={tile.icon} />
                      </span>
                      <span className="help-hub__tile-title">{tile.title}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
