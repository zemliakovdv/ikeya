// components/home/ProductTabsSection.js
'use client';

import { useEffect, useRef } from 'react';
import ProductCard from '@/components/catalog/products/ProductCard';

export default function ProductTabsSection({
  title = 'Товары',
  tabs = [],
  tabProducts = {},
  sectionClass = 'products-tabs',
  showNewBadge = false
}) {
  const swipersRef = useRef({});

  useEffect(() => {
    if (typeof window === 'undefined' || !window.Swiper) {
      return;
    }

    const timer = setTimeout(() => {
      Object.values(swipersRef.current).forEach(swiper => {
        if (swiper) swiper.destroy(true, true);
      });
      swipersRef.current = {};

      document.querySelectorAll('.products-slider').forEach((slider) => {
        const sliderId = slider.getAttribute('data-slider');

        swipersRef.current[sliderId] = new window.Swiper(slider, {
          slidesPerView: 1,
          spaceBetween: 0,
          loop: false,
          speed: 600,
          pagination: {
            el: slider.querySelector('.products-slider__pagination'),
            clickable: true,
          },
          navigation: {
            nextEl: slider.querySelector('.products-slider__nav-next'),
            prevEl: slider.querySelector('.products-slider__nav-prev'),
          },
        });
      });

      document.querySelectorAll('.product-gallery-main').forEach((gallery) => {
        const galleryId = gallery.getAttribute('data-gallery');
        const thumbs = document.querySelector(`[data-gallery-thumbs="${galleryId}"]`);

        let thumbsSwiper = null;
        if (thumbs) {
          thumbsSwiper = new window.Swiper(thumbs, {
            spaceBetween: 8,
            slidesPerView: 3,
            freeMode: true,
            watchSlidesProgress: true,
          });
        }

        new window.Swiper(gallery, {
          spaceBetween: 10,
          navigation: {
            nextEl: gallery.querySelector('.swiper-button-next'),
            prevEl: gallery.querySelector('.swiper-button-prev'),
          },
          thumbs: thumbsSwiper ? {
            swiper: thumbsSwiper,
          } : undefined,
        });
      });
    }, 100);

    return () => {
      clearTimeout(timer);
      Object.values(swipersRef.current).forEach(swiper => {
        if (swiper) swiper.destroy(true, true);
      });
    };
  }, [tabs, tabProducts]);

  if (tabs.length === 0 || Object.keys(tabProducts).length === 0) {
    return null;
  }

  const chunkProducts = (products, size = 5) => {
    const chunks = [];
    for (let i = 0; i < products.length; i += size) {
      chunks.push(products.slice(i, i + size));
    }
    return chunks;
  };

  return (
    <section className={sectionClass}>
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
                const slides = chunkProducts(products, 5);

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
                            {slides.map((slideProducts, slideIndex) => (
                              <div key={slideIndex} className="swiper-slide">
                                <div className="row g-4 swiper-slide-inner">
                                  {slideProducts.map((product) => (
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

                                  {slideProducts.length < 5 && Array.from({ length: 5 - slideProducts.length }).map((_, i) => (
                                    <div key={`empty-${i}`} className="col-lg-3 col-md-4 col-sm-6" style={{ visibility: 'hidden' }} />
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>

                          {slides.length > 1 && (
                            <div className="products-slider__pagination"></div>
                          )}

                          {slides.length > 1 && (
                            <>
                              <button className="products-slider__nav products-slider__nav-prev">
                                <svg width="7" height="12" viewBox="0 0 7 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M6 1L1 6L6 11" stroke="#181818" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                              </button>
                              <button className="products-slider__nav products-slider__nav-next">
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