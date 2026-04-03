// components/ui/ProductCard.js
'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/contexts/CartContext';
import CartCounter from '@/components/cart/CartCounter';
import { useFavorites } from '@/contexts/FavoritesContext';

const PLACEHOLDER_IMAGE = '/assets/img/no-image.jpg';

export default function ProductCard({
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
  const { isFavorite, add, remove } = useFavorites();
  const isLiked = sku ? isFavorite(sku) : false;
  const { addToCart, items } = useCart();
  const router = useRouter();

  const [isHovered, setIsHovered] = useState(false);

  // Парсим цену
  const priceNum = parseFloat((price || '0').toString().replace(/\s/g, '').replace(',', '.')) || 0;
  const priceWhole = Math.floor(priceNum).toLocaleString('ru-RU');
  const priceDecimal = Math.round((priceNum % 1) * 100).toString().padStart(2, '0');

  const productImages = images.length > 0 ? images : [PLACEHOLDER_IMAGE];
  const mainImage = productImages[0];
  const hoverImage = productImages[1] || productImages[0];
  const hasHover = hoverImage !== mainImage;

  const productDescription = description || '';

  const quantity = useMemo(() => {
    if (!sku) return 0;
    const found = (items || []).find((it) => it?.sku === sku);
    return Number(found?.quantity || 0);
  }, [items, sku]);

  const handleLikeClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!sku) return;
    try {
      if (isLiked) await remove(sku);
      else await add(sku);
    } catch (error) {
      console.error('Ошибка избранного:', error);
    }
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

  const handleCardClick = () => {
    if (url !== '#') router.push(url);
  };

  return (
    <div className="col product-card-inner">
      <div
        className="product-card"
        onClick={handleCardClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{ cursor: url !== '#' ? 'pointer' : 'default' }}
      >
        {/* Главное изображение с fade при наведении */}
        <div className="product-card__img-wrap" style={{ position: 'relative', overflow: 'hidden' }}>
          <img
            src={mainImage}
            alt={title}
            className="product-card__img product-card__img--main"
            onError={(e) => { e.target.src = PLACEHOLDER_IMAGE; }}
            style={{
              width: '100%',
              height: 'auto',
              display: 'block',
              opacity: isHovered && hasHover ? 0 : 1,
              transition: 'opacity 0.3s ease',
              position: 'relative',
              zIndex: 1,
            }}
          />
          {hasHover && (
            <img
              src={hoverImage}
              alt={title}
              className="product-card__img product-card__img--hover"
              onError={(e) => { e.target.src = PLACEHOLDER_IMAGE; }}
              style={{
                width: '100%',
                height: 'auto',
                display: 'block',
                position: 'absolute',
                top: 0,
                left: 0,
                opacity: isHovered ? 1 : 0,
                transition: 'opacity 0.3s ease',
                zIndex: 0,
              }}
            />
          )}
        </div>

        <div className="product-card__info">
          <h3 className="product-card__title">{title}</h3>
          {productDescription && (
            <p className="product-card__description">{productDescription}</p>
          )}
          <p className="product-card__price">
            {priceWhole}
            <span>.{priceDecimal} р.</span>
          </p>

          {quantity > 0 ? (
            <div onClick={(e) => e.stopPropagation()}>
              <CartCounter sku={sku} className="added-fullwidth" />
            </div>
          ) : (
            <button
              className="shop_button add-to-cart"
              onClick={handleAddToCart}
              type="button"
              disabled={!sku}
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
          <svg width="18" height="18" viewBox="0 0 20 18" fill="none">
            {isLiked ? (
              <path d="M10 17.22C9.34 17.22 8.67 17.01 8.1 16.58C5.66 14.76 0 10.04 0 5.53C0 2.43 2.35 0 5.35 0C7.01 0 8.43 0.62 10 2.06C11.57 0.62 12.99 0 14.65 0C17.65 0 20 2.43 20 5.53C20 10.03 14.33 14.75 11.9 16.58C11.33 17 10.67 17.22 10 17.22Z" fill="#CE0061" />
            ) : (
              <path d="M10 17.22C9.34 17.22 8.67 17.01 8.1 16.58C5.66 14.76 0 10.04 0 5.53C0 2.43 2.35 0 5.35 0C7.01 0 8.43 0.62 10 2.06C11.57 0.62 12.99 0 14.65 0C17.65 0 20 2.43 20 5.53C20 10.03 14.33 14.75 11.9 16.58C11.33 17 10.67 17.22 10 17.22ZM5.35 1.4C3.1 1.4 1.4 3.18 1.4 5.53C1.4 9.51 7.17 14.13 8.94 15.46C9.57 15.93 10.43 15.93 11.06 15.46C12.83 14.14 18.6 9.51 18.6 5.53C18.6 3.17 16.9 1.4 14.65 1.4C13.59 1.4 12.36 1.66 10.49 3.52C10.22 3.79 9.78 3.79 9.5 3.52C7.64 1.66 6.4 1.4 5.34 1.4H5.35Z" fill="#181818" />
            )}
          </svg>
        </button>
      </div>
    </div>
  );
}