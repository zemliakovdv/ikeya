// components/catalog/products/ProductCard.js
'use client';

import { useState, useCallback } from 'react';
import ProductGallery from './ProductGallery';
import ProductBadge from './ProductBadge';

export default function ProductCard({ product }) {
  const [isLiked, setIsLiked] = useState(false);

  const handleToggleLike = useCallback(() => {
    setIsLiked(prev => !prev);
  }, []);

  const handleAddToCart = useCallback(() => {
    // TODO: Добавить товар в корзину
    console.log('Add to cart:', product.id);
  }, [product.id]);

  return (
    <div className="col product-card-inner">
      <div className="product-card">
        {/* Галерея изображений */}
        <ProductGallery
          images={product.images}
          thumbs={product.thumbs}
          galleryId={`product-${product.id}`}
        />

        {/* Информация о товаре */}
        <div className="product-card__info">
          <h3 className="product-card__title">{product.title}</h3>
          <p className="product-card__description">{product.description}</p>
          <p className="product-card__price">
            {product.price}
            <span>.00 р.</span>
          </p>
          <button className="shop_button" onClick={handleAddToCart}>
            <img src="/assets/img/icons/shopping-cart.svg" alt="Добавить в корзину" />
            <p>Купить</p>
          </button>
        </div>

        {/* Бейджи */}
        {product.badges && product.badges.length > 0 && (
          <>
            <ProductBadge label={product.badges[0]} />
            {product.badges[1] && (
              <ProductBadge label={product.badges[1]} variant="pink" />
            )}
          </>
        )}

        {/* Кнопка "Избранное" */}
        <button
          className={`like ${isLiked ? 'active' : ''}`}
          onClick={handleToggleLike}
          aria-label={isLiked ? 'Удалить из избранного' : 'Добавить в избранное'}
        >
          <svg width="20" height="18" viewBox="0 0 20 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 17.22C9.34 17.22 8.67 17.01 8.1 16.58C5.66 14.76 0 10.04 0 5.53C0 2.43 2.35 0 5.35 0C7.01 0 8.43 0.62 10 2.06C11.57 0.62 12.99 0 14.65 0C17.65 0 20 2.43 20 5.53C20 10.03 14.33 14.75 11.9 16.58C11.33 17 10.67 17.22 10 17.22ZM5.35 1.4C3.1 1.4 1.4 3.18 1.4 5.53C1.4 9.51 7.17 14.13 8.94 15.46C9.57 15.93 10.43 15.93 11.06 15.46C12.83 14.14 18.6 9.51 18.6 5.53C18.6 3.17 16.9 1.4 14.65 1.4C13.59 1.4 12.36 1.66 10.49 3.52C10.22 3.79 9.78 3.79 9.5 3.52C7.64 1.66 6.4 1.4 5.34 1.4H5.35Z" fill="#181818"/>
          </svg>
        </button>
      </div>
    </div>
  );
}
