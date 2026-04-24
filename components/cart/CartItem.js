'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useFavorites } from '@/contexts/FavoritesContext';

export default function CartItem({
  item,
  checked = false,
  isUnavailable = false,
  onQuantityChange,
  onDelete,
  onFavorite,
  onCheckChange,
  loading = false,
}) {
  const product = item.product || {};
  const router = useRouter();
  const pricing = item.pricing || {};
  const { isFavorite, add, remove } = useFavorites();

  const isLiked = isFavorite(item.sku);

  const handleFavorite = async () => {
    try {
      if (isLiked) await remove(item.sku);
      else await add(item.sku);
    } catch (err) {
      console.error('Ошибка избранного:', err);
    }
  };

  // Изображение — images.local_images приходит как JSON-строка
  const getImageUrl = () => {
    const rawImages = product.local_images || product.images?.local_images;
    let list = [];
    if (typeof rawImages === 'string') {
      try { list = JSON.parse(rawImages); } catch { }
    } else if (Array.isArray(rawImages)) {
      list = rawImages;
    }
    if (list.length > 0 && list[0]) {
      const img = list[0];
      if (img.startsWith('http')) return img;
      return `https://test.ikeya.by/${img.startsWith('/') ? img.slice(1) : img}`;
    }
    return '/assets/img/no-image.jpg';
  };

  const imageUrl = getImageUrl();

  const productUrl = `/product/${item.sku}`;

  // Цены — если pricing нули (бэк не посчитал), берём product.price_byn
  const productPrice = parseFloat(String(product.price_byn || 0).replace(/\s/g, ''));
  const pricingNew = parseFloat(String(pricing.unit_price_new_byn || 0).replace(/\s/g, ''));
  const pricingOld = parseFloat(String(pricing.unit_price_old_byn || 0).replace(/\s/g, ''));
  const newPrice = pricingNew > 0 ? pricingNew : productPrice;
  const oldPrice = pricingOld > 0 ? pricingOld : productPrice;
  const discount = parseFloat(pricing.unit_discount_byn || 0);
  const hasDiscount = discount > 0 && pricing.promo_applied;

  const formatPrice = (price) => {
    const [whole, cents] = price.toFixed(2).split('.');
    return { whole: Number(whole).toLocaleString('ru-RU'), cents };
  };

  const oldPriceFormatted = formatPrice(oldPrice * (item.quantity || 1));
  const newPriceFormatted = formatPrice(newPrice * (item.quantity || 1));

  const handleMinus = () => {
    if (item.quantity > 1) onQuantityChange?.(item.sku, item.quantity - 1);
  };

  const handlePlus = () => {
    onQuantityChange?.(item.sku, item.quantity + 1);
  };

  return (
    <div className={`cart-item ${isUnavailable ? 'cart-item--unavailable' : 'available'}`}>
      {/* Чекбокс */}
      <div className="cart-item__select">
        <input
          type="checkbox"
          className="cart-item__checkbox"
          checked={checked}
          onChange={(e) => onCheckChange?.(item.sku, e.target.checked)}
          disabled={loading || isUnavailable}
        />
      </div>

      {/* Изображение */}
      <div className="cart-item__image">
        <Link href={productUrl}>
          <img src={imageUrl} alt={product.small_desc_name || product.name || 'Товар'} />
        </Link>
      </div>

      {/* Информация о товаре */}
      <div className="cart-item__info">
        <div className="cart-item__title-row">
          <Link href={productUrl} className="cart-item__name">
            {product.name_ru}
          </Link>
          {product.name_ru && (
            <p className="cart-item__desc">{product.small_desc_name || product.name || 'Без названия'}</p>
          )}
        </div>

        {isUnavailable && item.issue_reason && (
          <p className="cart-item__issue" style={{ color: '#B71C1C', fontSize: '14px' }}>
            {item.issue_reason}
          </p>
        )}

        <div className="cart-item__meta">
          <button
            className="cart-item__favorite"
            onClick={handleFavorite}
            disabled={loading}
            type="button"
          >
            {isLiked ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 20.61C11.34 20.61 10.67 20.4 10.1 19.97C7.66 18.15 2 13.43 2 8.92001C2 5.82001 4.35 3.39001 7.35 3.39001C9.01 3.39001 10.43 4.01001 12 5.45001C13.57 4.01001 14.99 3.39001 16.65 3.39001C19.65 3.39001 22 5.82001 22 8.92001C22 13.42 16.33 18.14 13.9 19.97C13.33 20.39 12.67 20.61 12 20.61Z" fill="#ce0061" />
              </svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 20.61C11.34 20.61 10.67 20.4 10.1 19.97C7.66 18.15 2 13.43 2 8.92001C2 5.82001 4.35 3.39001 7.35 3.39001C9.01 3.39001 10.43 4.01001 12 5.45001C13.57 4.01001 14.99 3.39001 16.65 3.39001C19.65 3.39001 22 5.82001 22 8.92001C22 13.42 16.33 18.14 13.9 19.97C13.33 20.39 12.67 20.61 12 20.61ZM7.35 4.79001C5.1 4.79001 3.4 6.57001 3.4 8.92001C3.4 12.9 9.17 17.52 10.94 18.85C11.57 19.32 12.43 19.32 13.06 18.85C14.83 17.53 20.6 12.9 20.6 8.92001C20.6 6.56001 18.9 4.79001 16.65 4.79001C15.59 4.79001 14.36 5.05001 12.49 6.91001C12.22 7.18001 11.78 7.18001 11.5 6.91001C9.64 5.05001 8.4 4.79001 7.34 4.79001H7.35Z" fill="#181818" />
              </svg>
            )}
          </button>

          <button
            className="cart-item__delete"
            onClick={() => onDelete?.(item.sku)}
            disabled={loading}
            type="button"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20.37 5.26H16.21L15.77 4.34C15.31 3.4 15.06 2.88 14.56 2.51C14.45 2.43 14.33 2.36 14.21 2.29C13.65 2 13.08 2 12.03 2C10.98 2 10.37 2 9.80999 2.3C9.67999 2.37 9.56999 2.44 9.44999 2.53C8.93999 2.92 8.69999 3.46 8.24999 4.43L7.86999 5.26H3.62999C3.23999 5.26 2.92999 5.57 2.92999 5.96C2.92999 6.35 3.23999 6.66 3.62999 6.66H4.36999L4.88999 15.32C5.03999 17.83 5.11999 19.09 5.82999 20.11C6.17999 20.62 6.62999 21.04 7.15999 21.36C8.21999 22.01 9.47999 22.01 12 22.01C14.52 22.01 15.78 22.01 16.84 21.36C17.37 21.04 17.81 20.62 18.17 20.11C18.88 19.09 18.96 17.83 19.11 15.32L19.65 6.65H20.39C20.78 6.65 21.09 6.34 21.09 5.95C21.09 5.56 20.78 5.25 20.39 5.25L20.37 5.26ZM9.51999 5.01C9.89999 4.18 10.07 3.81 10.29 3.64C10.34 3.6 10.39 3.57 10.45 3.54C10.7 3.41 11.11 3.4 12.02 3.4C12.93 3.4 13.31 3.4 13.55 3.53C13.61 3.56 13.66 3.59 13.71 3.63C13.93 3.79 14.11 4.15 14.5 4.95L14.65 5.26H9.39999L9.50999 5.01H9.51999ZM17.7 15.24C17.56 17.49 17.49 18.62 17.01 19.31C16.77 19.65 16.46 19.95 16.1 20.16C15.38 20.6 14.24 20.6 11.99 20.6C9.73999 20.6 8.59999 20.6 7.87999 20.16C7.51999 19.94 7.20999 19.65 6.96999 19.31C6.47999 18.61 6.41999 17.48 6.27999 15.23L5.75999 6.65H18.23L17.7 15.24Z" fill="#181818" />
              <path d="M9.67 9.91C9.28 9.91 8.97 10.22 8.97 10.61V16.19C8.97 16.58 9.28 16.89 9.67 16.89C10.06 16.89 10.37 16.58 10.37 16.19V10.61C10.37 10.22 10.06 9.91 9.67 9.91Z" fill="#181818" />
              <path d="M14.33 9.91C13.94 9.91 13.63 10.22 13.63 10.61V16.19C13.63 16.58 13.94 16.89 14.33 16.89C14.72 16.89 15.03 16.58 15.03 16.19V10.61C15.03 10.22 14.72 9.91 14.33 9.91Z" fill="#181818" />
            </svg>
          </button>
        </div>
      </div>

      {!isUnavailable && (
        <>
          <div className="cart-item__qty">
            <button
              className="qty-btn qty-btn--minus"
              onClick={handleMinus}
              disabled={loading || item.quantity <= 1}
              type="button"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21.3 12.7H2.7C2.31 12.7 2 12.39 2 12C2 11.61 2.31 11.3 2.7 11.3H21.3C21.69 11.3 22 11.61 22 12C22 12.39 21.69 12.7 21.3 12.7Z" fill="#BDBDBD" />
              </svg>
            </button>

            <span className="qty-value">{item.quantity}</span>

            <button
              className="qty-btn qty-btn--plus"
              onClick={handlePlus}
              disabled={loading}
              type="button"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21.3 11.3H12.7V2.7C12.7 2.31 12.39 2 12 2C11.61 2 11.3 2.31 11.3 2.7V11.3H2.7C2.31 11.3 2 11.61 2 12C2 12.39 2.31 12.7 2.7 12.7H11.3V21.3C11.3 21.69 11.61 22 12 22C12.39 22 12.7 21.69 12.7 21.3V12.7H21.3C21.69 12.7 22 12.39 22 12C22 11.61 21.69 11.3 21.3 11.3Z" fill="#757575" />
              </svg>
            </button>
          </div>

          <div className={`cart-item__price ${hasDiscount ? 'is_promocod' : 'no_promokod'}`}>
            {hasDiscount ? (
              <>
                <span className="price-promo">
                  {newPriceFormatted.whole}
                  <span className="price-currency">.{newPriceFormatted.cents} р.</span>
                </span>
                <span className="price-main">
                  {oldPriceFormatted.whole}
                  <span className="price-currency">.{oldPriceFormatted.cents} р.</span>
                </span>
                <span className="promo-size">
                  Скидка <span className="promo-size__calc">{discount.toFixed(2)}</span> р.
                </span>
                <div className="promo-badge">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5.92591 13.3287C5.39925 13.3287 4.87258 13.1553 4.43258 12.8153C2.94591 11.662 1.66591 10.382 0.512579 8.89533C-0.200755 7.96867 -0.167421 6.67533 0.599245 5.822C2.29925 3.922 4.07925 2.182 6.03258 0.501999C6.29924 0.268665 6.62591 0.135332 6.97258 0.101999C8.63925 -0.0513346 11.5792 -0.164668 12.5326 0.795332C13.4926 1.75533 13.3792 4.69533 13.2259 6.35533C13.1926 6.702 13.0526 7.022 12.8259 7.29533C11.1459 9.24867 9.40591 11.0287 7.50591 12.7287C7.05925 13.1287 6.49925 13.3287 5.92591 13.3287ZM1.29258 6.442C0.825912 6.962 0.805912 7.75533 1.24591 8.32867C2.34591 9.74867 3.57258 10.982 4.99925 12.082C5.57258 12.522 6.35924 12.5087 6.88591 12.0353C8.75924 10.362 10.4659 8.60867 12.1259 6.68867C12.2326 6.56867 12.2926 6.422 12.3059 6.26867C12.5326 3.822 12.3659 1.92867 11.8792 1.44867C11.3992 0.968665 9.50591 0.801999 7.05925 1.022C6.90591 1.03533 6.75924 1.09533 6.63925 1.202C4.71258 2.85533 2.95925 4.56867 1.29258 6.442Z" fill="#00910A" />
                  </svg>
                  <p>по промокоду {pricing.promo_code}</p>
                </div>
              </>
            ) : (
              <span className="price-main">
                {newPriceFormatted.whole}
                <span className="price-currency">.{newPriceFormatted.cents} р.</span>
              </span>
            )}
          </div>

        </>
      )}

      {isUnavailable && (
        <>
          <div className="cart-item__status">
            <span className="badge badge--dark">Нет в наличии</span>
          </div>
          <div className="cart-item__actions">
            <button
              className="btn btn--ghost-small"
              type="button"
              onClick={() => router.push(`/catalog/${product.category_id}`)}
              disabled={!product.category_id}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.225 4.61659C16.6083 3.59159 15.45 3.29159 13.15 2.69159L11.625 2.29993C9.32495 1.69993 8.16662 1.39993 7.10828 1.99159C6.39995 2.39159 6.01662 3.08326 5.69162 4.03326C4.59995 4.09993 3.85828 4.28326 3.29995 4.84993C2.44995 5.69993 2.44995 6.95826 2.44995 9.23326V13.1083C2.44995 15.3833 2.44995 16.6416 3.29995 17.4916C4.14995 18.3416 5.40828 18.3416 7.68328 18.3416H9.23328C11.5083 18.3416 12.7583 18.3416 13.6166 17.4916C14.0583 17.0499 14.2666 16.5083 14.3666 15.7666C15.2249 15.1249 15.55 13.9666 16.0999 11.9833L16.9166 9.03326C17.5166 6.85826 17.85 5.66659 17.2333 4.62493L17.225 4.61659ZM13.2916 13.0999C13.2916 15.1333 13.2916 16.1499 12.7833 16.6583C12.275 17.1666 11.25 17.1666 9.22495 17.1666H7.67495C5.64995 17.1666 4.62495 17.1666 4.11662 16.6583C3.60828 16.1499 3.60828 15.1333 3.60828 13.0999V9.22493C3.60828 7.19993 3.60828 6.17493 4.11662 5.66659C4.62495 5.15826 5.64995 5.15826 7.67495 5.15826H9.22495C11.25 5.15826 12.275 5.15826 12.7833 5.66659C13.2916 6.17493 13.2916 7.19993 13.2916 9.22493V13.0999ZM15.7833 8.70826L14.9666 11.6666C14.7666 12.3916 14.6 12.9666 14.45 13.4166C14.45 13.3083 14.45 13.2083 14.45 13.0916V9.2166C14.45 6.9416 14.45 5.6916 13.5999 4.83326C12.75 3.98326 11.4916 3.98326 9.21662 3.98326H7.66662C7.40828 3.98326 7.16662 3.98326 6.92495 3.98326C7.14995 3.44159 7.36662 3.14993 7.66662 2.98326C8.31662 2.61659 9.31662 2.88326 11.325 3.39993L12.85 3.79159C14.85 4.30826 15.8499 4.56659 16.2249 5.19159C16.575 5.77493 16.3583 6.63326 15.7916 8.6916L15.7833 8.70826Z" fill="#181818" />
              </svg>
              Похожие
            </button>
          </div>
        </>
      )}
    </div>
  );
}