// components/about/AboutCategoriesSlider.js
'use client';

import Link from 'next/link';
import Image from 'next/image';

const PLACEHOLDER_IMAGE = '/assets/img/main-page/popular-categories/popular-categories-1.png';

export default function AboutCategoriesSlider({ categories = [] }) {
  if (!categories.length) return null;

  // Разбиваем на слайды по 6
  const slides = [];
  for (let i = 0; i < categories.length; i += 6) {
    slides.push(categories.slice(i, i + 6));
  }

  return (
    <div className="popular-categories">
      <div className="about-categories-inner swiper">
        <div className="swiper-wrapper">
          {slides.map((slideCategories, slideIndex) => (
            <div key={slideIndex} className="swiper-slide popular-categories-item">
              {slideCategories.map((category) => (
                <div key={category.id} className="categories-item-card">
                  <div className="categories-card-img">
                    <Image
                      src={category.image}
                      alt={category.name}
                      width={120}
                      height={120}
                      priority={slideIndex === 0}
                      onError={(e) => { e.target.src = PLACEHOLDER_IMAGE; }}
                      style={{ width: '100%', height: 'auto' }}
                    />
                  </div>
                  <p>{category.name}</p>
                  <Link href={category.url} />
                </div>
              ))}
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
      <div className="popular-categories__pagination" />
    </div>
  );
}