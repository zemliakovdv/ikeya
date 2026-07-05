'use client';

import { useState, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useFavorites } from '@/contexts/FavoritesContext';
import { useCart } from '@/contexts/CartContext';
import CartCounter from '@/components/cart/CartCounter';

import { buildAssetUrl } from '@/lib/config/api';
const PLACEHOLDER = '/assets/img/no-image.jpg';

function formatPrice(price) {
  const num = parseFloat(String(price || 0).replace(/\s/g, ''));
  const int = Math.floor(num).toLocaleString('ru-RU');
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
    return buildAssetUrl(clean);
  });
}

export default function FavoriteProductCard({ product, onRemoved }) {
  const { remove } = useFavorites();
  const { items: cartItems, addToCart } = useCart();
  const router = useRouter();

  const [isHovered, setIsHovered] = useState(false);
  const [removing, setRemoving] = useState(false);

  const sku = product.sku;
  const title = product.small_desc_name || 'Товар IKEYA';
  const desc = product.name_ru || product.name || '';
  const { int, dec } = formatPrice(product.price_byn);

  const images = useMemo(() => buildImages(product.images), [product.images]);
  const mainImage = images[0];
  const hoverImage = images[1] || images[0];
  const hasHover = hoverImage !== mainImage;

  const quantity = useMemo(() => {
    const found = (cartItems || []).find(it => it?.sku === sku);
    return Number(found?.quantity || 0);
  }, [cartItems, sku]);

  const handleRemove = useCallback(async (e) => {
    e.stopPropagation();
    setRemoving(true);
    try {
      await remove(sku);
      onRemoved?.(sku);
    } catch (e) {
      console.error('Ошибка удаления из избранного', e);
      setRemoving(false);
    }
  }, [remove, sku, onRemoved]);

  const handleAddToCart = useCallback(async (e) => {
    e.stopPropagation();
    try {
      await addToCart(sku, 1);
    } catch (e) {
      console.error('Ошибка добавления в корзину', e);
    }
  }, [addToCart, sku]);

  return (
    <div className="col product-card-inner">
      <div
        className="product-card"
        onClick={() => router.push(`/product/${sku}`)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{ cursor: 'pointer' }}
      >
        {/* Главное изображение с fade при наведении */}
        <div className="product-card__img-wrap" style={{ position: 'relative', overflow: 'hidden' }}>
          <img
            src={mainImage}
            alt={title}
            width="262"
            height="262"
            onError={(e) => { e.target.src = PLACEHOLDER; }}
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
              width="262"
              height="262"
              onError={(e) => { e.target.src = PLACEHOLDER; }}
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

        {/* Инфо */}
        <div className="product-card__info">
          <div className="product-card__header">
            <h3 className="product-card__title">{title}</h3>
            {desc && <p className="product-card__description">{desc}</p>}
          </div>
          <p className="product-card__price">
            {int}<span>.{dec} р.</span>
          </p>

          {quantity > 0 ? (
            <div onClick={(e) => e.stopPropagation()}>
              <CartCounter sku={sku} className="added-fullwidth" />
            </div>
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
          <svg width="20" height="18" viewBox="0 0 20 18" fill="none">
            <path d="M10 17.22C9.34 17.22 8.67 17.01 8.1 16.58C5.66 14.76 0 10.04 0 5.53C0 2.43 2.35 0 5.35 0C7.01 0 8.43 0.62 10 2.06C11.57 0.62 12.99 0 14.65 0C17.65 0 20 2.43 20 5.53C20 10.03 14.33 14.75 11.9 16.58C11.33 17 10.67 17.22 10 17.22Z" fill="#CE0061" />
          </svg>
        </button>
      </div>
    </div>
  );
}