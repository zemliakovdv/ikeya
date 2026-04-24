'use client';

import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { resolveImageUrl } from '@/lib/api/ikea';
import { resolvePaymentUrl } from '@/lib/utils/paymentUrl';

const PAYMENT_LABELS = {
  card: 'Оплата картой онлайн',
  erip: 'Оплата через ЕРИП',
};

const SERVICE_LABELS = {
  furniture_delivery: 'Подъем и занос мебели',
  furniture_assembly: 'Сборка мебели',
};

// Названия провайдеров ПВЗ
const PROVIDER_NAMES = {
  europost: 'Европочта',
  autolight: 'Автолайт',
  ikeya: 'Склад IKEYA',
};

// Подпись под стоимостью доставки
const DELIVERY_TYPE_LABELS = {
  pickup: 'Доставка до ПВЗ',
  courier: 'Курьерская доставка',
};

function pad(n) { return String(n).padStart(2, '0'); }

function formatAmount(amount) {
  if (!amount && amount !== 0) return '0,00 р.';
  return Number(amount).toLocaleString('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' р.';
}

// ─── Иконки провайдеров ────────────────────────────────────────────────────────

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
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: 24,
      height: 24,
      borderRadius: '50%',
      background: '#FFDB00',
      fontFamily: 'Arial',
      fontWeight: 900,
      fontSize: 8,
      color: '#0058A3',
      letterSpacing: 0.5,
    }}>
      IK
    </span>
  );
}

function ProviderIcon({ provider }) {
  if (provider === 'autolight') {
    return <img src="/assets/img/icon/autolight.png" alt="Автолайт" width="24" height="24" />;
  }
  if (provider === 'europost') {
    return <EuropostIcon />;
  }
  // ikeya или любой другой
  return <IkeyaIcon />;
}

// ─── Компонент ────────────────────────────────────────────────────────────────

export default function OrderSuccessPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('order_id');

  const [order, setOrder] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);
  const timerRef = useRef(null);

  // Данные доставки
  const [pvz, setPvz] = useState(null); // самовывоз
  const [deliveryAddr, setDeliveryAddr] = useState(null); // курьер
  const [services, setServices] = useState([]);

  useEffect(() => {
    try {
      // ── Самовывоз ──
      const storedPvz = sessionStorage.getItem('selectedPvz');
      if (storedPvz) {
        setPvz(JSON.parse(storedPvz));
        sessionStorage.removeItem('selectedPvz');
      }

      // ── Курьерная доставка ──
      const storedAddr = sessionStorage.getItem('selectedDeliveryAddr');
      if (storedAddr) {
        setDeliveryAddr(JSON.parse(storedAddr));
        sessionStorage.removeItem('selectedDeliveryAddr');
      }

      // ── Услуги ──
      const storedServices = sessionStorage.getItem('selectedServices');
      if (storedServices) {
        setServices(JSON.parse(storedServices));
        sessionStorage.removeItem('selectedServices');
      }

      // ── Заказ ──
      const storedOrder = sessionStorage.getItem('checkoutOrder');
      if (storedOrder) {
        const orderData = JSON.parse(storedOrder);
        setOrder(orderData);
        if (orderData?.payment_expires_at && !orderData?.payment_expired) {
          const expiresAt = new Date(orderData.payment_expires_at).getTime();
          const secondsLeft = Math.max(0, Math.floor((expiresAt - Date.now()) / 1000));
          setTimeLeft(secondsLeft);
        }
        sessionStorage.removeItem('checkoutOrder');
      }

      // ── Товары ──
      const storedItems = sessionStorage.getItem('checkoutItems');
      if (storedItems) {
        setItems(JSON.parse(storedItems));
        sessionStorage.removeItem('checkoutItems');
      }
    } catch { }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0) return;
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) { clearInterval(timerRef.current); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [timeLeft === null ? null : 'started']);

  function handleCopy() {
    if (!orderId) return;
    navigator.clipboard.writeText(orderId).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  const timerStr = timeLeft !== null
    ? `${pad(Math.floor(timeLeft / 60))}:${pad(timeLeft % 60)}`
    : null;

  const attrs = order || {};
  const paymentLabel = PAYMENT_LABELS[attrs.payment_method] || attrs.payment_method || 'Оплата картой онлайн';
  const paymentUrl = resolvePaymentUrl(attrs.payment_url) || null;
  const paymentExpired = attrs.payment_expired === true;
  const showPaymentAlert = !loading && !paymentExpired && (timerStr !== null || paymentUrl);

  // Стоимость доставки — из calcResult если есть, иначе из order
  const isPickup = !!pvz;
  const isCourier = !!deliveryAddr;

  const calcResult = isPickup
    ? null // ПВЗ: стоимость берём из order.delivery_price
    : deliveryAddr?.calcResult;

  const deliveryFree = calcResult?.delivery?.free_delivery_eligible
    ?? (!attrs.delivery_price || Number(attrs.delivery_price) === 0);

  const deliveryCostByn = calcResult?.delivery?.base_cost_byn
    ?? attrs.delivery_price
    ?? null;

  const deliveryTypeLabel = isPickup
    ? DELIVERY_TYPE_LABELS.pickup
    : DELIVERY_TYPE_LABELS.courier;

  // Адрес для отображения
  const pvzAddress = pvz
    ? (pvz.city ? `${pvz.city}, ${pvz.address}` : pvz.address)
    : null;

  const courierAddress = deliveryAddr
    ? (deliveryAddr.apartment
      ? `${deliveryAddr.address}, кв.${deliveryAddr.apartment}`
      : deliveryAddr.address)
    : null;

  // Провайдер курьерки
  const isEuropostCourier = deliveryAddr?.calcResult?.delivery?.type === 'europost_courier';
  const courierProvider = isEuropostCourier ? 'europost' : 'ikeya';
  const courierProviderLabel = isEuropostCourier ? 'Доставка Европочта' : 'Доставка IKEYA';

  return (
    <main className="orders-statused">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="order-success-page">

              {/* ========== ЗАГОЛОВОК УСПЕХА ========== */}
              <div className="success-header">
                <div className="success-icon-large">
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16.0001 2.66667C8.65341 2.66667 2.66675 8.65334 2.66675 16C2.66675 23.3467 8.65341 29.3333 16.0001 29.3333C23.3467 29.3333 29.3334 23.3467 29.3334 16C29.3334 8.65334 23.3467 2.66667 16.0001 2.66667ZM21.6534 12.9067L14.8267 20.3467C14.6534 20.5333 14.4134 20.64 14.1601 20.6533H14.1467C13.9067 20.6533 13.6667 20.56 13.4934 20.3867L10.3867 17.28C10.0267 16.92 10.0267 16.3333 10.3867 15.96C10.7467 15.6 11.3334 15.6 11.7067 15.96L14.1201 18.3733L20.2801 11.6533C20.6267 11.28 21.2134 11.2533 21.6001 11.6C21.9734 11.9467 22.0001 12.5333 21.6534 12.92V12.9067Z" fill="#00910A" />
                  </svg>
                </div>
                <h1 className="success-title">Заказ успешно оформлен. Спасибо!</h1>
              </div>

              {/* ========== АЛЕРТ С ТАЙМЕРОМ ========== */}
              {showPaymentAlert && (
                <div className="alert alert-danger alert-payment">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2C6.49 2 2 6.49 2 12C2 17.51 6.49 22 12 22C17.51 22 22 17.51 22 12C22 6.49 17.51 2 12 2ZM12.7 15.72C12.7 16.11 12.39 16.42 12 16.42C11.61 16.42 11.3 16.11 11.3 15.72V11.53C11.3 11.14 11.61 10.83 12 10.83C12.39 10.83 12.7 11.14 12.7 11.53V15.72ZM12 9.12C11.54 9.12 11.16 8.75 11.16 8.29C11.16 7.82 11.53 7.44 12 7.44C12.47 7.44 12.84 7.81 12.84 8.28C12.84 8.75 12.47 9.12 12 9.12Z" fill="#B71C1C" />
                  </svg>
                  <p>
                    {timerStr ? (
                      <>Заказ ожидает оплаты <strong className="timer-value">{timerStr}</strong>. </>
                    ) : (
                      <>Заказ ожидает оплаты. </>
                    )}
                    <strong>Скопируйте код заказа для удобства оплаты. Автоматическая отмена заказа происходит сразу после истечения срока оплаты.</strong>
                  </p>
                  {paymentUrl && (
                    <a href={paymentUrl} target="_blank" rel="noopener noreferrer" className="btn-pay-order">
                      Оплатить заказ
                    </a>
                  )}
                </div>
              )}

              {/* ========== ИНФОРМАЦИЯ О ЗАКАЗЕ ========== */}
              <section className="order-info-section">
                <div className="order-number-block">
                  <div className="order-number-wrap">
                    <h2 className="order-number">Заказ № {orderId}</h2>
                    <button className="btn-copy-order" onClick={handleCopy} title="Скопировать номер заказа">
                      {copied ? (
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M20.9798 9.53C20.1798 8.73 19.0798 8.56 17.3498 8.52C17.3398 6.08 17.2198 4.68 16.3498 3.61C16.1698 3.39 15.9598 3.18 15.7398 3C14.5198 2 12.8998 2 9.67977 2C6.45977 2 4.83977 2 3.61977 3C3.39977 3.18 3.18977 3.39 3.00977 3.61C2.00977 4.83 2.00977 6.45 2.00977 9.67C2.00977 12.89 2.00977 14.51 3.00977 15.73C3.18977 15.95 3.39977 16.16 3.61977 16.34C4.68977 17.22 6.08977 17.33 8.52977 17.34C8.56977 19.08 8.73977 20.18 9.53977 20.97C10.5598 21.99 12.0698 21.99 14.7998 21.99H15.7298C18.4598 21.99 19.9698 21.99 20.9898 20.97C22.0098 19.95 22.0098 18.44 22.0098 15.71V14.78C22.0098 12.05 22.0098 10.54 20.9898 9.52L20.9798 9.53ZM4.49977 15.27C4.34977 15.15 4.20977 15 4.07977 14.85C3.38977 14.01 3.38977 12.56 3.38977 9.68C3.38977 6.8 3.38977 5.34 4.07977 4.51C4.20977 4.36 4.34977 4.22 4.49977 4.09C5.33977 3.4 6.78977 3.4 9.66977 3.4C12.5498 3.4 14.0098 3.4 14.8398 4.09C14.9898 4.21 15.1298 4.36 15.2598 4.51C15.8498 5.23 15.9298 6.42 15.9398 8.52C15.8598 8.52 15.7898 8.52 15.7098 8.52H14.7798C12.0498 8.52 10.5398 8.52 9.51977 9.54C8.49977 10.56 8.49977 12.07 8.49977 14.8V15.73C8.49977 15.81 8.49977 15.88 8.49977 15.96C6.23977 15.94 5.17977 15.84 4.48977 15.28L4.49977 15.27ZM20.5998 15.72C20.5998 18.16 20.5998 19.38 19.9898 19.99C19.3798 20.6 18.1498 20.6 15.7198 20.6H14.7898C12.3498 20.6 11.1298 20.6 10.5198 19.99C9.90977 19.38 9.90977 18.15 9.90977 15.72V14.79C9.90977 12.35 9.90977 11.13 10.5198 10.52C11.1298 9.91 12.3598 9.91 14.7898 9.91H15.7198C18.1498 9.91 19.3798 9.91 19.9898 10.52C20.5998 11.13 20.5998 12.36 20.5998 14.79V15.72Z" fill="#757575" />
                        </svg>
                      ) : (
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M20.9798 9.53C20.1798 8.73 19.0798 8.56 17.3498 8.52C17.3398 6.08 17.2198 4.68 16.3498 3.61C16.1698 3.39 15.9598 3.18 15.7398 3C14.5198 2 12.8998 2 9.67977 2C6.45977 2 4.83977 2 3.61977 3C3.39977 3.18 3.18977 3.39 3.00977 3.61C2.00977 4.83 2.00977 6.45 2.00977 9.67C2.00977 12.89 2.00977 14.51 3.00977 15.73C3.18977 15.95 3.39977 16.16 3.61977 16.34C4.68977 17.22 6.08977 17.33 8.52977 17.34C8.56977 19.08 8.73977 20.18 9.53977 20.97C10.5598 21.99 12.0698 21.99 14.7998 21.99H15.7298C18.4598 21.99 19.9698 21.99 20.9898 20.97C22.0098 19.95 22.0098 18.44 22.0098 15.71V14.78C22.0098 12.05 22.0098 10.54 20.9898 9.52L20.9798 9.53ZM4.49977 15.27C4.34977 15.15 4.20977 15 4.07977 14.85C3.38977 14.01 3.38977 12.56 3.38977 9.68C3.38977 6.8 3.38977 5.34 4.07977 4.51C4.20977 4.36 4.34977 4.22 4.49977 4.09C5.33977 3.4 6.78977 3.4 9.66977 3.4C12.5498 3.4 14.0098 3.4 14.8398 4.09C14.9898 4.21 15.1298 4.36 15.2598 4.51C15.8498 5.23 15.9298 6.42 15.9398 8.52C15.8598 8.52 15.7898 8.52 15.7098 8.52H14.7798C12.0498 8.52 10.5398 8.52 9.51977 9.54C8.49977 10.56 8.49977 12.07 8.49977 14.8V15.73C8.49977 15.81 8.49977 15.88 8.49977 15.96C6.23977 15.94 5.17977 15.84 4.48977 15.28L4.49977 15.27ZM20.5998 15.72C20.5998 18.16 20.5998 19.38 19.9898 19.99C19.3798 20.6 18.1498 20.6 15.7198 20.6H14.7898C12.3498 20.6 11.1298 20.6 10.5198 19.99C9.90977 19.38 9.90977 18.15 9.90977 15.72V14.79C9.90977 12.35 9.90977 11.13 10.5198 10.52C11.1298 9.91 12.3598 9.91 14.7898 9.91H15.7198C18.1498 9.91 19.3798 9.91 19.9898 10.52C20.5998 11.13 20.5998 12.36 20.5998 14.79V15.72Z" fill="#757575" />
                        </svg>
                      )}
                    </button>
                  </div>
                  <p className="order-tracking">
                    Отслеживайте статус <a href="/profile/orders" className="tracking-link">в личном кабинете</a>
                  </p>
                </div>

                {/* Способ оплаты */}
                <div className="order-detail-item">
                  <div className="detail-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M20.8398 5.49999C20.6598 5.28999 20.4498 5.09999 20.2398 4.92999C18.8798 3.85999 17.0498 3.85999 13.3998 3.85999H10.6098C6.95976 3.85999 5.11977 3.85999 3.76977 4.92999C3.54977 5.09999 3.34977 5.28999 3.16977 5.49999C2.00977 6.79999 2.00977 8.53999 2.00977 12C2.00977 15.46 2.00977 17.2 3.16977 18.5C3.34977 18.7 3.55977 18.9 3.76977 19.07C5.12977 20.14 6.95976 20.14 10.6098 20.14H13.3998C17.0498 20.14 18.8898 20.14 20.2498 19.07C20.4698 18.9 20.6698 18.71 20.8498 18.5C22.0098 17.2 22.0098 15.46 22.0098 12C22.0098 8.53999 22.0098 6.79999 20.8498 5.49999H20.8398ZM4.18977 6.42999C4.31977 6.27999 4.45977 6.14999 4.61977 6.02999C5.59977 5.25999 7.26977 5.25999 10.5998 5.25999H13.3898C16.7198 5.25999 18.3898 5.25999 19.3698 6.02999C19.5198 6.14999 19.6698 6.28999 19.7998 6.42999C20.2198 6.89999 20.4198 7.55999 20.5098 8.50999H3.48977C3.58977 7.54999 3.77977 6.89999 4.19977 6.42999H4.18977ZM19.7998 17.57C19.6698 17.72 19.5198 17.85 19.3698 17.97C18.3898 18.74 16.7198 18.74 13.3898 18.74H10.5998C7.26977 18.74 5.59977 18.74 4.61977 17.97C4.45977 17.85 4.31977 17.71 4.18977 17.57C3.38977 16.67 3.38977 15.11 3.38977 12C3.38977 11.21 3.38977 10.51 3.39977 9.90999H20.5898C20.5998 10.52 20.5998 11.21 20.5998 12C20.5998 15.11 20.5998 16.67 19.7998 17.57Z" fill="#757575" />
                      <path d="M11.5302 15.02H10.1302C9.74018 15.02 9.43018 15.33 9.43018 15.72C9.43018 16.11 9.74018 16.42 10.1302 16.42H11.5302C11.9202 16.42 12.2302 16.11 12.2302 15.72C12.2302 15.33 11.9202 15.02 11.5302 15.02Z" fill="#757575" />
                      <path d="M17.5801 15.02H14.3201C13.9301 15.02 13.6201 15.33 13.6201 15.72C13.6201 16.11 13.9301 16.42 14.3201 16.42H17.5801C17.9701 16.42 18.2801 16.11 18.2801 15.72C18.2801 15.33 17.9701 15.02 17.5801 15.02Z" fill="#757575" />
                    </svg>
                  </div>
                  <div className="detail-content">
                    <h3 className="detail-title">{paymentLabel}</h3>
                    <p className="detail-status">Ждет оплаты</p>
                  </div>
                </div>

                {/* Стоимость доставки */}
                {(isPickup || isCourier) && (
                  <div className="order-detail-item">
                    <div className="detail-content detail-delivery">
                      <h3 className="detail-price ">
                        {deliveryFree
                          ? <span className="text-success">бесплатно</span>
                          : deliveryCostByn
                            ? formatAmount(deliveryCostByn)
                            : <span className="text-muted">уточняется</span>
                        }
                      </h3>
                      <p className="detail-subtitle">{deliveryTypeLabel}</p>
                    </div>
                  </div>
                )}

                {/* Сумма заказа */}
                <div className="order-detail-item total-amount">
                  <div className="detail-content">
                    <h3 className="detail-price">{formatAmount(attrs.total_amount)}</h3>
                    <p className="detail-subtitle">Сумма заказа</p>
                  </div>
                </div>

                {/* Планируемая дата получения */}
                <div className="order-detail-item">
                  <div className="detail-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 22C6.49 22 2 17.51 2 12C2 6.49 6.49 2 12 2C17.51 2 22 6.49 22 12C22 17.51 17.51 22 12 22ZM12 3.4C7.26 3.4 3.4 7.26 3.4 12C3.4 16.74 7.26 20.6 12 20.6C16.74 20.6 20.6 16.74 20.6 12C20.6 7.26 16.74 3.4 12 3.4Z" fill="#757575" />
                      <path d="M13.8601 14.56C13.6801 14.56 13.5001 14.49 13.3701 14.36L11.5101 12.5C11.3801 12.37 11.3101 12.19 11.3101 12.01V8.29003C11.3101 7.90003 11.6201 7.59003 12.0101 7.59003C12.4001 7.59003 12.7101 7.90003 12.7101 8.29003V11.72L14.3701 13.38C14.6401 13.65 14.6401 14.09 14.3701 14.37C14.2301 14.51 14.0601 14.57 13.8801 14.57L13.8601 14.56Z" fill="#757575" />
                    </svg>
                  </div>
                  <div className="detail-content">
                    <h3 className="detail-title">через 20 дней</h3>
                    <p className="detail-subtitle">Планируемая дата получения заказа</p>
                  </div>
                </div>

                {/* ── Самовывоз: пункт выдачи ── */}
                {pvz && (
                  <div className="order-detail-item">
                    <div className="detail-icon">
                      <ProviderIcon provider={pvz.provider} />
                    </div>
                    <div className="detail-content">
                      <h3 className="detail-title">{pvzAddress}</h3>
                      <p className="detail-subtitle">{PROVIDER_NAMES[pvz.provider] || pvz.provider}</p>
                    </div>
                  </div>
                )}

                {/* ── Курьер: адрес доставки ── */}
                {deliveryAddr && (
                  <div className="order-detail-item">
                    <div className="detail-icon">
                      <ProviderIcon provider={courierProvider} />
                    </div>
                    <div className="detail-content">
                      <h3 className="detail-title detai-delivery">{courierAddress}</h3>
                      <p className="detail-subtitle">{courierProviderLabel}</p>
                    </div>
                  </div>
                )}

              </section>

              {/* ========== ВЫБРАННЫЕ УСЛУГИ ========== */}
              {(services.length > 0 || attrs.full_name) && (
                <section className="selected-services-section">
                  {services.length > 0 && (
                    <>
                      <div className="alert alert-info">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 2C6.49 2 2 6.49 2 12C2 17.51 6.49 22 12 22C17.51 22 22 17.51 22 12C22 6.49 17.51 2 12 2ZM12.7 15.72C12.7 16.11 12.39 16.42 12 16.42C11.61 16.42 11.3 16.11 11.3 15.72V11.53C11.3 11.14 11.61 10.83 12 10.83C12.39 10.83 12.7 11.14 12.7 11.53V15.72ZM12 9.12C11.54 9.12 11.16 8.75 11.16 8.29C11.16 7.82 11.53 7.44 12 7.44C12.47 7.44 12.84 7.81 12.84 8.28C12.84 8.75 12.47 9.12 12 9.12Z" fill="#0058A3" />
                        </svg>
                        <span>Услуги оплачиваются отдельно. С Вами свяжется сотрудник колл-центра для уточнения всех деталей.</span>
                      </div>
                      <div className="services-header">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M15.4201 11.64L16.5701 10.49C18.0401 10.88 19.6401 10.47 20.7401 9.36998C21.9501 8.15998 22.3301 6.34998 21.7101 4.75998C21.6301 4.53998 21.4301 4.37998 21.2001 4.32998C20.9701 4.27998 20.7301 4.34998 20.5601 4.51998L19.2901 5.78998H18.2101V4.70998L19.4701 3.43998C19.6401 3.26998 19.7101 3.02998 19.6601 2.79998C19.6101 2.56998 19.4501 2.37998 19.2301 2.28998C17.6401 1.66998 15.8301 2.05998 14.6201 3.25998C13.5201 4.35998 13.1101 5.94998 13.5001 7.42998L10.9501 9.97998L7.03014 6.05998L7.83014 5.25998C7.99014 5.09998 8.06014 4.87998 8.03014 4.64998C8.00014 4.41998 7.85014 4.23998 7.65014 4.13998L4.55014 2.58998C4.28014 2.45998 3.96014 2.50998 3.74014 2.71998L2.71014 3.74998C2.50014 3.95998 2.45014 4.28998 2.58014 4.55998L4.13014 7.65998C4.23014 7.85998 4.42014 7.99998 4.64014 8.03998C4.68014 8.03998 4.71014 8.03998 4.75014 8.03998C4.93014 8.03998 5.11014 7.96998 5.24014 7.83998L6.04014 7.03998L9.96014 10.96L7.41014 13.51C5.93014 13.11 4.34014 13.53 3.24014 14.63C2.03014 15.84 1.65014 17.65 2.27014 19.24C2.35014 19.46 2.55014 19.62 2.78014 19.67C3.01014 19.72 3.25014 19.65 3.42014 19.48L4.69014 18.22H5.77014V19.3L4.50014 20.57C4.33014 20.74 4.26014 20.98 4.31014 21.21C4.36014 21.44 4.52014 21.63 4.74014 21.72C5.25014 21.92 5.77014 22.01 6.30014 22.01C7.43014 22.01 8.53014 21.57 9.35014 20.75C10.4501 19.65 10.8601 18.06 10.4701 16.58L11.6201 15.43L17.0701 20.88C17.4801 21.29 18.0101 21.49 18.5501 21.49C19.0901 21.49 19.6201 21.29 20.0301 20.88L20.8501 20.06C21.6601 19.24 21.6601 17.91 20.8501 17.1L15.4001 11.65L15.4201 11.64ZM4.96014 6.16998L4.07014 4.37998L4.39014 4.05998L6.18014 4.94998L4.96014 6.16998ZM9.20014 15.89C9.00014 16.09 8.94014 16.38 9.04014 16.63C9.46014 17.71 9.20014 18.93 8.38014 19.75C7.86014 20.27 7.17014 20.57 6.45014 20.6L6.97014 20.08C7.10014 19.95 7.17014 19.77 7.17014 19.59V17.52C7.17014 17.13 6.86014 16.82 6.47014 16.82H4.40014C4.22014 16.82 4.04014 16.89 3.91014 17.02L3.39014 17.54C3.42014 16.83 3.72014 16.14 4.24014 15.61C5.06014 14.79 6.28014 14.53 7.36014 14.95C7.62014 15.05 7.91014 14.99 8.10014 14.79L14.7901 8.09998C14.9901 7.89998 15.0501 7.60998 14.9501 7.35998C14.5301 6.27998 14.7901 5.05998 15.6101 4.23998C16.1301 3.71998 16.8301 3.41998 17.5401 3.38998L17.0201 3.90998C16.8901 4.03998 16.8201 4.21998 16.8201 4.39998V6.46998C16.8201 6.85998 17.1301 7.16998 17.5201 7.16998H19.5901C19.7801 7.16998 19.9501 7.09998 20.0801 6.96998L20.6001 6.44998C20.5701 7.15998 20.2701 7.84998 19.7501 8.37998C18.9301 9.19998 17.7101 9.45998 16.6301 9.03998C16.3701 8.93998 16.0801 8.99998 15.8901 9.19998L9.20014 15.89ZM19.8901 19.07L19.0701 19.89C18.8001 20.16 18.3501 20.16 18.0801 19.89L12.6301 14.44L14.4401 12.63L19.8901 18.08C20.1601 18.35 20.1601 18.8 19.8901 19.07Z" fill="#757575" />
                        </svg>
                        <h3 className="services-title">Услуги:</h3>
                      </div>
                      <ul className="services-list-simple">
                        {services.map((s, i) => <li key={i}>{SERVICE_LABELS[s] || s}</li>)}
                      </ul>
                    </>
                  )}

                  {/* Получатель */}
                  {attrs.full_name && (
                    <div className="recipient-section">
                      <div className="recipient-header">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M15.0501 13.53C16.9101 12.47 18.1701 10.47 18.1701 8.17C18.1701 4.77 15.4001 2 12.0001 2C8.60014 2 5.83014 4.77 5.83014 8.17C5.83014 10.46 7.09014 12.46 8.95014 13.53C5.85014 14.75 3.64014 17.77 3.64014 21.31C3.64014 21.7 3.95014 22.01 4.34014 22.01C4.73014 22.01 5.04014 21.7 5.04014 21.31C5.04014 17.47 8.16014 14.35 12.0001 14.35C15.8401 14.35 18.9601 17.47 18.9601 21.31C18.9601 21.7 19.2701 22.01 19.6601 22.01C20.0501 22.01 20.3601 21.7 20.3601 21.31C20.3601 17.78 18.1501 14.76 15.0501 13.54V13.53ZM7.23014 8.17C7.23014 5.54 9.37014 3.4 12.0001 3.4C14.6301 3.4 16.7701 5.54 16.7701 8.17C16.7701 10.8 14.6301 12.94 12.0001 12.94C9.37014 12.94 7.23014 10.8 7.23014 8.17Z" fill="#757575" />
                        </svg>
                        <h3 className="recipient-name">{attrs.full_name}</h3>
                      </div>
                      <div className="contact-info-list">
                        {attrs.phone && <div className="contact-info-item"><span>+{attrs.phone}</span></div>}
                        {attrs.email && <div className="contact-info-item"><span>{attrs.email}</span></div>}
                      </div>
                    </div>
                  )}
                </section>
              )}

              {/* ========== ТОВАРЫ В ЗАКАЗЕ ========== */}
              {items.length > 0 && (
                <div className="products zakazi">
                  <div className="order-card">
                    <div className="order-items">
                      {items.map((item) => {
                        const a = item.attributes || {};
                        return (
                          <div key={item.id} className="order-item">
                            <img src={resolveImageUrl(a.image_url)} alt={a.name} className="item-image" />
                            <div className="flex-grow-1">
                              <div className="item-infos">
                                <div className="item-name">{a.name}</div>
                                {a.description && (
                                  <div className="item-desc">{a.description}</div>
                                )}
                              </div>
                              <div className="item-meta">
                                <span className="item-quantity">{a.quantity} шт</span>
                                <span className="item-price">{formatAmount(a.price_byn)}</span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {loading && <p style={{ textAlign: 'center', color: '#9e9e9e' }}>Загрузка...</p>}

            </div>
          </div>
        </div>
      </div>
    </main>
  );
}