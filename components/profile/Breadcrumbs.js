'use client';

import Link from 'next/link';

export default function Breadcrumbs({ items }) {
  const breadcrumbItems = Array.isArray(items) ? items : [];

  // Всегда добавляем "Главная" в начало
  const fullItems = [
    { href: '/', label: 'Главная' },
    ...breadcrumbItems
  ];

  return (
    <>
      {/* Schema.org JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: fullItems.map((item, index) => ({
              "@type": "ListItem",
              position: index + 1,
              name: item.label,
              item: item.href 
                ? `https://ikey.by${item.href}`  // ← Замени на свой домен
                : undefined
            }))
          })
        }}
      />

      {/* Визуальные хлебные крошки */}
      <section className="breadcumps">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="breadcumps-inner" itemScope itemType="https://schema.org/BreadcrumbList">
                {fullItems.map((item, index) => (
                  <span 
                    key={index} 
                    itemProp="itemListElement" 
                    itemScope 
                    itemType="https://schema.org/ListItem"
                  >
                    {item.href ? (
                      <Link href={item.href} itemProp="item">
                        <span itemProp="name">{item.label}</span>
                      </Link>
                    ) : item.onClick ? (
                      <a href="#" onClick={item.onClick} itemProp="item" style={{ cursor: 'pointer' }}>
                        <span itemProp="name">{item.label}</span>
                      </a>
                    ) : (
                      <span itemProp="item">
                        <span itemProp="name">{item.label}</span>
                      </span>
                    )}
                    <meta itemProp="position" content={index + 1} />
                    {index < fullItems.length - 1 && <span> / </span>}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}