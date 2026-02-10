// components/catalog/Breadcrumbs.js
import Link from 'next/link';

export default function Breadcrumbs({ items }) {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <section className="breadcumps">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="breadcumps-inner">
              {items.map((item, index) => (
                <span key={index}>
                  {item.href ? (
                    <Link href={item.href}>
                      {item.name || item.label}
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
  );
}
