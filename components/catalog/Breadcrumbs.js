// components/catalog/Breadcrumbs.js
import Link from 'next/link';

export default function Breadcrumbs({ items, mobileBackItem = null }) {
  if (!items || items.length === 0) {
    return null;
  }

  const mobileBackLabel = mobileBackItem?.name || mobileBackItem?.label || 'Каталог';
  const mobileBackHref = mobileBackItem?.href || '/catalog';
  const breadcrumbsClassName = mobileBackItem ? 'breadcumps-inner d-none d-lg-block' : 'breadcumps-inner';

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
              {mobileBackItem ? (
                <div className="d-block d-lg-none">
                  <Link href={mobileBackHref}>
                    <span>‹ {mobileBackLabel}</span>
                  </Link>
                </div>
              ) : null}

              <div className={breadcrumbsClassName}>
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
