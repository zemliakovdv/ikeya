'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import ProductCard from '@/components/catalog/products/ProductCard';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export default function RelatedProducts({ products }) {
  // Если нет товаров, не показываем секцию
  if (!products || products.length === 0) {
    return null;
  }

  return (
    <section className="more">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="more-inner">
              <h2>К этому товару подходят</h2>
              
              <div className="products-card-slider">
                <Swiper
                  modules={[Navigation, Pagination]}
                  spaceBetween={20}
                  slidesPerView={5}
                  navigation={{
                    prevEl: '.products-slider__nav-prev',
                    nextEl: '.products-slider__nav-next',
                  }}
                  pagination={{
                    el: '.products-slider__pagination',
                    clickable: true,
                  }}
                  breakpoints={{
                    320: { slidesPerView: 1, spaceBetween: 10 },
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

                {/* Пагинация */}
                <div className="products-slider__pagination"></div>

                {/* Навигация */}
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
