'use client';

import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { resolveImageUrl } from '@/lib/api/ikea';
import { resolvePaymentUrl } from '@/lib/utils/paymentUrl';

import { buildApiUrl, buildAssetUrl } from '@/lib/config/api';

const PAYMENT_LABELS = {
  card: 'Оплата картой онлайн',
  erip: 'Оплата через ЕРИП',
};

const SERVICE_LABELS = {
  furniture_delivery: 'Подъем и занос мебели',
  furniture_assembly: 'Сборка мебели',
};

const DELIVERY_TYPE_LABELS = {
  europost_pickup: 'Самовывоз Европочта',
  courier: 'Курьерская доставка Европочта',
  ikeya_delivery: 'Доставка IKEYA',
  pickup: 'Самовывоз Европочта',
};

function pad(n) {
  return String(n).padStart(2, '0');
}

function toNumber(value, fallback = 0) {
  const normalized = String(value ?? '')
    .replace(/\s/g, '')
    .replace(',', '.');

  const num = Number.parseFloat(normalized);

  return Number.isFinite(num) ? num : fallback;
}

function formatAmount(amount) {
  return `${toNumber(amount).toLocaleString('ru-RU', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} р.`;
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

function resolveImage(imageUrl) {
  if (!imageUrl) return null;

  if (typeof imageUrl === 'string') {
    if (imageUrl.startsWith('http')) return imageUrl;
    if (imageUrl.startsWith('/')) return buildAssetUrl(imageUrl);

    try {
      const parsed = JSON.parse(imageUrl);
      return resolveImage(parsed);
    } catch {
      return null;
    }
  }

  if (!Array.isArray(imageUrl) || imageUrl.length === 0) return null;

  const first = imageUrl[0];

  if (!first || String(first).startsWith('as:')) return null;
  if (String(first).startsWith('http')) return first;
  if (String(first).startsWith('/')) return buildAssetUrl(first);

  return null;
}

function getOrderItemImage(item = {}) {
  const candidates = [
    item.image_url,
    item.image,
    item.local_image,
    item.local_images,
    item.images,
    item.images?.local_images,
    item.images?.images,
    item.product?.image_url,
    item.product?.image,
    item.product?.local_images,
    item.product?.images,
    item.product?.images?.local_images,
    item.product?.images?.images,
    item.product?.attr?.local_images,
    item.product?.attributes?.local_images,
  ];

  for (const candidate of candidates) {
    const resolved = resolveImage(candidate);
    if (resolved) return resolved;
  }

  return null;
}

function getOrderDeliveryCost(attrs = {}) {
  const delivery = attrs.delivery || attrs.address?.delivery || {};

  const candidates = [
    attrs.delivery_price,
    attrs.delivery_price_byn,
    attrs.delivery_total_byn,
    attrs.total_delivery_byn,
    attrs.total_delivery_price_byn,
    delivery.delivery_price,
    delivery.delivery_price_byn,
    delivery.delivery_total_byn,
    delivery.total_delivery_byn,
    delivery.total_delivery_price_byn,
    delivery.price_byn,
    delivery.base_cost_byn,
    delivery.pricing?.internal?.total_delivery_byn,
    delivery.pricing?.internal?.total_delivery_price_byn,
    delivery.pricing?.internal?.delivery_total_byn,
    delivery.pricing?.internal?.delivery_price_byn,
    delivery.pricing?.internal?.base_cost_byn,
  ];

  const found = candidates.find((value) => value !== undefined && value !== null && value !== '');

  return found ?? null;
}

function getPaymentUrl(attr = {}) {
  return (
    attr.payment_url ||
    attr.payment_link ||
    attr.payment?.url ||
    attr.payment?.payment_url ||
    attr.payment?.payment_link ||
    attr.payment?.link ||
    attr.payment_url_full ||
    null
  );
}

function getItemPrice(item = {}) {
  const candidates = [
    item.line_total_new_byn,
    item.line_total_byn,
    item.total_price_byn,
    item.price_total_byn,
    item.price_byn,
    item.unit_price_new_byn,
    item.unit_price_byn,
  ];

  const found = candidates.find((value) => value !== undefined && value !== null && value !== '');

  return found ?? 0;
}

function EuropostIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="12" fill="white" />
      <circle cx="12" cy="12" r="10.8" fill="#FF0000" />
      <path d="M16.3933 8.81333L17.1733 8.36667L12.1333 5.45333L7.09333 8.36667L8.56 9.19333L12.1333 7.09333L15.7067 9.2L16.3933 8.81333Z" fill="white" />
      <path d="M12.7333 11.96V16.2533L14.1867 15.4133V12.52L16.3933 11.26V14.14L17.8533 13.3V9.04667H17.84L12.7333 11.96Z" fill="white" />
      <path d="M12.7333 17.2267V18.6733H12.74L17.8533 15.7467V14.2867L12.7333 17.2267Z" fill="white" />
      <path d="M11.54 18.6333V17.24L7.87333 15.16V13.8533L11.54 15.96V14.6333L7.87333 12.5333V11.1933L11.54 13.2867V11.96L7.87333 9.87333L6.42667 9.04667H6.41333V15.68L11.54 18.6333Z" fill="white" />
    </svg>
  );
}

function IkeyaIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M24 12C24 18.6274 18.6274 24 12 24C5.37258 24 0 18.6274 0 12C0 5.37258 5.37258 0 12 0C18.6274 0 24 5.37258 24 12Z" fill="white" />
      <path d="M22.8 12C22.8 17.9647 17.9647 22.8 12 22.8C6.03533 22.8 1.2 17.9647 1.2 12C1.2 6.03533 6.03533 1.2 12 1.2C17.9647 1.2 22.8 6.03533 22.8 12Z" fill="#FFDB00" />
      <path d="M5.52999 14.251V9.95803C5.52999 9.47881 5.52999 9.1194 5.51997 8.75999H7.92568C7.91566 9.12938 7.91566 9.45884 7.91566 9.95803V14.251C7.91566 14.9099 7.91566 15.3991 7.92568 15.8484H5.51997C5.52999 15.4091 5.52999 14.9199 5.52999 14.251Z" fill="#0058A3" />
      <path d="M9.05399 14.251V9.95803C9.05399 9.47881 9.05399 9.1194 9.04396 8.75999H11.4497C11.4397 9.12938 11.4397 9.45884 11.4397 9.95803V11.2459H12.7828C13.1136 10.9165 13.3843 10.6269 13.6248 10.3773L15.1585 8.75999H18.0754L18.0854 8.77995C17.4038 9.43888 15.7499 11.0762 14.6974 12.1045C15.78 13.2327 17.6243 15.1096 18.3561 15.8284L18.346 15.8484H15.4091L14.0759 14.4707C13.7652 14.1412 13.3542 13.7219 12.843 13.1927H11.4397V14.251C11.4397 14.9099 11.4397 15.3991 11.4497 15.8484H9.04396C9.05399 15.4091 9.05399 14.9199 9.05399 14.251Z" fill="#0058A3" />
    </svg>
  );
}

function DeliveryIcon({ type }) {
  if (type === 'europost_pickup' || type === 'pickup' || type === 'courier') {
    return <EuropostIcon />;
  }

  return <IkeyaIcon />;
}

function SimpleIcon({ children }) {
  return (
    <div className="detail-icon">
      {children || (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="#757575" strokeWidth="1.5" />
          <path d="M8 12h8" stroke="#757575" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      )}
    </div>
  );
}

export default function OrderSuccessPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('order_id');
  const { token } = useAuth();

  const [order, setOrder] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);
  const [isRedirectingToPayment, setIsRedirectingToPayment] = useState(false);
  const timerRef = useRef(null);

  const [pvz, setPvz] = useState(null);
  const [deliveryAddr, setDeliveryAddr] = useState(null);
  const [services, setServices] = useState([]);

  useEffect(() => {
    async function loadData() {
      setLoading(true);

      let orderData = null;
      let itemsData = [];
      let fromSession = false;

      try {
        const storedPvz = sessionStorage.getItem('selectedPvz');

        if (storedPvz) {
          setPvz(JSON.parse(storedPvz));
          sessionStorage.removeItem('selectedPvz');
        }

        const storedAddr = sessionStorage.getItem('selectedDeliveryAddr');

        if (storedAddr) {
          setDeliveryAddr(JSON.parse(storedAddr));
          sessionStorage.removeItem('selectedDeliveryAddr');
        }

        const storedServices = sessionStorage.getItem('selectedServices');

        if (storedServices) {
          setServices(JSON.parse(storedServices));
          sessionStorage.removeItem('selectedServices');
        }

        const storedOrder = sessionStorage.getItem('checkoutOrder');

        if (storedOrder) {
          orderData = JSON.parse(storedOrder);
          sessionStorage.removeItem('checkoutOrder');
          fromSession = true;
        }

        const storedItems = sessionStorage.getItem('checkoutItems');

        if (storedItems) {
          itemsData = JSON.parse(storedItems);
          sessionStorage.removeItem('checkoutItems');
        }
      } catch { }

      if (!fromSession && orderId && token) {
        try {
          const res = await fetch(buildApiUrl(`/account/orders/${orderId}`), {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            cache: 'no-store',
          });

          if (res.ok) {
            const data = await res.json();
            const attr = data.data?.attributes || {};

            orderData = attr;

            const included = data.included || [];
            const orderItemIds = data.data?.relationships?.order_items?.data?.map((item) => item.id) || [];
            const itemsMap = {};

            included.forEach((inc) => {
              if (inc.type === 'order_item') {
                itemsMap[inc.id] = inc.attributes;
              }
            });

            itemsData = orderItemIds
              .map((id) => itemsMap[id])
              .filter(Boolean)
              .map((item) => ({
                id: item.product_sku,
                attributes: {
                  product_sku: item.product_sku,
                  name: item.name || '—',
                  description: item.description || item.name || '—',
                  quantity: item.quantity || 1,
                  price_byn: item.price_byn || 0,
                  line_total_new_byn: item.line_total_new_byn,
                  line_total_byn: item.line_total_byn,
                  image_url: item.image_url || '',
                },
              }));

            const addr = attr.address || {};
            const deliveryType = attr.delivery_type;

            if (deliveryType === 'europost_pickup' || deliveryType === 'pickup') {
              const deliverySnap = addr.delivery || {};
              const pickupPoint = deliverySnap.pickup_point || {};

              if (pickupPoint.address || addr.pickup_point_id) {
                setPvz({
                  provider: 'europost',
                  address: pickupPoint.address || String(addr.pickup_point_id || ''),
                  city: pickupPoint.city || '',
                  working_hours: pickupPoint.working_hours || '',
                  phone: pickupPoint.phone || '',
                });
              }
            } else if (deliveryType === 'courier' || deliveryType === 'ikeya_delivery') {
              const deliverySnap = addr.delivery || {};
              const addrSnap = deliverySnap.address || addr;

              if (addrSnap.city || addrSnap.street) {
                const parts = [addrSnap.street, addrSnap.house, addrSnap.building].filter(Boolean).join(', ');
                const label = `${addrSnap.city || ''}, ${parts}`.replace(/^, /, '');

                setDeliveryAddr({
                  address: label,
                  apartment: addrSnap.apartment || '',
                  label,
                  calcResult: { delivery: { normalized_delivery_type: deliveryType } },
                });
              }
            }

            if (addr.services?.length) {
              setServices(addr.services);
            }
          }
        } catch { }
      }

      if (orderData) {
        setOrder(orderData);

        const expiresAt = orderData.payment_expires_at || orderData.attributes?.payment_expires_at;
        const expired = orderData.payment_expired ?? orderData.attributes?.payment_expired;

        if (expiresAt && !expired) {
          const secondsLeft = Math.max(0, Math.floor((new Date(expiresAt).getTime() - Date.now()) / 1000));
          setTimeLeft(secondsLeft > 0 ? secondsLeft : null);
        }
      }

      setItems(itemsData);
      setLoading(false);
    }

    loadData();
  }, [orderId, token]);

  useEffect(() => {
    if (!timeLeft) return undefined;

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          return null;
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [!!timeLeft]);

  const attrs = order?.attributes || order || {};
  const deliveryType = attrs.delivery_type || '';
  const paymentLabel = PAYMENT_LABELS[attrs.payment_method] || attrs.payment_method || 'Оплата картой онлайн';
  const paymentUrl = resolvePaymentUrl(
    getPaymentUrl({
      ...order,
      ...attrs,
      payment: attrs.payment || order?.payment,
    })
  ) || null;
  const paymentExpired = attrs.payment_expired === true;
  const timerStr = timeLeft ? `${pad(Math.floor(timeLeft / 60))}:${pad(timeLeft % 60)}` : null;
  const showPaymentAlert = !loading && !paymentExpired && (timerStr || paymentUrl);

  const isIkeya = deliveryType === 'ikeya_delivery';
  const deliveryTypeLabel = DELIVERY_TYPE_LABELS[deliveryType] || deliveryType || '';
  const trackNumber = attrs.track_number || null;

  const pvzAddress = pvz
    ? (pvz.city ? `${pvz.city}, ${pvz.address}` : pvz.address)
    : null;

  const courierAddress = deliveryAddr
    ? (deliveryAddr.apartment
      ? `${deliveryAddr.address}, кв.${deliveryAddr.apartment}`
      : deliveryAddr.address)
    : null;

  const rawDeliveryCost = getOrderDeliveryCost(attrs);
  const deliveryCost = rawDeliveryCost !== null ? toNumber(rawDeliveryCost) : null;
  const deliveryFree = deliveryCost !== null && deliveryCost === 0;

  function handleCopy() {
    const value = attrs.public_uid || attrs.id || orderId;

    if (!value) return;

    navigator.clipboard.writeText(String(value)).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  function handlePaymentRedirect() {
    if (!paymentUrl || isRedirectingToPayment) return;

    setIsRedirectingToPayment(true);
    window.location.assign(paymentUrl);
  }

  return (
    <main className="orders-statused">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="order-success-page">
              <div className="success-header">
                <div className="success-icon-large">
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                    <path d="M15.9998 2.66667C8.65317 2.66667 2.6665 8.65334 2.6665 16C2.6665 23.3467 8.65317 29.3333 15.9998 29.3333C23.3465 29.3333 29.3332 23.3467 29.3332 16C29.3332 8.65334 23.3465 2.66667 15.9998 2.66667ZM21.6532 12.9067L14.8265 20.3467C14.6532 20.5333 14.4132 20.64 14.1598 20.6533H14.1465C13.9065 20.6533 13.6665 20.56 13.4932 20.3867L10.3865 17.28C10.0265 16.92 10.0265 16.3333 10.3865 15.96C10.7465 15.6 11.3332 15.6 11.7065 15.96L14.1198 18.3733L20.2798 11.6533C20.6265 11.28 21.2132 11.2533 21.5998 11.6C21.9732 11.9467 21.9998 12.5333 21.6532 12.92V12.9067Z" fill="#00910A" />
                  </svg>
                </div>

                <h1 className="success-title">Заказ успешно оформлен. Спасибо!</h1>
              </div>

              {showPaymentAlert && (
                <div className="alert alert-danger alert-payment">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2C6.49 2 2 6.49 2 12C2 17.51 6.49 22 12 22C17.51 22 22 17.51 22 12C22 6.49 17.51 2 12 2ZM12.7 15.72C12.7 16.11 12.39 16.42 12 16.42C11.61 16.42 11.3 16.11 11.3 15.72V11.53C11.3 11.14 11.61 10.83 12 10.83C12.39 10.83 12.7 11.14 12.7 11.53V15.72ZM12 9.12C11.54 9.12 11.16 8.75 11.16 8.29C11.16 7.82 11.53 7.44 12 7.44C12.47 7.44 12.84 7.81 12.84 8.28C12.84 8.75 12.47 9.12 12 9.12Z" fill="#B71C1C" />
                  </svg>

                  <p>
                    {timerStr && <>Заказ ожидает оплаты <strong className="timer-value">{timerStr}</strong>. </>}
                    <strong>Скопируйте код заказа для удобства оплаты. Автоматическая отмена заказа происходит сразу после истечения срока оплаты.</strong>
                  </p>

                  {paymentUrl && (
                    <button
                      type="button"
                      className="btn-pay-order"
                      onClick={handlePaymentRedirect}
                      disabled={isRedirectingToPayment}
                      aria-disabled={isRedirectingToPayment}
                    >
                      Оплатить заказ
                    </button>
                  )}
                </div>
              )}

              <section className="order-info-section">
                <div className="order-number-block">
                  <div className="order-number-wrap">
                    <h2 className="order-number">Заказ № {attrs.public_uid || attrs.id || orderId}</h2>

                    <button className="btn-copy-order" onClick={handleCopy} title="Скопировать номер заказа" type="button">
                      {copied ? (
                        <span style={{ color: '#00910A', fontSize: 14 }}>Скопировано</span>
                      ) : (
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                          <path d="M8.5 8.5H6.8C5.8 8.5 5 9.3 5 10.3V18.2C5 19.2 5.8 20 6.8 20H14.7C15.7 20 16.5 19.2 16.5 18.2V16.5M9.3 4H17.2C18.2 4 19 4.8 19 5.8V13.7C19 14.7 18.2 15.5 17.2 15.5H9.3C8.3 15.5 7.5 14.7 7.5 13.7V5.8C7.5 4.8 8.3 4 9.3 4Z" stroke="#757575" strokeWidth="1.5" />
                        </svg>
                      )}
                    </button>
                  </div>

                  <p className="order-tracking">
                    Отслеживайте статус <a href="/profile/orders" className="tracking-link">в личном кабинете</a>
                  </p>

                  {trackNumber && (
                    <p className="order-tracking">
                      Трек-номер: <strong>{trackNumber}</strong>
                    </p>
                  )}
                </div>

                <div className="order-detail-item">
                  <SimpleIcon>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path d="M3 8.5H21M5 5H19C20.1 5 21 5.9 21 7V17C21 18.1 20.1 19 19 19H5C3.9 19 3 18.1 3 17V7C3 5.9 3.9 5 5 5Z" stroke="#757575" strokeWidth="1.5" />
                      <path d="M7 15H11" stroke="#757575" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </SimpleIcon>

                  <div className="detail-content">
                    <h3 className="detail-title">{paymentLabel}</h3>
                    <p className="detail-status">{paymentExpired ? 'Истёк срок оплаты' : 'Ждёт оплаты'}</p>
                  </div>
                </div>

                {(isIkeya || deliveryCost !== null) && (
                  <div className="order-detail-item">
                    <div className="detail-content detail-delivery">
                      <h3 className="detail-price">
                        {isIkeya ? (
                          'согласуется отдельно'
                        ) : deliveryFree ? (
                          <span className="text-success">бесплатно</span>
                        ) : (
                          formatAmount(deliveryCost)
                        )}
                      </h3>

                      <p className="detail-subtitle">{deliveryTypeLabel || 'Доставка'}</p>
                    </div>
                  </div>
                )}

                <div className="order-detail-item total-amount">
                  <div className="detail-content">
                    <h3 className="detail-price">{formatAmount(attrs.total_amount)}</h3>
                    <p className="detail-subtitle">Сумма заказа</p>
                  </div>
                </div>

                <div className="order-detail-item">
                  <SimpleIcon>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="9" stroke="#757575" strokeWidth="1.5" />
                      <path d="M12 7.5V12L15 14" stroke="#757575" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </SimpleIcon>

                  <div className="detail-content">
                    <h3 className="detail-title">
                      {formatDate(attrs.address?.delivery?.delivery_date || deliveryAddr?.calcResult?.delivery?.delivery_date) || 'уточняется'}
                    </h3>
                    <p className="detail-subtitle">Планируемая дата получения заказа</p>
                  </div>
                </div>

                {pvz && (
                  <div className="order-detail-item">
                    <div className="detail-icon"><DeliveryIcon type="europost_pickup" /></div>

                    <div className="detail-content">
                      <h3 className="detail-title">{pvzAddress}</h3>
                      <p className="detail-subtitle">Самовывоз Европочта</p>
                      {pvz.working_hours && <p className="detail-subtitle">{pvz.working_hours}</p>}
                    </div>
                  </div>
                )}

                {deliveryAddr && (
                  <div className="order-detail-item">
                    <div className="detail-icon"><DeliveryIcon type={deliveryType} /></div>

                    <div className="detail-content">
                      <h3 className="detail-title">{courierAddress}</h3>
                      <p className="detail-subtitle">{isIkeya ? 'Доставка IKEYA' : 'Доставка Европочта'}</p>
                    </div>
                  </div>
                )}
              </section>

              {(services.length > 0 || attrs.full_name) && (
                <section className="selected-services-section">
                  {services.length > 0 && (
                    <>
                      <div className="alert alert-info">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                          <path d="M12 2C6.49 2 2 6.49 2 12C2 17.51 6.49 22 12 22C17.51 22 22 17.51 22 12C22 6.49 17.51 2 12 2ZM12.7 15.72C12.7 16.11 12.39 16.42 12 16.42C11.61 16.42 11.3 16.11 11.3 15.72V11.53C11.3 11.14 11.61 10.83 12 10.83C12.39 10.83 12.7 11.14 12.7 11.53V15.72ZM12 9.12C11.54 9.12 11.16 8.75 11.16 8.29C11.16 7.82 11.53 7.44 12 7.44C12.47 7.44 12.84 7.81 12.84 8.28C12.84 8.75 12.47 9.12 12 9.12Z" fill="#0058A3" />
                        </svg>

                        <span>Услуги оплачиваются отдельно. С Вами свяжется сотрудник колл-центра для уточнения всех деталей.</span>
                      </div>

                      <div className="services-header">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                          <path d="M15.4199 11.64L16.5699 10.49C18.0399 10.88 19.6399 10.47 20.7399 9.36998C21.9499 8.15998 22.3299 6.34998 21.7099 4.75998C21.6299 4.53998 21.4299 4.37998 21.1999 4.32998C20.9699 4.27998 20.7299 4.34998 20.5599 4.51998L19.2899 5.78998H18.2099V4.70998L19.4699 3.43998C19.6399 3.26998 19.7099 3.02998 19.6599 2.79998C19.6099 2.56998 19.4499 2.37998 19.2299 2.28998C17.6399 1.66998 15.8299 2.05998 14.6199 3.25998C13.5199 4.35998 13.1099 5.94998 13.4999 7.42998L10.9499 9.97998L7.02989 6.05998L7.82989 5.25998C7.98989 5.09998 8.05989 4.87998 8.02989 4.64998C7.99989 4.41998 7.84989 4.23998 7.64989 4.13998L4.54989 2.58998C4.27989 2.45998 3.95989 2.50998 3.73989 2.71998L2.70989 3.74998C2.49989 3.95998 2.44989 4.28998 2.57989 4.55998L4.12989 7.65998C4.22989 7.85998 4.41989 7.99998 4.63989 8.03998C4.67989 8.03998 4.70989 8.03998 4.74989 8.03998C4.92989 8.03998 5.10989 7.96998 5.23989 7.83998L6.03989 7.03998L9.95989 10.96L7.40989 13.51C5.92989 13.11 4.33989 13.53 3.23989 14.63C2.02989 15.84 1.64989 17.65 2.26989 19.24C2.34989 19.46 2.54989 19.62 2.77989 19.67C3.00989 19.72 3.24989 19.65 3.41989 19.48L4.68989 18.22H5.76989V19.3L4.49989 20.57C4.32989 20.74 4.25989 20.98 4.30989 21.21C4.35989 21.44 4.51989 21.63 4.73989 21.72C5.24989 21.92 5.76989 22.01 6.29989 22.01C7.42989 22.01 8.52989 21.57 9.34989 20.75C10.4499 19.65 10.8599 18.06 10.4699 16.58L11.6199 15.43L17.0699 20.88C17.4799 21.29 18.0099 21.49 18.5499 21.49C19.0899 21.49 19.6199 21.29 20.0299 20.88L20.8499 20.06C21.6599 19.24 21.6599 17.91 20.8499 17.1L15.3999 11.65L15.4199 11.64ZM4.95989 6.16998L4.06989 4.37998L4.38989 4.05998L6.17989 4.94998L4.95989 6.16998ZM9.19989 15.89C8.99989 16.09 8.93989 16.38 9.03989 16.63C9.45989 17.71 9.19989 18.93 8.37989 19.75C7.85989 20.27 7.16989 20.57 6.44989 20.6L6.96989 20.08C7.09989 19.95 7.16989 19.77 7.16989 19.59V17.52C7.16989 17.13 6.85989 16.82 6.46989 16.82H4.39989C4.21989 16.82 4.03989 16.89 3.90989 17.02L3.38989 17.54C3.41989 16.83 3.71989 16.14 4.23989 15.61C5.05989 14.79 6.27989 14.53 7.35989 14.95C7.61989 15.05 7.90989 14.99 8.09989 14.79L14.7899 8.09998C14.9899 7.89998 15.0499 7.60998 14.9499 7.35998C14.5299 6.27998 14.7899 5.05998 15.6099 4.23998C16.1299 3.71998 16.8299 3.41998 17.5399 3.38998L17.0199 3.90998C16.8899 4.03998 16.8199 4.21998 16.8199 4.39998V6.46998C16.8199 6.85998 17.1299 7.16998 17.5199 7.16998H19.5899C19.7799 7.16998 19.9499 7.09998 20.0799 6.96998L20.5999 6.44998C20.5699 7.15998 20.2699 7.84998 19.7499 8.37998C18.9299 9.19998 17.7099 9.45998 16.6299 9.03998C16.3699 8.93998 16.0799 8.99998 15.8899 9.19998L9.19989 15.89ZM19.8899 19.07L19.0699 19.89C18.7999 20.16 18.3499 20.16 18.0799 19.89L12.6299 14.44L14.4399 12.63L19.8899 18.08C20.1599 18.35 20.1599 18.8 19.8899 19.07Z" fill="#757575" />
                        </svg>
                        <h3 className="services-title">Услуги:</h3>
                      </div>

                      <ul className="services-list-simple">
                        {services.map((service, index) => (
                          <li key={`${service}-${index}`}>{SERVICE_LABELS[service] || service}</li>
                        ))}
                      </ul>
                    </>
                  )}

                  {attrs.full_name && (
                    <div className="recipient-section">
                      <div className="recipient-header">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                          <circle cx="12" cy="8" r="4" stroke="#757575" strokeWidth="1.5" />
                          <path d="M5 21C5.7 17.5 8.3 15.5 12 15.5C15.7 15.5 18.3 17.5 19 21" stroke="#757575" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>

                        <h3 className="recipient-name">{attrs.full_name}</h3>
                      </div>

                      <div className="contact-info-list">
                        {attrs.phone && (
                          <div className="contact-info-item">
                            <span>+{attrs.phone}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </section>
              )}

              {items.length > 0 && (
                <div className="products zakazi">
                  <div className="order-card">
                    <div className="order-items">
                      {items.map((item, index) => {
                        const attributes = item.attributes || item;
                        const imgSrc = getOrderItemImage(attributes) || resolveImageUrl(attributes.image_url) || '/assets/img/no-image.jpg';
                        const itemPrice = getItemPrice(attributes);

                        return (
                          <div key={item.id || attributes.product_sku || index} className="order-item">
                            <img
                              src={imgSrc}
                              alt={attributes.name || ''}
                              className="item-image"
                              onError={(event) => {
                                event.currentTarget.src = '/assets/img/no-image.jpg';
                              }}
                            />

                            <div className="flex-grow-1">
                              <div className="item-infos">
                                <div className="item-name">{attributes.description || attributes.name}</div>

                                {attributes.description && attributes.description !== attributes.name && (
                                  <div className="item-desc">{attributes.name}</div>
                                )}
                              </div>

                              <div className="item-meta">
                                <span className="item-quantity">{attributes.quantity} шт</span>
                                <span className="item-price">{formatAmount(itemPrice)}</span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {loading && (
                <p style={{ textAlign: 'center', color: '#9e9e9e' }}>Загрузка...</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
