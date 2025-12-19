// components/Catalog/CatalogCategories.jsx
export default function CatalogCategories({ 
    show = true, 
    visibleCount = 20,
    categories = []
}) {
    // Дефолтные категории если не переданы
    const defaultCategories = Array.from({ length: 20 }, (_, i) => ({
        image: `/assets/img/catalog-page/collection${i === 0 ? '' : i + 1}.png`,
        text: `Коллекция ${i + 1}`,
        href: '/catalog-start.html'
    }));

    const items = categories.length > 0 ? categories : defaultCategories;

    if (!show) {
        return (
            <section className="catalog-categories" style={{ display: 'none' }}>
                <div className="container">
                    <div className="row">
                        <div className="col-12">
                            <h2>Каталог</h2>
                            <div className="catalog-categories-items"></div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="catalog-categories">
            <div className="container">
                <div className="row">
                    <div className="col-12">
                        <h2>Каталог</h2>
                        <div className="catalog-categories-items">
                            {items.map((cat, i) => (
                                <div 
                                    key={i} 
                                    className="catalog-categoties-card"
                                    style={i >= visibleCount ? { display: 'none' } : {}}
                                >
                                    <a href={cat.href} className="catalog-categoties-cardlink">
                                        <div className="catalog-categoties-banner">
                                            <img src={cat.image} alt={cat.text} />
                                        </div>
                                        <p>{cat.text}</p>
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
