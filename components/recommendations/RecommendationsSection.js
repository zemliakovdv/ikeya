// components/recommendations/RecommendationsSection.js
'use client';

import { useMemo, useRef } from 'react';
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

  // Группируем товары по 5 в каждый слайд
  const groupedProducts = useMemo(() => {
    const grouped = [];
    for (let i = 0; i < products.length; i += 5) {
      grouped.push(products.slice(i, i + 5));
    }
    return grouped;
  }, [products]);

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
                    modules={[Navigation, Pagination]}
                    spaceBetween={0}
                    slidesPerView={1}
                    loop={groupedProducts.length > 1}
                    navigation={{ prevEl: prevRef.current, nextEl: nextRef.current }}
                    pagination={{ el: paginationRef.current, clickable: true }}
                    onBeforeInit={(swiper) => {
                      swiper.params.navigation.prevEl = prevRef.current;
                      swiper.params.navigation.nextEl = nextRef.current;
                      swiper.params.pagination.el = paginationRef.current;
                    }}
                    className="products-slider"
                  >
                    {groupedProducts.map((group, groupIndex) => (
                      <SwiperSlide key={groupIndex}>
                        <div className="row g-4 swiper-slide-inner">
                          {group.map((product) => (
                            <ProductCard
                              key={product.id}
                              product={product}
                            />
                          ))}
                        </div>
                      </SwiperSlide>
                    ))}

                    {/* Навигация */}
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

                    {/* Пагинация */}
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