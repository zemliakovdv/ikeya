// components/catalog/CategoriesGrid.js
'use client';

import Link from 'next/link';

const API_BASE_URL = 'https://test.ikeya.by';
const PLACEHOLDER = '/assets/img/no-image.jpg';

function normalizeBasePath(basePath) {
  if (!basePath) return '';
  if (basePath.endsWith('/')) return basePath.slice(0, -1);
  return basePath;
}

export default function CategoriesGrid({
  categories = [],
  limit = null,
  showTitle = false,
  basePath = ''
}) {
  if (!categories || categories.length === 0) return null;

  const displayCategories = limit ? categories.slice(0, limit) : categories;
  const base = normalizeBasePath(basePath);

  return (
    <>
      {showTitle && <h2 style={{ marginBottom: '20px' }}>Популярные категории</h2>}

      <div className="catalog-categories-items">
        {displayCategories.map((category) => {
          if (!category) return null;

          let name, url, image;
          const id = category.id;

          // 1) Формат PopularCategory
          if (category.name && (category.href || category.url)) {
            name = category.name;
            url = category.href || category.url;
            image = category.image;
          } 
          // 2) Формат дерева API
          else if (category.attributes) {
            const attr = category.attributes;
            name = attr.translated_name || attr.name || 'Категория';
            const slug = attr.slug || id;
            
            url = base ? `${base}/${slug}` : `/catalog/${slug}`;

            // ЛОГИКА ПО ТВОЕМУ ЗАПРОСУ:
            // Сначала icon_url, если нет — pictogram_url
            const rawPath = attr.icon_url || attr.pictogram_url;

            if (rawPath) {
              if (rawPath.startsWith('http') || rawPath.startsWith('/assets')) {
                image = rawPath;
              } else {
                const cleanPath = rawPath.startsWith('/') ? rawPath : `/${rawPath}`;
                image = `${API_BASE_URL}${cleanPath}`;
              }
            }
          }

          const finalImage = image || '/assets/img/catalog-modal/placeholder.svg';

          return (
            <div key={id || url} className="catalog-categoties-card">
              <Link href={url} className="catalog-categoties-card-link">
                <div className="catalog-categoties-banner">
                  <img
                    src={finalImage}
                    alt={name}
                    loading="lazy"
                    onError={(e) => {
                      e.target.src = PLACEHOLDER;
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