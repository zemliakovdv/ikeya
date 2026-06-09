'use client';

import { useEffect, useRef } from 'react';
import ProductCard from '@/components/catalog/products/ProductCard';
import { stripBackendOrigin } from '@/lib/config/api';

const POLL_INTERVAL = 50;
const POLL_TIMEOUT = 3000;

export default function ProductsGridSlider({ slides, blockId }) {
  const containerRef = useRef(null);
  const swiperRef = useRef(null);
  const galleryMainInstances = useRef({});
  const galleryThumbsInstances = useRef({});

  useEffect(() => {
    let pollTimer = null;
    let elapsed = 0;

    const destroy = () => {
      if (swiperRef.current) {
        swiperRef.current.destroy(true, true);
        swiperRef.current = null;
      }
      Object.values(galleryMainInstances.current).forEach((s) => s?.destroy?.(true, true));
      Object.values(galleryThumbsInstances.current).forEach((s) => s?.destroy?.(true, true));
      galleryMainInstances.current = {};
      galleryThumbsInstances.current = {};
    };

    const init = () => {
      const el = containerRef.current;
      if (!el) return;

      destroy();

      // Галереи внутри карточек
      el.querySelectorAll('.product-gallery-main').forEach((galleryEl) => {
        const galleryId = galleryEl.getAttribute('data-gallery');
        if (!galleryId) return;

        const thumbsEl = el.querySelector(`[data-gallery-thumbs="${galleryId}"]`);
        let thumbsSwiper = null;

        if (thumbsEl) {
          try {
            thumbsSwiper = new window.Swiper(thumbsEl, {
              spaceBetween: 8,
              slidesPerView: 3,
              freeMode: true,
              watchSlidesProgress: true,
            });
            galleryThumbsInstances.current[galleryId] = thumbsSwiper;
          } catch (e) {
            console.error('Ошибка инициализации thumbs swiper:', e);
          }
        }

        try {
          const mainSwiper = new window.Swiper(galleryEl, {
            spaceBetween: 10,
            navigation: {
              nextEl: galleryEl.querySelector('.swiper-button-next'),
              prevEl: galleryEl.querySelector('.swiper-button-prev'),
            },
            thumbs: thumbsSwiper ? { swiper: thumbsSwiper } : undefined,
          });
          galleryMainInstances.current[galleryId] = mainSwiper;
        } catch (e) {
          console.error('Ошибка инициализации main gallery swiper:', e);
        }
      });

      // Основной слайдер
      try {
        swiperRef.current = new window.Swiper(el.querySelector('.article-products-slider'), {
          slidesPerView: 'auto',
          slidesPerGroup: 1,
          spaceBetween: 8,
          loop: false,
          watchOverflow: true,
          observer: true,
          observeParents: true,
          pagination: {
            el: el.querySelector('.article-products-slider__pagination'),
            clickable: true,
            dynamicBullets: true,
            dynamicMainBullets: 1,
          },
          navigation: {
            nextEl: el.querySelector('.article-products-slider__nav-next'),
            prevEl: el.querySelector('.article-products-slider__nav-prev'),
          },
        });
      } catch (e) {
        console.error('Ошибка инициализации products slider:', e);
      }
    };

    const poll = () => {
      if (typeof window === 'undefined') return;

      if (window.Swiper && containerRef.current) {
        init();
        return;
      }

      elapsed += POLL_INTERVAL;
      if (elapsed >= POLL_TIMEOUT) {
        console.warn(`ProductsGridSlider [${blockId}]: Swiper не загружен за ${POLL_TIMEOUT}ms`);
        return;
      }

      pollTimer = setTimeout(poll, POLL_INTERVAL);
    };

    poll();

    return () => {
      if (pollTimer) clearTimeout(pollTimer);
      destroy();
    };
  }, [slides, blockId]);

  return (
    <div className="article-products-card-slider-root" ref={containerRef}>
      <div className="article-products-slider swiper" data-slider={blockId}>
        <div className="swiper-wrapper">
          {slides.map((product) => (
            <div key={product.id || product.sku} className="swiper-slide article-products-slider__slide">
              <ProductCard
                product={{
                  id: product.id,
                  attributes: {
                    sku: product.sku,
                    small_desc_name: product.title,
                    name_ru: product.description,
                    price_byn: product.price,
                    local_images: (product.images || []).map((img) =>
                      stripBackendOrigin(img)
                    ),
                    variants: product.variants || null,
                    is_bestseller: product.badges?.includes('hit'),
                    is_new: product.badges?.includes('new'),
                  },
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {slides.length > 1 && <div className="article-products-slider__pagination" />}
      {slides.length > 1 && (
        <>
          <button className="article-products-slider__nav article-products-slider__nav-prev" type="button" aria-label="Назад">
            <svg width="7" height="12" viewBox="0 0 7 12" fill="none">
              <path d="M6 1L1 6L6 11" stroke="#181818" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button className="article-products-slider__nav article-products-slider__nav-next" type="button" aria-label="Вперёд">
            <svg width="7" height="12" viewBox="0 0 7 12" fill="none">
              <path d="M1 11L6 6L1 1" stroke="#181818" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </>
      )}
    </div>
  );
}
