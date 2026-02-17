'use client';

import { useState } from 'react';
import { useCart } from '/contexts/CartContext';

export default function CartSummary({
  subtotal = 0,
  promoDiscount = 0,
  delivery = 0,
  pvzDelivery = 0,
  total = 0,
  itemCount = 0,
  totalWeight = 0,
  canCheckout = true,
  onCheckout,
  checkoutButtonText = 'Перейти к оформлению',
  cart
}) {
  const { applyPromo, removePromo, loading } = useCart();
  const [promoCode, setPromoCode] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('error'); // 'error' или 'success'

  // Проверяем, применён ли промокод
  const appliedPromo = cart?.items?.[0]?.pricing?.promo_code || null;
  const hasPromo = appliedPromo !== null;

  const handlePromoSubmit = async (e) => {
    e.preventDefault();

    if (!promoCode.trim()) {
      setToastMessage('Введите промокод');
      setToastType('error');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      return;
    }

    try {
      await applyPromo(promoCode);
      setToastMessage('Промокод успешно применён');
      setToastType('success');
      setShowToast(true);
      setPromoCode('');
      setTimeout(() => setShowToast(false), 3000);
    } catch (error) {
      setToastMessage('Невозможно применить данный промокод');
      setToastType('error');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
  };

  const handlePromoRemove = async () => {
    try {
      await removePromo();
      setToastMessage('Промокод удалён');
      setToastType('success');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (error) {
      setToastMessage('Ошибка удаления промокода');
      setToastType('error');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
  };

  return (
    <aside className="cart-summary">
      {/* Toast для уведомлений */}
      <div
        className={`toast promokod-toast ${showToast ? 'show' : ''}`}
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
      >
        <div className="d-flex">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path 
              d={toastType === 'success' 
                ? "M12 2C6.49 2 2 6.49 2 12C2 17.51 6.49 22 12 22C17.51 22 22 17.51 22 12C22 6.49 17.51 2 12 2ZM10.5 16.5L6.5 12.5L7.91 11.09L10.5 13.67L16.09 8.08L17.5 9.5L10.5 16.5Z"
                : "M12 2C6.49 2 2 6.49 2 12C2 17.51 6.49 22 12 22C17.51 22 22 17.51 22 12C22 6.49 17.51 2 12 2ZM11.3 8.28C11.3 7.89 11.61 7.58 12 7.58C12.39 7.58 12.7 7.89 12.7 8.28V12.47C12.7 12.86 12.39 13.17 12 13.17C11.61 13.17 11.3 12.86 11.3 12.47V8.28ZM12.83 15.72C12.83 16.18 12.46 16.56 11.99 16.56C11.52 16.56 11.15 16.18 11.15 15.72C11.15 15.26 11.52 14.88 11.99 14.88C12.46 14.88 12.83 15.25 12.83 15.71V15.72Z"
              }
              fill={toastType === 'success' ? '#0058A3' : '#B71C1C'} 
            />
          </svg>
          <div className="toast-body">
            {toastMessage}
          </div>
          <button
            type="button"
            className="btn-close"
            onClick={() => setShowToast(false)}
            aria-label="Закрыть"
          ></button>
        </div>
      </div>

      {/* Промокод */}
      <div className="card-summary__coupon">
        {hasPromo ? (
          <div className="applied-promo">
            <span>Промокод: {appliedPromo}</span>
            <button 
              type="button" 
              className="btn btn-danger btn-sm"
              onClick={handlePromoRemove}
              disabled={loading}
            >
              Удалить
            </button>
          </div>
        ) : (
          <form onSubmit={handlePromoSubmit}>
            <input
              type="text"
              id="cardSummaryCoupon"
              placeholder="Промокод или купон"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              disabled={loading}
            />
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={loading}
            >
              Применить
            </button>
          </form>
        )}
      </div>

      {/* Основной блок */}
      <div className="cart-summary__inner">
        <h3 className="cart-summary__title">Ваш заказ</h3>

        {/* Всего товаров */}
        <div className="cart-summary__row">
          <p>Всего</p>
          <div></div>
          <p>{itemCount} {itemCount === 1 ? 'товар' : itemCount < 5 ? 'товара' : 'товаров'} {totalWeight > 0 && <span>({totalWeight} кг)</span>}</p>
        </div>

        {/* Стоимость товаров */}
        <div className="cart-summary__row">
          <p>Стоимость товаров</p>
          <div></div>
          <p className="summery-row__cost">{subtotal.toFixed(2)} р.</p>
        </div>

        {/* Скидка по промокоду */}
        {promoDiscount > 0 && (
          <div className="cart-summary__row no_promokod">
            <p>Скидка по промокоду</p>
            <div></div>
            <p className="summery-row__cost-promo" style={{ color: '#B71C1C' }}>
              -{promoDiscount.toFixed(2)} р.
            </p>
          </div>
        )}

        {/* Доставка */}
        <div className="cart-summary__row">
          <p>Доставка в Беларусь</p>
          <div></div>
          <p className="summery-row__cost-delivery">{delivery.toFixed(2)} р.</p>
        </div>

        {pvzDelivery > 0 && (
          <div className="cart-summary__row">
            <p>Доставка до ПВЗ</p>
            <div></div>
            <p className="summery-row__cost pvz-delivery">{pvzDelivery.toFixed(2)} р.</p>
          </div>
        )}

        {/* Итого */}
        <div className="cart-summary__total">
          <p>Итого</p>
          <div></div>
          <p className="summery-total__total">
            {Math.floor(total)}<span>.{(total % 1).toFixed(2).split('.')[1]} р.</span>
          </p>
        </div>

        {/* Кнопка оформления */}
        <button
          className="cart-summary__checkout-btn"
          disabled={!canCheckout || loading}
          onClick={onCheckout}
        >
          {checkoutButtonText}
        </button>
      </div>

      {/* Примечание о пошлине */}
      <div className="cart-summary__note">
        <div className="summary-note__wrap">
          <p className="cart-summary__note-icon">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9.99996 1.66669C5.40829 1.66669 1.66663 5.40835 1.66663 10C1.66663 14.5917 5.40829 18.3334 9.99996 18.3334C14.5916 18.3334 18.3333 14.5917 18.3333 10C18.3333 5.40835 14.5916 1.66669 9.99996 1.66669ZM13.1 10.5834H10.5833V13.1C10.5833 13.425 10.325 13.6834 9.99996 13.6834C9.67496 13.6834 9.41663 13.425 9.41663 13.1V10.5834H6.89996C6.57496 10.5834 6.31663 10.325 6.31663 10C6.31663 9.67502 6.57496 9.41669 6.89996 9.41669H9.41663V6.90002C9.41663 6.57502 9.67496 6.31669 9.99996 6.31669C10.325 6.31669 10.5833 6.57502 10.5833 6.90002V9.41669H13.1C13.425 9.41669 13.6833 9.67502 13.6833 10C13.6833 10.325 13.425 10.5834 13.1 10.5834Z" fill="#CE0061" />
            </svg>
          </p>
          <p><span>≈65 р.</span> пошлина не входит в цену</p>
        </div>
        <a href="#" className="cart-summary__details-link" data-bs-toggle="modal" data-bs-target="#customsModal">
          Подробнее
        </a>
      </div>
    </aside>
  );
}
