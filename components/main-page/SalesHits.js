'use client';

import { useEffect } from 'react';

export default function SalesHits() {
  useEffect(() => {
    // ✅ Задержка для гарантии загрузки Swiper
    const timer = setTimeout(() => {
      if (typeof window !== 'undefined' && window.Swiper) {
        
        // ✅ Инициализация главного слайдера карточек (только для saleshits-tabs)
        const productSliders = document.querySelectorAll('.saleshits-tabs .products-slider');
        
        productSliders.forEach((slider) => {
          // Проверка, не инициализирован ли уже
          if (slider.swiper) {
            slider.swiper.destroy(true, true);
          }

          new window.Swiper(slider, {
            slidesPerView: 1,
            spaceBetween: 20,
            speed: 500,
            navigation: {
              nextEl: slider.querySelector('.products-slider__nav-next'),
              prevEl: slider.querySelector('.products-slider__nav-prev'),
            },
            pagination: {
              el: slider.querySelector('.products-slider__pagination'),
              clickable: true,
            },
            breakpoints: {
              768: { slidesPerView: 1 },
            },
          });
        });

        // ✅ Инициализация галерей товаров (только для saleshits-tabs)
        const galleries = document.querySelectorAll('.saleshits-tabs .product-gallery-main');
        
        galleries.forEach((mainGallery) => {
          const galleryId = mainGallery.getAttribute('data-gallery');
          const thumbsGallery = document.querySelector(`[data-gallery-thumbs="${galleryId}"]`);

          // Уничтожаем старые экземпляры
          if (mainGallery.swiper) {
            mainGallery.swiper.destroy(true, true);
          }
          if (thumbsGallery && thumbsGallery.swiper) {
            thumbsGallery.swiper.destroy(true, true);
          }

          let thumbsSwiper = null;
          if (thumbsGallery) {
            thumbsSwiper = new window.Swiper(thumbsGallery, {
              spaceBetween: 10,
              slidesPerView: 4,
              freeMode: true,
              watchSlidesProgress: true,
            });
          }

          new window.Swiper(mainGallery, {
            spaceBetween: 10,
            navigation: {
              nextEl: mainGallery.querySelector('.swiper-button-next'),
              prevEl: mainGallery.querySelector('.swiper-button-prev'),
            },
            thumbs: { swiper: thumbsSwiper },
          });
        });
      }
    }, 100); // ✅ Задержка 100ms

    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="products-tabs saleshits-tabs">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <h2>Хиты продаж</h2>

            {/* Табы навигации */}
            <ul className="nav products-tabs__nav" id="salesHitsTabs" role="tablist">
              <li className="nav-item" role="presentation">
                <button 
                  className="nav-link products-tabs__link active" 
                  id="beds-tab" 
                  data-bs-toggle="tab"
                  data-bs-target="#beds" 
                  type="button" 
                  role="tab"
                >
                  Кровати и матрасы
                </button>
              </li>
              <li className="nav-item" role="presentation">
                <button 
                  className="nav-link products-tabs__link" 
                  id="sofas-tab" 
                  data-bs-toggle="tab"
                  data-bs-target="#sofas" 
                  type="button" 
                  role="tab"
                >
                  Диваны и кресла
                </button>
              </li>
              <li className="nav-item" role="presentation">
                <button 
                  className="nav-link products-tabs__link" 
                  id="lighting-tab" 
                  data-bs-toggle="tab"
                  data-bs-target="#lighting" 
                  type="button" 
                  role="tab"
                >
                  Освещение
                </button>
              </li>
              <li className="nav-item" role="presentation">
                <button 
                  className="nav-link products-tabs__link" 
                  id="wardrobes-tab" 
                  data-bs-toggle="tab"
                  data-bs-target="#wardrobes" 
                  type="button" 
                  role="tab"
                >
                  Шкафы
                </button>
              </li>
              <li className="nav-item" role="presentation">
                <button 
                  className="nav-link products-tabs__link" 
                  id="dressers-tab" 
                  data-bs-toggle="tab"
                  data-bs-target="#dressers" 
                  type="button" 
                  role="tab"
                >
                  Комоды и тумбочки
                </button>
              </li>
              <li className="nav-item" role="presentation">
                <button 
                  className="nav-link products-tabs__link" 
                  id="storage-tab" 
                  data-bs-toggle="tab"
                  data-bs-target="#storage" 
                  type="button" 
                  role="tab"
                >
                  Системы хранения
                </button>
              </li>
              <li className="nav-item" role="presentation">
                <button 
                  className="nav-link products-tabs__link" 
                  id="garden-tab" 
                  data-bs-toggle="tab"
                  data-bs-target="#garden" 
                  type="button" 
                  role="tab"
                >
                  Сад и балкон
                </button>
              </li>
            </ul>

            {/* Контент табов */}
            <div className="tab-content products-tabs__content" id="salesHitsTabsContent">
              
              {/* Таб 1: Кровати и матрасы */}
              <div className="tab-pane fade show active" id="beds" role="tabpanel">
                <div className="products-card-slider">
                  <div className="products-slider swiper" data-slider="saleshits">
                    <div className="swiper-wrapper">
                      
                      {/* Слайд 1 */}
                      <div className="swiper-slide">
                        <div className="row g-4 swiper-slide-inner">
                          
                          {/* Карточка 1 */}
                          <div className="col product-card-inner">
                            <div className="product-card">
                              <div className="product-card__gallery">
                                <div style={{ '--swiper-navigation-color': '#fff', '--swiper-pagination-color': '#fff' }}
                                  className="swiper product-gallery-main" data-gallery="saleshits-1">
                                  <div className="swiper-wrapper">
                                    <div className="swiper-slide">
                                      <img src="assets/img/main-page/sales-hist/hits-1.png" alt="Товар" />
                                    </div>
                                    <div className="swiper-slide">
                                      <img src="assets/img/main-page/sales-hist/hits-2.png" alt="Товар" />
                                    </div>
                                    <div className="swiper-slide">
                                      <img src="assets/img/main-page/sales-hist/hits-3.png" alt="Товар" />
                                    </div>
                                    <div className="swiper-slide">
                                      <img src="assets/img/main-page/sales-hist/hits-4.png" alt="Товар" />
                                    </div>
                                    <div className="swiper-slide">
                                      <img src="assets/img/main-page/sales-hist/hits-5.png" alt="Товар" />
                                    </div>
                                  </div>
                                  <div className="swiper-button-next"></div>
                                  <div className="swiper-button-prev"></div>
                                </div>

                                <div data-thumbs-slider="" className="swiper product-gallery-thumbs" data-gallery-thumbs="saleshits-1">
                                  <div className="swiper-wrapper">
                                    <div className="swiper-slide">
                                      <img src="assets/img/main-page/sales-hist/hits-1.png" alt="Миниатюра" />
                                    </div>
                                    <div className="swiper-slide">
                                      <img src="assets/img/main-page/sales-hist/hits-1.png" alt="Миниатюра" />
                                    </div>
                                    <div className="swiper-slide">
                                      <img src="assets/img/main-page/sales-hist/hits-3.png" alt="Миниатюра" />
                                    </div>
                                    <div className="swiper-slide product-gallery-thumbs__more">
                                      <span className="product-gallery-thumbs__count">+2</span>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <div className="product-card__info">
                                <h3 className="product-card__title">SLATTUM</h3>
                                <p className="product-card__description">Каркас кровати с обивкой, Vissle темно-серый, 140x200 см</p>
                                <p className="product-card__price">135<span>.00 р.</span></p>
                                <button className="shop_button">
                                  <img src="assets/img/icons/shopping-cart.svg" alt="В корзину" />
                                  <p>В корзину</p>
                                </button>
                              </div>

                              <span className="sales-hit">Хит продаж</span>
                              <span className="sales-hit pink">-10% промокод IKEYA</span>
                              <button className="like">
                                <img src="assets/img/icons/header-favorite.svg" alt="Добавить в избранное" />
                              </button>
                            </div>
                          </div>

                          {/* Карточка 2 */}
                          <div className="col product-card-inner">
                            <div className="product-card">
                              <div className="product-card__gallery">
                                <div style={{ '--swiper-navigation-color': '#fff', '--swiper-pagination-color': '#fff' }}
                                  className="swiper product-gallery-main" data-gallery="saleshits-2">
                                  <div className="swiper-wrapper">
                                    <div className="swiper-slide">
                                      <img src="assets/img/main-page/sales-hist/hits-2.png" alt="Товар" />
                                    </div>
                                    <div className="swiper-slide">
                                      <img src="assets/img/main-page/sales-hist/hits-3.png" alt="Товар" />
                                    </div>
                                    <div className="swiper-slide">
                                      <img src="assets/img/main-page/sales-hist/hits-4.png" alt="Товар" />
                                    </div>
                                  </div>
                                  <div className="swiper-button-next"></div>
                                  <div className="swiper-button-prev"></div>
                                </div>

                                <div data-thumbs-slider="" className="swiper product-gallery-thumbs" data-gallery-thumbs="saleshits-2">
                                  <div className="swiper-wrapper">
                                    <div className="swiper-slide">
                                      <img src="assets/img/main-page/sales-hist/hits-2.png" alt="Миниатюра" />
                                    </div>
                                    <div className="swiper-slide">
                                      <img src="assets/img/main-page/sales-hist/hits-3.png" alt="Миниатюра" />
                                    </div>
                                    <div className="swiper-slide">
                                      <img src="assets/img/main-page/sales-hist/hits-4.png" alt="Миниатюра" />
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <div className="product-card__info">
                                <h3 className="product-card__title">SLATTUM</h3>
                                <p className="product-card__description">Каркас кровати с обивкой, Vissle темно-серый, 140x200 см</p>
                                <p className="product-card__price">135<span>.00 р.</span></p>
                                <button className="shop_button">
                                  <img src="assets/img/icons/shopping-cart.svg" alt="В корзину" />
                                  <p>В корзину</p>
                                </button>
                              </div>

                              <span className="sales-hit">Хит продаж</span>
                              <span className="sales-hit pink">-10% промокод IKEYA</span>
                              <button className="like">
                                <img src="assets/img/icons/header-favorite.svg" alt="Добавить в избранное" />
                              </button>
                            </div>
                          </div>

                          {/* Карточка 3 */}
                          <div className="col product-card-inner">
                            <div className="product-card">
                              <div className="product-card__gallery">
                                <div style={{ '--swiper-navigation-color': '#fff', '--swiper-pagination-color': '#fff' }}
                                  className="swiper product-gallery-main" data-gallery="saleshits-3">
                                  <div className="swiper-wrapper">
                                    <div className="swiper-slide">
                                      <img src="assets/img/main-page/sales-hist/hits-3.png" alt="Товар" />
                                    </div>
                                  </div>
                                </div>
                                <div data-thumbs-slider="" className="swiper product-gallery-thumbs" data-gallery-thumbs="saleshits-3">
                                  <div className="swiper-wrapper">
                                    <div className="swiper-slide">
                                      <img src="assets/img/main-page/sales-hist/hits-3.png" alt="Миниатюра" />
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="product-card__info">
                                <h3 className="product-card__title">SLATTUM</h3>
                                <p className="product-card__description">Каркас кровати с обивкой, Vissle темно-серый, 140x200 см</p>
                                <p className="product-card__price">135<span>.00 р.</span></p>
                                <button className="shop_button">
                                  <img src="assets/img/icons/shopping-cart.svg" alt="В корзину" />
                                  <p>В корзину</p>
                                </button>
                              </div>
                              <span className="sales-hit">Хит продаж</span>
                              <span className="sales-hit pink">-10% промокод IKEYA</span>
                              <button className="like">
                                <img src="assets/img/icons/header-favorite.svg" alt="Добавить в избранное" />
                              </button>
                            </div>
                          </div>

                          {/* Карточка 4 */}
                          <div className="col product-card-inner">
                            <div className="product-card">
                              <div className="product-card__gallery">
                                <div className="swiper product-gallery-main" data-gallery="saleshits-4">
                                  <div className="swiper-wrapper">
                                    <div className="swiper-slide">
                                      <img src="assets/img/main-page/sales-hist/hits-4.png" alt="Товар" />
                                    </div>
                                  </div>
                                </div>
                                <div className="swiper product-gallery-thumbs" data-gallery-thumbs="saleshits-4">
                                  <div className="swiper-wrapper">
                                    <div className="swiper-slide">
                                      <img src="assets/img/main-page/sales-hist/hits-4.png" alt="Миниатюра" />
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="product-card__info">
                                <h3 className="product-card__title">SLATTUM</h3>
                                <p className="product-card__description">Каркас кровати с обивкой, Vissle темно-серый, 140x200 см</p>
                                <p className="product-card__price">135<span>.00 р.</span></p>
                                <button className="shop_button">
                                  <img src="assets/img/icons/shopping-cart.svg" alt="В корзину" />
                                  <p>В корзину</p>
                                </button>
                              </div>
                              <span className="sales-hit">Хит продаж</span>
                              <span className="sales-hit pink">-10% промокод IKEYA</span>
                              <button className="like">
                                <img src="assets/img/icons/header-favorite.svg" alt="Добавить в избранное" />
                              </button>
                            </div>
                          </div>

                          {/* Карточка 5 */}
                          <div className="col product-card-inner">
                            <div className="product-card">
                              <div className="product-card__gallery">
                                <div className="swiper product-gallery-main" data-gallery="saleshits-5">
                                  <div className="swiper-wrapper">
                                    <div className="swiper-slide">
                                      <img src="assets/img/main-page/sales-hist/hits-5.png" alt="Товар" />
                                    </div>
                                  </div>
                                </div>
                                <div className="swiper product-gallery-thumbs" data-gallery-thumbs="saleshits-5">
                                  <div className="swiper-wrapper">
                                    <div className="swiper-slide">
                                      <img src="assets/img/main-page/sales-hist/hits-5.png" alt="Миниатюра" />
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="product-card__info">
                                <h3 className="product-card__title">SLATTUM</h3>
                                <p className="product-card__description">Каркас кровати с обивкой, Vissle темно-серый, 140x200 см</p>
                                <p className="product-card__price">135<span>.00 р.</span></p>
                                <button className="shop_button">
                                  <img src="assets/img/icons/shopping-cart.svg" alt="В корзину" />
                                  <p>В корзину</p>
                                </button>
                              </div>
                              <span className="sales-hit">Хит продаж</span>
                              <span className="sales-hit pink">-10% промокод IKEYA</span>
                              <button className="like">
                                <img src="assets/img/icons/header-favorite.svg" alt="Добавить в избранное" />
                              </button>
                            </div>
                          </div>

                        </div>
                      </div>

                      {/* Слайд 2 */}
                      <div className="swiper-slide">
                        <div className="row g-4 swiper-slide-inner">
                          <div className="col product-card-inner">
                            <div className="product-card">
                              <div className="product-card__gallery">
                                <div className="swiper product-gallery-main" data-gallery="saleshits-6">
                                  <div className="swiper-wrapper">
                                    <div className="swiper-slide">
                                      <img src="assets/img/main-page/sales-hist/hits-1.png" alt="Товар" />
                                    </div>
                                  </div>
                                </div>
                                <div className="swiper product-gallery-thumbs" data-gallery-thumbs="saleshits-6">
                                  <div className="swiper-wrapper">
                                    <div className="swiper-slide">
                                      <img src="assets/img/main-page/sales-hist/hits-1.png" alt="Миниатюра" />
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="product-card__info">
                                <h3 className="product-card__title">SLATTUM</h3>
                                <p className="product-card__description">Каркас кровати</p>
                                <p className="product-card__price">135<span>.00 р.</span></p>
                                <button className="shop_button">
                                  <img src="assets/img/icons/shopping-cart.svg" alt="В корзину" />
                                  <p>В корзину</p>
                                </button>
                              </div>
                              <span className="sales-hit">Хит продаж</span>
                              <span className="sales-hit pink">-10% промокод IKEYA</span>
                              <button className="like">
                                <img src="assets/img/icons/header-favorite.svg" alt="Добавить в избранное" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                    </div>

                    {/* Навигация */}
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

              {/* Остальные табы */}
              <div className="tab-pane fade" id="sofas" role="tabpanel">
                <p>Диваны и кресла - содержимое</p>
              </div>
              <div className="tab-pane fade" id="lighting" role="tabpanel">
                <p>Освещение - содержимое</p>
              </div>
              <div className="tab-pane fade" id="wardrobes" role="tabpanel">
                <p>Шкафы - содержимое</p>
              </div>
              <div className="tab-pane fade" id="dressers" role="tabpanel">
                <p>Комоды - содержимое</p>
              </div>
              <div className="tab-pane fade" id="storage" role="tabpanel">
                <p>Системы хранения - содержимое</p>
              </div>
              <div className="tab-pane fade" id="garden" role="tabpanel">
                <p>Сад и балкон - содержимое</p>
              </div>
              
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
