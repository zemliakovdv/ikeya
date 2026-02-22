// components/profile/FavoriteProductCard.js
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Thumbs } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
import { removeFavorite } from '@/lib/api/account';
import { useCart } from '@/contexts/CartContext';

function formatPrice(price) {
  const [int, dec] = Number(price).toFixed(2).split('.');
  return { int, dec };
}

const THUMBS_VISIBLE = 3;

export default function FavoriteProductCard({ product, onRemoved }) {
  const { addToCart } = useCart();
  const [thumbsSwiper,  setThumbsSwiper]  = useState(null);
  const [removing,      setRemoving]      = useState(false);
  const [addingToCart,  setAddingToCart]  = useState(false);

  const { int, dec } = formatPrice(product.price);
  const images = product.images?.length ? product.images : [product.image ?? '/assets/img/catalog-page/card/card_1.png'];
  const thumbImages    = images.slice(0, THUMBS_VISIBLE);
  const extraCount     = images.length - THUMBS_VISIBLE;

  async function handleRemove() {
    setRemoving(true);
    try {
      await removeFavorite(product.id);
      onRemoved(product.id);
    } catch (e) {
      console.error('Ошибка удаления из избранного', e);
      setRemoving(false);
    }
  }

  async function handleAddToCart() {
    setAddingToCart(true);
    try {
      await addToCart(product.id, 1);
    } catch (e) {
      console.error('Ошибка добавления в корзину', e);
    } finally {
      setAddingToCart(false);
    }
  }

  return (
    <div className="col product-card-inner">
      <div className="product-card">

        {/* Галерея */}
        <div className="product-card__gallery">

          {/* Основной слайдер */}
          <Swiper
            style={{ '--swiper-navigation-color': '#fff', '--swiper-pagination-color': '#fff' }}
            className="swiper product-gallery-main"
            modules={[Navigation, Thumbs]}
            navigation
            thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
            spaceBetween={0}
            slidesPerView={1}
          >
            {images.map((img, idx) => (
              <SwiperSlide key={idx}>
                <Link href={`/product/${product.slug}`}>
                  <img src={img} alt={product.name} />
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Слайдер миниатюр */}
          <Swiper
            className="swiper product-gallery-thumbs"
            modules={[Thumbs]}
            onSwiper={setThumbsSwiper}
            spaceBetween={4}
            slidesPerView={4}
            watchSlidesProgress
          >
            {thumbImages.map((img, idx) => (
              <SwiperSlide key={idx}>
                <img src={img} alt="Миниатюра" />
              </SwiperSlide>
            ))}
            {extraCount > 0 && (
              <SwiperSlide className="product-gallery-thumbs__more">
                <span className="product-gallery-thumbs__count">+{extraCount}</span>
              </SwiperSlide>
            )}
          </Swiper>
        </div>

        {/* Инфо о товаре */}
        <div className="product-card__info">
          <h3 className="product-card__title">
            <Link href={`/product/${product.slug}`}>{product.name}</Link>
          </h3>
          <p className="product-card__description">{product.description}</p>
          <p className="product-card__price">
            {int}<span>.{dec} р.</span>
          </p>
          <button
            className="shop_button"
            onClick={handleAddToCart}
            disabled={addingToCart}
          >
            <img src="/assets/img/icons/shopping-cart.svg" alt="В корзину" />
            <p>{addingToCart ? 'Добавляем…' : 'В корзину'}</p>
          </button>
        </div>

        {/* Бейджи */}
        {product.is_hit && <span className="sales-hit">Хит продаж</span>}
        {product.discount && (
          <span className="sales-hit pink" style={{ display: 'inline-block' }}>
            -{product.discount}% промокод IKEYA
          </span>
        )}

        {/* Лайк — убрать из избранного */}
        <button className="like" onClick={handleRemove} disabled={removing}>
          <svg width="20" height="18" viewBox="0 0 20 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 17.22C9.34 17.22 8.67 17.01 8.1 16.58C5.66 14.76 0 10.04 0 5.53C0 2.43 2.35 0 5.35 0C7.01 0 8.43 0.62 10 2.06C11.57 0.62 12.99 0 14.65 0C17.65 0 20 2.43 20 5.53C20 10.03 14.33 14.75 11.9 16.58C11.33 17 10.67 17.22 10 17.22ZM5.35 1.4C3.1 1.4 1.4 3.18 1.4 5.53C1.4 9.51 7.17 14.13 8.94 15.46C9.57 15.93 10.43 15.93 11.06 15.46C12.83 14.14 18.6 9.51 18.6 5.53C18.6 3.17 16.9 1.4 14.65 1.4C13.59 1.4 12.36 1.66 10.49 3.52C10.22 3.79 9.78 3.79 9.5 3.52C7.64 1.66 6.4 1.4 5.34 1.4H5.35Z" fill="#181818"/>
          </svg>
        </button>

      </div>
    </div>
  );
}
