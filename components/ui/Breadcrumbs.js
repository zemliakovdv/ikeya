'use client';

export default function Breadcrumbs({ items }) {
  if (!items || items.length === 0) return null;

  return (
    <section className="breadcumps">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="breadcumps-inner">
              {items.map((item, index) => (
                <span key={index}>
                  {item.url ? (
                    <a href={item.url}>{item.label}</a>
                  ) : (
                    <span>{item.label}</span>
                  )}
                  {index < items.length - 1 && <span>/</span>}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
