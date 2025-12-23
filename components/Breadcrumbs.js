import Link from 'next/link';

export default function Breadcrumbs({ items }) {
  return (
    <section className="breadcumps">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="breadcumps-inner">
              {items.map((item, index) => (
                <span key={index}>
                  {item.href ? (
                    <Link href={item.href}>{item.label}</Link>
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
