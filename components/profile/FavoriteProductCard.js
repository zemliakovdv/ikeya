'use client';

import { useState, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Thumbs } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
import { useFavorites } from '@/contexts/FavoritesContext';
import { useCart } from '@/contexts/CartContext';
import CartCounter from '@/components/cart/CartCounter';

const API_BASE_URL = 'http://45.135.234.22';
const PLACEHOLDER   = '/assets/img/no-image.jpg';
const THUMBS_VISIBLE = 3;

function formatPrice(price) {
  const num = Number(price || 0);
  const int = Math.floor(num);
  const dec = ((num % 1) * 100).toFixed(0).padStart(2, '0');
  return { int, dec };
}

function buildImages(rawImages) {
  const list =
    rawImages?.local_images?.filter(Boolean).length
      ? rawImages.local_images
      : rawImages?.images?.filter(Boolean) ?? [];

  if (!list.length) return [PLACEHOLDER];

  return list.map(img => {
    const clean = img.startsWith('/') ? img.slice(1) : img;
    return `${API_BASE_URL}/${clean}`;
  });
}

export default function FavoriteProductCard({ product, onRemoved }) {
  const { remove } = useFavorites();
  const { items: cartItems, addToCart } = useCart();
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [removing,     setRemoving]     = useState(false);

  const sku   = product.sku;
  const title = product.small_desc_name || 'Товар IKEYA';
  const desc  = product.name_ru || product.name || '';
  const { int, dec } = formatPrice(product.price_byn);

  const images      = useMemo(() => buildImages(product.images), [product.images]);
  const thumbImages = images.slice(0, THUMBS_VISIBLE);
  const extraCount  = images.length - THUMBS_VISIBLE;

  const quantity = useMemo(() => {
    const found = (cartItems || []).find(it => it?.sku === sku);
    return Number(found?.quantity || 0);
  }, [cartItems, sku]);

  const handleRemove = useCallback(async () => {
    setRemoving(true);
    try {
      await remove(sku);
      onRemoved?.(sku);
    } catch (e) {
      console.error('Ошибка удаления из избранного', e);
      setRemoving(false);
    }
  }, [remove, sku, onRemoved]);

  const handleAddToCart = useCallback(async () => {
    try {
      await addToCart(sku, 1);
    } catch (e) {
      console.error('Ошибка добавления в корзину', e);
    }
  }, [addToCart, sku]);

  return (
    <div className="col product-card-inner">
      <div className="product-card">

        {/* Галерея */}
        <div className="product-card__gallery">
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
                <Link href={`/product/${sku}`}>
                  <img src={img} alt={title} onError={e => { e.target.src = PLACEHOLDER; }} />
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>

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
                <img src={img} alt="Миниатюра" onError={e => { e.target.src = PLACEHOLDER; }} />
              </SwiperSlide>
            ))}
            {extraCount > 0 && (
              <SwiperSlide className="product-gallery-thumbs__more">
                <span className="product-gallery-thumbs__count">+{extraCount}</span>
              </SwiperSlide>
            )}
          </Swiper>
        </div>

        {/* Инфо */}
        <div className="product-card__info">
          <Link href={`/product/${sku}`} className="product-card__header">
            <h3 className="product-card__title">{title}</h3>
            {desc && <p className="product-card__description">{desc}</p>}
          </Link>
          <p className="product-card__price">
            {int}<span>.{dec} р.</span>
          </p>

          {quantity > 0 ? (
            <CartCounter sku={sku} className="added-fullwidth" />
          ) : (
            <button className="shop_button" onClick={handleAddToCart} type="button">
              <img src="/assets/img/icons/shopping-cart.svg" alt="В корзину" />
              <p>В корзину</p>
            </button>
          )}
        </div>

        {/* Бейджи */}
        {product.is_bestseller && <span className="sales-hit">Хит продаж</span>}

        {/* Удалить из избранного */}
        <button
          className="like active"
          onClick={handleRemove}
          disabled={removing}
          aria-label="Удалить из избранного"
          type="button"
        >
          <svg width="20" height="18" viewBox="0 0 20 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 17.22C9.34 17.22 8.67 17.01 8.1 16.58C5.66 14.76 0 10.04 0 5.53C0 2.43 2.35 0 5.35 0C7.01 0 8.43 0.62 10 2.06C11.57 0.62 12.99 0 14.65 0C17.65 0 20 2.43 20 5.53C20 10.03 14.33 14.75 11.9 16.58C11.33 17 10.67 17.22 10 17.22Z" fill="#CE0061"/>
          </svg>
        </button>

      </div>
    </div>
  );
}