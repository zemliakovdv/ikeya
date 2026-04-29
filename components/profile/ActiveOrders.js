// components/profile/ActiveOrders.js
'use client';

import { useState, useEffect, useRef } from 'react';
import { resolvePaymentUrl } from '@/lib/utils/paymentUrl';
import TrackingModal from '@/components/profile/TrackingModal';

function pad(n) { return String(n).padStart(2, '0'); }

function useCountdown(initialSeconds) {
  const [timeLeft, setTimeLeft] = useState(initialSeconds ?? null);
  const timerRef = useRef(null);

  useEffect(() => {
    if (initialSeconds === null || initialSeconds <= 0) return;
    setTimeLeft(initialSeconds);
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) { clearInterval(timerRef.current); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [initialSeconds]);

  if (timeLeft === null) return null;
  return `${pad(Math.floor(timeLeft / 60))}:${pad(timeLeft % 60)}`;
}

const OrderCard = ({ order }) => {
  const [copied, setCopied] = useState(false);
  const [showTracking, setShowTracking] = useState(false);
  const countdown = useCountdown(order.paymentSecondsLeft);

  function handleCopy() {
    navigator.clipboard.writeText(String(order.id)).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  const renderStatusSection = () => {
    if (order.status === 'awaiting') {
      return (
        <div className="order-status">
          <div className="order-status-content">
            <div className="order-status-inner">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12 2C6.49 2 2 6.49 2 12C2 17.51 6.49 22 12 22C17.51 22 22 17.51 22 12C22 6.49 17.51 2 12 2ZM11.3 8.28C11.3 7.89 11.61 7.58 12 7.58C12.39 7.58 12.7 7.89 12.7 8.28V12.47C12.7 12.86 12.39 13.17 12 13.17C11.61 13.17 11.3 12.86 11.3 12.47V8.28ZM12.83 15.72C12.83 16.18 12.46 16.56 11.99 16.56C11.52 16.56 11.15 16.18 11.15 15.72C11.15 15.26 11.52 14.88 11.99 14.88C12.46 14.88 12.83 15.25 12.83 15.71V15.72Z" fill="#B71C1C" />
              </svg>
              <div className="status-text">
                Заказ ожидает оплаты
                {countdown && <> <strong className="timer-value">{countdown}.</strong></>}
                {' '}<span>Скопируйте код заказа для удобства оплаты. Автоматическая отмена заказа происходит сразу после истечения срока оплаты.</span>
              </div>
            </div>
            <div className="order-actions">
              {resolvePaymentUrl(order.paymentUrl) ? (
                <a
                  href={resolvePaymentUrl(order.paymentUrl)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-danger"
                >
                  Оплатить заказ
                </a>
              ) : (
                <button className="btn btn-danger" disabled>Оплатить заказ</button>
              )}
            </div>
          </div>
        </div>
      );
    }

    if (['transit', 'customs-belarus', 'in-transit-pvz'].includes(order.status)) {
      return (
        <div className="order-address order-track">
          <div
            className="order-address__inner"
            style={{ cursor: 'pointer' }}
            onClick={() => setShowTracking(true)}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M16.1415 3.83329L13.8748 2.73329C12.3998 2.01663 11.6582 1.66663 10.7748 1.66663C9.8915 1.66663 9.14984 2.02496 7.67484 2.74163L5.40817 3.84163C3.99984 4.52496 3.2165 4.89996 3.2165 5.74163V8.06663C3.2165 8.39163 3.47484 8.64996 3.79984 8.64996C4.12484 8.64996 4.38317 8.39163 4.38317 8.06663V7.12496C4.67484 7.28329 5.0165 7.44996 5.4165 7.64163L7.68317 8.73329C8.83317 9.29163 9.53317 9.62496 10.1998 9.74996V17.075C9.79984 16.9583 9.29984 16.7416 8.55817 16.425C7.18317 15.825 6.09984 15.35 5.37484 14.925C5.28317 14.875 5.18317 14.8416 5.08317 14.8416H2.24984C1.92484 14.8416 1.6665 15.1 1.6665 15.425C1.6665 15.75 1.92484 16.0083 2.24984 16.0083H4.92484C5.69984 16.45 6.7665 16.9166 8.09984 17.4916C9.38317 18.05 10.0248 18.3333 10.7832 18.3333C11.5415 18.3333 12.1832 18.05 13.4665 17.4916C16.7082 16.075 18.3415 15.3666 18.3415 13.875V5.73329C18.3415 4.89163 17.5665 4.51663 16.1498 3.83329H16.1415ZM4.38317 5.76663C4.48317 5.57496 5.2165 5.22496 5.9165 4.88329L8.18317 3.78329C10.8082 2.51663 10.7332 2.50829 13.3665 3.78329L13.4165 3.80829L6.7915 7.01663L5.90817 6.59163C5.19984 6.24996 4.47484 5.89996 4.37484 5.76663H4.38317ZM8.13317 7.65829L14.7582 4.44996L15.6415 4.87496C16.3498 5.21663 17.0915 5.57496 17.1832 5.69996C17.0915 5.87496 16.3582 6.23329 15.6415 6.58329L13.3748 7.67496C10.7415 8.94996 10.8165 8.94996 8.18317 7.67496L8.13317 7.64996V7.65829ZM12.9998 16.425C12.2582 16.75 11.7582 16.9666 11.3582 17.075V9.74996C12.0332 9.62496 12.7332 9.29163 13.8748 8.73329L16.1415 7.64163C16.5415 7.44996 16.8748 7.28329 17.1748 7.12496V13.8833C17.1748 14.6083 15.5998 15.3 12.9998 16.4333V16.425Z" fill="#181818" />
              <path d="M2.24984 11.3583H4.57484C4.89984 11.3583 5.15817 11.1 5.15817 10.775C5.15817 10.45 4.89984 10.1917 4.57484 10.1917H2.24984C1.92484 10.1917 1.6665 10.45 1.6665 10.775C1.6665 11.1 1.92484 11.3583 2.24984 11.3583Z" fill="#181818" />
              <path d="M2.24984 13.6834H4.57484C4.89984 13.6834 5.15817 13.4251 5.15817 13.1001C5.15817 12.7751 4.89984 12.5167 4.57484 12.5167H2.24984C1.92484 12.5167 1.6665 12.7751 1.6665 13.1001C1.6665 13.4251 1.92484 13.6834 2.24984 13.6834Z" fill="#181818" />
            </svg>
            <div className="address-text where-oreder">Где мой заказ</div>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M12.775 9.99999C12.775 10.9333 10.2417 13.1667 8.125 14.875C7.88334 15.0667 7.53334 15.0333 7.34167 14.7917C7.15 14.55 7.18333 14.2 7.425 14.0083C9.28333 12.5083 11.375 10.5917 11.65 9.99999C11.375 9.40833 9.28333 7.49166 7.425 5.99166C7.18333 5.79999 7.15 5.44999 7.34167 5.20833C7.53334 4.96666 7.88334 4.93333 8.125 5.12499C10.25 6.83333 12.775 9.07499 12.775 9.99999Z" fill="#BDBDBD" />
            </svg>
          </div>
        </div>
      );
    }

    if (['arrived-pvz'].includes(order.status)) {
      return (
        <div className="orders-statuses">
          <div className="order-address">
            <div className="address-text">
              <strong>{order.trackNumber || '—'}</strong><br />Трек-номер
            </div>
          </div>
          <div className="order-status status-info">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M12 2C6.49 2 2 6.49 2 12C2 17.51 6.49 22 12 22C17.51 22 22 17.51 22 12C22 6.49 17.51 2 12 2ZM12.7 15.72C12.7 16.11 12.39 16.42 12 16.42C11.61 16.42 11.3 16.11 11.3 15.72V11.53C11.3 11.14 11.61 10.83 12 10.83C12.39 10.83 12.7 11.14 12.7 11.53V15.72ZM12 9.12C11.54 9.12 11.16 8.75 11.16 8.29C11.16 7.82 11.53 7.44 12 7.44C12.47 7.44 12.84 7.81 12.84 8.28C12.84 8.75 12.47 9.12 12 9.12Z" fill="#0058A3" />
            </svg>
            <div className="status-text">
              Выдача заказов осуществляется по трек-номеру и документу, удостоверяющему личность.
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  const getBadgeClass = () => {
    const map = {
      'awaiting':        'badge-awaiting',
      'assembly':        'badge-assembly',
      'transit':         'badge-available',
      'customs-belarus': 'badge-available',
      'in-transit-pvz':  'badge-available',
      'arrived-pvz':     'badge-ready',
      'delivered':       'badge-havit',
      'canceled':        'badge-canceled',
    };
    return map[order.status] || '';
  };

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
                style={{ marginLeft: '8px', background: 'none', border: 'none', cursor: 'pointer', padding: '0 4px', verticalAlign: 'middle' }}
              >
                {copied ? (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M20.9798 9.53C20.1798 8.73 19.0798 8.56 17.3498 8.52C17.3398 6.08 17.2198 4.68 16.3498 3.61C16.1698 3.39 15.9598 3.18 15.7398 3C14.5198 2 12.8998 2 9.67977 2C6.45977 2 4.83977 2 3.61977 3C3.39977 3.18 3.18977 3.39 3.00977 3.61C2.00977 4.83 2.00977 6.45 2.00977 9.67C2.00977 12.89 2.00977 14.51 3.00977 15.73C3.18977 15.95 3.39977 16.16 3.61977 16.34C4.68977 17.22 6.08977 17.33 8.52977 17.34C8.56977 19.08 8.73977 20.18 9.53977 20.97C10.5598 21.99 12.0698 21.99 14.7998 21.99H15.7298C18.4598 21.99 19.9698 21.99 20.9898 20.97C22.0098 19.95 22.0098 18.44 22.0098 15.71V14.78C22.0098 12.05 22.0098 10.54 20.9898 9.52L20.9798 9.53Z" fill="#757575" />
                  </svg>
                ) : (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M20.9798 9.53C20.1798 8.73 19.0798 8.56 17.3498 8.52C17.3398 6.08 17.2198 4.68 16.3498 3.61C16.1698 3.39 15.9598 3.18 15.7398 3C14.5198 2 12.8998 2 9.67977 2C6.45977 2 4.83977 2 3.61977 3C3.39977 3.18 3.18977 3.39 3.00977 3.61C2.00977 4.83 2.00977 6.45 2.00977 9.67C2.00977 12.89 2.00977 14.51 3.00977 15.73C3.18977 15.95 3.39977 16.16 3.61977 16.34C4.68977 17.22 6.08977 17.33 8.52977 17.34C8.56977 19.08 8.73977 20.18 9.53977 20.97C10.5598 21.99 12.0698 21.99 14.7998 21.99H15.7298C18.4598 21.99 19.9698 21.99 20.9898 20.97C22.0098 19.95 22.0098 18.44 22.0098 15.71V14.78C22.0098 12.05 22.0098 10.54 20.9898 9.52L20.9798 9.53Z" fill="#757575" />
                  </svg>
                )}
              </button>
              {' '}от {order.date}
            </div>
            <div className={`order-badge ${getBadgeClass()}`}>
              {order.statusDescription || order.status}
            </div>
          </div>
          {order.dateRange && order.dateRange !== '—' && (
            <div className="order-subtitle">
              Планируется дата получения заказа: <span className="order_the_date">{order.dateRange}</span>
            </div>
          )}
        </div>
        <div className="order-price">{order.price} р.</div>
      </div>

      {renderStatusSection()}

      <div className="order-items">
        {order.items?.length > 0 ? (
          order.items.map((item, idx) => (
            <div key={idx} className="order-item">
              <img
                src={item.image || '/assets/img/profile/active_1.png'}
                alt={item.name}
                className="item-image"
                onError={(e) => { e.target.src = '/assets/img/profile/active_1.png'; }}
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
        <OrderCard key={order.id} order={order} />
      ))}
    </>
  );
}