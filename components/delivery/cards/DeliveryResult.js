'use client';

// components/delivery/cards/DeliveryResult.js

import { useState } from 'react';

const PassportIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M8 1.33334C4.32667 1.33334 1.33334 4.32667 1.33334 8.00001C1.33334 11.6733 4.32667 14.6667 8 14.6667C11.6733 14.6667 14.6667 11.6733 14.6667 8.00001C14.6667 4.32667 11.6733 1.33334 8 1.33334ZM8.46667 10.48C8.46667 10.74 8.26 10.9467 8 10.9467C7.74 10.9467 7.53334 10.74 7.53334 10.48V7.68667C7.53334 7.42667 7.74 7.22 8 7.22C8.26 7.22 8.46667 7.42667 8.46667 7.68667V10.48ZM8 6.08C7.69334 6.08 7.44667 5.83334 7.44667 5.52667C7.44667 5.22 7.69334 4.97334 8 4.97334C8.30667 4.97334 8.55334 5.22 8.55334 5.52667C8.55334 5.83334 8.30667 6.08 8 6.08Z" fill="#0058A3" />
  </svg>
);

const EuropostLogo = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="12" fill="white" />
    <circle cx="12" cy="12" r="10.8" fill="#FF0000" />
    <path d="M16.3933 8.81333L17.1733 8.36667L12.1333 5.45333L7.09333 8.36667L8.56 9.19333L12.1333 7.09333L15.7067 9.2L16.3933 8.81333Z" fill="white" />
    <path d="M12.7333 11.96V16.2533L14.1867 15.4133V12.52L16.3933 11.26V14.14L17.8533 13.3V9.04667H17.84L12.7333 11.96Z" fill="white" />
    <path d="M12.7333 17.2267V18.6733H12.74L17.8533 15.7467V14.2867L12.7333 17.2267Z" fill="white" />
    <path d="M11.54 18.6333V17.24L7.87333 15.16V13.8533L11.54 15.96V14.6333L7.87333 12.5333V11.1933L11.54 13.2867V11.96L7.87333 9.87333L6.42667 9.04667H6.41333V15.68L11.54 18.6333Z" fill="white" />
  </svg>
);

const IkeyaLogo = () => (
  <span style={{ fontFamily: 'Arial', fontWeight: 900, fontSize: 18, color: '#0058A3', letterSpacing: 1 }}>
    IKE<span style={{ color: '#FFDB00' }}>YA</span>
  </span>
);

function formatDate(dateStr) {
  if (!dateStr) return null;
  const date = new Date(dateStr);
  const day = date.getDate();
  const months = ['января','февраля','марта','апреля','мая','июня','июля','августа','сентября','октября','ноября','декабря'];
  return `${day} ${months[date.getMonth()]}`;
}

/**
 * DeliveryResult — результат расчёта доставки по адресу
 *
 * Props:
 *  - calcResult  {object|null} — ответ от /delivery/calculate
 */
export default function DeliveryResult({ calcResult }) {
  const [conditionsOpen, setConditionsOpen] = useState(false);

  const delivery      = calcResult?.delivery;
  const deliveryType  = delivery?.normalized_delivery_type || delivery?.type;
  const isEuropost    = deliveryType === 'courier';
  const isFree        = delivery?.free_delivery_eligible;
  const cost          = delivery?.total_delivery_price_byn || delivery?.delivery_price_byn;
  const deliveryDate  = delivery?.delivery_date;
  const storageUntil  = delivery?.storage_until;

  return (
    <div className="delivery-result">

      {/* Провайдер + логотип */}
      <div className="delivery-result__provider">
        <span className="delivery-result__name">
          {isEuropost ? 'Доставка Европочта' : 'Доставка IKEYA'}
        </span>
        <span className="delivery-result__logo">
          {isEuropost ? <EuropostLogo /> : <IkeyaLogo />}
        </span>
      </div>

      {/* Стоимость и даты — только для Европочты */}
      {isEuropost && (
        <>
          <div className="delivery-result__row">
            <span className="delivery-result__label">Стоимость доставки</span>
            <span className="delivery-result__value">
              {isFree
                ? <span className="text-success">бесплатно</span>
                : cost ? `${cost} р.` : '—'
              }
            </span>
          </div>

          {deliveryDate && (
            <div className="delivery-result__row">
              <span className="delivery-result__label">Дата доставки</span>
              <span className="delivery-result__value">{formatDate(deliveryDate)}</span>
            </div>
          )}

          {storageUntil && (
            <div className="delivery-result__row">
              <span className="delivery-result__label">Хранение до</span>
              <span className="delivery-result__value">{formatDate(storageUntil)}</span>
            </div>
          )}
        </>
      )}

      {/* Паспорт */}
      <div className="delivery-result__passport">
        <PassportIcon />
        <span>Для получения заказа необходим паспорт</span>
      </div>

      {/* Европочта — условия */}
      {isEuropost && (
        <>
          <button
            type="button"
            className="delivery-result__conditions-link"
            onClick={() => setConditionsOpen(v => !v)}
          >
            Условия получения товаров
          </button>

          {conditionsOpen && (
            <div className="delivery-result__conditions-text">
              Получатель обязан предъявить паспорт и оплатить таможенную пошлину при наличии.
              Срок хранения посылки — 14 дней.
            </div>
          )}

          <p className="delivery-result__note">
            Окно доставки будет дополнительно согласовано с вами службой доставки Европочты
          </p>
        </>
      )}

      {/* IKEYA — информационный блок */}
      {!isEuropost && (
        <div className="delivery-result__info">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M8 1.33334C4.32667 1.33334 1.33334 4.32667 1.33334 8.00001C1.33334 11.6733 4.32667 14.6667 8 14.6667C11.6733 14.6667 14.6667 11.6733 14.6667 8.00001C14.6667 4.32667 11.6733 1.33334 8 1.33334ZM8.46667 10.48C8.46667 10.74 8.26 10.9467 8 10.9467C7.74 10.9467 7.53334 10.74 7.53334 10.48V7.68667C7.53334 7.42667 7.74 7.22 8 7.22C8.26 7.22 8.46667 7.42667 8.46667 7.68667V10.48ZM8 6.08C7.69334 6.08 7.44667 5.83334 7.44667 5.52667C7.44667 5.22 7.69334 4.97334 8 4.97334C8.30667 4.97334 8.55334 5.22 8.55334 5.52667C8.55334 5.83334 8.30667 6.08 8 6.08Z" fill="#0058A3" />
          </svg>
          <span>
            С вами свяжется сотрудник IKEYA для согласования сроков и стоимости доставки заказа.
            Данная услуга оплачивается отдельно от заказа.
          </span>
        </div>
      )}

    </div>
  );
}