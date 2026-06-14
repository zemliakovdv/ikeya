'use client';

// components/delivery/cards/DeliveryResult.js

const PassportIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path
      d="M5.83333 3.33334H14.1667C15.0871 3.33334 15.8333 4.07954 15.8333 5.00001V15C15.8333 15.9205 15.0871 16.6667 14.1667 16.6667H5.83333C4.91286 16.6667 4.16666 15.9205 4.16666 15V5.00001C4.16666 4.07954 4.91286 3.33334 5.83333 3.33334Z"
      stroke="currentColor"
      strokeWidth="1.5"
    />
    <path
      d="M7.5 7.08334C7.5 5.93275 8.43274 5.00001 9.58333 5.00001H10.4167C11.5673 5.00001 12.5 5.93275 12.5 7.08334C12.5 8.23394 11.5673 9.16668 10.4167 9.16668H9.58333C8.43274 9.16668 7.5 8.23394 7.5 7.08334Z"
      stroke="currentColor"
      strokeWidth="1.5"
    />
    <path d="M7.5 12.0833H12.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M7.5 14.5833H10.8333" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
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

function getDeliveryCost(delivery) {
  const candidates = [
    delivery?.total_delivery_price_byn,
    delivery?.total_delivery_byn,
    delivery?.delivery_price_byn,
    delivery?.delivery_total_byn,
    delivery?.price_byn,
    delivery?.base_cost_byn,
    delivery?.poland_delivery_byn,
    delivery?.pricing?.internal?.total_delivery_byn,
    delivery?.pricing?.internal?.total_delivery_price_byn,
    delivery?.pricing?.internal?.delivery_total_byn,
    delivery?.pricing?.internal?.delivery_price_byn,
    delivery?.pricing?.internal?.base_cost_byn,
    delivery?.pricing?.internal?.poland_delivery_byn,
  ];

  const found = candidates.find((value) => {
    if (value === undefined || value === null || value === '') return false;
    return toNumber(value, 0) > 0;
  });

  return found !== undefined ? toNumber(found, 0) : 0;
}

export default function DeliveryResult({ calcResult }) {
  const delivery = calcResult?.delivery || {};
  const deliveryType = getDeliveryType(delivery);
  const isEuropost = isEuropostDelivery(deliveryType);
  const isIkeyaDelivery = deliveryType === 'ikeya_delivery';
  const isFree = delivery?.free_delivery_eligible === true;
  const cost = getDeliveryCost(delivery);
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
                {cost > 0 ? formatMoney(cost) : isFree ? <span className="text-success">бесплатно</span> : '—'}
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
