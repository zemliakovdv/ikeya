// components/catalog/products/ProductCard.js
'use client';

import { useState, useCallback } from 'react';
import ProductGallery from './ProductGallery';
import ProductBadge from './ProductBadge';

const API_BASE_URL = 'http://45.135.234.22';

export default function ProductCard({ product }) {
  const [isLiked, setIsLiked] = useState(false);

  const handleToggleLike = useCallback(() => {
    setIsLiked(prev => !prev);
  }, []);

  const handleAddToCart = useCallback(() => {
    console.log('Add to cart:', product.id);
  }, [product.id]);

  const attr = product.attributes;
  
  const title = attr.name_ru || attr.name || 'Товар';
  const description = attr.collection || '';
  
  const price = Math.floor(attr.price);
  const priceDecimal = ((attr.price % 1) * 100).toFixed(0).padStart(2, '0');
  
  // 🔥 ИСПРАВЛЕНИЕ: Парсим local_images из строки JSON
  let imagesList = [];
  
  // Пробуем local_images
  if (attr.local_images) {
    try {
      // Если это строка JSON, парсим её
      if (typeof attr.local_images === 'string') {
        imagesList = JSON.parse(attr.local_images);
      } else if (Array.isArray(attr.local_images)) {
        imagesList = attr.local_images;
      }
    } catch (e) {
      console.error('Ошибка парсинга local_images:', e);
    }
  }
  
  // Если local_images пустой, берём images
  if (imagesList.length === 0 && Array.isArray(attr.images)) {
    imagesList = attr.images;
  }
  
  // Формируем массив изображений с полными URL
  const images = imagesList.length > 0
    ? imagesList.map(img => {
        if (typeof img === 'string') {
          if (img.startsWith('http')) {
            return img;
          }
          return `${API_BASE_URL}/${img}`;
        }
        return `https://via.placeholder.com/400x400/f5f5f5/999?text=Invalid`;
      })
    : [`https://via.placeholder.com/400x400/f5f5f5/999?text=${encodeURIComponent(title.slice(0, 10))}`];
  
  const thumbs = images;
  
  const badges = [];
  if (attr.is_bestseller) badges.push('Хит продаж');
  if (attr.is_popular) badges.push('Популярное');

  return (
    <div className="col product-card-inner">
      <div className="product-card">
        <ProductGallery
          images={images}
          thumbs={thumbs}
          galleryId={`product-${product.id}`}
        />

        <div className="product-card__info">
          <h3 className="product-card__title">{title}</h3>
          {description && (
            <p className="product-card__description">{description}</p>
          )}
          <p className="product-card__price">
            {price}
            <span>.{priceDecimal} р.</span>
          </p>
          <button className="shop_button" onClick={handleAddToCart}>
            <img src="/assets/img/icons/shopping-cart.svg" alt="Добавить в корзину" />
            <p>В корзину</p>
          </button>
        </div>

        {badges.length > 0 && (
          <>
            <ProductBadge label={badges[0]} />
            {badges[1] && (
              <ProductBadge label={badges[1]} variant="pink" />
            )}
          </>
        )}

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
