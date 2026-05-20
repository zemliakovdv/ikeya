// components/catalog/ChildCategoriesSlider.js
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useRef } from 'react';
import { IMAGES_BASE_URL } from '@/lib/api/ikea';

const PLACEHOLDER = '/assets/img/no-image.jpg';

function resolveImage(attr) {
  const raw =
    attr?.icon_url ||
    attr?.pictogram_url ||
    attr?.background_image_url ||
    attr?.local_image_path ||
    attr?.remote_image_url;

  if (!raw) return PLACEHOLDER;

  if (raw.startsWith('/assets')) {
    return raw;
  }

  if (raw.startsWith('http')) {
    return raw.replace(/^https?:\/\/[^/]+/, IMAGES_BASE_URL);
  }

  return `${IMAGES_BASE_URL}${raw.startsWith('/') ? raw : `/${raw}`}`;
}

function updateNavButtons(swiper, prevBtn, nextBtn) {
  if (!prevBtn || !nextBtn) return;

  prevBtn.style.display = swiper.isBeginning ? 'none' : '';
  nextBtn.style.display = swiper.isEnd ? 'none' : '';
}

export default function ChildCategoriesSlider({ categories = [], basePath = '' }) {
  const containerRef = useRef(null);
  const swiperRef = useRef(null);
  const retryTimerRef = useRef(0);
  const raf1Ref = useRef(0);
  const raf2Ref = useRef(0);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!categories.length) return;

    if (retryTimerRef.current) clearTimeout(retryTimerRef.current);
    if (raf1Ref.current) cancelAnimationFrame(raf1Ref.current);
    if (raf2Ref.current) cancelAnimationFrame(raf2Ref.current);

    const init = () => {
      if (!window.Swiper) {
        retryTimerRef.current = window.setTimeout(init, 100);
        return;
      }

      const root = containerRef.current;
      if (!root) return;

      const sliderEl = root.querySelector('.popular-categories-inner');
      if (!sliderEl) return;

      const prevBtn = root.querySelector('.popular-categories__nav-prev');
      const nextBtn = root.querySelector('.popular-categories__nav-next');

      if (swiperRef.current) {
        swiperRef.current.destroy(true, true);
        swiperRef.current = null;
      }

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
          0: {
            slidesPerView: 3,
            spaceBetween: 8,
          },
          576: {
            slidesPerView: 4,
            spaceBetween: 10,
          },
          768: {
            slidesPerView: 6,
            spaceBetween: 12,
          },
          992: {
            slidesPerView: 8,
            spaceBetween: 12,
          },
        },
        on: {
          init(swiper) {
            updateNavButtons(swiper, prevBtn, nextBtn);
          },
          slideChange(swiper) {
            updateNavButtons(swiper, prevBtn, nextBtn);
          },
          resize(swiper) {
            updateNavButtons(swiper, prevBtn, nextBtn);
          },
        },
      });
    };

    raf1Ref.current = requestAnimationFrame(() => {
      raf2Ref.current = requestAnimationFrame(init);
    });

    return () => {
      if (retryTimerRef.current) clearTimeout(retryTimerRef.current);
      if (raf1Ref.current) cancelAnimationFrame(raf1Ref.current);
      if (raf2Ref.current) cancelAnimationFrame(raf2Ref.current);

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
              <Link href={item.url} className="categories-item-card">
                <div className="categories-card-img">
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={120}
                    height={120}
                    priority={index < 3}
                    onError={(e) => {
                      e.currentTarget.src = PLACEHOLDER;
                    }}
                    style={{ width: '100%', height: 'auto' }}
                  />
                </div>
                <p>{item.name}</p>
              </Link>
            </div>
          ))}
        </div>
      </div>

      <button
        className="popular-categories__nav popular-categories__nav-prev"
        type="button"
        aria-label="Предыдущие категории"
      >
        <svg width="6.67" height="12" viewBox="0 0 7 12" fill="none">
          <path d="M6 1L1 6L6 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <button
        className="popular-categories__nav popular-categories__nav-next"
        type="button"
        aria-label="Следующие категории"
      >
        <svg width="6.67" height="12" viewBox="0 0 7 12" fill="none">
          <path d="M1 11L6 6L1 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  );
}