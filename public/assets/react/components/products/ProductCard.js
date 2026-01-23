"use client"

import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation, Thumbs } from "swiper/modules"
import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/thumbs"
import { useState } from "react"

export function ProductCard({ product }) {
  const [thumbsSwiper, setThumbsSwiper] = useState(null)

  return (
    <div className="product-card">
      <div className="product-card__gallery">
        <Swiper
          modules={[Navigation, Thumbs]}
          navigation
          thumbs={{ swiper: thumbsSwiper }}
          className="product-gallery-main"
        >
          {product.images.map((img) => (
            <SwiperSlide key={img.id}>
              <img src={img.src} alt={img.alt} />
            </SwiperSlide>
          ))}
        </Swiper>

        <Swiper
          onSwiper={setThumbsSwiper}
          modules={[Thumbs]}
          slidesPerView={4}
          watchSlidesProgress
          className="product-gallery-thumbs"
        >
          {product.images.slice(0, 3).map((img) => (
            <SwiperSlide key={img.id}>
              <img src={img.src} alt={img.alt} />
            </SwiperSlide>
          ))}
          {product.images.length > 3 && (
            <SwiperSlide className="product-gallery-thumbs__more">
              <span className="product-gallery-thumbs__count">
                +{product.images.length - 3}
              </span>
            </SwiperSlide>
          )}
        </Swiper>
      </div>

      <div className="product-card__info">
        <h3 className="product-card__title">{product.title}</h3>
        <p className="product-card__description">{product.description}</p>
        <p className="product-card__price">
          {product.price}
          <span>.00 {product.currencySuffix}</span>
        </p>
        <button className="shop_button" type="button">
          <img src="/assets/img/icons/shopping-cart.svg" alt="В корзину" />
          <p>В корзину</p>
        </button>
      </div>

      {product.isHit && <span className="sales-hit">Хит продаж</span>}
      {product.promoLabel && (
        <span className="sales-hit pink">{product.promoLabel}</span>
      )}
      {product.isNew && <span className="sales-hit green">Новинка</span>}

      <button className="like" type="button">
        <img
          src="/assets/img/icons/header-favorite.svg"
          alt="Добавить в избранное"
        />
      </button>
    </div>
  )
}
