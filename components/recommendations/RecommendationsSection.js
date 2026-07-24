// components/recommendations/RecommendationsSection.js
'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import ProductCard from '@/components/catalog/products/ProductCard';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export default function RecommendationsSection({ products = [] }) {
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const paginationRef = useRef(null);
  const [desktopMode, setDesktopMode] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 1200px)');
    const handleChange = (event) => {
      setDesktopMode(event.matches);
    };

    setDesktopMode(mediaQuery.matches);
    mediaQuery.addEventListener('change', handleChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  const groupedProducts = useMemo(() => {
    if (!desktopMode) {
      return [];
    }

    const grouped = [];
    for (let i = 0; i < products.length; i += 5) {
      grouped.push(products.slice(i, i + 5));
    }
    return grouped;
  }, [desktopMode, products]);

  const mobileBreakpoints = {
    0: {
      slidesPerView: 2,
      spaceBetween: 8,
    },
    360: {
      slidesPerView: 2,
      spaceBetween: 8,
    },
    576: {
      slidesPerView: 3,
      spaceBetween: 8,
    },
    768: {
      slidesPerView: 3,
      spaceBetween: 12,
    },
    992: {
      slidesPerView: 4,
      spaceBetween: 12,
    },
  };

  return (
    <section className="reki">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="reki-inner">
              <h2>Мы рекомендуем</h2>
              <div className="reki-content">
                <div className="products-card-slider">
                  <Swiper
                    key={desktopMode ? 'desktop-grouped' : 'mobile-single'}
                    modules={[Navigation, Pagination]}
                    spaceBetween={desktopMode ? 0 : 8}
                    slidesPerView={desktopMode ? 1 : 2}
                    breakpoints={desktopMode ? undefined : mobileBreakpoints}
                    roundLengths
                    loop={desktopMode ? groupedProducts.length > 1 : products.length > 1}
                    onBeforeInit={(swiper) => {
                      swiper.params.navigation.prevEl = prevRef.current;
                      swiper.params.navigation.nextEl = nextRef.current;
                      swiper.params.pagination.el = paginationRef.current;
                    }}
                    onSwiper={(swiper) => {
                      swiper.navigation.init();
                      swiper.navigation.update();
                      swiper.pagination.init();
                      swiper.pagination.update();
                    }}
                    className="products-slider"
                  >
                    {desktopMode
                      ? groupedProducts.map((group, groupIndex) => (
                        <SwiperSlide key={`group-${groupIndex}`}>
                          <div className="row g-4 swiper-slide-inner">
                            {group.map((product) => (
                              <ProductCard
                                key={product.id}
                                product={product}
                              />
                            ))}
                          </div>
                        </SwiperSlide>
                      ))
                      : products.map((product) => (
                        <SwiperSlide key={product.id}>
                          <ProductCard product={product} />
                        </SwiperSlide>
                      ))}

                    <div
                      className="products-slider__nav products-slider__nav-prev"
                      ref={prevRef}
                    >
                      <svg width="6.67" height="12" viewBox="0 0 7 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6 1L1 6L6 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>

                    <div
                      className="products-slider__nav products-slider__nav-next"
                      ref={nextRef}
                    >
                      <svg width="6.67" height="12" viewBox="0 0 7 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 11L6 6L1 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>

                    <div
                      className="products-slider__pagination"
                      ref={paginationRef}
                    ></div>
                  </Swiper>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
