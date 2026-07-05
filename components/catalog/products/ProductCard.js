'use client';

import { useCallback, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { IMAGES_BASE_URL } from '@/lib/api/ikea';
import { useCart } from '@/contexts/CartContext';
import { useFavorites } from '@/contexts/FavoritesContext';
import CartCounter from '@/components/cart/CartCounter';
import ProductBadge from './ProductBadge';

const PLACEHOLDER_IMAGE = '/assets/img/no-image.jpg';
const MAX_VISIBLE_VARIANTS = 3;

function resolveImage(path) {
  if (!path) return PLACEHOLDER_IMAGE;

  if (path.startsWith('/assets')) {
    return path;
  }

  if (path.startsWith('http')) {
    return path.replace(/^https?:\/\/[^/]+/, IMAGES_BASE_URL);
  }

  return `${IMAGES_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}

function resolveVariantImage(images) {
  if (!Array.isArray(images) || !images.length) return PLACEHOLDER_IMAGE;

  const local = images.find((img) => img && !img.startsWith('http'));
  return local ? resolveImage(local) : PLACEHOLDER_IMAGE;
}

function parsePrice(value) {
  if (value === null || value === undefined || value === '') return 0;

  const normalized = String(value)
    .replace(/\s/g, '')
    .replace(',', '.');

  const parsed = Number.parseFloat(normalized);

  return Number.isFinite(parsed) ? parsed : 0;
}

function formatPrice(priceNum) {
  const safePrice = Number.isFinite(priceNum) ? priceNum : 0;
  const floor = Math.floor(safePrice).toLocaleString('ru-RU');
  const decimal = Math.round((safePrice % 1) * 100).toString().padStart(2, '0');

  return { floor, decimal };
}

function buildProductUrl(slug, sku) {
  if (slug && sku) return `/product/${slug}-${sku}`;
  if (sku) return `/product/${sku}`;

  return '#';
}

export default function ProductCard({ product, priority = false }) {
  const router = useRouter();
  const { addToCart, items } = useCart();
  const { isFavorite, add, remove } = useFavorites();

  const [isHovered, setIsHovered] = useState(false);
  const [activeVariant, setActiveVariant] = useState(null);

  const attr = product?.attributes || {};
  const productId = product?.id;

  const baseSku = Array.isArray(attr.sku)
    ? attr.sku[0]
    : (attr.sku || productId);

  const currentSku = activeVariant?.sku || baseSku;
  const currentSlug = activeVariant?.slug || attr.slug;
  const productUrl = buildProductUrl(currentSlug, currentSku);

  const productTitle = activeVariant?.name_ru || attr.name_ru || 'Товар IKEA';
  const productSubtitle = activeVariant?.small_desc_name || attr.small_desc_name || '';

  const currentPriceNum = parsePrice(attr.price_byn || attr.price);
  const { floor: price, decimal: priceDecimal } = formatPrice(currentPriceNum);

  const baseImages = useMemo(() => {
    if (!Array.isArray(attr.local_images) || !attr.local_images.length) {
      return [PLACEHOLDER_IMAGE];
    }

    return attr.local_images.map(resolveImage).filter(Boolean);
  }, [attr.local_images]);

  const variantImages = useMemo(() => {
    if (!Array.isArray(activeVariant?.images) || !activeVariant.images.length) {
      return null;
    }

    return activeVariant.images.map(resolveImage).filter(Boolean);
  }, [activeVariant]);

  const images = variantImages?.length ? variantImages : baseImages;
  const mainImage = images[0] || PLACEHOLDER_IMAGE;
  const hoverImage = images[1] || mainImage;

  const colorVariants = useMemo(() => {
    const variantsArr = Array.isArray(attr.variants) ? attr.variants : [];
    const colorGroup = variantsArr.find((group) => group.type === 'color');

    return (colorGroup?.data || []).filter((variant) => variant?.item?.sku);
  }, [attr.variants]);

  const hasVariants = colorVariants.length > 0;
  const visibleVariants = colorVariants.slice(0, MAX_VISIBLE_VARIANTS);
  const hiddenCount = colorVariants.length - MAX_VISIBLE_VARIANTS;

  const quantity = useMemo(() => {
    const found = (items || []).find((item) => item?.sku === currentSku);
    return Number(found?.quantity || 0);
  }, [items, currentSku]);

  const badges = useMemo(() => {
    const result = [];

    if (attr.is_bestseller || attr.is_popular) result.push('Хит продаж');
    if (attr.is_new) result.push('Новинка');

    return result;
  }, [attr.is_bestseller, attr.is_popular, attr.is_new]);

  const isCurrentFavorite = baseSku ? isFavorite(baseSku) : false;

  const handleLike = useCallback(async (e) => {
    e.stopPropagation();

    if (!baseSku) return;

    try {
      if (isFavorite(baseSku)) {
        await remove(baseSku);
      } else {
        await add(baseSku);
      }
    } catch (err) {
      console.error('Ошибка избранного:', err);
    }
  }, [baseSku, isFavorite, add, remove]);

  const handleAddToCart = useCallback(async (e) => {
    e.stopPropagation();

    if (!currentSku) return;

    try {
      await addToCart(currentSku, 1);
    } catch (error) {
      console.error('Ошибка добавления в корзину:', error);
      alert('Не удалось добавить товар в корзину');
    }
  }, [addToCart, currentSku]);

  const handleCardClick = useCallback(() => {
    if (productUrl === '#') return;

    router.push(productUrl);
  }, [router, productUrl]);

  const handleVariantClick = useCallback((e, variant) => {
    e.stopPropagation();

    if (!variant?.item) return;

    setActiveVariant(variant.item);
  }, []);

  if (!productId && !baseSku) return null;

  return (
    <div className="col product-card-inner">
      <div
        className="product-card"
        onClick={handleCardClick}
        style={{ cursor: productUrl === '#' ? 'default' : 'pointer' }}
      >
        <div
          className="product-card__img-wrap"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          style={{ position: 'relative', overflow: 'hidden' }}
        >
          <img
            src={mainImage}
            alt={productTitle}
            className="product-card__img product-card__img--main"
            width="262"
            height="262"
            loading={priority ? 'eager' : 'lazy'}
            onError={(e) => {
              e.currentTarget.src = PLACEHOLDER_IMAGE;
            }}
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
              width="262"
              height="262"
              loading="lazy"
              onError={(e) => {
                e.currentTarget.src = PLACEHOLDER_IMAGE;
              }}
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
          <div className="product-card__variants" onClick={(e) => e.stopPropagation()}>
            {hasVariants && visibleVariants.map((variant) => {
              const variantSku = variant.item.sku;
              const variantImg = resolveVariantImage(variant.item.images);
              const isActive = activeVariant
                ? variantSku === activeVariant?.sku
                : variantSku === baseSku;

              return (
                <button
                  key={variantSku}
                  className={`product-card__variant-btn${isActive ? ' active' : ''}`}
                  title={variant.color}
                  onClick={(e) => handleVariantClick(e, variant)}
                  type="button"
                >
                  <img
                    src={variantImg}
                    alt={variant.color || ''}
                    width="34"
                    height="34"
                    onError={(e) => {
                      e.currentTarget.src = PLACEHOLDER_IMAGE;
                    }}
                  />
                </button>
              );
            })}

            {hasVariants && hiddenCount > 0 && (
              <button
                className="product-card__variant-btn product-card__variant-more"
                onClick={(e) => {
                  e.stopPropagation();
                  router.push(buildProductUrl(attr.slug, baseSku));
                }}
                type="button"
              >
                +{hiddenCount}
              </button>
            )}
          </div>

          <div className="product-card__header">
            <h3 className="product-card__title">{productTitle}</h3>

            {productSubtitle && (
              <p className="product-card__description">{productSubtitle}</p>
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
              disabled={!currentSku}
              aria-disabled={!currentSku}
            >
              <img src="/assets/img/icons/shopping-cart.svg" alt="" aria-hidden="true" />
              <p>В корзину</p>
            </button>
          )}
        </div>

        {badges.length > 0 && (
          <>
            {badges.map((label) => (
              <ProductBadge key={label} label={label} />
            ))}
          </>
        )}

        <button
          className={`like ${isCurrentFavorite ? 'active' : ''}`}
          onClick={handleLike}
          aria-label={isCurrentFavorite ? 'Удалить из избранного' : 'Добавить в избранное'}
          type="button"
        >
          <svg width="20" height="18" viewBox="0 0 20 18" fill="none">
            {isCurrentFavorite ? (
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
