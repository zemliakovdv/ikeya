'use client';

import { useEffect, useRef } from 'react';
import ProductCard from '@/components/catalog/products/ProductCard';

export default function ProductsGridSlider({ slides, blockId }) {
  const swiperRef = useRef(null);

  // ✅ отдельные инстансы галерей, чтобы корректно destroy()
  const galleryMainInstances = useRef({});
  const galleryThumbsInstances = useRef({});

  useEffect(() => {
    if (typeof window === 'undefined' || !window.Swiper) return;

    let raf1 = 0;
    let raf2 = 0;

    const init = () => {
      const el = document.querySelector(`.products-slider[data-slider="${blockId}"]`);
      if (!el) return;

      // ---- cleanup старых галерей (важно) ----
      Object.values(galleryMainInstances.current).forEach((s) => s?.destroy?.(true, true));
      Object.values(galleryThumbsInstances.current).forEach((s) => s?.destroy?.(true, true));
      galleryMainInstances.current = {};
      galleryThumbsInstances.current = {};

      // ✅ Инициализируем галереи ТОЛЬКО внутри текущего блока
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

      // ---- cleanup старого основного слайдера ----
      if (swiperRef.current) {
        swiperRef.current.destroy(true, true);
        swiperRef.current = null;
      }

      // ✅ основной слайдер
      try {
        swiperRef.current = new window.Swiper(el, {
          slidesPerView: 1,
          spaceBetween: 0,
          loop: false,
          pagination: {
            el: el.querySelector('.products-slider__pagination'),
            clickable: true,
          },
          navigation: {
            nextEl: el.querySelector('.products-slider__nav-next'),
            prevEl: el.querySelector('.products-slider__nav-prev'),
          },
        });
      } catch (e) {
        console.error('Ошибка инициализации products slider:', e);
      }
    };

    // ✅ rAF x2 — даём DOM “устаканиться” после рендера карточек
    raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(init);
    });

    return () => {
      if (raf1) cancelAnimationFrame(raf1);
      if (raf2) cancelAnimationFrame(raf2);

      // destroy основного
      if (swiperRef.current) {
        swiperRef.current.destroy(true, true);
        swiperRef.current = null;
      }

      // destroy галерей
      Object.values(galleryMainInstances.current).forEach((s) => s?.destroy?.(true, true));
      Object.values(galleryThumbsInstances.current).forEach((s) => s?.destroy?.(true, true));
      galleryMainInstances.current = {};
      galleryThumbsInstances.current = {};
    };
  }, [slides, blockId]);

  return (
    <div className="products-card-slider">
      <div className="products-slider swiper" data-slider={blockId}>
        <div className="swiper-wrapper">
          {slides.map((slideProducts, index) => (
            <div key={index} className="swiper-slide">
              <div className="row g-4 swiper-slide-inner">
                {slideProducts.map(product => (
                  <ProductCard
                    key={product.id}
                    product={{
                      id: product.id,
                      attributes: {
                        sku: product.sku,
                        small_desc_name: product.title,
                        name_ru: product.description,
                        price_byn: product.price,
                        local_images: (product.images || []).map(img =>
                          img.replace('http://45.135.234.22/', '')
                        ),
                        variants: product.variants || null,
                        is_bestseller: product.badges?.includes('hit'),
                        is_new: product.badges?.includes('new'),
                      }
                    }}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        {slides.length > 1 && <div className="products-slider__pagination"></div>}
        {slides.length > 1 && (
          <>
            <button className="products-slider__nav products-slider__nav-prev" type="button">
              <svg width="7" height="12" viewBox="0 0 7 12" fill="none">
                <path d="M6 1L1 6L6 11" stroke="#181818" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button className="products-slider__nav products-slider__nav-next" type="button">
              <svg width="7" height="12" viewBox="0 0 7 12" fill="none">
                <path d="M1 11L6 6L1 1" stroke="#181818" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </>
        )}
      </div>
    </div>
  );
}