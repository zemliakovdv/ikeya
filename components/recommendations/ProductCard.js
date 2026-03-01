'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Thumbs, FreeMode } from 'swiper/modules';
import { useState, useCallback } from 'react';
import { useCart } from '@/contexts/CartContext';
import CartCounter from '@/components/cart/CartCounter';

export default function ProductCard({ product, galleryId }) {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const { addToCart, items } = useCart();

  const sku = product?.sku || product?.id;

  const getQtyBySku = useCallback((skuValue) => {
    if (!skuValue) return 0;
    const found = (items || []).find((it) => it?.sku === skuValue);
    return Number(found?.quantity || 0);
  }, [items]);

  const quantity = getQtyBySku(sku);

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!sku) return;

    try {
      await addToCart(sku, 1);
    } catch (error) {
      console.error('Ошибка добавления в корзину:', error);
      alert('Не удалось добавить товар в корзину');
    }
  };

  const handleAddToFavorites = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Add to favorites:', product?.id);
  };

  return (
    <div className="product-card">
      {/* Галерея */}
      <div className="product-card__gallery">
        {/* Основной слайдер */}
        <Swiper
          modules={[Navigation, Thumbs]}
          spaceBetween={10}
          navigation={{
            nextEl: `[data-gallery="${galleryId}"] .swiper-button-next`,
            prevEl: `[data-gallery="${galleryId}"] .swiper-button-prev`,
          }}
          thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
          className="swiper product-gallery-main"
          data-gallery={galleryId}
          style={{
            '--swiper-navigation-color': '#fff',
            '--swiper-pagination-color': '#fff',
          }}
        >
          {product.images?.map((image, index) => (
            <SwiperSlide key={index}>
              <img src={image} alt="Товар" />
            </SwiperSlide>
          ))}
          <div className="swiper-button-next"></div>
          <div className="swiper-button-prev"></div>
        </Swiper>

        {/* Слайдер миниатюр */}
        <Swiper
          modules={[FreeMode, Thumbs]}
          onSwiper={setThumbsSwiper}
          spaceBetween={8}
          slidesPerView={3}
          freeMode={true}
          watchSlidesProgress={true}
          className="swiper product-gallery-thumbs"
          data-gallery-thumbs={galleryId}
        >
          {product.thumbs?.slice(0, 3).map((thumb, index) => (
            <SwiperSlide key={index}>
              <img src={thumb} alt="Миниатюра" />
            </SwiperSlide>
          ))}
          {product.thumbs?.length > 3 && (
            <SwiperSlide className="product-gallery-thumbs__more">
              <span className="product-gallery-thumbs__count">+{product.thumbs.length - 3}</span>
            </SwiperSlide>
          )}
        </Swiper>
      </div>

      {/* Информация о товаре */}
      <div className="product-card__info">
        <h3 className="product-card__title">{product.title}</h3>
        <p className="product-card__description">{product.description}</p>
        <p className="product-card__price">
          {Math.floor(product.price)}
          <span>.{(product.price % 1).toFixed(2).split('.')[1]} р.</span>
        </p>

        {quantity > 0 ? (
          <div style={{ marginBottom: 0 }}>
            <CartCounter sku={sku} className="added-fullwidth" />
          </div>
        ) : (
          <button
            className="shop_button"
            onClick={handleAddToCart}
            type="button"
            disabled={!sku}
            aria-disabled={!sku}
          >
            <img src="/assets/img/icons/shopping-cart.svg" alt="В корзину" />
            <p>В корзину</p>
          </button>
        )}
      </div>

      {/* Бейджи */}
      {product.isHit && <span className="sales-hit">Хит продаж</span>}
      {product.promoCode && <span className="sales-hit pink">{product.promoCode}</span>}

      {/* Кнопка избранного */}
      <button className="like" onClick={handleAddToFavorites} type="button">
        <img src="/assets/img/icons/header-favorite.svg" alt="Добавить в избранное" />
      </button>
    </div>
  );
}