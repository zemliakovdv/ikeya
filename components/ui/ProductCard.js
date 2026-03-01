// components/ui/ProductCard.js
'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';
import CartCounter from '@/components/cart/CartCounter';

const PLACEHOLDER_IMAGE = '/assets/img/no-image.jpg';

export default function ProductCard({
  gallery,
  title,
  description,
  price,
  images = [],
  salesHit = false,
  promo = false,
  isNew = false,
  url = '#',
  sku,
}) {
  const [isLiked, setIsLiked] = useState(false);
  const { addToCart, items } = useCart();

  const productImages = images.length > 0 ? images : [PLACEHOLDER_IMAGE];
  const productDescription = description || 'Описание скоро появится';

  const quantity = useMemo(() => {
    if (!sku) return 0;
    const found = (items || []).find((it) => it?.sku === sku);
    return Number(found?.quantity || 0);
  }, [items, sku]);

  const handleImageError = (e) => {
    e.target.src = PLACEHOLDER_IMAGE;
  };

  const handleLikeClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsLiked(!isLiked);
  };

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

  return (
    <div className="col product-card-inner">
      <div className="product-card">
        <Link href={url}>
          <div className="product-card__gallery">
            <div
              style={{ '--swiper-navigation-color': '#fff', '--swiper-pagination-color': '#fff' }}
              className="swiper product-gallery-main"
              data-gallery={gallery}
            >
              <div className="swiper-wrapper">
                {productImages.map((image, index) => (
                  <div key={index} className="swiper-slide">
                    <img
                      src={image}
                      alt={`${title} - изображение ${index + 1}`}
                      loading="lazy"
                      onError={handleImageError}
                    />
                  </div>
                ))}
              </div>
              <div className="swiper-button-next"></div>
              <div className="swiper-button-prev"></div>
            </div>

            <div
              thumbsslider=""
              className="swiper product-gallery-thumbs"
              data-gallery-thumbs={gallery}
            >
              <div className="swiper-wrapper">
                {productImages.slice(0, 3).map((image, index) => (
                  <div key={index} className="swiper-slide">
                    <img
                      src={image}
                      alt={`${title} - миниатюра ${index + 1}`}
                      onError={handleImageError}
                    />
                  </div>
                ))}

                {productImages.length > 3 && (
                  <div className="swiper-slide product-gallery-thumbs__more">
                    <span className="product-gallery-thumbs__count">
                      +{productImages.length - 3}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Link>

        <div className="product-card__info">
          <Link href={url}>
            <h3 className="product-card__title">{title}</h3>
          </Link>
          <p className="product-card__description">{productDescription}</p>
          <p className="product-card__price">
            {price}
            <span>.00 р.</span>
          </p>

          {quantity > 0 ? (
            <div style={{ marginBottom: 0 }}>
              <div style={{ width: '100%' }}>
                <CartCounter sku={sku} className="added-fullwidth" />
              </div>
            </div>
          ) : (
            <button
              className="shop_button add-to-cart"
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

        {salesHit && <span className="sales-hit">Хит продаж</span>}
        {promo && <span className="sales-hit pink">-10% промокод IKEYA</span>}
        {isNew && <span className="sales-hit green">Новинка</span>}

        <button
          className={`like ${isLiked ? 'active' : ''}`}
          onClick={handleLikeClick}
          aria-label={isLiked ? 'Удалить из избранного' : 'Добавить в избранное'}
          type="button"
        >
          <img
            src="/assets/img/icons/header-favorite.svg"
            alt="Избранное"
            style={{
              filter: isLiked
                ? 'invert(27%) sepia(51%) saturate(2878%) hue-rotate(346deg) brightness(104%) contrast(97%)'
                : 'none',
            }}
          />
        </button>
      </div>
    </div>
  );
}