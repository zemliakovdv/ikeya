// components/home/PromoBlock.js
'use client'

import { useEffect, useCallback, useRef } from 'react'
import Link from 'next/link'
import { useCart } from '@/contexts/CartContext'
import CartCounter from '@/components/cart/CartCounter'

export default function PromoBlock({ bannerImage, bannerUrl, categoryName, products = [] }) {
  const { addToCart, items } = useCart()

  const rootRef = useRef(null)
  const swiperRef = useRef(null)
  const raf1Ref = useRef(0)
  const raf2Ref = useRef(0)
  const retryTimerRef = useRef(0)

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!products.length) return

    if (raf1Ref.current) cancelAnimationFrame(raf1Ref.current)
    if (raf2Ref.current) cancelAnimationFrame(raf2Ref.current)
    if (retryTimerRef.current) clearTimeout(retryTimerRef.current)

    const init = () => {
      if (!window.Swiper) {
        retryTimerRef.current = window.setTimeout(init, 100)
        return
      }

      const root = rootRef.current
      if (!root) return

      const sliderEl = root.querySelector('.promo-card-inner')
      if (!sliderEl) return

      const paginationEl = root.querySelector('.promo-cards-slider__pagination')
      const nextEl = root.querySelector('.promo-cards-slider__nav-next')
      const prevEl = root.querySelector('.promo-cards-slider__nav-prev')

      if (swiperRef.current) {
        swiperRef.current.destroy(true, true)
        swiperRef.current = null
      }

      try {
        swiperRef.current = new window.Swiper(sliderEl, {
          slidesPerView: 1,
          spaceBetween: 0,
          loop: products.length > 1,
          pagination: products.length > 1
            ? {
                el: paginationEl,
                clickable: true,
              }
            : false,
          navigation: products.length > 1
            ? {
                nextEl,
                prevEl,
              }
            : false,
        })
      } catch (e) {
        console.error('Ошибка инициализации PromoBlock Swiper:', e)
      }
    }

    raf1Ref.current = requestAnimationFrame(() => {
      raf2Ref.current = requestAnimationFrame(init)
    })

    return () => {
      if (raf1Ref.current) cancelAnimationFrame(raf1Ref.current)
      if (raf2Ref.current) cancelAnimationFrame(raf2Ref.current)
      if (retryTimerRef.current) clearTimeout(retryTimerRef.current)

      if (swiperRef.current) {
        swiperRef.current.destroy(true, true)
        swiperRef.current = null
      }
    }
  }, [products])

  const getQtyBySku = useCallback((sku) => {
    if (!sku) return 0

    const found = (items || []).find((it) => it?.sku === sku)
    return Number(found?.quantity || 0)
  }, [items])

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

  if (!products.length) return null

  const hasMultipleProducts = products.length > 1

  return (
    <section className="promo-block" ref={rootRef}>
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="promo-block-inner">

              <div className="promo-block-info">
                <Link href={bannerUrl || '#'}>
                  {bannerImage ? (
                    <img src={bannerImage} alt={categoryName || 'Промо-баннер'} loading="lazy" fetchPriority="low" />
                  ) : (
                    <img src="/assets/img/main-page/promo-block/left-banner.png" alt="Промо-баннер" loading="lazy" fetchPriority="low" />
                  )}
                </Link>
              </div>

              <div className="promo-block-card">
                <div className="promo-cards-slider">
                  <div className="promo-card-inner swiper">
                    <div className="swiper-wrapper">
                      {products.map((product) => {
                        const sku = product?.sku || product?.id
                        const hasSku = !!sku
                        const quantity = getQtyBySku(sku)
                        const images = Array.isArray(product.images) ? product.images : []
                        const badges = Array.isArray(product.badges) ? product.badges : []
                        const productUrl = product.url || '#'
                        const productTitle = product.title || 'Товар'

                        return (
                          <div key={product.id} className="swiper-slide">
                            <div className="promo-card-item">
                              <div className="product-card">

                                <Link href={productUrl} className="promo-card__gallery">
                                  {images.length > 0 ? (
                                    <img
                                      src={images[0]}
                                      alt={productTitle}
                                      loading="lazy"
                                      onError={(e) => {
                                        e.currentTarget.src = '/assets/img/main-page/promo-block/promo-card-1.png'
                                      }}
                                    />
                                  ) : (
                                    <img
                                      src="/assets/img/main-page/promo-block/promo-card-1.png"
                                      alt={productTitle}
                                      loading="lazy"
                                    />
                                  )}
                                </Link>

                                <div className="promo-card__info">
                                  <Link href={productUrl}>
                                    <h3 className="product-card__title">{productTitle}</h3>
                                  </Link>

                                  {product.description && (
                                    <p className="product-card__description">{product.description}</p>
                                  )}

                                  <p className="product-card__price">
                                    {product.price || '0.00'}<span> р.</span>
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
                                      <img src="/assets/img/icons/shopping-cart.svg" alt="" width="20" height="20" />
                                      <p>В корзину</p>
                                    </button>
                                  )}
                                </div>

                                {badges.includes('hit') && (
                                  <span className="sales-hit">Хит продаж</span>
                                )}

                                {badges.includes('promo') && (
                                  <span className="sales-hit pink">Популярное</span>
                                )}

                                <button className="like" type="button" aria-label="Добавить в избранное">
                                  <img src="/assets/img/icons/header-favorite.svg" alt="" />
                                </button>

                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  {hasMultipleProducts && (
                    <>
                      <button
                        className="promo-cards-slider__nav promo-cards-slider__nav-prev"
                        type="button"
                        aria-label="Предыдущий товар"
                      >
                        <svg width="7" height="12" viewBox="0 0 7 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M6 1L1 6L6 11" stroke="#181818" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </button>

                      <button
                        className="promo-cards-slider__nav promo-cards-slider__nav-next"
                        type="button"
                        aria-label="Следующий товар"
                      >
                        <svg width="7" height="12" viewBox="0 0 7 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M1 11L6 6L1 1" stroke="#181818" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </button>

                      <div className="promo-cards-slider__pagination"></div>
                    </>
                  )}
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
