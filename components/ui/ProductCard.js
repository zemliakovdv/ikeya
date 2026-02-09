// components/ui/ProductCard.js
'use client';

import { useState } from 'react';
import Link from 'next/link';

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
  url = '#'
}) {
  const [isLiked, setIsLiked] = useState(false);

  // ✅ ОТЛАДКА - посмотри что приходит
  console.log('=== ProductCard Debug ===');
  console.log('Товар:', title);
  console.log('images (raw):', images);
  console.log('Тип images:', typeof images, Array.isArray(images));

  // ✅ ИЗОБРАЖЕНИЯ С ЗАГЛУШКОЙ
  const productImages = images.length > 0 
    ? images 
    : [PLACEHOLDER_IMAGE];

  console.log('productImages (итог):', productImages);

  const productDescription = description || 'Описание скоро появится';

  const handleLikeClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsLiked(!isLiked);
  };

  return (
    <div className="col product-card-inner">
      <div className="product-card">
        <Link href={url}>
          <div className="product-card__gallery">
            <div 
              style={{"--swiper-navigation-color": "#fff", "--swiper-pagination-color": "#fff"}}
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
                      onError={(e) => {
                        console.log('❌ Ошибка загрузки:', image);
                        e.target.src = PLACEHOLDER_IMAGE;
                      }}
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
                      onError={(e) => {
                        e.target.src = PLACEHOLDER_IMAGE;
                      }}
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
            {price}<span>.00 р.</span>
          </p>
          <button className="shop_button add-to-cart">
            <img src="/assets/img/icons/shopping-cart.svg" alt="В корзину" />
            <p>В корзину</p>
          </button>
        </div>

        {salesHit && <span className="sales-hit">Хит продаж</span>}
        {promo && <span className="sales-hit pink">-10% промокод IKEYA</span>}
        {isNew && <span className="sales-hit green">Новинка</span>}

        <button 
          className={`like ${isLiked ? 'active' : ''}`}
          onClick={handleLikeClick}
          aria-label={isLiked ? 'Удалить из избранного' : 'Добавить в избранное'}
        >
          <img 
            src="/assets/img/icons/header-favorite.svg" 
            alt="Избранное"
            style={{ 
              filter: isLiked ? 'invert(27%) sepia(51%) saturate(2878%) hue-rotate(346deg) brightness(104%) contrast(97%)' : 'none' 
            }}
          />
        </button>
      </div>
    </div>
  );
}
