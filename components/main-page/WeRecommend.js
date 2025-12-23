'use client';

import { useEffect } from 'react';

export default function WeRecommend() {
  useEffect(() => {
    if (typeof window !== 'undefined' && window.Swiper) {
      // Инициализация слайдеров карточек для каждой вкладки
      const productSliders = document.querySelectorAll('.recomended-tabs .products-slider');
      productSliders.forEach((slider) => {
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

      // Инициализация галерей товаров
      const galleries = document.querySelectorAll('.recomended-tabs .product-gallery-main');
      galleries.forEach((mainGallery) => {
        const galleryId = mainGallery.getAttribute('data-gallery');
        const thumbsGallery = document.querySelector(`[data-gallery-thumbs="${galleryId}"]`);

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
  }, []);

  return (
    <section className="products-tabs recomended-tabs">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <h2>Мы рекомендуем</h2>

            {/* Табы навигации */}
            <ul className="nav products-tabs__nav" id="recommendTabs" role="tablist">
              <li className="nav-item" role="presentation">
                <button className="nav-link products-tabs__link active" id="svet-tab" data-bs-toggle="tab"
                  data-bs-target="#svet" type="button" role="tab">Освещение</button>
              </li>
              <li className="nav-item" role="presentation">
                <button className="nav-link products-tabs__link" id="divans-tab" data-bs-toggle="tab"
                  data-bs-target="#divans" type="button" role="tab">Диваны и кресла</button>
              </li>
              <li className="nav-item" role="presentation">
                <button className="nav-link products-tabs__link" id="lightings-tab" data-bs-toggle="tab"
                  data-bs-target="#lightings" type="button" role="tab">Освещение</button>
              </li>
              <li className="nav-item" role="presentation">
                <button className="nav-link products-tabs__link" id="shkafi-tab" data-bs-toggle="tab"
                  data-bs-target="#shkafi" type="button" role="tab">Шкафы</button>
              </li>
              <li className="nav-item" role="presentation">
                <button className="nav-link products-tabs__link" id="komodi-tab" data-bs-toggle="tab"
                  data-bs-target="#komodi" type="button" role="tab">Комоды и тумбочки</button>
              </li>
              <li className="nav-item" role="presentation">
                <button className="nav-link products-tabs__link" id="hranenie-tab" data-bs-toggle="tab"
                  data-bs-target="#hranenie" type="button" role="tab">Системы хранения</button>
              </li>
              <li className="nav-item" role="presentation">
                <button className="nav-link products-tabs__link" id="balkon-tab" data-bs-toggle="tab"
                  data-bs-target="#balkon" type="button" role="tab">Сад и балкон</button>
              </li>
            </ul>

            {/* Контент табов */}
            <div className="tab-content products-tabs__content" id="recommendTabsContent">
              
              {/* Таб 1: Освещение */}
              <div className="tab-pane fade show active" id="svet" role="tabpanel">
                <div className="products-card-slider">
                  <div className="products-slider swiper" data-slider="recommend">
                    <div className="swiper-wrapper">
                      
                      {/* Слайд 1 */}
                      <div className="swiper-slide">
                        <div className="row g-4 swiper-slide-inner">
                          
                          {/* Карточка 1 */}
                          <div className="col product-card-inner">
                            <div className="product-card">
                              <div className="product-card__gallery">
                                <div style={{ '--swiper-navigation-color': '#fff', '--swiper-pagination-color': '#fff' }}
                                  className="swiper product-gallery-main" data-gallery="recommend-1">
                                  <div className="swiper-wrapper">
                                    <div className="swiper-slide">
                                      <img src="assets/img/main-page/we-recomend/recomend-1.png" alt="Товар" />
                                    </div>
                                    <div className="swiper-slide">
                                      <img src="assets/img/main-page/we-recomend/recomend-2.png" alt="Товар" />
                                    </div>
                                    <div className="swiper-slide">
                                      <img src="assets/img/main-page/we-recomend/recomend-3.png" alt="Товар" />
                                    </div>
                                    <div className="swiper-slide">
                                      <img src="assets/img/main-page/we-recomend/recomend-4.png" alt="Товар" />
                                    </div>
                                    <div className="swiper-slide">
                                      <img src="assets/img/main-page/we-recomend/recomend-5.png" alt="Товар" />
                                    </div>
                                  </div>
                                  <div className="swiper-button-next"></div>
                                  <div className="swiper-button-prev"></div>
                                </div>

                                <div thumbsSlider="" className="swiper product-gallery-thumbs" data-gallery-thumbs="recommend-1">
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
                                <h3 className="product-card__title">NÖSUND</h3>
                                <p className="product-card__description">Потолочный светильник, береза, 44 см</p>
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
                                  className="swiper product-gallery-main" data-gallery="recommend-2">
                                  <div className="swiper-wrapper">
                                    <div className="swiper-slide">
                                      <img src="assets/img/main-page/we-recomend/recomend-2.png" alt="Товар" />
                                    </div>
                                    <div className="swiper-slide">
                                      <img src="assets/img/main-page/we-recomend/recomend-3.png" alt="Товар" />
                                    </div>
                                    <div className="swiper-slide">
                                      <img src="assets/img/main-page/we-recomend/recomend-4.png" alt="Товар" />
                                    </div>
                                  </div>
                                  <div className="swiper-button-next"></div>
                                  <div className="swiper-button-prev"></div>
                                </div>

                                <div thumbsSlider="" className="swiper product-gallery-thumbs" data-gallery-thumbs="recommend-2">
                                  <div className="swiper-wrapper">
                                    <div className="swiper-slide">
                                      <img src="assets/img/main-page/we-recomend/recomend-2.png" alt="Миниатюра" />
                                    </div>
                                    <div className="swiper-slide">
                                      <img src="assets/img/main-page/we-recomend/recomend-3.png" alt="Миниатюра" />
                                    </div>
                                    <div className="swiper-slide">
                                      <img src="assets/img/main-page/we-recomend/recomend-4.png" alt="Миниатюра" />
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <div className="product-card__info">
                                <h3 className="product-card__title">MUDDERVERK</h3>
                                <p className="product-card__description">Lampa wisząca, mosiądz/opalowa biel szkło</p>
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

                          {/* Карточки 3-5 */}
                          <div className="col product-card-inner">
                            <div className="product-card">
                              <div className="product-card__gallery">
                                <div style={{ '--swiper-navigation-color': '#fff', '--swiper-pagination-color': '#fff' }}
                                  className="swiper product-gallery-main" data-gallery="recommend-3">
                                  <div className="swiper-wrapper">
                                    <div className="swiper-slide">
                                      <img src="assets/img/main-page/we-recomend/recomend-3.png" alt="Товар" />
                                    </div>
                                  </div>
                                </div>
                                <div thumbsSlider="" className="swiper product-gallery-thumbs" data-gallery-thumbs="recommend-3">
                                  <div className="swiper-wrapper">
                                    <div className="swiper-slide">
                                      <img src="assets/img/main-page/we-recomend/recomend-3.png" alt="Миниатюра" />
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="product-card__info">
                                <h3 className="product-card__title">NYMÅNE</h3>
                                <p className="product-card__description">Настольная лампа, антрацит, 33 см</p>
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

                          <div className="col product-card-inner">
                            <div className="product-card">
                              <div className="product-card__gallery">
                                <div className="swiper product-gallery-main" data-gallery="recommend-4">
                                  <div className="swiper-wrapper">
                                    <div className="swiper-slide">
                                      <img src="assets/img/main-page/we-recomend/recomend-4.png" alt="Товар" />
                                    </div>
                                  </div>
                                </div>
                                <div className="swiper product-gallery-thumbs" data-gallery-thumbs="recommend-4">
                                  <div className="swiper-wrapper">
                                    <div className="swiper-slide">
                                      <img src="assets/img/main-page/we-recomend/recomend-4.png" alt="Миниатюра" />
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="product-card__info">
                                <h3 className="product-card__title">RÖDFLIK</h3>
                                <p className="product-card__description">Настольная лампа, светло-бежевая</p>
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

                          <div className="col product-card-inner">
                            <div className="product-card">
                              <div className="product-card__gallery">
                                <div className="swiper product-gallery-main" data-gallery="recommend-5">
                                  <div className="swiper-wrapper">
                                    <div className="swiper-slide">
                                      <img src="assets/img/main-page/we-recomend/recomend-5.png" alt="Товар" />
                                    </div>
                                  </div>
                                </div>
                                <div className="swiper product-gallery-thumbs" data-gallery-thumbs="recommend-5">
                                  <div className="swiper-wrapper">
                                    <div className="swiper-slide">
                                      <img src="assets/img/main-page/we-recomend/recomend-5.png" alt="Миниатюра" />
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="product-card__info">
                                <h3 className="product-card__title">SLATTUM</h3>
                                <p className="product-card__description">Каркас кровати с обивкой, Vissle темно-серый</p>
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
                                <div className="swiper product-gallery-main" data-gallery="recommend-6">
                                  <div className="swiper-wrapper">
                                    <div className="swiper-slide">
                                      <img src="assets/img/main-page/sales-hist/hits-1.png" alt="Товар" />
                                    </div>
                                  </div>
                                </div>
                                <div className="swiper product-gallery-thumbs" data-gallery-thumbs="recommend-6">
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
              <div className="tab-pane fade" id="divans" role="tabpanel">
                <p>Диваны и кресла - содержимое</p>
              </div>
              <div className="tab-pane fade" id="lightings" role="tabpanel">
                <p>Освещение - содержимое</p>
              </div>
              <div className="tab-pane fade" id="shkafi" role="tabpanel">
                <p>Шкафы - содержимое</p>
              </div>
              <div className="tab-pane fade" id="komodi" role="tabpanel">
                <p>Комоды - содержимое</p>
              </div>
              <div className="tab-pane fade" id="hranenie" role="tabpanel">
                <p>Системы хранения - содержимое</p>
              </div>
              <div className="tab-pane fade" id="balkon" role="tabpanel">
                <p>Сад и балкон - содержимое</p>
              </div>
              
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
