const BUYER_LEGAL_SLUGS = [
  'webpay-services-payment-ikeya-by',
  'delivery-international-logistics-ikeya-by',
  'returns-and-exchange-ikeya-by',
];

const BUYER_LEGAL_ORDER = {
  'webpay-services-payment-ikeya-by': 2,
  'delivery-international-logistics-ikeya-by': 3,
  'returns-and-exchange-ikeya-by': 4,
};

const BUYER_LEGAL_ICONS = {
  'webpay-services-payment-ikeya-by': 'payment',
  'delivery-international-logistics-ikeya-by': 'delivery',
  'returns-and-exchange-ikeya-by': 'returns',
};

const STATIC_BUYER_ITEMS = [
  { title: 'Таможенная пошлина', href: '/help/customs', order: 0, icon: 'customs' },
  { title: 'Как сделать заказ', href: '/help/how-to-order', order: 1, icon: 'order' },
];

function mapLegalPageToItem(page) {
  const slug = page?.attributes?.slug;
  const title = page?.attributes?.title;

  if (!slug || !title) return null;

  return {
    title,
    href: `/help/${slug}`,
    icon: BUYER_LEGAL_ICONS[slug] || 'legal',
  };
}

export function buildHelpNavSections(legalPages = []) {
  const legalForBuyers = legalPages
    .filter((page) => BUYER_LEGAL_SLUGS.includes(page.attributes.slug))
    .map((page) => {
      const item = mapLegalPageToItem(page);

      return item
        ? {
            ...item,
            order: BUYER_LEGAL_ORDER[page.attributes.slug],
          }
        : null;
    })
    .filter(Boolean);

  const buyerItems = [...STATIC_BUYER_ITEMS, ...legalForBuyers]
    .sort((a, b) => a.order - b.order)
    .map(({ order, ...item }) => item);

  const legalItems = legalPages
    .filter((page) => !BUYER_LEGAL_SLUGS.includes(page.attributes.slug))
    .map(mapLegalPageToItem)
    .filter(Boolean);

  return [
    ...(legalItems.length > 0
      ? [{ title: 'Правовая информация', items: legalItems }]
      : []),
    { title: 'Покупателям', items: buyerItems },
  ];
}
