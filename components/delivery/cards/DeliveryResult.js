'use client';

// components/delivery/cards/DeliveryResult.js

const PassportIcon = () => (
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
  <path d="M12 2C6.49 2 2 6.49 2 12C2 17.51 6.49 22 12 22C17.51 22 22 17.51 22 12C22 6.49 17.51 2 12 2ZM12.7 15.72C12.7 16.11 12.39 16.42 12 16.42C11.61 16.42 11.3 16.11 11.3 15.72V11.53C11.3 11.14 11.61 10.83 12 10.83C12.39 10.83 12.7 11.14 12.7 11.53V15.72ZM12 9.12C11.54 9.12 11.16 8.75 11.16 8.29C11.16 7.82 11.53 7.44 12 7.44C12.47 7.44 12.84 7.81 12.84 8.28C12.84 8.75 12.47 9.12 12 9.12Z" fill="#0058A3"/>
</svg>
);

const IkeyaLogo = () => (
  <span style={{ fontFamily: 'Arial', fontWeight: 900, fontSize: 18, color: '#0058A3', letterSpacing: 1 }}>
    IKE<span style={{ color: '#FFDB00' }}>YA</span>
  </span>
);

function toNumber(value, fallback = 0) {
  const normalized = String(value ?? '')
    .replace(/\s/g, '')
    .replace(',', '.');

  const parsed = Number.parseFloat(normalized);

  return Number.isFinite(parsed) ? parsed : fallback;
}

function formatMoney(value) {
  return `${toNumber(value).toFixed(2)} р.`;
}

function formatDate(dateStr) {
  if (!dateStr) return null;

  const date = new Date(dateStr);

  if (Number.isNaN(date.getTime())) return null;

  const day = date.getDate();
  const months = [
    'января',
    'февраля',
    'марта',
    'апреля',
    'мая',
    'июня',
    'июля',
    'августа',
    'сентября',
    'октября',
    'ноября',
    'декабря',
  ];

  return `${day} ${months[date.getMonth()]}`;
}

function getDeliveryType(delivery) {
  return (
    delivery?.normalized_delivery_type ||
    delivery?.delivery_type ||
    delivery?.type ||
    delivery?.code ||
    ''
  );
}

function isEuropostDelivery(type) {
  return [
    'courier',
    'europost_courier',
    'europost_delivery',
    'europost_pickup',
  ].includes(type);
}

function getDeliveryMethodCost(calcResult) {
  const delivery = calcResult?.delivery || {};
  const totals = calcResult?.totals || delivery?.totals || {};

  const candidates = [
    totals?.delivery_method_byn,
    delivery?.delivery_method_byn,
    delivery?.delivery_method_price_byn,
    delivery?.pricing?.internal?.delivery_method_byn,
    delivery?.pricing?.internal?.delivery_method_price_byn,
  ];

  const found = candidates.find((value) => value !== undefined && value !== null && value !== '');

  if (found === undefined) {
    return { hasValue: false, value: 0 };
  }

  return {
    hasValue: true,
    value: toNumber(found, 0),
  };
}

export default function DeliveryResult({ calcResult }) {
  const delivery = calcResult?.delivery || {};
  const deliveryType = getDeliveryType(delivery);
  const isEuropost = isEuropostDelivery(deliveryType);
  const isIkeyaDelivery = deliveryType === 'ikeya_delivery';
  const isFree = delivery?.free_delivery_eligible === true;
  const deliveryMethodCost = getDeliveryMethodCost(calcResult);
  const deliveryDate = delivery?.delivery_date;
  const storageUntil = delivery?.storage_until;

  return (
    <div className="delivery-result">
      <div className="delivery-result__provider">
        <span className="delivery-result__name">
          {isIkeyaDelivery ? 'Доставка IKEYA' : 'Доставка Европочта'}
        </span>

        <span className="delivery-result__logo">
          {isIkeyaDelivery ? (
            <IkeyaLogo />
          ) : (
            <img src="/assets/img/cart/evropochta-logo.png" alt="Европочта" />
          )}
        </span>
      </div>

      {isEuropost && (
        <>
          <div className="delivery-result__meta">
            <div className="delivery-result__row">
              <span className="delivery-result__label">Стоимость доставки</span>
              <span className="delivery-result__value">
                {deliveryMethodCost.hasValue
                  ? deliveryMethodCost.value > 0
                    ? formatMoney(deliveryMethodCost.value)
                    : isFree
                      ? <span className="text-success">бесплатно</span>
                      : formatMoney(0)
                  : isFree
                    ? <span className="text-success">бесплатно</span>
                    : '—'}
              </span>
            </div>

            {deliveryDate && (
              <div className="delivery-result__row">
                <span className="delivery-result__label">Дата доставки</span>
                <span className="delivery-result__value">{formatDate(deliveryDate)}</span>
              </div>
            )}
          </div>

          <div className="delivery-result__passport">
            <PassportIcon />
            <span>Для получения заказа необходим паспорт</span>
          </div>

          <div className="delivery-result__conditions">
            <div className="delivery-result__conditions-link">Условия получения товаров</div>
            <div className="delivery-result__conditions-text">
              Окно доставки будет дополнительно согласовано с вами службой доставки Европочты
            </div>
          </div>
        </>
      )}

      {isIkeyaDelivery && (
        <>
          <div className="delivery-result__info">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M8 1.33334C4.32667 1.33334 1.33334 4.32667 1.33334 8.00001C1.33334 11.6733 4.32667 14.6667 8 14.6667C11.6733 14.6667 14.6667 11.6733 14.6667 8.00001C14.6667 4.32667 11.6733 1.33334 8 1.33334ZM8.46667 10.48C8.46667 10.74 8.26 10.9467 8 10.9467C7.74 10.9467 7.53334 10.74 7.53334 10.48V7.68667C7.53334 7.42667 7.74 7.22 8 7.22C8.26 7.22 8.46667 7.42667 8.46667 7.68667V10.48ZM8 6.08C7.69334 6.08 7.44667 5.83334 7.44667 5.52667C7.44667 5.22 7.69334 4.97334 8 4.97334C8.30667 4.97334 8.55334 5.22 8.55334 5.52667C8.55334 5.83334 8.30667 6.08 8 6.08Z" fill="#0058A3" />
            </svg>

            <span>
              С вами свяжется сотрудник IKEYA для согласования сроков и стоимости доставки заказа.
              Данная услуга оплачивается отдельно от заказа.
            </span>
          </div>

          <div className="delivery-result__passport">
            <PassportIcon />
            <span>Для получения заказа необходим паспорт</span>
          </div>
        </>
      )}

      {!isIkeyaDelivery && storageUntil && (
        <div className="delivery-result__storage">
          <span className="delivery-result__label">Хранение до</span>
          <span className="delivery-result__value">{formatDate(storageUntil)}</span>
        </div>
      )}
    </div>
  );
}
