// components/catalog/CategoriesGrid.js
'use client';

import Link from 'next/link';

const API_BASE_URL = 'http://45.135.234.22';

export default function CategoriesGrid({ categories = [], limit = null, showTitle = false }) {
  if (!categories || categories.length === 0) {
    return null;
  }

  const displayCategories = limit ? categories.slice(0, limit) : categories;

  return (
    <>
      {showTitle && <h2 style={{ marginBottom: '20px' }}>Популярные категории</h2>}
      <div className="catalog-categories-items">
        {displayCategories.map((category) => {
          // Поддержка двух форматов: готовый объект или данные из API
          let name, image, url;

          if (category.name && category.href) {
            // Уже преобразованные данные
            name = category.name;
            image = category.image;
            url = category.href;
          } else if (category.attributes) {
            // Данные напрямую из API
            const attr = category.attributes;
            name = attr.translated_name || attr.name || 'Категория';
            
            if (attr.local_image_path) {
              image = attr.local_image_path.startsWith('http') 
                ? attr.local_image_path 
                : `${API_BASE_URL}/${attr.local_image_path}`;
            } else if (attr.remote_image_url) {
              image = attr.remote_image_url;
            } else {
              image = `https://via.placeholder.com/300x300/e0e0e0/757575?text=${encodeURIComponent(name.slice(0, 15))}`;
            }
            
            url = `/catalog/${attr.ikea_id}`;
          } else {
            return null;
          }

          return (
            <div key={category.id} className="catalog-categoties-card">
              <Link href={url} className="catalog-categoties-card-link">
                <div className="catalog-categoties-banner">
                  <img 
                    src={image} 
                    alt={name}
                    onError={(e) => {
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
    </>
  );
}
