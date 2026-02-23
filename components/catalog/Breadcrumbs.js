// components/catalog/Breadcrumbs.js
import Link from 'next/link';

export default function Breadcrumbs({ items }) {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <>
      {/* Schema.org JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: items.map((item, index) => ({
              "@type": "ListItem",
              position: index + 1,
              name: item.name || item.label,
              item: item.href 
                ? `https://ikey.by${item.href}`  // Замени на свой домен
                : undefined
            })).filter(item => item.name) // Убираем пустые
          })
        }}
      />

      {/* Визуальные хлебные крошки */}
      <section className="breadcumps">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="breadcumps-inner" itemScope itemType="https://schema.org/BreadcrumbList">
                {items.map((item, index) => (
                  <span key={index} itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
                    {item.href ? (
                      <Link 
                        href={item.href}
                        itemProp="item"
                      >
                        <span itemProp="name">{item.name || item.label}</span>
                      </Link>
                    ) : (
                      <span itemProp="item">
                        <span itemProp="name">{item.name || item.label}</span>
                      </span>
                    )}
                    <meta itemProp="position" content={index + 1} />
                    {index < items.length - 1 && <span> / </span>}
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
