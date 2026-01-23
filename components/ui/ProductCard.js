'use client'

import Link from 'next/link'

export default function ProductCard({ gallery, title, description, price, salesHit, promo }) {
  return (
    <div className="col product-card-inner">
      <div className="product-card">
        {/* Слайдер изображений товара */}
        <div className="product-card__gallery" onClick={() => window.location.href='/product/slug'}>
          {/* Основной слайдер */}
          <div style={{"--swiper-navigation-color": "#fff", "--swiper-pagination-color": "#fff"}}
            className="swiper product-gallery-main" data-gallery={gallery}>
            <div className="swiper-wrapper">
              <div className="swiper-slide">
                <img src="/assets/img/main-page/sales-hist/hits-1.png" alt="Товар" />
              </div>
              <div className="swiper-slide">
                <img src="/assets/img/main-page/sales-hist/hits-2.png" alt="Товар" />
              </div>
              <div className="swiper-slide">
                <img src="/assets/img/main-page/sales-hist/hits-3.png" alt="Товар" />
              </div>
              <div className="swiper-slide">
                <img src="/assets/img/main-page/sales-hist/hits-4.png" alt="Товар" />
              </div>
              <div className="swiper-slide">
                <img src="/assets/img/main-page/sales-hist/hits-5.png" alt="Товар" />
              </div>
            </div>
            <div className="swiper-button-next"></div>
            <div className="swiper-button-prev"></div>
          </div>

          {/* Слайдер миниатюр */}
          <div thumbsslider="" className="swiper product-gallery-thumbs" data-gallery-thumbs={gallery}>
            <div className="swiper-wrapper">
              <div className="swiper-slide">
                <img src="/assets/img/main-page/sales-hist/hits-1.png" alt="Миниатюра" />
              </div>
              <div className="swiper-slide">
                <img src="/assets/img/main-page/sales-hist/hits-1.png" alt="Миниатюра" />
              </div>
              <div className="swiper-slide">
                <img src="/assets/img/main-page/sales-hist/hits-3.png" alt="Миниатюра" />
              </div>
              <div className="swiper-slide product-gallery-thumbs__more">
                <span className="product-gallery-thumbs__count">+2</span>
              </div>
            </div>
          </div>
        </div>

        {/* Информация о товаре */}
        <div className="product-card__info">
          <h3 className="product-card__title">{title}</h3>
          <p className="product-card__description">{description}</p>
          <p className="product-card__price">{price}<span>.00 р.</span></p>
          <button className="shop_button add-to-cart">
            <img src="/assets/img/icons/shopping-cart.svg" alt="В корзину" />
            <p>В корзину</p>
          </button>
        </div>

        {salesHit && <span className="sales-hit">Хит продаж</span>}
        {promo && <span className="sales-hit pink">-10% промокод IKEYA</span>}
        <button className="like">
          <img src="/assets/img/icons/header-favorite.svg" alt="Добавить в избранное" />
        </button>
      </div>
    </div>
  )
}
