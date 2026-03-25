'use client';

import { useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/contexts/CartContext';
import { useFavorites } from '@/contexts/FavoritesContext';
import { useAuth } from '@/contexts/AuthContext';
import { useAuthModals } from '@/components/auth/AuthModalsHost';
import CartCounter from '@/components/cart/CartCounter';
import ProductGallery from './ProductGallery';
import ProductBadge from './ProductBadge';

const API_BASE_URL = 'http://45.135.234.22';
const PLACEHOLDER_IMAGE = '/assets/img/no-image.jpg';

export default function ProductCard({ product }) {
  const router = useRouter();
  const { addToCart, items } = useCart();
  const { isFavorite, add, remove } = useFavorites();
  const { isAuth } = useAuth();
  const { openLogin } = useAuthModals();

  // ← Guard после хуков
  if (!product || !product.attributes) return null;

  const attr = product.attributes;
  const sku = attr.sku || product.id;

  const title = attr.name_ru || attr.name || 'Товар';

  const description = attr.short_description_ru
    || attr.content_ru
    || attr.collection
    || attr.name_ru
    || 'Описание скоро появится';

  const quantity = useMemo(() => {
    if (!sku) return 0;
    const found = (items || []).find((it) => it?.sku === sku);
    return Number(found?.quantity || 0);
  }, [items, sku]);

  const handleLike = useCallback(async (e) => {
    e.stopPropagation();
    if (!sku) return;
    if (!isAuth) { openLogin(); return; }
    try {
      if (isFavorite(sku)) await remove(sku);
      else await add(sku);
    } catch (err) {
      console.error('Ошибка избранного:', err);
    }
  }, [sku, isAuth, isFavorite, openLogin, add, remove]);

  const handleAddToCart = useCallback(async () => {
    try {
      await addToCart(sku, 1);
    } catch (error) {
      console.error('Ошибка добавления в корзину:', error);
      alert('Не удалось добавить товар в корзину');
    }
  }, [addToCart, sku]);

  const handleProductClick = useCallback(() => {
    const slug = attr.sku || product.id || 'unknown';
    router.push(`/product/${slug}`);
  }, [router, attr.sku, product.id]);

  const priceNum = parseFloat(attr.price_byn || attr.price || 0);
  const price = Math.floor(priceNum);
  const priceDecimal = Math.round((priceNum % 1) * 100).toString().padStart(2, '0');

  let imagesList = [];

  if (attr.local_images) {
    try {
      const parsed = typeof attr.local_images === 'string'
        ? JSON.parse(attr.local_images)
        : attr.local_images;
      if (Array.isArray(parsed)) {
        imagesList = parsed.filter(img => img && typeof img === 'string');
      }
    } catch (error) {
      console.error(`Ошибка парсинга изображений товара ${product.id}`);
    }
  }

  const images = imagesList.length > 0
    ? imagesList.map(img => {
      const cleanPath = img.startsWith('/') ? img.slice(1) : img;
      return `${API_BASE_URL}/${cleanPath}`;
    })
    : [PLACEHOLDER_IMAGE];

  const thumbs = images;

  const badges = [];
  if (attr.is_bestseller) badges.push('Хит продаж');
  if (attr.is_popular) badges.push('Хит продаж');

  return (
    <div className="col product-card-inner">
      <div className="product-card" onClick={handleProductClick} style={{ cursor: 'pointer' }}>
        <div onClick={(e) => e.stopPropagation()}>
          <ProductGallery
            images={images}
            thumbs={thumbs}
            galleryId={`product-${product.id}`}
          />
        </div>

        <div className="product-card__info">
          <div className="product-card__header">
            <h3 className="product-card__title">{title}</h3>
            {description && (
              <p className="product-card__description">{description}</p>
            )}
          </div>

          <p className="product-card__price">
            {price}
            <span>.{priceDecimal} р.</span>
          </p>

          {quantity > 0 ? (
            <div style={{ marginBottom: 0 }} onClick={(e) => e.stopPropagation()}>
              <CartCounter sku={sku} className="added-fullwidth" />
            </div>
          ) : (
            <button
              className="shop_button"
              onClick={(e) => { e.stopPropagation(); handleAddToCart(); }}
              type="button"
            >
              <img src="/assets/img/icons/shopping-cart.svg" alt="Добавить в корзину" />
              <p>В корзину</p>
            </button>
          )}
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
          className={`like ${sku && isFavorite(sku) ? 'active' : ''}`}
          onClick={handleLike}
          aria-label={sku && isFavorite(sku) ? 'Удалить из избранного' : 'Добавить в избранное'}
          type="button"
        >
          <svg width="20" height="18" viewBox="0 0 20 18" fill="none">
            {sku && isFavorite(sku) ? (
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