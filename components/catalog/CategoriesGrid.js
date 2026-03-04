// components/catalog/CategoriesGrid.js
'use client';

import Link from 'next/link';

const API_BASE_URL = 'http://45.135.234.22';

function normalizeBasePath(basePath) {
  if (!basePath) return '';
  if (basePath.endsWith('/')) return basePath.slice(0, -1);
  return basePath;
}

export default function CategoriesGrid({
  categories = [],
  limit = null,
  showTitle = false,
  // ✅ опционально: если передашь basePath="/catalog/parent-slug",
  // то дочерние категории будут вести на /catalog/parent-slug/child-slug
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

          // 1) уже преобразованные данные
          if (category.name && category.href) {
            return (
              <div key={category.id || category.href} className="catalog-categoties-card">
                <Link href={category.href} className="catalog-categoties-card-link">
                  <div className="catalog-categoties-banner">
                    <img
                      src={category.image}
                      alt={category.name}
                      onError={(e) => {
                        e.target.src = `https://via.placeholder.com/300x300/e0e0e0/757575?text=${encodeURIComponent(
                          category.name.slice(0, 15)
                        )}`;
                      }}
                    />
                  </div>
                  <p>{category.name}</p>
                </Link>
              </div>
            );
          }

          // 2) API формат {id, attributes}
          if (!category.attributes) return null;

          const categoryId = category.id;
          const attr = category.attributes;

          const name = attr.translated_name || attr.name || 'Категория';
          const slug = attr.slug;

          let image = `https://via.placeholder.com/300x300/e0e0e0/757575?text=${encodeURIComponent(
            name.slice(0, 15)
          )}`;

          if (attr.local_image_path) {
            image = attr.local_image_path.startsWith('http')
              ? attr.local_image_path
              : `${API_BASE_URL}/${attr.local_image_path}`;
          } else if (attr.remote_image_url) {
            image = attr.remote_image_url;
          }

          // ✅ URL: если есть basePath — делаем вложенный путь
          // иначе — /catalog/{slug}
          let url = '/catalog';
          if (slug) {
            url = base ? `${base}/${slug}` : `/catalog/${slug}`;
          }

          return (
            <div key={categoryId} className="catalog-categoties-card">
              <Link href={url} className="catalog-categoties-card-link">
                <div className="catalog-categoties-banner">
                  <img
                    src={image}
                    alt={name}
                    onError={(e) => {
                      e.target.src = `https://via.placeholder.com/300x300/e0e0e0/757575?text=${encodeURIComponent(
                        name.slice(0, 15)
                      )}`;
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