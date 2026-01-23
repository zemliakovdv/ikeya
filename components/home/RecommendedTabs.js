'use client'

import { useEffect } from 'react'
import ProductCard from '@components/ui/ProductCard'

export default function RecommendedTabs() {
  useEffect(() => {
    // Инициализация слайдеров (аналогично ProductsTabs)
    if (typeof window !== 'undefined' && window.Swiper) {
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
    <section className="products-tabs recomended-tabs">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <h2>Мы рекомендуем</h2>
            {/* Табы навигации */}
            <ul className="nav products-tabs__nav" id="productsTabs" role="tablist">
              <li className="nav-item" role="presentation">
                <button className="nav-link products-tabs__link active" id="svet-tab" data-bs-toggle="tab"
                  data-bs-target="#svet" type="button" role="tab">
                  Освещение
                </button>
              </li>
              <li className="nav-item" role="presentation">
                <button className="nav-link products-tabs__link" id="divans-tab" data-bs-toggle="tab"
                  data-bs-target="#divans" type="button" role="tab">
                  Диваны и кресла
                </button>
              </li>
              <li className="nav-item" role="presentation">
                <button className="nav-link products-tabs__link" id="lightings-tab" data-bs-toggle="tab"
                  data-bs-target="#lightings" type="button" role="tab">
                  Освещение
                </button>
              </li>
              <li className="nav-item" role="presentation">
                <button className="nav-link products-tabs__link" id="shkafi-tab" data-bs-toggle="tab"
                  data-bs-target="#shkafi" type="button" role="tab">
                  Шкафы
                </button>
              </li>
              <li className="nav-item" role="presentation">
                <button className="nav-link products-tabs__link" id="komodi-tab" data-bs-toggle="tab"
                  data-bs-target="#komodi" type="button" role="tab">
                  Комоды и тумбочки
                </button>
              </li>
              <li className="nav-item" role="presentation">
                <button className="nav-link products-tabs__link" id="hranenie-tab" data-bs-toggle="tab"
                  data-bs-target="#hranenie" type="button" role="tab">
                  Системы хранения
                </button>
              </li>
              <li className="nav-item" role="presentation">
                <button className="nav-link products-tabs__link" id="balkon-tab" data-bs-toggle="tab"
                  data-bs-target="#balkon" type="button" role="tab">
                  Сад и балкон
                </button>
              </li>
            </ul>

            {/* Контент табов */}
            <div className="tab-content products-tabs__content" id="productsTabsContent">
              {/* Таб 1: Освещение */}
              <div className="tab-pane fade show active" id="svet" role="tabpanel">
                <div className="products-card-slider">
                  <div className="products-slider swiper" data-slider="beds">
                    <div className="swiper-wrapper">
                      {/* Слайд с 5 карточками */}
                      <div className="swiper-slide">
                        <div className="row g-4 swiper-slide-inner">
                          <ProductCard gallery="rec-1" title="NÖSUND" description="Потолочный светильник, береза, 44 см" price="135" salesHit={true} promo={true} />
                          <ProductCard gallery="rec-2" title="MUDDERVERK" description="Lampa wisząca, mosiądz/opalowa biel szkło" price="135" salesHit={true} promo={true} />
                          <ProductCard gallery="rec-3" title="NYMÅNE" description="Настольная лампа, антрацит, 33 см" price="135" salesHit={true} promo={true} />
                          <ProductCard gallery="rec-4" title="RÖDFLIK" description="Настольная лампа, светло-бежевая" price="135" salesHit={true} promo={true} />
                          <ProductCard gallery="rec-5" title="SLATTUM" description="Каркас кровати с обивкой, Vissle темно-серый, 140x200 см" price="135" salesHit={true} promo={true} />
                        </div>
                      </div>
                      {/* Дополнительный слайд */}
                      <div className="swiper-slide">
                        <div className="row g-4 swiper-slide-inner">
                          <ProductCard gallery="rec-1" title="SLATTUM" description="Каркас кровати с обивкой, Vissle темно-серый, 140x200 см" price="135" salesHit={true} promo={true} />
                          <ProductCard gallery="rec-2" title="SLATTUM" description="Каркас кровати с обивкой, Vissle темно-серый, 140x200 см" price="135" salesHit={true} promo={true} />
                          <ProductCard gallery="rec-3" title="SLATTUM" description="Каркас кровати с обивкой, Vissle темно-серый, 140x200 см" price="135" salesHit={true} promo={true} />
                          <ProductCard gallery="rec-4" title="SLATTUM" description="Каркас кровати с обивкой, Vissle темно-серый, 140x200 см" price="135" salesHit={true} promo={true} />
                          <ProductCard gallery="rec-5" title="SLATTUM" description="Каркас кровати с обивкой, Vissle темно-серый, 140x200 см" price="135" salesHit={true} promo={true} />
                        </div>
                      </div>
                    </div>
                    {/* Пагинация */}
                    <div className="products-slider__pagination"></div>
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
                  </div>
                </div>
              </div>

              {/* Остальные 6 табов добавьте по аналогии */}
              
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
