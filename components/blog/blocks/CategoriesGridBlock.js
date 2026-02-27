import Link from 'next/link';

export default function CategoriesGridBlock({ block }) {
  const categories = block.grid_categories || [];
  if (!categories.length) return null;

  return (
    <section className="grid-of-goods">
      <div className="row g-4">
        {categories.map((cat) => (
          <div key={cat.ikea_id} className="col-lg-3 col-md-4 col-sm-6">
            <Link href={`/categories/${cat.ikea_id}`} className="category-card">
              {cat.name}
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
