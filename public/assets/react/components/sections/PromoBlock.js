"use client"

import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation, Pagination } from "swiper/modules"
import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/pagination"

export function PromoBlock({
  leftBannerHref,
  leftBannerSrc,
  leftBannerAlt,
  products,
}) {
  return (
    <section className="promo-block">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="promo-block-inner">
              <div className="promo-block-info">
                <a href={leftBannerHref}>
                  <img src={leftBannerSrc} alt={leftBannerAlt} />
                </a>
              </div>

              <div className="promo-block-card">
                <div className="promo-cards-slider">
                  <div className="promo-card-inner">
                    <Swiper
                      modules={[Navigation, Pagination]}
                      slidesPerView={1}
                      loop
                      navigation={{
                        prevEl: ".promo-cards-slider__nav-prev",
                        nextEl: ".promo-cards-slider__nav-next",
                      }}
                      pagination={{
                        el: ".promo-cards-slider__pagination",
                        clickable: true,
                      }}
                      className="promo-cards-slider__swiper swiper"
                    >
                      {products.map((product) => (
                        <SwiperSlide key={product.id}>
                          <div className="promo-card-item">
                            <div className="product-card">
                              <div className="promo-card__gallery">
                                <img
                                  src={product.imageSrc}
                                  alt={product.imageAlt}
                                />
                              </div>

                              <div className="promo-card__info">
                                <h3 className="product-card__title">
                                  {product.title}
                                </h3>
                                <p className="product-card__description">
                                  {product.description}
                                </p>
                                <p className="product-card__price">
                                  {product.price}
                                  <span>.00 {product.currencySuffix}</span>
                                </p>
                                <button className="shop_button" type="button">
                                  <img
                                    src="/assets/img/icons/shopping-cart.svg"
                                    alt="В корзину"
                                  />
                                  <p>В корзину</p>
                                </button>
                              </div>

                              {product.isHit && (
                                <span className="sales-hit">Хит продаж</span>
                              )}
                              {product.promoLabel && (
                                <span className="sales-hit pink">
                                  {product.promoLabel}
                                </span>
                              )}

                              <button className="like" type="button">
                                <img
                                  src="/assets/img/icons/header-favorite.svg"
                                  alt="Добавить в избранное"
                                />
                              </button>
                            </div>
                          </div>
                        </SwiperSlide>
                      ))}
                    </Swiper>

                    <button
                      className="promo-cards-slider__nav promo-cards-slider__nav-prev"
                      type="button"
                      aria-label="Предыдущий слайд"
                    >
                      <svg width="7" height="12" viewBox="0 0 7 12" fill="none">
                        <path
                          d="M6 1L1 6L6 11"
                          stroke="#181818"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                    <button
                      className="promo-cards-slider__nav promo-cards-slider__nav-next"
                      type="button"
                      aria-label="Следующий слайд"
                    >
                      <svg width="7" height="12" viewBox="0 0 7 12" fill="none">
                        <path
                          d="M1 11L6 6L1 1"
                          stroke="#181818"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>

                    <div className="promo-cards-slider__pagination" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
