// components/catalog/ChildCategoriesSlider.js
'use client';

import Link from 'next/link';
import Image from 'next/image';

const API_BASE_URL = 'https://test.ikeya.by';
const PLACEHOLDER = '/assets/img/no-image.jpg';

function resolveImage(attr) {
  const raw = attr?.icon_url || attr?.pictogram_url || attr?.background_image_url;
  if (!raw) return PLACEHOLDER;
  if (raw.startsWith('http') || raw.startsWith('/assets')) return raw;
  const clean = raw.startsWith('/') ? raw : `/${raw}`;
  return `${API_BASE_URL}${clean}`;
}

export default function ChildCategoriesSlider({ categories = [], basePath = '' }) {
  if (!categories.length) return null;

  const items = categories.map((cat) => {
    const attr = cat.attributes || {};
    const slug = attr.slug || cat.id;
    return {
      id: cat.id,
      name: attr.translated_name || attr.name || 'Категория',
      image: resolveImage(attr),
      url: basePath ? `${basePath}/${slug}` : `/catalog/${slug}`,
    };
  });

  return (
    <div className="popular-categories">
      <div className="popular-categories-inner swiper">
        <div className="swiper-wrapper">
          {items.map((item, index) => (
            <div key={item.id} className="swiper-slide popular-categories-item">
              <div className="categories-item-card">
                <div className="categories-card-img">
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={120}
                    height={120}
                    priority={index < 8}
                    onError={(e) => { e.target.src = PLACEHOLDER; }}
                    style={{ width: '100%', height: 'auto' }}
                  />
                </div>
                <p>{item.name}</p>
                <Link href={item.url} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="popular-categories__nav popular-categories__nav-prev">
        <svg width="6.67" height="12" viewBox="0 0 7 12" fill="none">
          <path d="M6 1L1 6L6 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <div className="popular-categories__nav popular-categories__nav-next">
        <svg width="6.67" height="12" viewBox="0 0 7 12" fill="none">
          <path d="M1 11L6 6L1 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </div>
  );
}