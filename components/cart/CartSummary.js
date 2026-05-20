'use client';

import { useMemo, useState } from 'react';
import { useCart } from '@/contexts/CartContext';

function toNumber(value, fallback = 0) {
  const normalized = String(value ?? '')
    .replace(/\s/g, '')
    .replace(',', '.');

  const num = Number.parseFloat(normalized);
  return Number.isFinite(num) ? num : fallback;
}

function formatMoney(value) {
  const amount = toNumber(value, 0);
  const whole = Math.floor(amount).toLocaleString('ru-RU');
  const cents = (amount % 1).toFixed(2).split('.')[1];

  return (
    <>
      {whole}
      <span>.{cents} р.</span>
    </>
  );
}

function formatMoneyPlain(value) {
  return `${toNumber(value).toFixed(2)} р.`;
}

function formatWeight(value) {
  const weight = toNumber(value, 0);

  if (weight <= 0) return '';

  const rounded = Number(weight.toFixed(2));

  return rounded.toLocaleString('ru-RU', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
}

function getItemWord(count) {
  const absCount = Math.abs(Number(count || 0));
  const lastTwo = absCount % 100;
  const lastOne = absCount % 10;

  if (lastTwo >= 11 && lastTwo <= 14) return 'товаров';
  if (lastOne === 1) return 'товар';
  if (lastOne >= 2 && lastOne <= 4) return 'товара';

  return 'товаров';
}

export default function CartSummary({
  subtotal = 0,
  promoDiscount = 0,
  delivery = 0,

  // Checkout-специфичные доставки
  pvzDelivery = 0,
  showPvzDelivery = false,
  courierDelivery = 0,
  showCourierDelivery = false,

  itemCount = 0,
  totalWeight = 0,
  canCheckout = true,
  onCheckout,
  checkoutButtonText = 'Перейти к оформлению',
  cart,
  customsDuty = 0,
  checkoutLoading = false,
}) {
  const { applyPromo, removePromo, loading } = useCart();

  const [promoCode, setPromoCode] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('error');

  const appliedPromo = useMemo(() => {
    const items = cart?.items || [];
    const found = items.find((it) => it?.pricing?.promo_applied && it?.pricing?.promo_code);

    return found?.pricing?.promo_code || null;
  }, [cart]);

  const hasPromo = appliedPromo !== null;

  const displayTotal =
    toNumber(subtotal) -
    toNumber(promoDiscount) +
    toNumber(delivery) +
    toNumber(pvzDelivery) +
    toNumber(courierDelivery);

  const isCheckoutDisabled = !canCheckout || checkoutLoading || loading;

  const show = (type, msg) => {
    setToastType(type);
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handlePromoSubmit = async (event) => {
    event.preventDefault();

    const code = promoCode.trim();

    if (!code) {
      show('error', 'Введите промокод');
      return;
    }

    try {
      await applyPromo(code);
      setPromoCode('');
      show('success', 'Промокод успешно применён');
    } catch {
      show('error', 'Невозможно применить данный промокод');
    }
  };

  const handlePromoRemove = async (event) => {
    event.preventDefault();

    try {
      await removePromo();
      show('success', 'Промокод удалён');
    } catch {
      show('error', 'Ошибка удаления промокода');
    }
  };

  return (
    <aside className="cart-summary">
      <div
        className={`toast promokod-toast ${showToast ? 'show' : ''}`}
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
      >
        <div className="d-flex">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d={
                toastType === 'success'
                  ? 'M12 2C6.49 2 2 6.49 2 12C2 17.51 6.49 22 12 22C17.51 22 22 17.51 22 12C22 6.49 17.51 2 12 2ZM10.5 16.5L6.5 12.5L7.91 11.09L10.5 13.67L16.09 8.08L17.5 9.5L10.5 16.5Z'
                  : 'M12 2C6.49 2 2 6.49 2 12C2 17.51 6.49 22 12 22C17.51 22 22 17.51 22 12C22 6.49 17.51 2 12 2ZM11.3 8.28C11.3 7.89 11.61 7.58 12 7.58C12.39 7.58 12.7 7.89 12.7 8.28V12.47C12.7 12.86 12.39 13.17 12 13.17C11.61 13.17 11.3 12.86 11.3 12.47V8.28ZM12.83 15.72C12.83 16.18 12.46 16.56 11.99 16.56C11.52 16.56 11.15 16.18 11.15 15.72C11.15 15.26 11.52 14.88 11.99 14.88C12.46 14.88 12.83 15.25 12.83 15.71V15.72Z'
              }
              fill={toastType === 'success' ? '#0058A3' : '#B71C1C'}
            />
          </svg>

          <div className="toast-body">{toastMessage}</div>

          <button
            type="button"
            className="btn-close"
            onClick={() => setShowToast(false)}
            aria-label="Закрыть"
          />
        </div>
      </div>

      <div className="card-summary__coupon">
        <form onSubmit={hasPromo ? handlePromoRemove : handlePromoSubmit}>
          <input
            type="text"
            id="cardSummaryCoupon"
            placeholder={hasPromo ? appliedPromo : 'Промокод или купон'}
            value={hasPromo ? appliedPromo : promoCode}
            onChange={(event) => !hasPromo && setPromoCode(event.target.value)}
            disabled={loading || hasPromo}
          />

          <button
            type="submit"
            className={`btn ${hasPromo ? 'btn-danger' : 'btn-primary'}`}
            disabled={loading}
          >
            {hasPromo ? '✕ Удалить' : 'Применить'}
          </button>
        </form>
      </div>

      <div className="cart-summary__inner">
        <h3 className="cart-summary__title">Ваш заказ</h3>

        <div className="cart-summary__row">
          <p>Всего</p>
          <div />
          <p>
            {itemCount} {getItemWord(itemCount)}
            {toNumber(totalWeight) > 0 && <span> ({formatWeight(totalWeight)} кг)</span>}
          </p>
        </div>

        <div className="cart-summary__row">
          <p>Стоимость товаров</p>
          <div />
          <p className="summery-row__cost">
            {formatMoney(subtotal)}
          </p>
        </div>

        {hasPromo && toNumber(promoDiscount) > 0 && (
          <div className="cart-summary__row is_promocod">
            <p>Скидка по промокоду</p>
            <div />
            <p className="summery-row__cost-promo" style={{ color: '#B71C1C' }}>
              -{formatMoneyPlain(promoDiscount)}
            </p>
          </div>
        )}

        <div className="cart-summary__row">
          <p>Доставка в Беларусь</p>
          <div />
          <p className="summery-row__cost-delivery">
            {formatMoney(delivery)}
          </p>
        </div>

        {(showPvzDelivery || toNumber(pvzDelivery) > 0) && (
          <div className="cart-summary__row">
            <p>Доставка до ПВЗ</p>
            <div />
            <p className="summery-row__cost pvz-delivery">
              {formatMoney(pvzDelivery)}
            </p>
          </div>
        )}

        {(showCourierDelivery || toNumber(courierDelivery) > 0) && (
          <div className="cart-summary__row">
            <p>Доставка</p>
            <div />
            <p className="summery-row__cost">
              {formatMoney(courierDelivery)}
            </p>
          </div>
        )}

        <div className="cart-summary__total">
          <p>Итого</p>
          <div />
          <p className="summery-total__total">
            {formatMoney(displayTotal)}
          </p>
        </div>

        <button
          className="cart-summary__checkout-btn"
          disabled={isCheckoutDisabled}
          onClick={onCheckout}
          type="button"
        >
          {checkoutLoading ? 'Оформляем...' : checkoutButtonText}
        </button>

        <p className="cart-summary__notice">
          Оформляя заказ, я принимаю условия{' '}
          <a href="#" target="_blank" rel="nofollow">договора-оферты</a>{' '}
          таможенного представителя
        </p>

        <div className="cart-summary__note">
          <div className="summary-note__wrap">
            <p className="cart-summary__note-icon">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path
                  d="M9.99996 1.66669C5.40829 1.66669 1.66663 5.40835 1.66663 10C1.66663 14.5917 5.40829 18.3334 9.99996 18.3334C14.5916 18.3334 18.3333 14.5917 18.3333 10C18.3333 5.40835 14.5916 1.66669 9.99996 1.66669ZM13.1 10.5834H10.5833V13.1C10.5833 13.425 10.325 13.6834 9.99996 13.6834C9.67496 13.6834 9.41663 13.425 9.41663 13.1V10.5834H6.89996C6.57496 10.5834 6.31663 10.325 6.31663 10C6.31663 9.67502 6.57496 9.41669 6.89996 9.41669H9.41663V6.90002C9.41663 6.57502 9.67496 6.31669 9.99996 6.31669C10.325 6.31669 10.5833 6.57502 10.5833 6.90002V9.41669H13.1C13.425 9.41669 13.6833 9.67502 13.6833 10C13.6833 10.325 13.425 10.5834 13.1 10.5834Z"
                  fill="#CE0061"
                />
              </svg>
            </p>

            <p>
              {toNumber(customsDuty) > 0 ? (
                <>
                  <span>≈{formatMoney(customsDuty)}</span> пошлина не входит в цену
                </>
              ) : (
                <>
                  <span>0 р.</span> пошлина не входит в цену
                </>
              )}
            </p>
          </div>

          <a
            href="/help/customs/"
            target="_blank"
            rel="noopener noreferrer"
            className="cart-summary__details-link"
          >
            Подробнее
          </a>
        </div>
      </div>
    </aside>
  );
}