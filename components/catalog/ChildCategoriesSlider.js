// components/catalog/ChildCategoriesSlider.js
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useRef } from 'react';

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
  const containerRef = useRef(null);
  const swiperRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const init = () => {
      if (!window.Swiper) {
        setTimeout(init, 100);
        return;
      }

      if (swiperRef.current) {
        swiperRef.current.destroy(true, true);
        swiperRef.current = null;
      }

      const sliderEl = containerRef.current?.querySelector('.popular-categories-inner');
      if (!sliderEl) return;

      const prevBtn = containerRef.current?.querySelector('.popular-categories__nav-prev');
      const nextBtn = containerRef.current?.querySelector('.popular-categories__nav-next');

      swiperRef.current = new window.Swiper(sliderEl, {
        slidesPerView: 8,
        spaceBetween: 12,
        speed: 600,
        watchOverflow: true,
        navigation: {
          nextEl: nextBtn,
          prevEl: prevBtn,
        },
        breakpoints: {
          0:   { slidesPerView: 3, spaceBetween: 8 },
          576: { slidesPerView: 4, spaceBetween: 10 },
          768: { slidesPerView: 6, spaceBetween: 12 },
          992: { slidesPerView: 8, spaceBetween: 12 },
        },
        on: {
          init(swiper) {
            if (prevBtn) prevBtn.style.display = swiper.isBeginning ? 'none' : '';
            if (nextBtn) nextBtn.style.display = swiper.isEnd ? 'none' : '';
          },
          slideChange(swiper) {
            if (prevBtn) prevBtn.style.display = swiper.isBeginning ? 'none' : '';
            if (nextBtn) nextBtn.style.display = swiper.isEnd ? 'none' : '';
          },
        },
      });
    };

    init();

    return () => {
      if (swiperRef.current) {
        swiperRef.current.destroy(true, true);
        swiperRef.current = null;
      }
    };
  }, [categories]);

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
    <div className="popular-categories" ref={containerRef}>
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