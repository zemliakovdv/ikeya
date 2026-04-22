'use client';

import { useCallback, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/contexts/CartContext';
import { useFavorites } from '@/contexts/FavoritesContext';
import CartCounter from '@/components/cart/CartCounter';
import ProductBadge from './ProductBadge';

const API_BASE_URL = 'https://test.ikeya.by';
const PLACEHOLDER_IMAGE = '/assets/img/no-image.jpg';
const MAX_VISIBLE_VARIANTS = 3;

function resolveImage(path) {
  if (!path) return PLACEHOLDER_IMAGE;
  if (path.startsWith('http')) return path;
  const clean = path.startsWith('/') ? path.slice(1) : path;
  return `${API_BASE_URL}/${clean}`;
}

// Для миниатюр вариантов берём первую локальную картинку.
// Бэк всегда кладёт ikea.com ссылку первой, локальные — следом.
function resolveVariantImage(images) {
  if (!images?.length) return PLACEHOLDER_IMAGE;
  const local = images.find(img => !img.startsWith('http'));
  return local ? resolveImage(local) : PLACEHOLDER_IMAGE;
}

function formatPrice(priceNum) {
  const floor = Math.floor(priceNum).toLocaleString('ru-RU');
  const decimal = Math.round((priceNum % 1) * 100).toString().padStart(2, '0');
  return { floor, decimal };
}

export default function ProductCard({ product, priority = false }) {
  const router = useRouter();
  const { addToCart, items } = useCart();
  const { isFavorite, add, remove } = useFavorites();

  const [isHovered, setIsHovered] = useState(false);
  const [activeVariant, setActiveVariant] = useState(null);

  if (!product || !product.attributes) return null;

  const attr = product.attributes;
  const sku = attr.sku || product.id;

  // Заголовок и описание — из варианта или из основного товара
  const title = activeVariant?.small_desc_name || attr.small_desc_name || 'Товар IKEA';
  const description = activeVariant?.name_ru || attr.name_ru || '';

  // Цена — всегда от основного товара, не меняем при смене варианта
  // price_byn в вариантах и attr.price_byn расходятся на бэке — цену показываем только со страницы товара
  const currentPriceNum = parseFloat(
    String(attr.price_byn || attr.price || 0).replace(/\s/g, '')
  );
  const { floor: price, decimal: priceDecimal } = formatPrice(currentPriceNum);

  // Изображения — из варианта (если выбран) или из основного товара
  const baseImages = Array.isArray(attr.local_images) && attr.local_images.length
    ? attr.local_images.map(resolveImage)
    : [PLACEHOLDER_IMAGE];

  const variantImages = activeVariant?.images?.length
    ? activeVariant.images.map(resolveImage)
    : null;

  const images = variantImages || baseImages;
  const mainImage = images[0];
  const hoverImage = images[1] || images[0];

  // Варианты — бэк отдаёт массив [{ type, data }, ...]
  // Берём только color-варианты для отображения миниатюр на карточке
  const colorVariants = useMemo(() => {
    const variantsArr = Array.isArray(attr.variants) ? attr.variants : [];
    const colorGroup = variantsArr.find(g => g.type === 'color');
    return (colorGroup?.data || []).filter(v => v.item?.sku);
  }, [attr.variants]);

  const hasVariants = colorVariants.length > 0;
  // +1 для кнопки сброса (возврат к основному товару)
  const visibleVariants = colorVariants.slice(0, MAX_VISIBLE_VARIANTS);
  const hiddenCount = colorVariants.length - MAX_VISIBLE_VARIANTS;

  const currentSku = activeVariant?.sku || sku;

  const quantity = useMemo(() => {
    const found = (items || []).find((it) => it?.sku === currentSku);
    return Number(found?.quantity || 0);
  }, [items, currentSku]);

  const handleLike = useCallback(async (e) => {
    e.stopPropagation();
    if (!sku) return;
    try {
      if (isFavorite(sku)) await remove(sku);
      else await add(sku);
    } catch (err) {
      console.error('Ошибка избранного:', err);
    }
  }, [sku, isFavorite, add, remove]);

  const handleAddToCart = useCallback(async (e) => {
    e.stopPropagation();
    try {
      await addToCart(currentSku, 1);
    } catch (error) {
      console.error('Ошибка добавления в корзину:', error);
      alert('Не удалось добавить товар в корзину');
    }
  }, [addToCart, currentSku]);

  const handleCardClick = useCallback(() => {
    router.push(`/product/${currentSku}`);
  }, [router, currentSku]);

  const handleVariantClick = useCallback((e, variant) => {
    e.stopPropagation();
    setActiveVariant(variant.item);
  }, []);

  const badges = [];
  if (attr.is_bestseller || attr.is_popular) badges.push('Хит продаж');
  if (attr.is_new) badges.push('Новинка');

  return (
    <div className="col product-card-inner">
      <div
        className="product-card"
        onClick={handleCardClick}
        style={{ cursor: 'pointer' }}
      >
        {/* Hover только на блоке с изображением */}
        <div
          className="product-card__img-wrap"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          style={{ position: 'relative', overflow: 'hidden' }}
        >
          <img
            src={mainImage}
            alt={title}
            className="product-card__img product-card__img--main"
            loading={priority ? 'eager' : 'lazy'}
            style={{
              width: '100%',
              height: 'auto',
              display: 'block',
              opacity: isHovered && hoverImage !== mainImage ? 0 : 1,
              transition: 'opacity 0.3s ease',
              position: 'relative',
              zIndex: 1,
            }}
          />
          {hoverImage !== mainImage && (
            <img
              src={hoverImage}
              alt=""
              aria-hidden="true"
              className="product-card__img product-card__img--hover"
              loading="lazy"
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

          {/* Цветовые варианты */}
          <div className="product-card__variants" onClick={(e) => e.stopPropagation()}>
            {hasVariants && visibleVariants.map((variant) => {
              const variantImg = resolveVariantImage(variant.item.images);
              // Активен: либо выбран явно, либо это вариант текущего основного товара
              const isActive = activeVariant
                ? variant.item.sku === activeVariant?.sku
                : variant.item.sku === sku;
              return (
                <button
                  key={variant.item.sku}
                  className={`product-card__variant-btn${isActive ? ' active' : ''}`}
                  title={variant.color}
                  onClick={(e) => handleVariantClick(e, variant)}
                  type="button"
                >
                  <img src={variantImg} alt={variant.color} />
                </button>
              );
            })}
            {hasVariants && hiddenCount > 0 && (
              <button
                className="product-card__variant-btn product-card__variant-more"
                onClick={(e) => { e.stopPropagation(); router.push(`/product/${sku}`); }}
                type="button"
              >
                +{hiddenCount}
              </button>
            )}
          </div>

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
            <div onClick={(e) => e.stopPropagation()}>
              <CartCounter sku={currentSku} className="added-fullwidth" />
            </div>
          ) : (
            <button
              className="shop_button"
              onClick={handleAddToCart}
              type="button"
            >
              <img src="/assets/img/icons/shopping-cart.svg" alt="" aria-hidden="true" />
              <p>В корзину</p>
            </button>
          )}
        </div>

        {badges.length > 0 && (
          <>
            <ProductBadge label={badges[0]} />
            {badges[1] && <ProductBadge label={badges[1]} variant="pink" />}
          </>
        )}

        <button
          className={`like ${sku && isFavorite(sku) ? 'active' : ''}`}
          onClick={handleLike}
          aria-label={isFavorite(sku) ? 'Удалить из избранного' : 'Добавить в избранное'}
          type="button"
        >
          <svg width="20" height="18" viewBox="0 0 20 18" fill="none">
            {isFavorite(sku) ? (
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