'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';

const CUSTOMS_HELP_HREF = '/help/customs';
const ORDER_HELP_HREF = '/help/how-to-order';
const PRODUCT_IMAGE_FALLBACK = '/assets/img/profile/active_1.png';
const EUROPOST_LOGO_SRC = '/assets/img/cart/evropochta-logo.png';
const IKEYA_LOGO_SRC = '/assets/img/logo.svg';

function ArrowLeftIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M15 19L8 12L15 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CopyIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M13.75 2.5H6.25C5.33 2.5 4.58 3.25 4.58 4.17V12.5H6.25V4.17H13.75V2.5Z" fill="currentColor" />
      <path d="M8.33 6.25H15C15.92 6.25 16.67 7 16.67 7.92V15.83C16.67 16.75 15.92 17.5 15 17.5H8.33C7.41 17.5 6.67 16.75 6.67 15.83V7.92C6.67 7 7.41 6.25 8.33 6.25ZM8.33 7.92V15.83H15V7.92H8.33Z" fill="currentColor" />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M7.5 4.17L13.33 10L7.5 15.83" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function DeliveryIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 7.5C4 6.67 4.67 6 5.5 6H14V16H4V7.5Z" stroke="currentColor" strokeWidth="1.6" />
      <path d="M14 9H17.2L20 12.4V16H14V9Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M7 18.5C7.83 18.5 8.5 17.83 8.5 17C8.5 16.17 7.83 15.5 7 15.5C6.17 15.5 5.5 16.17 5.5 17C5.5 17.83 6.17 18.5 7 18.5Z" fill="currentColor" />
      <path d="M17 18.5C17.83 18.5 18.5 17.83 18.5 17C18.5 16.17 17.83 15.5 17 15.5C16.17 15.5 15.5 16.17 15.5 17C15.5 17.83 16.17 18.5 17 18.5Z" fill="currentColor" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 21C16.97 21 21 16.97 21 12C21 7.03 16.97 3 12 3C7.03 3 3 7.03 3 12C3 16.97 7.03 21 12 21Z" stroke="currentColor" strokeWidth="1.6" />
      <path d="M12 7.5V12L15 13.8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CardIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 7.5C4 6.67 4.67 6 5.5 6H18.5C19.33 6 20 6.67 20 7.5V16.5C20 17.33 19.33 18 18.5 18H5.5C4.67 18 4 17.33 4 16.5V7.5Z" stroke="currentColor" strokeWidth="1.6" />
      <path d="M4 10H20" stroke="currentColor" strokeWidth="1.6" />
      <path d="M7 14.5H11" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function ServiceIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M14.7 5.3L18.7 9.3L9.3 18.7L5.3 14.7L14.7 5.3Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M13.2 6.8L17.2 10.8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M6 19H18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function InfoIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M10 18.33C14.6 18.33 18.33 14.6 18.33 10C18.33 5.4 14.6 1.67 10 1.67C5.4 1.67 1.67 5.4 1.67 10C1.67 14.6 5.4 18.33 10 18.33Z" fill="#0058A3" />
      <path d="M10 8.75V13.33" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M10 6.67H10.01" stroke="white" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function HelpIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M10 18.33C14.6 18.33 18.33 14.6 18.33 10C18.33 5.4 14.6 1.67 10 1.67C5.4 1.67 1.67 5.4 1.67 10C1.67 14.6 5.4 18.33 10 18.33Z" stroke="currentColor" strokeWidth="1.4" />
      <path d="M7.92 7.92C7.92 6.77 8.85 5.83 10 5.83C11.15 5.83 12.08 6.77 12.08 7.92C12.08 9.58 10 9.58 10 11.25" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M10 14.17H10.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function formatMoney(value) {
  if (value === undefined || value === null || value === '') return null;
  const normalized = typeof value === 'string'
    ? value.replace(/\s/g, '').replace(',', '.')
    : value;
  const num = Number.parseFloat(normalized);
  if (!Number.isFinite(num)) return null;
  return `${num.toLocaleString('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} р.`;
}

function pluralizeProduct(count) {
  const abs = Math.abs(count);
  const mod10 = abs % 10;
  const mod100 = abs % 100;

  if (mod10 === 1 && mod100 !== 11) return 'товар';
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return 'товара';
  return 'товаров';
}

function getItemsCount(order) {
  if (Number.isFinite(order.itemsCount)) return order.itemsCount;
  return (order.items || []).reduce((sum, item) => sum + Number(item?.quantity || 0), 0);
}

function normalizeCode(value) {
  return String(value || '').trim().toLowerCase().replace(/[-\s]+/g, '_');
}

function normalizeDeliveryCode(value) {
  return String(value || '').trim().toLowerCase().replace(/[\s-]+/g, '_');
}

function looksLikeSystemCode(value) {
  const text = String(value || '').trim();
  return Boolean(text) && /^[a-z0-9_-]+$/i.test(text) && text === text.toLowerCase();
}

function humanizeCode(value) {
  const text = String(value || '').trim().replace(/[_-]+/g, ' ').replace(/\s+/g, ' ');
  if (!text) return null;

  return text
    .split(' ')
    .map((word) => (word ? `${word[0].toUpperCase()}${word.slice(1).toLowerCase()}` : ''))
    .join(' ');
}

const DELIVERY_LABELS = {
  europost: 'Европочта',
  euro_post: 'Европочта',
  evropochta: 'Европочта',
  courier: 'Курьерская доставка',
  courier_delivery: 'Курьерская доставка',
  pickup: 'Самовывоз',
  self_pickup: 'Самовывоз',
  pvz: 'Пункт выдачи',
};

function getDeliveryLabel(value) {
  const text = String(value || '').trim();
  if (!text) return null;

  const code = normalizeCode(text);
  if (DELIVERY_LABELS[code]) return DELIVERY_LABELS[code];
  if (looksLikeSystemCode(text)) return humanizeCode(text);

  return text;
}

function getDeliveryCodes(order) {
  return [
    order.deliveryProvider,
    order.deliveryName,
    order.deliveryMethod,
    order.deliveryType,
    order.rawDeliveryType,
  ]
    .map(normalizeDeliveryCode)
    .filter(Boolean);
}

function isEuropostDelivery(order) {
  return getDeliveryCodes(order).some((code) => (
    code.includes('europost') || code.includes('evropochta')
  ));
}

function isIkeyaDelivery(order) {
  return getDeliveryCodes(order).some((code) => code.includes('ikeya'));
}

function renderDeliveryIcon(order) {
  if (isEuropostDelivery(order)) {
    return (
      <img
        src={EUROPOST_LOGO_SRC}
        alt=""
        className="order-detail__delivery-logo order-detail__delivery-logo--europost"
        aria-hidden="true"
      />
    );
  }

  if (isIkeyaDelivery(order)) {
    return (
      <img
        src={IKEYA_LOGO_SRC}
        alt=""
        className="order-detail__delivery-logo order-detail__delivery-logo--ikeya"
        aria-hidden="true"
      />
    );
  }

  return <DeliveryIcon />;
}

function getDeliveryTitle(order) {
  const source = [
    order.deliveryName,
    order.deliveryProvider,
    order.deliveryMethod,
    order.deliveryType,
  ]
    .filter(Boolean)
    .map((value) => String(value).trim())
    .filter(Boolean)[0];
  const label = getDeliveryLabel(source);
  if (!label) return null;

  const normalized = label.toLowerCase();
  if (normalized.startsWith('доставка')) return label;
  if (normalized === 'самовывоз') return 'Самовывоз';
  if (normalized === 'курьерская доставка') return 'Курьерская доставка';
  if (normalized === 'пункт выдачи') return 'Доставка в пункт выдачи';
  if (normalized === 'европочта') return 'Доставка Европочта';
  return `Доставка ${label}`;
}

function getLocalDeliveryLabel(order) {
  const source = order.deliveryName || order.deliveryProvider || order.deliveryMethod || order.deliveryType;
  if (!source) return 'Доставка';

  const value = getDeliveryLabel(source);
  if (!value) return 'Доставка';
  if (/самовывоз/i.test(value)) return 'Самовывоз';
  if (/курьер/i.test(value)) return 'Курьерская доставка';
  if (/европочт/i.test(value)) return 'Европочта';
  if (/пункт выдачи/i.test(value)) return 'Пункт выдачи';
  return value.toLowerCase().startsWith('доставка') ? value : `Доставка ${value}`;
}

const PAYMENT_METHOD_LABELS = {
  card: 'Оплата картой онлайн',
  online_card: 'Оплата картой онлайн',
  card_online: 'Оплата картой онлайн',
  online: 'Оплата онлайн',
  cash: 'Оплата наличными',
  cash_on_delivery: 'Оплата при получении',
  cod: 'Оплата при получении',
  terminal: 'Оплата картой при получении',
  bank_transfer: 'Банковский перевод',
  invoice: 'Оплата по счёту',
};

function getPaymentMethodTitle(value) {
  const text = String(value || '').trim();
  if (!text) return null;

  const code = normalizeCode(text);
  if (PAYMENT_METHOD_LABELS[code]) return PAYMENT_METHOD_LABELS[code];
  if (looksLikeSystemCode(text)) return null;

  return text;
}

function resolvePaymentState(order) {
  if (order?.isPaid === true) {
    return { key: 'paid', label: 'Оплачено' };
  }

  if (order?.isPaid === false || order?.isAwaitingPayment === true) {
    return { key: 'waiting', label: 'Ждет оплаты' };
  }

  return { key: null, label: null };
}

function SummaryRow({ label, value }) {
  if (!value) return null;

  return (
    <div className="order-detail__summary-row">
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}

function InfoRow({ icon, title, subtitle, children }) {
  if (!title && !subtitle && !children) return null;

  return (
    <div className="order-detail__info-row">
      <div className="order-detail__info-icon">{icon}</div>
      <div className="order-detail__info-body">
        {title && <div className="order-detail__info-title">{title}</div>}
        {subtitle && <div className="order-detail__info-subtitle">{subtitle}</div>}
        {children}
      </div>
    </div>
  );
}

function ProductItem({ item, index }) {
  const price = formatMoney(item.priceAmount ?? item.price);
  const content = (
    <>
      <img
        className="order-detail__product-image"
        src={item.image || PRODUCT_IMAGE_FALLBACK}
        alt={item.name || 'Товар'}
        onError={(event) => {
          event.currentTarget.src = PRODUCT_IMAGE_FALLBACK;
        }}
      />
      <div className="order-detail__product-info">
        <div className="order-detail__product-name">{item.name || '—'}</div>
        {(item.desc || item.product_sku) && (
          <div className="order-detail__product-desc">{item.desc || item.product_sku}</div>
        )}
      </div>
      <div className="order-detail__product-meta">
        <span>{item.quantity || 1} шт.</span>
        {price && <span>{price}</span>}
      </div>
    </>
  );

  const key = `${item.product_sku || item.desc || item.name || 'item'}-${index}`;

  if (item.product_sku) {
    return (
      <Link className="order-detail__product" href={`/product/${item.product_sku}`} key={key}>
        {content}
      </Link>
    );
  }

  return (
    <div className="order-detail__product" key={key}>
      {content}
    </div>
  );
}

export default function OrderDetail({ order, onBack, onReorder }) {
  const [orderCopied, setOrderCopied] = useState(false);
  const [trackCopied, setTrackCopied] = useState(false);

  const orderTitle = order.date && order.date !== '—'
    ? `Заказ № ${order.id} от ${order.date}`
    : `Заказ № ${order.id}`;

  const deliveryTitle = getDeliveryTitle(order);
  const itemsCount = getItemsCount(order);
  const itemsSummary = itemsCount > 0
    ? `${itemsCount} ${pluralizeProduct(itemsCount)}${order.totalWeight ? ` (${String(order.totalWeight).replace('.', ',')} кг)` : ''}`
    : null;
  const canRepeatOrder = !order.isDraft && order.statusConfig?.repeatAllowed === true;
  const paymentMethodTitle = getPaymentMethodTitle(order.paymentMethodLabel);
  const paymentState = resolvePaymentState(order);
  const hasPaymentInfo = Boolean(paymentMethodTitle || paymentState.label);
  const hasProducts = Array.isArray(order.items) && order.items.length > 0;
  const hasServices = Array.isArray(order.services) && order.services.length > 0;
  const trackingDeliveryLabel = getDeliveryLabel(order.deliveryProvider || order.deliveryName);
  const totalDisplay = order.totalAmount !== null && order.totalAmount !== undefined
    ? formatMoney(order.totalAmount)
    : order.price && order.price !== '0,00'
      ? formatMoney(order.price)
      : null;

  const summaryRows = useMemo(() => {
    const localDeliveryLabel = getLocalDeliveryLabel(order);
    return [
      { label: 'Всего', value: itemsSummary },
      { label: 'Стоимость товаров', value: formatMoney(order.itemsSubtotal) },
      { label: 'Доставка в Беларусь', value: formatMoney(order.deliveryToBelarus) },
      { label: localDeliveryLabel, value: formatMoney(order.localDeliveryCost) },
    ].filter((row) => row.value);
  }, [itemsSummary, order]);

  function copyValue(value, setter) {
    if (!value || typeof navigator === 'undefined' || !navigator.clipboard) return;
    navigator.clipboard.writeText(String(value)).then(() => {
      setter(true);
      window.setTimeout(() => setter(false), 1600);
    });
  }

  return (
    <div className="order-detail">
      <div className="order-detail__layout">
        <div className="order-detail__main">
          <section className="order-detail__info-card">
            <div className="order-detail__header">
              <button
                className="order-detail__back"
                type="button"
                aria-label="Вернуться к заказам"
                onClick={onBack}
              >
                <ArrowLeftIcon />
              </button>
              <div className="order-detail__header-text">
                <div className="order-detail__title-row">
                  <h1>{orderTitle}</h1>
                  <button
                    className="order-detail__copy-number"
                    type="button"
                    aria-label="Скопировать номер заказа"
                    onClick={() => copyValue(order.id, setOrderCopied)}
                  >
                    <CopyIcon />
                    {orderCopied && <span>Скопировано</span>}
                  </button>
                </div>
              </div>
            </div>

            <div className="order-detail__status">
              <span>Статус заказа:</span>
              <span className={`order-detail__status-badge order-detail__badge ${order.statusConfig?.badgeClass || ''}`}>
                {order.statusDescription || order.status || '—'}
              </span>
            </div>

            {order.trackNumber && (
              <>
                <div className="order-detail__tracking">
                  <div className="order-detail__track-card">
                    <div>
                      <div className="order-detail__track-value">{order.trackNumber}</div>
                      <div className="order-detail__track-label">Трек-номер</div>
                    </div>
                    <button
                      className="order-detail__icon-button"
                      type="button"
                      aria-label="Скопировать трек-номер"
                      onClick={() => copyValue(order.trackNumber, setTrackCopied)}
                    >
                      {trackCopied ? <span>Скопировано</span> : <CopyIcon />}
                    </button>
                  </div>

                  {order.trackingUrl ? (
                    <a
                      className="order-detail__track-card order-detail__track-card--link"
                      href={order.trackingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <div>
                        <div className="order-detail__track-value">Отследить</div>
                        {trackingDeliveryLabel ? (
                          <div className="order-detail__track-label">
                            {trackingDeliveryLabel}
                          </div>
                        ) : null}
                      </div>
                      <ArrowRightIcon />
                    </a>
                  ) : (
                    <div className="order-detail__track-card">
                      <div>
                        <div className="order-detail__track-value">Отследить</div>
                        {trackingDeliveryLabel ? (
                          <div className="order-detail__track-label">
                            {trackingDeliveryLabel}
                          </div>
                        ) : null}
                      </div>
                    </div>
                  )}
                </div>

                <div className="order-detail__notice">
                  <InfoIcon />
                  <span>Выдача заказов осуществляется по трек-номеру и документу, удостоверяющему личность.</span>
                </div>
              </>
            )}

            <div className="order-detail__info-list">
              <InfoRow icon={renderDeliveryIcon(order)} title={deliveryTitle} subtitle={order.deliveryAddress} />
              <InfoRow
                icon={<ClockIcon />}
                title={order.dateRange && order.dateRange !== '—' ? order.dateRange : null}
                subtitle={order.dateRange && order.dateRange !== '—' ? 'Планируемая дата получения заказа' : null}
              />
              {hasPaymentInfo && (
                <InfoRow
                  icon={<CardIcon />}
                  title={paymentMethodTitle}
                >
                  {paymentState.label && (
                    <span className={`order-detail__payment-state order-detail__payment-state--${paymentState.key}`}>
                      {paymentState.label}
                    </span>
                  )}
                </InfoRow>
              )}
              {hasServices && (
                <InfoRow icon={<ServiceIcon />} title="Услуги:">
                  <div className="order-detail__notice order-detail__notice--services">
                    <InfoIcon />
                    <span>Услуги оплачиваются отдельно. С Вами свяжется сотрудник колл-центра для уточнения всех деталей.</span>
                  </div>
                  <ul className="order-detail__services">
                    {order.services.map((service) => (
                      <li key={service}>{service}</li>
                    ))}
                  </ul>
                </InfoRow>
              )}
            </div>
          </section>

          <section className="order-detail__products-card">
            {hasProducts ? (
              order.items.map((item, index) => (
                <ProductItem item={item} index={index} key={`${item.product_sku || item.desc || item.name || 'item'}-${index}`} />
              ))
            ) : (
              <div className="order-detail__empty-products">Список товаров недоступен</div>
            )}
          </section>
        </div>

        <aside className="order-detail__aside">
          <section className="order-detail__summary-card">
            <h2>Ваш заказ</h2>
            <div className="order-detail__summary-list">
              {summaryRows.map((row) => (
                <SummaryRow key={row.label} label={row.label} value={row.value} />
              ))}
              {totalDisplay && (
                <div className="order-detail__summary-total">
                  <span>Итого</span>
                  <span>{totalDisplay}</span>
                </div>
              )}
            </div>

            {order.isAwaitingPayment && order.paymentUrl && (
              <a className="order-detail__primary-action" href={order.paymentUrl}>
                Оплатить заказ
              </a>
            )}

            {canRepeatOrder && (
              <button
                className="order-detail__primary-action"
                type="button"
                onClick={() => onReorder(order.id)}
              >
                Повторить заказ
              </button>
            )}
          </section>

          {order.customsDuty !== null && order.customsDuty !== undefined && (
            <section className="order-detail__customs-card">
              <div className="order-detail__customs-text">
                <InfoIcon />
                <span>
                  <strong>{order.customsDutyApprox ? '≈' : ''}{formatMoney(order.customsDuty)}</strong>
                  {' '}пошлина не входит в цену
                </span>
              </div>
              <Link className="order-detail__text-link" href={CUSTOMS_HELP_HREF}>
                Правила оплаты и формирование таможенной пошлины
              </Link>
            </section>
          )}

          <section className="order-detail__help-card">
            <Link className="order-detail__help-link" href={ORDER_HELP_HREF}>
              <HelpIcon />
              <span>Вопросы по заказу</span>
              <ArrowRightIcon />
            </Link>
          </section>
        </aside>
      </div>
    </div>
  );
}
