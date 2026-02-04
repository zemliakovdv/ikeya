// components/catalog/CategoriesGrid.js
'use client';

import Link from 'next/link';

const API_BASE_URL = 'http://45.135.234.22';

export default function CategoriesGrid({ categories = [], limit = 12 }) {
  if (!categories || categories.length === 0) {
    return null;
  }

  const displayCategories = categories.slice(0, limit);

  return (
    <section className="catalog-categories">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <h2>Популярные категории</h2>
            <div className="catalog-categories-items">
              {displayCategories.map((category) => {
                const attr = category.attributes;
                
                // Название
                const name = attr.translated_name || attr.name || 'Категория';
                
                // 🔥 Только local изображения (remote не работают)
                let image;
                if (attr.local_image_path) {
                  image = attr.local_image_path.startsWith('http') 
                    ? attr.local_image_path 
                    : `${API_BASE_URL}/${attr.local_image_path}`;
                } else {
                  // Placeholder если нет local изображения
                  image = `https://via.placeholder.com/300x300/e0e0e0/757575?text=${encodeURIComponent(name.slice(0, 15))}`;
                }
                
                const url = `/catalog/${attr.ikea_id}`;

                return (
                  <div key={category.id} className="catalog-categoties-card">
                    <Link href={url} className="catalog-categoties-card-link">
                      <div className="catalog-categoties-banner">
                        <img 
                          src={image} 
                          alt={name}
                          onError={(e) => {
                            // Если не загрузилось, показываем placeholder
                            e.target.src = `https://via.placeholder.com/300x300/e0e0e0/757575?text=${encodeURIComponent(name.slice(0, 15))}`;
                          }}
                        />
                      </div>
                      <p>{name}</p>
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
