'use client';

import { useEffect, useRef } from 'react';
import ProductCard from '../catalog/ProductCard';

export default function ProductSlider({ 
  title = "Товары", 
  products, 
  className = "more"
}) {
  const swiperRef = useRef(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.Swiper) {
      const swiper = new window.Swiper(swiperRef.current, {
        slidesPerView: 1,
        spaceBetween: 20,
        navigation: {
          nextEl: `.${className} .products-slider__nav-next`,
          prevEl: `.${className} .products-slider__nav-prev`,
        },
        pagination: {
          el: `.${className} .products-slider__pagination`,
          clickable: true,
        },
      });

      return () => {
        if (swiper) swiper.destroy();
      };
    }
  }, [className]);

  // Группируем товары по 5
  const slides = [];
  for (let i = 0; i < products.length; i += 5) {
    slides.push(products.slice(i, i + 5));
  }

  return (
    <section className={className}>
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className={`${className}-inner`}>
              <h2>{title}</h2>
              <div className="products-card-slider">
                <div ref={swiperRef} className="products-slider swiper" data-slider={className}>
                  <div className="swiper-wrapper">
                    {slides.map((slideProducts, slideIndex) => (
                      <div key={slideIndex} className="swiper-slide">
                        <div className="row g-4 swiper-slide-inner">
                          {slideProducts.map((product) => (
                            <div key={product.id} className="col product-card-inner">
                              <ProductCard {...product} />
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="products-slider__pagination"></div>
                <button className="products-slider__nav products-slider__nav-prev">
                  <svg width="7" height="12" viewBox="0 0 7 12" fill="none">
                    <path d="M6 1L1 6L6 11" stroke="#181818" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                <button className="products-slider__nav products-slider__nav-next">
                  <svg width="7" height="12" viewBox="0 0 7 12" fill="none">
                    <path d="M1 11L6 6L1 1" stroke="#181818" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
