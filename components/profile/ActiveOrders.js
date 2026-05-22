'use client';

// components/profile/ActiveOrders.js

import { useEffect, useRef, useState } from 'react';
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

function InfoIcon({ color = '#0058A3' }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 2C6.49 2 2 6.49 2 12C2 17.51 6.49 22 12 22C17.51 22 22 17.51 22 12C22 6.49 17.51 2 12 2ZM12.7 15.72C12.7 16.11 12.39 16.42 12 16.42C11.61 16.42 11.3 16.11 11.3 15.72V11.53C11.3 11.14 11.61 10.83 12 10.83C12.39 10.83 12.7 11.14 12.7 11.53V15.72ZM12 9.12C11.54 9.12 11.16 8.75 11.16 8.29C11.16 7.82 11.53 7.44 12 7.44C12.47 7.44 12.84 7.81 12.84 8.28C12.84 8.75 12.47 9.12 12 9.12Z"
        fill={color}
      />
    </svg>
  );
}

function CopyIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M8.5 8.5H6.8C5.8 8.5 5 9.3 5 10.3V18.2C5 19.2 5.8 20 6.8 20H14.7C15.7 20 16.5 19.2 16.5 18.2V16.5M9.3 4H17.2C18.2 4 19 4.8 19 5.8V13.7C19 14.7 18.2 15.5 17.2 15.5H9.3C8.3 15.5 7.5 14.7 7.5 13.7V5.8C7.5 4.8 8.3 4 9.3 4Z"
        stroke="#757575"
        strokeWidth="1.5"
      />
    </svg>
  );
}

function PackageIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="M16.14 3.83L13.88 2.73C12.4 2.02 11.66 1.67 10.78 1.67C9.89 1.67 9.15 2.03 7.67 2.74L5.41 3.84C4 4.53 3.22 4.9 3.22 5.74V8.07C3.22 8.39 3.47 8.65 3.8 8.65C4.12 8.65 4.38 8.39 4.38 8.07V7.13C4.67 7.28 5.02 7.45 5.42 7.64L7.68 8.73C8.83 9.29 9.53 9.63 10.2 9.75V17.08C9.8 16.96 9.3 16.74 8.56 16.43C7.18 15.83 6.1 15.35 5.37 14.93C5.28 14.88 5.18 14.84 5.08 14.84H2.25C1.92 14.84 1.67 15.1 1.67 15.43C1.67 15.75 1.92 16.01 2.25 16.01H4.92C5.7 16.45 6.77 16.92 8.1 17.49C9.38 18.05 10.03 18.33 10.78 18.33C11.54 18.33 12.18 18.05 13.47 17.49C16.71 16.08 18.34 15.37 18.34 13.88V5.73C18.34 4.89 17.57 4.52 16.15 3.83H16.14Z"
        fill="#181818"
      />
    </svg>
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

const OrderCard = ({ order }) => {
  const router = useRouter();
  const [copied, setCopied] = useState(false);
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
    );
  }

  function renderArrivedPvzStatus() {
    return (
      <div className="orders-statuses">
        <div className="order-address">
          <div className="address-text">
            <strong>{order.trackNumber || '—'}</strong>
            <br />
            Трек-номер
          </div>
        </div>

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
            <div key={`${item.desc || item.name || 'item'}-${idx}`} className="order-item">
              <img
                src={item.image || '/assets/img/profile/active_1.png'}
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