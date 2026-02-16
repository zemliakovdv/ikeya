'use client';

export default function CartItem({
  item,
  isUnavailable = false,
  onQuantityChange,
  onDelete,
  onFavorite,
  onCheckChange,
  loading = false
}) {


  // Данные товара из API
  const product = item.product || {};
  const pricing = item.pricing || {};


  // Изображение товара (приоритет: локальные → внешние)
  const getImageUrl = () => {
    const localImages = product.local_images; // ⬅️ УБРАЛ .images
    const remoteImages = product.images; // ⬅️ УБРАЛ .images

    // Парсим local_images если это строка JSON
    let localImagesList = [];
    if (typeof localImages === 'string') {
      try {
        localImagesList = JSON.parse(localImages);
      } catch (e) {
        console.error('Ошибка парсинга local_images');
      }
    } else if (Array.isArray(localImages)) {
      localImagesList = localImages;
    }

    // ПРИОРИТЕТ 1: Локальные изображения
    if (localImagesList.length > 0 && localImagesList[0]) {
      const img = localImagesList[0];
      // Если путь относительный - добавляем базовый URL
      if (img.startsWith('http')) {
        return img;
      } else {
        const cleanPath = img.startsWith('/') ? img.slice(1) : img;
        return `http://45.135.234.22/${cleanPath}`;
      }
    }

    // ПРИОРИТЕТ 3: Placeholder
    return '/assets/img/no-image.jpg';
  };

  const imageUrl = getImageUrl();


  // Цены
  const oldPrice = parseFloat(pricing.unit_price_old_byn || product.price_byn || 0);
  const newPrice = parseFloat(pricing.unit_price_new_byn || product.price_byn || 0);
  const discount = parseFloat(pricing.unit_discount_byn || 0);
  const hasDiscount = discount > 0 && pricing.promo_applied;

  // Форматирование цены (123.45 → "123" и "45")
  const formatPrice = (price) => {
    const [whole, cents] = price.toFixed(2).split('.');
    return { whole, cents };
  };

  const oldPriceFormatted = formatPrice(oldPrice);
  const newPriceFormatted = formatPrice(newPrice);

  // ФУНКЦИИ ОБРАБОТЧИКОВ (после всех переменных!)
  const handleMinus = () => {
    if (item.quantity > 1) {
      onQuantityChange?.(item.sku, item.quantity - 1);
    }
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
          checked={item.isChecked || false}
          onChange={(e) => onCheckChange?.(item.sku, e.target.checked)}
          disabled={loading}
        />
      </div>

      {/* Изображение */}
      <div className="cart-item__image">
        <img src={imageUrl} alt={product.name || 'Товар'} />
      </div>

      {/* Информация о товаре */}
      <div className="cart-item__info">
        <div className="cart-item__title-row">
          <p className="cart-item__name">{product.name_ru || product.name || 'Без названия'}</p>
        </div>
        <p className="cart-item__desc">Артикул: {item.sku}</p>

        {/* Причина недоступности */}
        {isUnavailable && item.issue_reason && (
          <p className="cart-item__issue" style={{ color: '#B71C1C', fontSize: '14px' }}>
            {item.issue_reason}
          </p>
        )}

        <div className="cart-item__meta">
          <button
            className="cart-item__favorite"
            onClick={() => onFavorite?.(item.sku)}
            disabled={loading}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 20.61C11.34 20.61 10.67 20.4 10.1 19.97C7.66 18.15 2 13.43 2 8.92001C2 5.82001 4.35 3.39001 7.35 3.39001C9.01 3.39001 10.43 4.01001 12 5.45001C13.57 4.01001 14.99 3.39001 16.65 3.39001C19.65 3.39001 22 5.82001 22 8.92001C22 13.42 16.33 18.14 13.9 19.97C13.33 20.39 12.67 20.61 12 20.61ZM7.35 4.79001C5.1 4.79001 3.4 6.57001 3.4 8.92001C3.4 12.9 9.17 17.52 10.94 18.85C11.57 19.32 12.43 19.32 13.06 18.85C14.83 17.53 20.6 12.9 20.6 8.92001C20.6 6.56001 18.9 4.79001 16.65 4.79001C15.59 4.79001 14.36 5.05001 12.49 6.91001C12.22 7.18001 11.78 7.18001 11.5 6.91001C9.64 5.05001 8.4 4.79001 7.34 4.79001H7.35Z" fill="#181818" />
            </svg>
          </button>
          <button
            className="cart-item__delete"
            onClick={() => onDelete?.(item.sku)}
            disabled={loading}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20.37 5.26H16.21L15.77 4.34C15.31 3.4 15.06 2.88 14.56 2.51C14.45 2.43 14.33 2.36 14.21 2.29C13.65 2 13.08 2 12.03 2C10.98 2 10.37 2 9.80999 2.3C9.67999 2.37 9.56999 2.44 9.44999 2.53C8.93999 2.92 8.69999 3.46 8.24999 4.43L7.86999 5.26H3.62999C3.23999 5.26 2.92999 5.57 2.92999 5.96C2.92999 6.35 3.23999 6.66 3.62999 6.66H4.36999L4.88999 15.32C5.03999 17.83 5.11999 19.09 5.82999 20.11C6.17999 20.62 6.62999 21.04 7.15999 21.36C8.21999 22.01 9.47999 22.01 12 22.01C14.52 22.01 15.78 22.01 16.84 21.36C17.37 21.04 17.81 20.62 18.17 20.11C18.88 19.09 18.96 17.83 19.11 15.32L19.65 6.65H20.39C20.78 6.65 21.09 6.34 21.09 5.95C21.09 5.56 20.78 5.25 20.39 5.25L20.37 5.26ZM9.51999 5.01C9.89999 4.18 10.07 3.81 10.29 3.64C10.34 3.6 10.39 3.57 10.45 3.54C10.7 3.41 11.11 3.4 12.02 3.4C12.93 3.4 13.31 3.4 13.55 3.53C13.61 3.56 13.66 3.59 13.71 3.63C13.93 3.79 14.11 4.15 14.5 4.95L14.65 5.26H9.39999L9.50999 5.01H9.51999ZM17.7 15.24C17.56 17.49 17.49 18.62 17.01 19.31C16.77 19.65 16.46 19.95 16.1 20.16C15.38 20.6 14.24 20.6 11.99 20.6C9.73999 20.6 8.59999 20.6 7.87999 20.16C7.51999 19.94 7.20999 19.65 6.96999 19.31C6.47999 18.61 6.41999 17.48 6.27999 15.23L5.75999 6.65H18.23L17.7 15.24Z" fill="#181818" />
              <path d="M9.67 9.91C9.28 9.91 8.97 10.22 8.97 10.61V16.19C8.97 16.58 9.28 16.89 9.67 16.89C10.06 16.89 10.37 16.58 10.37 16.19V10.61C10.37 10.22 10.06 9.91 9.67 9.91Z" fill="#181818" />
              <path d="M14.33 9.91C13.94 9.91 13.63 10.22 13.63 10.61V16.19C13.63 16.58 13.94 16.89 14.33 16.89C14.72 16.89 15.03 16.58 15.03 16.19V10.61C15.03 10.22 14.72 9.91 14.33 9.91Z" fill="#181818" />
            </svg>
          </button>
        </div>
      </div>

      {/* Доступный товар: количество + цена */}
      {!isUnavailable && (
        <>
          <div className="cart-item__qty">
            <button
              className="qty-btn qty-btn--minus"
              onClick={handleMinus}
              disabled={loading || item.quantity <= 1}
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
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21.3 11.3H12.7V2.7C12.7 2.31 12.39 2 12 2C11.61 2 11.3 2.31 11.3 2.7V11.3H2.7C2.31 11.3 2 11.61 2 12C2 12.39 2.31 12.7 2.7 12.7H11.3V21.3C11.3 21.69 11.61 22 12 22C12.39 22 12.7 21.69 12.7 21.3V12.7H21.3C21.69 12.7 22 12.39 22 12C22 11.61 21.69 11.3 21.3 11.3Z" fill="#757575" />
              </svg>
            </button>
          </div>

          <div className="cart-item__price no_promokod">
            {hasDiscount && (
              <>
                <span className="price-promo">
                  {newPriceFormatted.whole}<span className="price-currency">.{newPriceFormatted.cents} р.</span>
                </span>
                <span className="price-main">
                  {oldPriceFormatted.whole}<span className="price-currency">.{oldPriceFormatted.cents} р.</span>
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
            )}
            {!hasDiscount && (
              <span className="price-main">
                {newPriceFormatted.whole}<span className="price-currency">.{newPriceFormatted.cents} р.</span>
              </span>
            )}
          </div>
        </>
      )}

      {/* Недоступный товар: статус + кнопка "Похожие" */}
      {isUnavailable && (
        <>
          <div className="cart-item__status">
            <span className="badge badge--dark">Нет в наличии</span>
          </div>
          <div className="cart-item__actions">
            <button className="btn btn--ghost-small">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.225 4.61666C16.6083 3.59166 15.45 3.29166 13.15 2.69166L11.625 2.29999C9.32495 1.69999 8.16662 1.39999 7.10828 1.99166C6.39995 2.39166 6.01662 3.08332 5.69162 4.03332C4.59995 4.09999 3.85828 4.28332 3.29995 4.84999C2.44995 5.69999 2.44995 6.95832 2.44995 9.23332V13.1083C2.44995 15.3833 2.44995 16.6417 3.29995 17.4917C4.14995 18.3417 5.40828 18.3417 7.68328 18.3417H9.23328C11.5083 18.3417 12.7583 18.3417 13.6166 17.4917C14.0583 17.05 14.2666 16.5083 14.3666 15.7667C15.2249 15.125 15.55 13.9667 16.0999 11.9833L16.9166 9.03332C17.5166 6.85832 17.85 5.66666 17.2333 4.62499L17.225 4.61666ZM13.2916 13.1C13.2916 15.1333 13.2916 16.15 12.7833 16.6583C12.275 17.1667 11.25 17.1667 9.22495 17.1667H7.67495C5.64995 17.1667 4.62495 17.1667 4.11662 16.6583C3.60828 16.15 3.60828 15.1333 3.60828 13.1V9.22499C3.60828 7.19999 3.60828 6.17499 4.11662 5.66666C4.62495 5.15832 5.64995 5.15832 7.67495 5.15832H9.22495C11.25 5.15832 12.275 5.15832 12.7833 5.66666C13.2916 6.17499 13.2916 7.19999 13.2916 9.22499V13.1ZM15.7833 8.70832L14.9666 11.6667C14.7666 12.3917 14.6 12.9667 14.45 13.4167C14.45 13.3083 14.45 13.2083 14.45 13.0917V9.21666C14.45 6.94166 14.45 5.69166 13.5999 4.83332C12.75 3.98332 11.4916 3.98332 9.21662 3.98332H7.66662C7.40828 3.98332 7.16662 3.98332 6.92495 3.98332C7.14995 3.44166 7.36662 3.14999 7.66662 2.98332C8.31662 2.61666 9.31662 2.88332 11.325 3.39999L12.85 3.79166C14.85 4.30832 15.8499 4.56666 16.2249 5.19166C16.575 5.77499 16.3583 6.63332 15.7916 8.69166L15.7833 8.70832Z" fill="#181818" />
              </svg>
              Похожие
            </button>
          </div>
        </>
      )}
    </div>
  );
}
