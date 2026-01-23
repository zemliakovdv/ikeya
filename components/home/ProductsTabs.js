'use client'

import { useEffect } from 'react'
import ProductCard from '@components/ui/ProductCard'

export default function ProductsTabs() {
  useEffect(() => {
    // Инициализация слайдеров после загрузки
    if (typeof window !== 'undefined' && window.Swiper) {
      // Инициализация основных слайдеров товаров
      document.querySelectorAll('.products-slider').forEach((slider) => {
        new window.Swiper(slider, {
          slidesPerView: 1,
          spaceBetween: 0,
          loop: true,
          pagination: {
            el: slider.querySelector('.products-slider__pagination'),
            clickable: true,
          },
          navigation: {
            nextEl: slider.querySelector('.products-slider__nav-next'),
            prevEl: slider.querySelector('.products-slider__nav-prev'),
          },
        })
      })

      // Инициализация галерей товаров
      document.querySelectorAll('.product-gallery-main').forEach((gallery) => {
        const galleryId = gallery.getAttribute('data-gallery')
        const thumbs = document.querySelector(`[data-gallery-thumbs="${galleryId}"]`)
        
        let thumbsSwiper = null
        if (thumbs) {
          thumbsSwiper = new window.Swiper(thumbs, {
            spaceBetween: 10,
            slidesPerView: 4,
            freeMode: true,
            watchSlidesProgress: true,
          })
        }

        new window.Swiper(gallery, {
          spaceBetween: 10,
          navigation: {
            nextEl: gallery.querySelector('.swiper-button-next'),
            prevEl: gallery.querySelector('.swiper-button-prev'),
          },
          thumbs: thumbsSwiper ? {
            swiper: thumbsSwiper,
          } : undefined,
        })
      })
    }
  }, [])

  return (
    <section className="products-tabs">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <h2>Хиты продаж</h2>
            {/* Табы навигации */}
            <ul className="nav products-tabs__nav" id="productsTabs" role="tablist">
              <li className="nav-item" role="presentation">
                <button className="nav-link products-tabs__link active" id="beds-tab" data-bs-toggle="tab"
                  data-bs-target="#beds" type="button" role="tab">
                  Кровати и матрасы
                </button>
              </li>
              <li className="nav-item" role="presentation">
                <button className="nav-link products-tabs__link" id="sofas-tab" data-bs-toggle="tab"
                  data-bs-target="#sofas" type="button" role="tab">
                  Диваны и кресла
                </button>
              </li>
              <li className="nav-item" role="presentation">
                <button className="nav-link products-tabs__link" id="lighting-tab" data-bs-toggle="tab"
                  data-bs-target="#lighting" type="button" role="tab">
                  Освещение
                </button>
              </li>
              <li className="nav-item" role="presentation">
                <button className="nav-link products-tabs__link" id="wardrobes-tab" data-bs-toggle="tab"
                  data-bs-target="#wardrobes" type="button" role="tab">
                  Шкафы
                </button>
              </li>
              <li className="nav-item" role="presentation">
                <button className="nav-link products-tabs__link" id="dressers-tab" data-bs-toggle="tab"
                  data-bs-target="#dressers" type="button" role="tab">
                  Комоды и тумбочки
                </button>
              </li>
              <li className="nav-item" role="presentation">
                <button className="nav-link products-tabs__link" id="storage-tab" data-bs-toggle="tab"
                  data-bs-target="#storage" type="button" role="tab">
                  Системы хранения
                </button>
              </li>
              <li className="nav-item" role="presentation">
                <button className="nav-link products-tabs__link" id="garden-tab" data-bs-toggle="tab"
                  data-bs-target="#garden" type="button" role="tab">
                  Сад и балкон
                </button>
              </li>
            </ul>

            {/* Контент табов */}
            <div className="tab-content products-tabs__content" id="productsTabsContent">
              {/* Таб 1: Кровати и матрасы */}
              <div className="tab-pane fade show active" id="beds" role="tabpanel">
                <div className="products-card-slider">
                  <div className="products-slider swiper" data-slider="beds">
                    <div className="swiper-wrapper">
                      {/* Слайд с 5 карточками */}
                      <div className="swiper-slide">
                        <div className="row g-4 swiper-slide-inner">
                          <ProductCard gallery="beds-1" title="SLATTUM" description="Каркас кровати с обивкой, Vissle темно-серый, 140x200 см" price="135" salesHit={true} promo={true} />
                          <ProductCard gallery="beds-2" title="SLATTUM" description="Каркас кровати с обивкой, Vissle темно-серый, 140x200 см" price="135" salesHit={true} promo={true} />
                          <ProductCard gallery="beds-3" title="SLATTUM" description="Каркас кровати с обивкой, Vissle темно-серый, 140x200 см" price="135" salesHit={true} promo={true} />
                          <ProductCard gallery="beds-4" title="SLATTUM" description="Каркас кровати с обивкой, Vissle темно-серый, 140x200 см" price="135" salesHit={true} promo={true} />
                          <ProductCard gallery="beds-5" title="SLATTUM" description="Каркас кровати с обивкой, Vissle темно-серый, 140x200 см" price="135" salesHit={true} promo={true} />
                        </div>
                      </div>
                      {/* Дополнительный слайд */}
                      <div className="swiper-slide">
                        <div className="row g-4 swiper-slide-inner">
                          <ProductCard gallery="beds-1" title="SLATTUM" description="Каркас кровати с обивкой, Vissle темно-серый, 140x200 см" price="135" salesHit={true} promo={true} />
                          <ProductCard gallery="beds-2" title="SLATTUM" description="Каркас кровати с обивкой, Vissle темно-серый, 140x200 см" price="135" salesHit={true} promo={true} />
                          <ProductCard gallery="beds-3" title="SLATTUM" description="Каркас кровати с обивкой, Vissle темно-серый, 140x200 см" price="135" salesHit={true} promo={true} />
                          <ProductCard gallery="beds-4" title="SLATTUM" description="Каркас кровати с обивкой, Vissle темно-серый, 140x200 см" price="135" salesHit={true} promo={true} />
                          <ProductCard gallery="beds-5" title="SLATTUM" description="Каркас кровати с обивкой, Vissle темно-серый, 140x200 см" price="135" salesHit={true} promo={true} />
                        </div>
                      </div>
                    </div>
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

              {/* Остальные табы (Диваны, Освещение и т.д.) - структура идентична */}
              {/* Добавьте остальные 6 табов по аналогии с первым */}
              
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
