// components/home/PromoBlock.js
'use client'

import { useEffect, useCallback, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useCart } from '@/contexts/CartContext'
import CartCounter from '@/components/cart/CartCounter'

export default function PromoBlock({ bannerImage, bannerUrl, categoryName, products = [] }) {
  const { addToCart, items } = useCart()

  const rootRef = useRef(null)
  const swiperRef = useRef(null)
  const raf1Ref = useRef(0)
  const raf2Ref = useRef(0)

  useEffect(() => {
    if (typeof window === 'undefined' || !window.Swiper) return
    if (!products.length) return

    if (raf1Ref.current) cancelAnimationFrame(raf1Ref.current)
    if (raf2Ref.current) cancelAnimationFrame(raf2Ref.current)

    const init = () => {
      const root = rootRef.current
      if (!root) return

      const sliderEl = root.querySelector('.promo-card-inner')
      if (!sliderEl) return

      const paginationEl = root.querySelector('.promo-cards-slider__pagination')
      const nextEl = root.querySelector('.promo-cards-slider__nav-next')
      const prevEl = root.querySelector('.promo-cards-slider__nav-prev')

      // ✅ убираем старый инстанс, если был
      if (swiperRef.current) {
        swiperRef.current.destroy(true, true)
        swiperRef.current = null
      }

      try {
        swiperRef.current = new window.Swiper(sliderEl, {
          slidesPerView: 1,
          spaceBetween: 0,
          loop: products.length > 1,
          pagination: {
            el: paginationEl,
            clickable: true,
          },
          navigation: {
            nextEl,
            prevEl,
          },
        })
      } catch (e) {
        console.error('Ошибка инициализации PromoBlock Swiper:', e)
      }
    }

    // ✅ rAF x2 чтобы DOM точно был готов после рендера карточек
    raf1Ref.current = requestAnimationFrame(() => {
      raf2Ref.current = requestAnimationFrame(init)
    })

    return () => {
      if (raf1Ref.current) cancelAnimationFrame(raf1Ref.current)
      if (raf2Ref.current) cancelAnimationFrame(raf2Ref.current)

      if (swiperRef.current) {
        swiperRef.current.destroy(true, true)
        swiperRef.current = null
      }
    }
  }, [products])

  const getQtyBySku = useCallback((sku) => {
    if (!sku) return 0;
    const found = (items || []).find((it) => it?.sku === sku);
    return Number(found?.quantity || 0);
  }, [items]);

  const handleAddToCart = async (e, product) => {
    e.preventDefault()
    e.stopPropagation()

    const sku = product?.sku || product?.id
    if (!sku) return

    try {
      await addToCart(sku, 1)
    } catch (error) {
      console.error('Ошибка добавления в корзину:', error)
      alert('Не удалось добавить товар в корзину')
    }
  }

  if (!products.length) return null;

  return (
    <section className="promo-block" ref={rootRef}>
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
                      {products.map((product) => {
                        const sku = product?.sku || product?.id
                        const hasSku = !!sku
                        const quantity = getQtyBySku(sku)

                        return (
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

                                  {quantity > 0 ? (
                                    <div style={{ marginBottom: 0 }}>
                                      <CartCounter sku={sku} className="added-fullwidth" />
                                    </div>
                                  ) : (
                                    <button
                                      className="shop_button add-to-cart"
                                      onClick={(e) => handleAddToCart(e, product)}
                                      type="button"
                                      disabled={!hasSku}
                                      aria-disabled={!hasSku}
                                    >
                                      <img src="/assets/img/icons/shopping-cart.svg" alt="В корзину" />
                                      <p>В корзину</p>
                                    </button>
                                  )}
                                </div>

                                {/* Бейджи */}
                                {product.badges.includes('hit') && (
                                  <span className="sales-hit">Хит продаж</span>
                                )}
                                {product.badges.includes('promo') && (
                                  <span className="sales-hit pink">Популярное</span>
                                )}

                                <button className="like" type="button">
                                  <img src="/assets/img/icons/header-favorite.svg" alt="Добавить в избранное" />
                                </button>

                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  {/* Навигация */}
                  <button className="promo-cards-slider__nav promo-cards-slider__nav-prev" type="button">
                    <svg width="7" height="12" viewBox="0 0 7 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M6 1L1 6L6 11" stroke="#181818" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                  <button className="promo-cards-slider__nav promo-cards-slider__nav-next" type="button">
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