// components/help/HelpSidebar.js
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

// Slug'и legal pages, которые отображаются в секции "Покупателям"
const BUYER_LEGAL_SLUGS = [
  'webpay-services-payment-ikeya-by',
  'delivery-international-logistics-ikeya-by',
  'returns-and-exchange-ikeya-by',
];

// Порядок отображения в секции "Покупателям"
const BUYER_LEGAL_ORDER = {
  'webpay-services-payment-ikeya-by': 2,
  'delivery-international-logistics-ikeya-by': 3,
  'returns-and-exchange-ikeya-by': 4,
};

const STATIC_BUYER_ITEMS = [
  { label: 'Таможенная пошлина', href: '/help/customs', order: 0 },
  { label: 'Как сделать заказ', href: '/help/how-to-order', order: 1 },
];

export default function HelpSidebar({ legalPages = [] }) {
  const pathname = usePathname().replace(/\/$/, '');

  const legalForBuyers = legalPages
    .filter((page) => BUYER_LEGAL_SLUGS.includes(page.attributes.slug))
    .map((page) => ({
      label: page.attributes.title,
      href: `/help/${page.attributes.slug}`,
      order: BUYER_LEGAL_ORDER[page.attributes.slug],
    }));

  const buyerItems = [...STATIC_BUYER_ITEMS, ...legalForBuyers].sort(
    (a, b) => a.order - b.order
  );

  const legalItems = legalPages
    .filter((page) => !BUYER_LEGAL_SLUGS.includes(page.attributes.slug))
    .map((page) => ({
      label: page.attributes.title,
      href: `/help/${page.attributes.slug}`,
    }));

  const menu = [
    ...(legalItems.length > 0
      ? [{ title: 'Правовая информация', items: legalItems }]
      : []),
    { title: 'Покупателям', items: buyerItems },
  ];

  const [open, setOpen] = useState(menu.map(() => true));

  const toggle = (index) => {
    setOpen((prev) => prev.map((val, i) => (i === index ? !val : val)));
  };

  return (
    <aside className="help-sidebar">
      {menu.map((section, sectionIndex) => (
        <div key={section.title} className="help-sidebar__section">
          <button
            className={`help-sidebar__title ${open[sectionIndex] ? 'open' : ''}`}
            onClick={() => toggle(sectionIndex)}
            type="button"
          >
            <span>{section.title}</span>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M8 10.22C7.25 10.22 5.47 8.19 4.1 6.5C3.95 6.31 3.97 6.03 4.17 5.87C4.36 5.72 4.64 5.75 4.79 5.94C5.99 7.43 7.53 9.1 8 9.32C8.47 9.1 10.01 7.43 11.21 5.94C11.36 5.75 11.64 5.72 11.83 5.87C12.03 6.03 12.05 6.31 11.9 6.5C10.53 8.2 8.74 10.22 8 10.22Z"
                fill="#181818"
                style={{
                  transform: open[sectionIndex] ? 'rotate(180deg)' : 'rotate(0deg)',
                  transformOrigin: 'center',
                  transition: 'transform 0.2s',
                }}
              />
            </svg>
          </button>

          {open[sectionIndex] && (
            <ul className="help-sidebar__list">
              {section.items.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`help-sidebar__link ${pathname === item.href ? 'active' : ''}`}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </aside>
  );
}