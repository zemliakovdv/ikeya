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
  const [swiperReady, setSwiperReady] = useState(false);

  // Группируем товары по 5 в каждый слайд
  const groupedProducts = useMemo(() => {
    const grouped = [];
    for (let i = 0; i < products.length; i += 5) {
      grouped.push(products.slice(i, i + 5));
    }
    return grouped;
  }, [products]);

  // Даём рефам проставиться до инициализации Swiper
  useEffect(() => {
    setSwiperReady(true);
  }, []);

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
                    // 👇 не используем глобальные селекторы — всё через refs
                    navigation={swiperReady ? { prevEl: prevRef.current, nextEl: nextRef.current } : false}
                    pagination={swiperReady ? { el: paginationRef.current, clickable: true } : false}
                    onBeforeInit={(swiper) => {
                      // Swiper/react требует проставить элементы вручную до init
                      if (!prevRef.current || !nextRef.current || !paginationRef.current) return;

                      swiper.params.navigation.prevEl = prevRef.current;
                      swiper.params.navigation.nextEl = nextRef.current;
                      swiper.params.pagination.el = paginationRef.current;
                    }}
                    onSwiper={(swiper) => {
                      // На всякий случай — если refs подтянулись чуть позже
                      if (!prevRef.current || !nextRef.current || !paginationRef.current) return;

                      swiper.params.navigation.prevEl = prevRef.current;
                      swiper.params.navigation.nextEl = nextRef.current;
                      swiper.params.pagination.el = paginationRef.current;

                      swiper.navigation?.destroy?.();
                      swiper.navigation?.init?.();
                      swiper.navigation?.update?.();

                      swiper.pagination?.destroy?.();
                      swiper.pagination?.init?.();
                      swiper.pagination?.render?.();
                      swiper.pagination?.update?.();
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