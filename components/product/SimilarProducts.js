'use client';

import { useRef, useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import ProductCard from '@/components/catalog/products/ProductCard';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

/**
 * SimilarProducts — «Похожие товары»
 * Данные: 10 товаров из той же категории (attr.category_id).
 * page.js фетчит их через /categories/{category_id}/products?per_page=10
 * и передаёт сюда уже готовый массив.
 */
export default function SimilarProducts({ products }) {
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const paginationRef = useRef(null);
  const [swiperReady, setSwiperReady] = useState(false);

  useEffect(() => {
    setSwiperReady(true);
  }, []);

  if (!products?.length) return null;

  return (
    <section className="more">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="more-inner">
              <h2>Похожие товары</h2>
              <div className="products-card-slider">
                <Swiper
                  modules={[Navigation, Pagination]}
                  spaceBetween={20}
                  slidesPerView={5}
                  loop={products.length > 5}
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
                  className="products-slider swiper"
                >
                  {products.map((product) => (
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
          </div>
        </div>
      </div>
    </section>
  );
}