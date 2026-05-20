// components/catalog/CategoriesGrid.js
'use client';

import Link from 'next/link';
import { IMAGES_BASE_URL } from '@/lib/api/ikea';

const PLACEHOLDER = '/assets/img/catalog-modal/placeholder.svg';

function normalizeBasePath(basePath) {
  if (!basePath) return '';
  return basePath.endsWith('/') ? basePath.slice(0, -1) : basePath;
}

function resolveImageUrl(url) {
  if (!url) return null;

  if (url.startsWith('/assets')) {
    return url;
  }

  if (url.startsWith('http')) {
    return url.replace(/^https?:\/\/[^/]+/, IMAGES_BASE_URL);
  }

  return `${IMAGES_BASE_URL}${url.startsWith('/') ? url : `/${url}`}`;
}

export default function CategoriesGrid({
  categories = [],
  limit = null,
  showTitle = false,
  basePath = '',
}) {
  if (!Array.isArray(categories) || categories.length === 0) return null;

  const displayCategories = limit ? categories.slice(0, limit) : categories;
  const base = normalizeBasePath(basePath);

  return (
    <>
      {showTitle && <h2 style={{ marginBottom: '20px' }}>Популярные категории</h2>}

      <div className="catalog-categories-items">
        {displayCategories.map((category) => {
          if (!category) return null;

          const id = category.id;

          let name = 'Категория';
          let url = '/catalog';
          let image = null;

          if (category.name && (category.href || category.url)) {
            name = category.name;
            url = category.href || category.url;
            image = resolveImageUrl(category.image);
          } else if (category.attributes) {
            const attr = category.attributes;
            const slug = attr.slug || id;

            name = attr.translated_name || attr.name || 'Категория';
            url = base ? `${base}/${slug}` : `/catalog/${slug}`;

            image = resolveImageUrl(
              attr.icon_url ||
              attr.pictogram_url ||
              attr.background_image_url ||
              attr.local_image_path ||
              attr.remote_image_url
            );
          }

          const finalImage = image || PLACEHOLDER;

          return (
            <div key={id || url} className="catalog-categoties-card">
              <Link href={url} className="catalog-categoties-card-link">
                <div className="catalog-categoties-banner">
                  <img
                    src={finalImage}
                    alt={name}
                    loading="lazy"
                    decoding="async"
                    onError={(e) => {
                      e.currentTarget.src = PLACEHOLDER;
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