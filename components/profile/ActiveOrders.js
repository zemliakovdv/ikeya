'use client';

// components/profile/ActiveOrders.js

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { resolvePaymentUrl } from '@/lib/utils/paymentUrl';
import TrackingModal from '@/components/profile/TrackingModal';

function pad(n) {
  return String(n).padStart(2, '0');
}

function useCountdown(initialSeconds) {
  const [timeLeft, setTimeLeft] = useState(initialSeconds ?? null);
  const timerRef = useRef(null);

  useEffect(() => {
    if (initialSeconds === null || initialSeconds === undefined || initialSeconds <= 0) {
      setTimeLeft(null);
      return undefined;
    }

    setTimeLeft(initialSeconds);

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (!prev || prev <= 1) {
          clearInterval(timerRef.current);
          return null;
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [initialSeconds]);

  if (!timeLeft) return null;

  return `${pad(Math.floor(timeLeft / 60))}:${pad(timeLeft % 60)}`;
}

function InfoIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M12 2C6.49 2 2 6.49 2 12C2 17.51 6.49 22 12 22C17.51 22 22 17.51 22 12C22 6.49 17.51 2 12 2ZM12.7 15.72C12.7 16.11 12.39 16.42 12 16.42C11.61 16.42 11.3 16.11 11.3 15.72V11.53C11.3 11.14 11.61 10.83 12 10.83C12.39 10.83 12.7 11.14 12.7 11.53V15.72ZM12 9.12C11.54 9.12 11.16 8.75 11.16 8.29C11.16 7.82 11.53 7.44 12 7.44C12.47 7.44 12.84 7.81 12.84 8.28C12.84 8.75 12.47 9.12 12 9.12Z" fill="#0058A3" />
    </svg>
  );
}

function CopyIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M20.98 9.53C20.18 8.73 19.08 8.56 17.35 8.52C17.34 6.08 17.22 4.68 16.35 3.61C16.17 3.39 15.96 3.18 15.74 3C14.52 2 12.9 2 9.68001 2C6.46001 2 4.84001 2 3.62001 3C3.40001 3.18 3.19001 3.39 3.01001 3.61C2.01001 4.83 2.01001 6.45 2.01001 9.67C2.01001 12.89 2.01001 14.51 3.01001 15.73C3.19001 15.95 3.40001 16.16 3.62001 16.34C4.69001 17.22 6.09001 17.33 8.53001 17.34C8.57001 19.08 8.74001 20.18 9.54001 20.97C10.56 21.99 12.07 21.99 14.8 21.99H15.73C18.46 21.99 19.97 21.99 20.99 20.97C22.01 19.95 22.01 18.44 22.01 15.71V14.78C22.01 12.05 22.01 10.54 20.99 9.52L20.98 9.53ZM4.50001 15.27C4.35001 15.15 4.21001 15 4.08001 14.85C3.39001 14.01 3.39001 12.56 3.39001 9.68C3.39001 6.8 3.39001 5.34 4.08001 4.51C4.21001 4.36 4.35001 4.22 4.50001 4.09C5.34001 3.4 6.79001 3.4 9.67001 3.4C12.55 3.4 14.01 3.4 14.84 4.09C14.99 4.21 15.13 4.36 15.26 4.51C15.85 5.23 15.93 6.42 15.94 8.52C15.86 8.52 15.79 8.52 15.71 8.52H14.78C12.05 8.52 10.54 8.52 9.52001 9.54C8.50001 10.56 8.50001 12.07 8.50001 14.8V15.73C8.50001 15.81 8.50001 15.88 8.50001 15.96C6.24001 15.94 5.18001 15.84 4.49001 15.28L4.50001 15.27ZM20.6 15.72C20.6 18.16 20.6 19.38 19.99 19.99C19.38 20.6 18.15 20.6 15.72 20.6H14.79C12.35 20.6 11.13 20.6 10.52 19.99C9.91001 19.38 9.91001 18.15 9.91001 15.72V14.79C9.91001 12.35 9.91001 11.13 10.52 10.52C11.13 9.91 12.36 9.91 14.79 9.91H15.72C18.15 9.91 19.38 9.91 19.99 10.52C20.6 11.13 20.6 12.36 20.6 14.79V15.72Z" fill="#BDBDBD" />
    </svg>
  );
}

function PackageIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M16.1417 3.83329L13.8751 2.73329C12.4001 2.01663 11.6584 1.66663 10.7751 1.66663C9.89175 1.66663 9.15008 2.02496 7.67508 2.74163L5.40841 3.84163C4.00008 4.52496 3.21675 4.89996 3.21675 5.74163V8.06663C3.21675 8.39163 3.47508 8.64996 3.80008 8.64996C4.12508 8.64996 4.38341 8.39163 4.38341 8.06663V7.12496C4.67508 7.28329 5.01675 7.44996 5.41675 7.64163L7.68341 8.73329C8.83341 9.29163 9.53341 9.62496 10.2001 9.74996V17.075C9.80008 16.9583 9.30008 16.7416 8.55841 16.425C7.18341 15.825 6.10008 15.35 5.37508 14.925C5.28341 14.875 5.18341 14.8416 5.08341 14.8416H2.25008C1.92508 14.8416 1.66675 15.1 1.66675 15.425C1.66675 15.75 1.92508 16.0083 2.25008 16.0083H4.92508C5.70008 16.45 6.76675 16.9166 8.10008 17.4916C9.38341 18.05 10.0251 18.3333 10.7834 18.3333C11.5417 18.3333 12.1834 18.05 13.4667 17.4916C16.7084 16.075 18.3417 15.3666 18.3417 13.875V5.73329C18.3417 4.89163 17.5667 4.51663 16.1501 3.83329H16.1417ZM4.38341 5.76663C4.48341 5.57496 5.21675 5.22496 5.91675 4.88329L8.18341 3.78329C10.8084 2.51663 10.7334 2.50829 13.3667 3.78329L13.4167 3.80829L6.79175 7.01663L5.90841 6.59163C5.20008 6.24996 4.47508 5.89996 4.37508 5.76663H4.38341ZM8.13341 7.65829L14.7584 4.44996L15.6417 4.87496C16.3501 5.21663 17.0917 5.57496 17.1834 5.69996C17.0917 5.87496 16.3584 6.23329 15.6417 6.58329L13.3751 7.67496C10.7417 8.94996 10.8167 8.94996 8.18341 7.67496L8.13341 7.64996V7.65829ZM13.0001 16.425C12.2584 16.75 11.7584 16.9666 11.3584 17.075V9.74996C12.0334 9.62496 12.7334 9.29163 13.8751 8.73329L16.1417 7.64163C16.5417 7.44996 16.8751 7.28329 17.1751 7.12496V13.8833C17.1751 14.6083 15.6001 15.3 13.0001 16.4333V16.425Z" fill="#181818" />
      <path d="M2.25008 11.3583H4.57508C4.90008 11.3583 5.15841 11.1 5.15841 10.775C5.15841 10.45 4.90008 10.1917 4.57508 10.1917H2.25008C1.92508 10.1917 1.66675 10.45 1.66675 10.775C1.66675 11.1 1.92508 11.3583 2.25008 11.3583Z" fill="#181818" />
      <path d="M2.25008 13.6834H4.57508C4.90008 13.6834 5.15841 13.4251 5.15841 13.1001C5.15841 12.7751 4.90008 12.5167 4.57508 12.5167H2.25008C1.92508 12.5167 1.66675 12.7751 1.66675 13.1001C1.66675 13.4251 1.92508 13.6834 2.25008 13.6834Z" fill="#181818" />
    </svg>
  );
}

function firstImageFromValue(value) {
  if (Array.isArray(value)) {
    return value[0] || null;
  }

  return value || null;
}

function getOrderItemImage(item = {}) {
  return (
    item.image ||
    item.image_url ||
    item.local_image ||
    firstImageFromValue(item.local_images) ||
    firstImageFromValue(item.images?.local_images) ||
    firstImageFromValue(item.images?.images) ||
    item.attributes?.image_url ||
    item.product?.image ||
    item.product?.image_url ||
    firstImageFromValue(item.product?.local_images) ||
    firstImageFromValue(item.product?.images?.local_images) ||
    firstImageFromValue(item.product?.images?.images) ||
    null
  );
}

function ArrowIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="M12.78 10C12.78 10.93 10.24 13.17 8.13 14.88C7.88 15.07 7.53 15.03 7.34 14.79C7.15 14.55 7.18 14.2 7.43 14.01C9.28 12.51 11.38 10.59 11.65 10C11.38 9.41 9.28 7.49 7.43 5.99C7.18 5.8 7.15 5.45 7.34 5.21C7.53 4.97 7.88 4.93 8.13 5.12C10.25 6.83 12.78 9.07 12.78 10Z"
        fill="#BDBDBD"
      />
    </svg>
  );
}

const isEuropostOrder = (order) =>
  order?.deliveryType === 'europost_pickup' ||
  order?.deliveryType === 'courier' ||
  order?.deliveryType === 'ikeya_delivery';

const OrderCard = ({ order }) => {
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const [trackCopied, setTrackCopied] = useState(false);
  const [showTracking, setShowTracking] = useState(false);

  const countdown = useCountdown(order.paymentSecondsLeft);
  const paymentUrl = resolvePaymentUrl(order.paymentUrl) || order.paymentUrl || null;

  const shouldShowPaymentBlock = Boolean(
    !order.isDraft &&
    !order.paymentExpired &&
    paymentUrl &&
    (
      order.isAwaitingPayment === true ||
      order.status === 'awaiting' ||
      order.rawStatus === 'created' ||
      order.rawStatus === 'processing'
    )
  );

  function handleCopy() {
    const value = order.id || order.publicUid || order.draftId;

    if (!value) return;

    navigator.clipboard.writeText(String(value)).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  function handleTrackCopy() {
    if (!order?.trackNumber) return;

    navigator.clipboard.writeText(String(order.trackNumber)).then(() => {
      setTrackCopied(true);
      setTimeout(() => setTrackCopied(false), 2000);
    });
  }

  function renderTrackNumberCard() {
    if (!isEuropostOrder(order) || !order.trackNumber) {
      return null;
    }

    return (
      <div className="order-address">
        <div className="order-address__inner">
          <div className="address-text">
            <strong>{order.trackNumber}</strong>
            <br />
            Трек-номер
          </div>

          <button
            className="btn-copy-order"
            onClick={handleTrackCopy}
            title="Скопировать трек-номер"
            type="button"
            style={{
              marginLeft: '8px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '0 4px',
              verticalAlign: 'middle',
            }}
          >
            {trackCopied ? (
              <span style={{ color: '#00910A', fontSize: 14 }}>Трек-номер скопирован</span>
            ) : (
              <CopyIcon />
            )}
          </button>
        </div>
      </div>
    );
  }

  function renderDraftStatus() {
    return (
      <div className="order-status">
        <div className="order-status-content">
          <div className="order-status-inner">
            <InfoIcon />
            <div className="status-text">
              Заказ ожидает оформления. Вы можете продолжить в любой момент.
            </div>
          </div>

          <div className="order-actions">
            <button
              className="btn btn-primary"
              type="button"
              onClick={() => router.push(`/checkout?draft_id=${order.draftId || order.id}`)}
            >
              Продолжить оформление
            </button>
          </div>
        </div>
      </div>
    );
  }

  function renderPaymentStatus() {
    return (
      <div className="order-status">
        <div className="order-status-content">
          <div className="order-status-inner">
            <InfoIcon color="#B71C1C" />

            <div className="status-text">
              Заказ ожидает оплаты
              {countdown && <> <strong className="timer-value">{countdown}.</strong></>}
              {' '}
              <span>
                Скопируйте код заказа для удобства оплаты. Автоматическая отмена заказа происходит сразу после истечения срока оплаты.
              </span>
            </div>
          </div>

          <div className="order-actions">
            <a
              href={paymentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-danger"
            >
              Оплатить заказ
            </a>
          </div>
        </div>
      </div>
    );
  }

  function renderTrackingStatus() {
    return (
      <div className="orders-statuses">
        {renderTrackNumberCard()}

        <div className="order-address order-track">
          <div
            className="order-address__inner"
            style={{ cursor: 'pointer' }}
            onClick={() => setShowTracking(true)}
          >
            <PackageIcon />
            <div className="address-text where-oreder">Где мой заказ</div>
            <ArrowIcon />
          </div>
        </div>
      </div>
    );
  }

  function renderArrivedPvzStatus() {
    return (
      <div className="orders-statuses">
        {renderTrackNumberCard()}

        <div className="order-status status-info">
          <InfoIcon />
          <div className="status-text">
            Выдача заказов осуществляется по трек-номеру и документу, удостоверяющему личность.
          </div>
        </div>
      </div>
    );
  }

  function renderStatusSection() {
    if (order.isDraft) {
      return renderDraftStatus();
    }

    if (shouldShowPaymentBlock) {
      return renderPaymentStatus();
    }

    if (['transit', 'customs-belarus', 'in-transit-pvz'].includes(order.status)) {
      return renderTrackingStatus();
    }

    if (order.status === 'arrived-pvz') {
      return renderArrivedPvzStatus();
    }

    return null;
  }

  function getBadgeClass() {
    if (order.isDraft) return 'badge-assembly';

    const map = {
      awaiting: 'badge-awaiting',
      assembly: 'badge-assembly',
      transit: 'badge-available',
      'customs-belarus': 'badge-available',
      'in-transit-pvz': 'badge-available',
      'arrived-pvz': 'badge-ready',
      delivered: 'badge-havit',
      canceled: 'badge-canceled',
    };

    return map[order.status] || '';
  }

  return (
    <div className="order-card">
      <div className="order-header">
        <div className="odrer-header_inner">
          <div className="order-header_top">
            <div className="order-title">
              Заказ № {order.id}

              <button
                className="btn-copy-order"
                onClick={handleCopy}
                title="Скопировать номер заказа"
                type="button"
                style={{
                  marginLeft: '8px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '0 4px',
                  verticalAlign: 'middle',
                }}
              >
                {copied ? (
                  <span style={{ color: '#00910A', fontSize: 14 }}>Скопировано</span>
                ) : (
                  <CopyIcon />
                )}
              </button>

              {' '}от {order.date}
            </div>

            <div className={`order-badge ${getBadgeClass()}`}>
              {order.statusDescription || order.status}
            </div>
          </div>

          {!order.isDraft && order.dateRange && order.dateRange !== '—' && (
            <div className="order-subtitle">
              Планируемая дата получения заказа:{' '}
              <span className="order_the_date">{order.dateRange}</span>
            </div>
          )}
        </div>

        <div className="order-price">{order.price} р.</div>
      </div>

      {renderStatusSection()}

      <div className="order-items">
        {order.items?.length > 0 ? (
          order.items.map((item, idx) => (
            item.product_sku ? (
              <Link
                key={`${item.product_sku || item.desc || item.name || 'item'}-${idx}`}
                href={`/product/${item.product_sku}`}
                className="order-item"
              >
                <img
                  src={getOrderItemImage(item) || '/assets/img/profile/active_1.png'}
                  alt={item.name || 'Товар'}
                  className="item-image"
                  onError={(event) => {
                    event.currentTarget.src = '/assets/img/profile/active_1.png';
                  }}
                />

                <div className="flex-grow-1">
                  <div className="item-infos">
                    <div className="item-name">{item.name}</div>
                    {item.desc && <div className="item-desc">{item.desc}</div>}
                  </div>

                  <div className="item-meta">
                    <span className="item-quantity">{item.quantity} шт</span>
                    <span className="item-price">{item.price} р.</span>
                  </div>
                </div>
              </Link>
            ) : (
              <div key={`${item.desc || item.name || 'item'}-${idx}`} className="order-item">
                <img
                  src={getOrderItemImage(item) || '/assets/img/profile/active_1.png'}
                  alt={item.name || 'Товар'}
                  className="item-image"
                  onError={(event) => {
                    event.currentTarget.src = '/assets/img/profile/active_1.png';
                  }}
                />

                <div className="flex-grow-1">
                  <div className="item-infos">
                    <div className="item-name">{item.name}</div>
                    {item.desc && <div className="item-desc">{item.desc}</div>}
                  </div>

                  <div className="item-meta">
                    <span className="item-quantity">{item.quantity} шт</span>
                    <span className="item-price">{item.price} р.</span>
                  </div>
                </div>
              </div>
            )
          ))
        ) : (
          <div className="order-item-empty" style={{ color: '#9e9e9e', padding: '8px 0' }}>
            Список товаров недоступен
          </div>
        )}
      </div>

      {showTracking && (
        <TrackingModal
          order={order}
          onClose={() => setShowTracking(false)}
        />
      )}
    </div>
  );
};

export default function ActiveOrders({ orders }) {
  if (!orders || orders.length === 0) return null;

  return (
    <>
      {orders.map((order) => (
        <OrderCard key={order.draftId || order.id} order={order} />
      ))}
    </>
  );
}
