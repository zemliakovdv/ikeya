'use client';

import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { resolveImageUrl } from '@/lib/api/ikea';
import { resolvePaymentUrl } from '@/lib/utils/paymentUrl';

const API_BASE_URL = 'https://test.ikeya.by/api/v1';

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
    if (imageUrl.startsWith('/')) return `https://test.ikeya.by${imageUrl}`;

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
  if (String(first).startsWith('/')) return `https://test.ikeya.by${first}`;

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
    <span style={{ fontFamily: 'Arial', fontWeight: 900, fontSize: 18, color: '#0058A3' }}>
      IKE<span style={{ color: '#FFDB00' }}>YA</span>
    </span>
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
      } catch {}

      if (!fromSession && orderId && token) {
        try {
          const res = await fetch(`${API_BASE_URL}/account/orders/${orderId}`, {
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
        } catch {}
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
  const paymentUrl = resolvePaymentUrl(attrs.payment_url) || null;
  const paymentExpired = attrs.payment_expired === true;
  const timerStr = timeLeft ? `${pad(Math.floor(timeLeft / 60))}:${pad(timeLeft % 60)}` : null;
  const showPaymentAlert = !loading && !paymentExpired && (timerStr || paymentUrl);

  const isIkeya = deliveryType === 'ikeya_delivery';
  const deliveryTypeLabel = DELIVERY_TYPE_LABELS[deliveryType] || deliveryType || '';

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
                    <a href={paymentUrl} target="_blank" rel="noopener noreferrer" className="btn-pay-order">
                      Оплатить заказ
                    </a>
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
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                          <path d="M6 19L19 6M8 6H6V8M16 18H18V16" stroke="#757575" strokeWidth="1.5" strokeLinecap="round" />
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
                        const imgSrc = resolveImage(attributes.image_url) || resolveImageUrl(attributes.image_url) || '/assets/img/no-image.jpg';
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