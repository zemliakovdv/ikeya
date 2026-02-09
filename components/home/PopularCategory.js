// components/home/PopularCategory.js
'use client';

import { useEffect } from 'react';
import Link from 'next/link';

const PLACEHOLDER_IMAGE = '/assets/img/main-page/popular-categories/popular-categories-1.png';

export default function PopularCategory({ categories = [] }) {
  useEffect(() => {
    if (typeof window !== 'undefined' && window.Swiper) {
      new window.Swiper('.popular-categories-inner', {
        slidesPerView: 1,
        spaceBetween: 0,
        loop: true,
        pagination: {
          el: '.popular-categories__pagination',
          clickable: true,
        },
        navigation: {
          nextEl: '.popular-categories__nav-next',
          prevEl: '.popular-categories__nav-prev',
        },
      });
    }
  }, []);

  const handleImageError = (e) => {
    console.log('❌ Не загрузилась картинка категории');
    e.target.src = PLACEHOLDER_IMAGE;
  };

  // ✅ ИСПРАВЛЕНО: Если категорий меньше 24, дополняем их копиями
  let displayCategories = [...categories];
  
  // Минимум 24 категории (3 слайда по 8)
  if (displayCategories.length > 0 && displayCategories.length < 24) {
    const needed = 24 - displayCategories.length;
    const cycled = [];
    
    for (let i = 0; i < needed; i++) {
      cycled.push({
        ...displayCategories[i % displayCategories.length],
        // ✅ Уникальный ID для React key
        id: `${displayCategories[i % displayCategories.length].id}-copy-${i}`
      });
    }
    
    displayCategories = [...displayCategories, ...cycled];
  }

  // Если категорий вообще нет, показываем заглушки
  if (categories.length === 0) {
    displayCategories = [
      // Слайд 1 - Мягкая мебель
      ...Array.from({ length: 8 }, (_, i) => ({ 
        id: `fallback-1-${i}`, 
        name: 'Мягкая мебель', 
        image: '/assets/img/main-page/popular-categories/popular-categories-1.png', 
        url: '/catalog' 
      })),
      // Слайд 2 - Комоды
      ...Array.from({ length: 8 }, (_, i) => ({ 
        id: `fallback-2-${i}`, 
        name: 'Комоды', 
        image: '/assets/img/main-page/popular-categories/popular-categories-2.png', 
        url: '/catalog' 
      })),
      // Слайд 3 - Матрасы
      ...Array.from({ length: 8 }, (_, i) => ({ 
        id: `fallback-3-${i}`, 
        name: 'Матрасы', 
        image: '/assets/img/main-page/popular-categories/popular-categories-3.png', 
        url: '/catalog' 
      }))
    ];
  }

  // Разбиваем категории на группы по 8
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
                            <img 
                              src={category.image} 
                              alt={category.name}
                              onError={handleImageError}
                            />
                          </div>
                          <p>{category.name}</p>
                          <Link href={category.url}></Link>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>

              <div className="popular-categories__nav popular-categories__nav-prev">
                <svg width="6.67" height="12" viewBox="0 0 7 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 1L1 6L6 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              
              <div className="popular-categories__nav popular-categories__nav-next">
                <svg width="6.67" height="12" viewBox="0 0 7 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 11L6 6L1 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>

              <div className="popular-categories__pagination"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
