'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import ProductCard from '@/components/catalog/products/ProductCard';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export default function RecommendationsSection({ products = [] }) {
  // Группируем товары по 5 в каждый слайд
  const groupedProducts = [];
  for (let i = 0; i < products.length; i += 5) {
    groupedProducts.push(products.slice(i, i + 5));
  }

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
                    navigation={{
                      prevEl: '.products-slider__nav-prev',
                      nextEl: '.products-slider__nav-next',
                    }}
                    pagination={{
                      el: '.products-slider__pagination',
                      clickable: true,
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
                    <div className="products-slider__nav products-slider__nav-prev">
                      <svg width="6.67" height="12" viewBox="0 0 7 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6 1L1 6L6 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <div className="products-slider__nav products-slider__nav-next">
                      <svg width="6.67" height="12" viewBox="0 0 7 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 11L6 6L1 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>

                    {/* Пагинация */}
                    <div className="products-slider__pagination"></div>
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
