// components/home/PromoBlock.js
'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'

export default function PromoBlock({ bannerImage, bannerUrl, categoryName, products = [] }) {
  useEffect(() => {
    if (typeof window !== 'undefined' && window.Swiper) {
      new window.Swiper('.promo-card-inner', {
        slidesPerView: 1,
        spaceBetween: 0,
        loop: products.length > 1,
        pagination: {
          el: '.promo-cards-slider__pagination',
          clickable: true,
        },
        navigation: {
          nextEl: '.promo-cards-slider__nav-next',
          prevEl: '.promo-cards-slider__nav-prev',
        },
      });
    }
  }, [products]);

  if (!products.length) return null;

  return (
    <section className="promo-block">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="promo-block-inner">

              {/* Левый баннер */}
              <div className="promo-block-info">
                <Link href={bannerUrl || '#'}>
                  {bannerImage ? (
                    <img src={bannerImage} alt={categoryName || 'Промо-баннер'} />
                  ) : (
                    <img src="/assets/img/main-page/promo-block/left-banner.png" alt="Промо-баннер" />
                  )}
                </Link>
              </div>

              {/* Слайдер товаров */}
              <div className="promo-block-card">
                <div className="promo-cards-slider">
                  <div className="promo-card-inner swiper">
                    <div className="swiper-wrapper">
                      {products.map((product) => (
                        <div key={product.id} className="swiper-slide">
                          <div className="promo-card-item">
                            <div className="product-card">

                              {/* Изображение */}
                              <Link href={product.url} className="promo-card__gallery">
                                {product.images.length > 0 ? (
                                  <img
                                    src={product.images[0]}
                                    alt={product.title}
                                    onError={(e) => {
                                      e.target.src = '/assets/img/main-page/promo-block/promo-card-1.png';
                                    }}
                                  />
                                ) : (
                                  <img src="/assets/img/main-page/promo-block/promo-card-1.png" alt={product.title} />
                                )}
                              </Link>

                              {/* Информация */}
                              <div className="promo-card__info">
                                <Link href={product.url}>
                                  <h3 className="product-card__title">{product.title}</h3>
                                </Link>
                                {product.description && (
                                  <p className="product-card__description">{product.description}</p>
                                )}
                                <p className="product-card__price">
                                  {product.price}<span> р.</span>
                                </p>
                                <button className="shop_button add-to-cart">
                                  <img src="/assets/img/icons/shopping-cart.svg" alt="В корзину" />
                                  <p>В корзину</p>
                                </button>
                              </div>

                              {/* Бейджи */}
                              {product.badges.includes('hit') && (
                                <span className="sales-hit">Хит продаж</span>
                              )}
                              {product.badges.includes('promo') && (
                                <span className="sales-hit pink">Популярное</span>
                              )}

                              <button className="like">
                                <img src="/assets/img/icons/header-favorite.svg" alt="Добавить в избранное" />
                              </button>

                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Навигация */}
                  <button className="promo-cards-slider__nav promo-cards-slider__nav-prev">
                    <svg width="7" height="12" viewBox="0 0 7 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M6 1L1 6L6 11" stroke="#181818" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                  <button className="promo-cards-slider__nav promo-cards-slider__nav-next">
                    <svg width="7" height="12" viewBox="0 0 7 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1 11L6 6L1 1" stroke="#181818" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>

                  {/* Пагинация */}
                  <div className="promo-cards-slider__pagination"></div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
