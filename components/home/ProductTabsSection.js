'use client';

import { useEffect, useRef } from 'react';
import ProductCard from '@/components/catalog/products/ProductCard';

function toLocalImagePath(image) {
  if (!image) return '';

  if (image.startsWith('/images/')) {
    return image;
  }

  try {
    const url = new URL(image);

    if (url.pathname.startsWith('/images/')) {
      return url.pathname;
    }

    return image;
  } catch {
    return image.startsWith('/') ? image : `/${image}`;
  }
}

export default function ProductTabsSection({
  title = 'Товары',
  tabs = [],
  tabProducts = {},
  sectionClass = 'products-tabs',
  showNewBadge = false,
}) {
  const sectionRef = useRef(null);
  const swipersRef = useRef({});
  const retryTimerRef = useRef(0);
  const raf1Ref = useRef(0);
  const raf2Ref = useRef(0);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!sectionRef.current) return;

    let cancelled = false;

    const destroySwipers = () => {
      Object.values(swipersRef.current).forEach((swiper) => {
        swiper?.destroy?.(true, true);
      });

      swipersRef.current = {};
    };

    const initSliders = () => {
      if (cancelled) return;

      if (!window.Swiper) {
        retryTimerRef.current = window.setTimeout(initSliders, 100);
        return;
      }

      const sectionEl = sectionRef.current;
      if (!sectionEl) return;

      destroySwipers();

      const sliders = sectionEl.querySelectorAll('.products-slider');

      sliders.forEach((slider) => {
        const sliderId = slider.getAttribute('data-slider');

        if (!sliderId) return;

        const slideCount = slider.querySelectorAll('.swiper-slide').length;
        const prevBtn = slider.querySelector('.products-slider__nav-prev');
        const nextBtn = slider.querySelector('.products-slider__nav-next');
        const pagination = slider.querySelector('.products-slider__pagination');

        if (slideCount <= 1) {
          if (prevBtn) prevBtn.style.display = 'none';
          if (nextBtn) nextBtn.style.display = 'none';
          if (pagination) pagination.style.display = 'none';
          return;
        }

        if (prevBtn) prevBtn.style.display = '';
        if (nextBtn) nextBtn.style.display = '';
        if (pagination) pagination.style.display = '';

        swipersRef.current[sliderId] = new window.Swiper(slider, {
          slidesPerView: 2,
          spaceBetween: 0,
          breakpoints: {
            0: {
              slidesPerView: 2,
              spaceBetween: 0,
            },
            360: {
              slidesPerView: 2,
              spaceBetween: 0,
            },
            576: {
              slidesPerView: 3.25,
              spaceBetween: 0,
            },
            768: {
              slidesPerView: 3.5,
              spaceBetween: 0,
            },
            992: {
              slidesPerView: 4.5,
              spaceBetween: 0,
            },
            1200: {
              slidesPerView: 4,
              spaceBetween: 0,
            },
            1400: {
              slidesPerView: 5,
              spaceBetween: 0,
            },
            1920: {
              slidesPerView: 5,
              spaceBetween: 0,
            },
          },
          loop: false,
          speed: 600,
          watchOverflow: true,
          pagination: {
            el: pagination,
            clickable: true,
            dynamicBullets: true,
          },
          navigation: {
            nextEl: nextBtn,
            prevEl: prevBtn,
          },
        });
      });
    };

    const updateVisibleSwiper = () => {
      if (!sectionRef.current) return;

      requestAnimationFrame(() => {
        const activePane = sectionRef.current.querySelector('.tab-pane.active');
        const activeSlider = activePane?.querySelector('.products-slider');
        const activeSliderId = activeSlider?.getAttribute('data-slider');

        if (activeSliderId && swipersRef.current[activeSliderId]) {
          swipersRef.current[activeSliderId].update();
        }
      });
    };

    const tabButtons = sectionRef.current.querySelectorAll('[data-bs-toggle="tab"]');

    tabButtons.forEach((button) => {
      button.addEventListener('shown.bs.tab', updateVisibleSwiper);
    });

    raf1Ref.current = requestAnimationFrame(() => {
      raf2Ref.current = requestAnimationFrame(initSliders);
    });

    return () => {
      cancelled = true;

      if (retryTimerRef.current) window.clearTimeout(retryTimerRef.current);
      if (raf1Ref.current) cancelAnimationFrame(raf1Ref.current);
      if (raf2Ref.current) cancelAnimationFrame(raf2Ref.current);

      tabButtons.forEach((button) => {
        button.removeEventListener('shown.bs.tab', updateVisibleSwiper);
      });

      destroySwipers();
    };
  }, [tabs, tabProducts]);

  if (tabs.length === 0 || Object.keys(tabProducts).length === 0) {
    return null;
  }

  return (
    <section ref={sectionRef} className={sectionClass}>
      <div className="container">
        <div className="row">
          <div className="col-12">
            <h2>{title}</h2>

            <ul className="nav products-tabs__nav" id={`${sectionClass}-tabs`} role="tablist">
              {tabs.map((tab, index) => (
                <li key={tab.id} className="nav-item" role="presentation">
                  <button
                    className={`nav-link products-tabs__link ${index === 0 ? 'active' : ''}`}
                    id={`${sectionClass}-${tab.id}-tab`}
                    data-bs-toggle="tab"
                    data-bs-target={`#${sectionClass}-${tab.id}`}
                    type="button"
                    role="tab"
                  >
                    {tab.label}
                  </button>
                </li>
              ))}
            </ul>

            <div className="tab-content products-tabs__content" id={`${sectionClass}-content`}>
              {tabs.map((tab, index) => {
                const products = tabProducts[tab.id] || [];

                return (
                  <div
                    key={tab.id}
                    className={`tab-pane fade ${index === 0 ? 'show active' : ''}`}
                    id={`${sectionClass}-${tab.id}`}
                    role="tabpanel"
                  >
                    {products.length === 0 ? (
                      <div style={{ textAlign: 'center', padding: '40px 0', color: '#999' }}>
                        <p>Нет товаров в этой категории</p>
                      </div>
                    ) : (
                      <div className="products-card-slider">
                        <div
                          className="products-slider swiper"
                          data-slider={`${sectionClass}-${tab.id}`}
                        >
                          <div className="swiper-wrapper">
                            {products.map((product, productIndex) => (
                              <div key={product.id} className="swiper-slide">
                                <ProductCard
                                  priority={index === 0 && productIndex < 5}
                                  product={{
                                    id: product.id,
                                    attributes: {
                                      sku: product.sku,
                                      small_desc_name: product.title,
                                      name_ru: product.description,
                                      price_byn: product.price,
                                      local_images: (product.images || [])
                                        .map(toLocalImagePath)
                                        .filter(Boolean),
                                      variants: product.variants || null,
                                      is_bestseller: product.badges?.includes('hit'),
                                      is_new: product.badges?.includes('new'),
                                    },
                                  }}
                                />
                              </div>
                            ))}
                          </div>

                          {products.length > 1 && (
                            <div className="products-slider__pagination" />
                          )}

                          {products.length > 1 && (
                            <>
                              <button
                                className="products-slider__nav products-slider__nav-prev"
                                type="button"
                                aria-label="Предыдущий слайд"
                              >
                                <svg width="7" height="12" viewBox="0 0 7 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M6 1L1 6L6 11" stroke="#181818" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                              </button>

                              <button
                                className="products-slider__nav products-slider__nav-next"
                                type="button"
                                aria-label="Следующий слайд"
                              >
                                <svg width="7" height="12" viewBox="0 0 7 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M1 11L6 6L1 1" stroke="#181818" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
