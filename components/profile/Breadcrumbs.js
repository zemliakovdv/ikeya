'use client';

import Link from 'next/link';

export default function Breadcrumbs({ items }) {
  // Безопасная проверка
  const breadcrumbItems = Array.isArray(items) ? items : [];

  return (
    <section className="breadcumps">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="breadcumps-inner">
              <Link href="/">Главная</Link>
              {breadcrumbItems.length > 0 && (
                <>
                  <span></span>
                  {breadcrumbItems.map((item, index) => (
                    <span key={index}>
                      {item.href ? (
                        <Link href={item.href}>{item.label}</Link>
                      ) : (
                        <a href="#">{item.label}</a>
                      )}
                      {index < breadcrumbItems.length - 1 && <span></span>}
                    </span>
                  ))}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
