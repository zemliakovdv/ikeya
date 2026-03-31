'use client';

// components/home/PopularCategory.js

import Link from 'next/link';
import Image from 'next/image';

const PLACEHOLDER_IMAGE = '/assets/img/main-page/popular-categories/popular-categories-1.png';

const FALLBACK_CATEGORIES = [
  ...Array.from({ length: 8 }, (_, i) => ({ id: `fallback-1-${i}`, name: 'Мягкая мебель', image: '/assets/img/main-page/popular-categories/popular-categories-1.png', url: '/catalog' })),
  ...Array.from({ length: 8 }, (_, i) => ({ id: `fallback-2-${i}`, name: 'Комоды',        image: '/assets/img/main-page/popular-categories/popular-categories-2.png', url: '/catalog' })),
  ...Array.from({ length: 8 }, (_, i) => ({ id: `fallback-3-${i}`, name: 'Матрасы',       image: '/assets/img/main-page/popular-categories/popular-categories-3.png', url: '/catalog' })),
];

export default function PopularCategory({ categories = [] }) {
  const displayCategories = categories.length ? categories : FALLBACK_CATEGORIES;

  // Разбиваем на слайды по 8
  const slides = [];
  for (let i = 0; i < displayCategories.length; i += 8) {
    slides.push(displayCategories.slice(i, i + 8));
  }


  return (
    <section className="popular-category">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <h2>Популярные категории</h2>
            <div className="popular-categories">
              <div className="popular-categories-inner swiper">
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
          </div>
        </div>
      </div>
    </section>
  );
}