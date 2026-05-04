'use client';

// components/profile/ActiveOrders.js

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
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
  const router = useRouter();
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
    // Черновик — показываем кнопку "Продолжить оформление"
    if (order.isDraft) {
      return (
        <div className="order-status">
          <div className="order-status-content">
            <div className="order-status-inner">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12 2C6.49 2 2 6.49 2 12C2 17.51 6.49 22 12 22C17.51 22 22 17.51 22 12C22 6.49 17.51 2 12 2ZM12.7 15.72C12.7 16.11 12.39 16.42 12 16.42C11.61 16.42 11.3 16.11 11.3 15.72V11.53C11.3 11.14 11.61 10.83 12 10.83C12.39 10.83 12.7 11.14 12.7 11.53V15.72ZM12 9.12C11.54 9.12 11.16 8.75 11.16 8.29C11.16 7.82 11.53 7.44 12 7.44C12.47 7.44 12.84 7.81 12.84 8.28C12.84 8.75 12.47 9.12 12 9.12Z" fill="#0058A3" />
              </svg>
              <div className="status-text">
                Заказ ожидает оформления. Вы можете продолжить в любой момент.
              </div>
            </div>
            <div className="order-actions">
              <button
                className="btn btn-primary"
                onClick={() => router.push(`/checkout?draft_id=${order.id}`)}
              >
                Продолжить оформление
              </button>
            </div>
          </div>
        </div>
      );
    }

    // Ожидает оплаты
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

    // В пути
    if (['transit', 'customs-belarus', 'in-transit-pvz'].includes(order.status)) {
      return (
        <div className="order-address order-track">
          <div
            className="order-address__inner"
            style={{ cursor: 'pointer' }}
            onClick={() => setShowTracking(true)}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16.1416 3.83341L13.875 2.73341C12.4 2.01675 11.6583 1.66675 10.775 1.66675C9.89163 1.66675 9.14996 2.02508 7.67496 2.74175L5.40829 3.84175C3.99996 4.52508 3.21663 4.90008 3.21663 5.74175V8.06675C3.21663 8.39175 3.47496 8.65008 3.79996 8.65008C4.12496 8.65008 4.38329 8.39175 4.38329 8.06675V7.12508C4.67496 7.28341 5.01663 7.45008 5.41663 7.64175L7.68329 8.73341C8.83329 9.29175 9.53329 9.62508 10.2 9.75008V17.0751C9.79996 16.9584 9.29996 16.7417 8.55829 16.4251C7.18329 15.8251 6.09996 15.3501 5.37496 14.9251C5.28329 14.8751 5.18329 14.8417 5.08329 14.8417H2.24996C1.92496 14.8417 1.66663 15.1001 1.66663 15.4251C1.66663 15.7501 1.92496 16.0084 2.24996 16.0084H4.92496C5.69996 16.4501 6.76663 16.9167 8.09996 17.4917C9.38329 18.0501 10.025 18.3334 10.7833 18.3334C11.5416 18.3334 12.1833 18.0501 13.4666 17.4917C16.7083 16.0751 18.3416 15.3667 18.3416 13.8751V5.73341C18.3416 4.89175 17.5666 4.51675 16.15 3.83341H16.1416ZM4.38329 5.76675C4.48329 5.57508 5.21663 5.22508 5.91663 4.88341L8.18329 3.78341C10.8083 2.51675 10.7333 2.50841 13.3666 3.78341L13.4166 3.80841L6.79163 7.01675L5.90829 6.59175C5.19996 6.25008 4.47496 5.90008 4.37496 5.76675H4.38329ZM8.13329 7.65841L14.7583 4.45008L15.6416 4.87508C16.35 5.21675 17.0916 5.57508 17.1833 5.70008C17.0916 5.87508 16.3583 6.23341 15.6416 6.58341L13.375 7.67508C10.7416 8.95008 10.8166 8.95008 8.18329 7.67508L8.13329 7.65008V7.65841ZM13 16.4251C12.2583 16.7501 11.7583 16.9667 11.3583 17.0751V9.75008C12.0333 9.62508 12.7333 9.29175 13.875 8.73341L16.1416 7.64175C16.5416 7.45008 16.875 7.28341 17.175 7.12508V13.8834C17.175 14.6084 15.6 15.3001 13 16.4334V16.4251Z" fill="#181818" />
              <path d="M2.24996 11.3583H4.57496C4.89996 11.3583 5.15829 11.1 5.15829 10.775C5.15829 10.45 4.89996 10.1917 4.57496 10.1917H2.24996C1.92496 10.1917 1.66663 10.45 1.66663 10.775C1.66663 11.1 1.92496 11.3583 2.24996 11.3583Z" fill="#181818" />
              <path d="M2.24996 13.6833H4.57496C4.89996 13.6833 5.15829 13.4249 5.15829 13.0999C5.15829 12.7749 4.89996 12.5166 4.57496 12.5166H2.24996C1.92496 12.5166 1.66663 12.7749 1.66663 13.0999C1.66663 13.4249 1.92496 13.6833 2.24996 13.6833Z" fill="#181818" />
            </svg>
            <div className="address-text where-oreder">Где мой заказ</div>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M12.775 9.99999C12.775 10.9333 10.2417 13.1667 8.125 14.875C7.88334 15.0667 7.53334 15.0333 7.34167 14.7917C7.15 14.55 7.18333 14.2 7.425 14.0083C9.28333 12.5083 11.375 10.5917 11.65 9.99999C11.375 9.40833 9.28333 7.49166 7.425 5.99166C7.18333 5.79999 7.15 5.44999 7.34167 5.20833C7.53334 4.96666 7.88334 4.93333 8.125 5.12499C10.25 6.83333 12.775 9.07499 12.775 9.99999Z" fill="#BDBDBD" />
            </svg>
          </div>
        </div>
      );
    }

    // Прибыл в ПВЗ
    if (order.status === 'arrived-pvz') {
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
    if (order.isDraft) return 'badge-assembly';
    const map = {
      'awaiting': 'badge-awaiting',
      'assembly': 'badge-assembly',
      'transit': 'badge-available',
      'customs-belarus': 'badge-available',
      'in-transit-pvz': 'badge-available',
      'arrived-pvz': 'badge-ready',
      'delivered': 'badge-havit',
      'canceled': 'badge-canceled',
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
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20.9798 9.53C20.1798 8.73 19.0798 8.56 17.3498 8.52C17.3398 6.08 17.2198 4.68 16.3498 3.61C16.1698 3.39 15.9598 3.18 15.7398 3C14.5198 2 12.8998 2 9.67977 2C6.45977 2 4.83977 2 3.61977 3C3.39977 3.18 3.18977 3.39 3.00977 3.61C2.00977 4.83 2.00977 6.45 2.00977 9.67C2.00977 12.89 2.00977 14.51 3.00977 15.73C3.18977 15.95 3.39977 16.16 3.61977 16.34C4.68977 17.22 6.08977 17.33 8.52977 17.34C8.56977 19.08 8.73977 20.18 9.53977 20.97C10.5598 21.99 12.0698 21.99 14.7998 21.99H15.7298C18.4598 21.99 19.9698 21.99 20.9898 20.97C22.0098 19.95 22.0098 18.44 22.0098 15.71V14.78C22.0098 12.05 22.0098 10.54 20.9898 9.52L20.9798 9.53ZM4.49977 15.27C4.34977 15.15 4.20977 15 4.07977 14.85C3.38977 14.01 3.38977 12.56 3.38977 9.68C3.38977 6.8 3.38977 5.34 4.07977 4.51C4.20977 4.36 4.34977 4.22 4.49977 4.09C5.33977 3.4 6.78977 3.4 9.66977 3.4C12.5498 3.4 14.0098 3.4 14.8398 4.09C14.9898 4.21 15.1298 4.36 15.2598 4.51C15.8498 5.23 15.9298 6.42 15.9398 8.52C15.8598 8.52 15.7898 8.52 15.7098 8.52H14.7798C12.0498 8.52 10.5398 8.52 9.51977 9.54C8.49977 10.56 8.49977 12.07 8.49977 14.8V15.73C8.49977 15.81 8.49977 15.88 8.49977 15.96C6.23977 15.94 5.17977 15.84 4.48977 15.28L4.49977 15.27ZM20.5998 15.72C20.5998 18.16 20.5998 19.38 19.9898 19.99C19.3798 20.6 18.1498 20.6 15.7198 20.6H14.7898C12.3498 20.6 11.1298 20.6 10.5198 19.99C9.90977 19.38 9.90977 18.15 9.90977 15.72V14.79C9.90977 12.35 9.90977 11.13 10.5198 10.52C11.1298 9.91 12.3598 9.91 14.7898 9.91H15.7198C18.1498 9.91 19.3798 9.91 19.9898 10.52C20.5998 11.13 20.5998 12.36 20.5998 14.79V15.72Z" fill="#757575" />
                  </svg>
                ) : (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20.9798 9.53C20.1798 8.73 19.0798 8.56 17.3498 8.52C17.3398 6.08 17.2198 4.68 16.3498 3.61C16.1698 3.39 15.9598 3.18 15.7398 3C14.5198 2 12.8998 2 9.67977 2C6.45977 2 4.83977 2 3.61977 3C3.39977 3.18 3.18977 3.39 3.00977 3.61C2.00977 4.83 2.00977 6.45 2.00977 9.67C2.00977 12.89 2.00977 14.51 3.00977 15.73C3.18977 15.95 3.39977 16.16 3.61977 16.34C4.68977 17.22 6.08977 17.33 8.52977 17.34C8.56977 19.08 8.73977 20.18 9.53977 20.97C10.5598 21.99 12.0698 21.99 14.7998 21.99H15.7298C18.4598 21.99 19.9698 21.99 20.9898 20.97C22.0098 19.95 22.0098 18.44 22.0098 15.71V14.78C22.0098 12.05 22.0098 10.54 20.9898 9.52L20.9798 9.53ZM4.49977 15.27C4.34977 15.15 4.20977 15 4.07977 14.85C3.38977 14.01 3.38977 12.56 3.38977 9.68C3.38977 6.8 3.38977 5.34 4.07977 4.51C4.20977 4.36 4.34977 4.22 4.49977 4.09C5.33977 3.4 6.78977 3.4 9.66977 3.4C12.5498 3.4 14.0098 3.4 14.8398 4.09C14.9898 4.21 15.1298 4.36 15.2598 4.51C15.8498 5.23 15.9298 6.42 15.9398 8.52C15.8598 8.52 15.7898 8.52 15.7098 8.52H14.7798C12.0498 8.52 10.5398 8.52 9.51977 9.54C8.49977 10.56 8.49977 12.07 8.49977 14.8V15.73C8.49977 15.81 8.49977 15.88 8.49977 15.96C6.23977 15.94 5.17977 15.84 4.48977 15.28L4.49977 15.27ZM20.5998 15.72C20.5998 18.16 20.5998 19.38 19.9898 19.99C19.3798 20.6 18.1498 20.6 15.7198 20.6H14.7898C12.3498 20.6 11.1298 20.6 10.5198 19.99C9.90977 19.38 9.90977 18.15 9.90977 15.72V14.79C9.90977 12.35 9.90977 11.13 10.5198 10.52C11.1298 9.91 12.3598 9.91 14.7898 9.91H15.7198C18.1498 9.91 19.3798 9.91 19.9898 10.52C20.5998 11.13 20.5998 12.36 20.5998 14.79V15.72Z" fill="#757575" />
                  </svg>
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
              Планируемая дата получения заказа: <span className="order_the_date">{order.dateRange}</span>
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