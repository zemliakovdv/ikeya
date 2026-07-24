'use client';

import { useRef, useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import ProductCard from '@/components/catalog/products/ProductCard';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

/**
 * ItemsTab — «Товары в комплекте»
 * Данные: attr.included_products[] (массив SKU) → page.js фетчит полные объекты
 * и передаёт сюда готовый массив product-объектов.
 *
 * Используется внутри ProductTabs в табе «Предметы».
 * Использует тот же ProductCard что и остальные слайдеры — единообразие карточек.
 */
export default function ItemsTab({ includedProducts = [] }) {
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const paginationRef = useRef(null);
  const [swiperReady, setSwiperReady] = useState(false);

  useEffect(() => {
    setSwiperReady(true);
  }, []);

  if (!includedProducts.length) {
    return <p className="text-muted">Нет товаров в комплекте.</p>;
  }

  return (
    <div className="tab-predmety__content">
      <div className="products-card-slider">
        <Swiper
          modules={[Navigation, Pagination]}
          spaceBetween={20}
          slidesPerView={5}
          loop={includedProducts.length > 5}
          navigation={
            swiperReady
              ? { prevEl: prevRef.current, nextEl: nextRef.current }
              : false
          }
          pagination={
            swiperReady
              ? { el: paginationRef.current, clickable: true }
              : false
          }
          onBeforeInit={(swiper) => {
            if (!prevRef.current || !nextRef.current || !paginationRef.current) return;
            swiper.params.navigation.prevEl = prevRef.current;
            swiper.params.navigation.nextEl = nextRef.current;
            swiper.params.pagination.el = paginationRef.current;
          }}
          onSwiper={(swiper) => {
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
          breakpoints={{
            320: { slidesPerView: 2, spaceBetween: 10 },
            576: { slidesPerView: 2, spaceBetween: 15 },
            768: { slidesPerView: 3, spaceBetween: 15 },
            992: { slidesPerView: 4, spaceBetween: 20 },
            1200: { slidesPerView: 5, spaceBetween: 20 },
          }}
          roundLengths
          className="products-slider swiper"
        >
          {includedProducts.map((product) => (
            <SwiperSlide key={product.id}>
              <ProductCard product={product} />
            </SwiperSlide>
          ))}
        </Swiper>

        <div className="products-slider__pagination" ref={paginationRef} />
        <button
          className="products-slider__nav products-slider__nav-prev"
          ref={prevRef}
          type="button"
          aria-label="Предыдущий"
        >
          <svg width="7" height="12" viewBox="0 0 7 12" fill="none">
            <path d="M6 1L1 6L6 11" stroke="#181818" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <button
          className="products-slider__nav products-slider__nav-next"
          ref={nextRef}
          type="button"
          aria-label="Следующий"
        >
          <svg width="7" height="12" viewBox="0 0 7 12" fill="none">
            <path d="M1 11L6 6L1 1" stroke="#181818" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </div>
  );
}