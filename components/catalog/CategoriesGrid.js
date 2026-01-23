export default function CategoriesGrid({ categories = [] }) {
  if (categories.length === 0) return null;

  return (
    <section className="catalog-categories">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <h2>Каталог</h2>
            <div className="catalog-categories-items">
              {categories.map(category => (
                <div key={category.id} className="catalog-categoties-card">
                  <a href={category.url} className="atalog-categoties-card__link">
                    <div className="catalog-categoties-banner">
                      <img src={category.image} alt={category.name} />
                    </div>
                    <p>{category.name}</p>
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
