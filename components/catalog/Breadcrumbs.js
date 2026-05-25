// components/catalog/Breadcrumbs.js
import Link from 'next/link';

export default function Breadcrumbs({ items }) {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: items
              .filter((item) => item.name || item.label)
              .map((item, index) => ({
                "@type": "ListItem",
                position: index + 1,
                name: item.name || item.label,
                item: item.href
                  ? `https://ikeya.by${item.href}`
                  : undefined,
              })),
          }),
        }}
      />

      <section className="breadcumps">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="breadcumps-inner">
                {items.map((item, index) => (
                  <span key={index}>
                    {item.href ? (
                      <Link href={item.href}>
                        <span>{item.name || item.label}</span>
                      </Link>
                    ) : (
                      <span>{item.name || item.label}</span>
                    )}
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