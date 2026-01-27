'use client'

import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Swiper from 'swiper'
import { Navigation, Pagination, Thumbs } from 'swiper/modules'

export default function NewProductsTabs() {
  const [activeTab, setActiveTab] = useState('beds')
  const [mounted, setMounted] = useState(false)
  const swiperInstances = useRef({})
  const galleryMainInstances = useRef({})
  const galleryThumbsInstances = useRef({})

  // Ждем монтирования компонента
  useEffect(() => {
    queueMicrotask(() => setMounted(true));
  }, [])

  const tabs = [
    { id: 'beds', label: 'Освещение' },
    { id: 'sofas', label: 'Диваны и кресла' },
    { id: 'lighting', label: 'Освещение' },
    { id: 'wardrobes', label: 'Шкафы' },
    { id: 'dressers', label: 'Комоды и тумбочки' },
    { id: 'storage', label: 'Системы хранения' },
    { id: 'garden', label: 'Сад и балкон' }
  ]

  const tabProducts = {
    beds: [
      {
        id: 'beds-1',
        title: 'STOCKHOLM 2025',
        description: 'Стул, дуб/ротанг',
        price: '135.00',
        images: [
          '/assets/img/main-page/news/new-1.png',
          '/assets/img/main-page/news/new-2.png',
          '/assets/img/main-page/news/new-3.png',
          '/assets/img/main-page/news/new-4.png',
          '/assets/img/main-page/news/new-5.png'
        ],
        badges: ['hit', 'promo', 'new']
      },
      {
        id: 'beds-2',
        title: 'SONHULT',
        description: 'Stoliki, 2 szt., szary/orzech',
        price: '135.00',
        images: [
          '/assets/img/main-page/news/new-2.png',
          '/assets/img/main-page/news/new-3.png',
          '/assets/img/main-page/news/new-4.png'
        ],
        badges: ['hit', 'promo', 'new']
      },
      {
        id: 'beds-3',
        title: 'STOCKHOLM 2025',
        description: 'Стул, дуб/кожа',
        price: '135.00',
        images: ['/assets/img/main-page/news/new-3.png'],
        badges: ['hit', 'promo', 'new']
      },
      {
        id: 'beds-4',
        title: 'STOCKHOLM 2025',
        description: 'Журнальный столик, дубовый шпон, стекло',
        price: '135.00',
        images: ['/assets/img/main-page/news/new-4.png'],
        badges: ['hit', 'promo', 'new']
      },
      {
        id: 'beds-5',
        title: 'ARKELSTORP',
        description: 'Журнальный столик, черный, 65x140x52 см',
        price: '135.00',
        images: ['/assets/img/main-page/news/new-5.png'],
        badges: ['hit', 'promo', 'new']
      }
    ],
    sofas: [
      {
        id: 'sofas-1',
        title: 'STOCKHOLM 2025',
        description: 'Стул, дуб/ротанг',
        price: '135.00',
        images: ['/assets/img/main-page/news/new-1.png'],
        badges: ['hit', 'promo', 'new']
      }
    ]
  }

  useEffect(() => {
    if (!mounted) return

    const initializeSliders = () => {
      const currentProducts = tabProducts[activeTab] || []
      
      // Уничтожаем старые галереи
      Object.values(galleryMainInstances.current).forEach(swiper => {
        if (swiper) swiper.destroy(true, true)
      })
      Object.values(galleryThumbsInstances.current).forEach(swiper => {
        if (swiper) swiper.destroy(true, true)
      })
      galleryMainInstances.current = {}
      galleryThumbsInstances.current = {}

      // Инициализируем галереи для каждого товара
      currentProducts.forEach((product) => {
        const thumbsSelector = `[data-gallery-thumbs="${product.id}"]`
        const mainSelector = `[data-gallery="${product.id}"]`

        const thumbsEl = document.querySelector(thumbsSelector)
        const mainEl = document.querySelector(mainSelector)

        if (thumbsEl && mainEl && product.images.length > 1) {
          try {
            const thumbsSwiper = new Swiper(thumbsSelector, {
              modules: [Thumbs],
              spaceBetween: 8,
              slidesPerView: 'auto',
              watchSlidesProgress: true,
              freeMode: true
            })

            const mainSwiper = new Swiper(mainSelector, {
              modules: [Navigation, Thumbs],
              spaceBetween: 0,
              navigation: {
                nextEl: `${mainSelector} .swiper-button-next`,
                prevEl: `${mainSelector} .swiper-button-prev`
              },
              thumbs: {
                swiper: thumbsSwiper
              }
            })

            galleryThumbsInstances.current[product.id] = thumbsSwiper
            galleryMainInstances.current[product.id] = mainSwiper
          } catch (error) {
            console.error('Ошибка инициализации галереи:', error)
          }
        }
      })

      // Уничтожаем старый основной слайдер
      if (swiperInstances.current[activeTab]) {
        swiperInstances.current[activeTab].destroy(true, true)
      }

      // Инициализируем основной слайдер товаров
      setTimeout(() => {
        const swiperEl = document.querySelector(`.products-slider[data-slider="${activeTab}"]`)
        if (swiperEl) {
          try {
            const swiper = new Swiper(swiperEl, {
              modules: [Navigation, Pagination],
              slidesPerView: 1,
              spaceBetween: 24,
              navigation: {
                nextEl: '.products-slider__nav-next',
                prevEl: '.products-slider__nav-prev'
              },
              pagination: {
                el: '.products-slider__pagination',
                clickable: true
              }
            })
            swiperInstances.current[activeTab] = swiper
          } catch (error) {
            console.error('Ошибка инициализации основного слайдера:', error)
          }
        }
      }, 100)
    }

    initializeSliders()

    return () => {
      Object.values(swiperInstances.current).forEach(swiper => {
        if (swiper) swiper.destroy(true, true)
      })
      Object.values(galleryMainInstances.current).forEach(swiper => {
        if (swiper) swiper.destroy(true, true)
      })
      Object.values(galleryThumbsInstances.current).forEach(swiper => {
        if (swiper) swiper.destroy(true, true)
      })
    }
  }, [activeTab, mounted])

  const renderBadges = (badges) => {
    return (
      <>
        {badges.includes('hit') && <span className="sales-hit">Хит продаж</span>}
        {badges.includes('promo') && <span className="sales-hit pink">-10% промокод IKEYA</span>}
        {badges.includes('new') && <span className="sales-hit green">Новинка</span>}
      </>
    )
  }

  const renderProductCard = (product) => {
    const visibleThumbs = product.images.slice(0, 3)
    const remainingCount = product.images.length - 3

    return (
      <div key={product.id} className="col product-card-inner">
        <div className="product-card">
          <div className="product-card__gallery">
            <Link href="/shop-card">
              <div
                style={{ '--swiper-navigation-color': '#fff', '--swiper-pagination-color': '#fff' }}
                className="swiper product-gallery-main"
                data-gallery={product.id}
              >
                <div className="swiper-wrapper">
                  {product.images.map((img, idx) => (
                    <div key={idx} className="swiper-slide">
                      <Image src={img} alt="Товар" width={300} height={300} />
                    </div>
                  ))}
                </div>
                {product.images.length > 1 && (
                  <>
                    <div className="swiper-button-next"></div>
                    <div className="swiper-button-prev"></div>
                  </>
                )}
              </div>

              {product.images.length > 1 && (
                <div
                  className="swiper product-gallery-thumbs"
                  data-gallery-thumbs={product.id}
                >
                  <div className="swiper-wrapper">
                    {visibleThumbs.map((img, idx) => (
                      <div key={idx} className="swiper-slide">
                        <Image src={img} alt="Миниатюра" width={60} height={60} />
                      </div>
                    ))}
                    {remainingCount > 0 && (
                      <div className="swiper-slide product-gallery-thumbs__more">
                        <span className="product-gallery-thumbs__count">+{remainingCount}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </Link>
          </div>

          <div className="product-card__info">
            <h3 className="product-card__title">{product.title}</h3>
            <p className="product-card__description">{product.description}</p>
            <p className="product-card__price">
              {product.price.split('.')[0]}
              <span>.{product.price.split('.')[1]} р.</span>
            </p>
            <button className="shop_button add-to-cart">
              <Image src="/assets/img/icons/shopping-cart.svg" alt="В корзину" width={20} height={20} />
              <p>В корзину</p>
            </button>
          </div>

          {renderBadges(product.badges)}

          <button className="like">
            <Image src="/assets/img/icons/header-favorite.svg" alt="Добавить в избранное" width={24} height={24} />
          </button>
        </div>
      </div>
    )
  }

  if (!mounted) return null

  const currentProducts = tabProducts[activeTab] || []

  return (
    <section className="products-tabs new-tabs">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <h2>Новинки</h2>

            <ul className="nav products-tabs__nav" role="tablist">
              {tabs.map(tab => (
                <li key={tab.id} className="nav-item" role="presentation">
                  <button
                    className={`nav-link products-tabs__link ${activeTab === tab.id ? 'active' : ''}`}
                    onClick={() => setActiveTab(tab.id)}
                    type="button"
                    role="tab"
                  >
                    {tab.label}
                  </button>
                </li>
              ))}
            </ul>

            <div className="tab-content products-tabs__content">
              <div className="tab-pane fade show active" role="tabpanel">
                <div className="products-card-slider">
                  <div className="products-slider swiper" data-slider={activeTab}>
                    <div className="swiper-wrapper">
                      <div className="swiper-slide">
                        <div className="row g-4 swiper-slide-inner">
                          {currentProducts.map(product => renderProductCard(product))}
                        </div>
                      </div>
                    </div>

                    <div className="products-slider__nav products-slider__nav-prev">
                      <svg width="6.67" height="12" viewBox="0 0 7 12" fill="none">
                        <path d="M6 1L1 6L6 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <div className="products-slider__nav products-slider__nav-next">
                      <svg width="6.67" height="12" viewBox="0 0 7 12" fill="none">
                        <path d="M1 11L6 6L1 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>

                    <div className="products-slider__pagination"></div>
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
