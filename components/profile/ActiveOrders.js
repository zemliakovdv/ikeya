// components/profile/ActiveOrders.js
'use client';

import { useState, useEffect, useRef } from 'react';

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
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C6.49 2 2 6.49 2 12C2 17.51 6.49 22 12 22C17.51 22 22 17.51 22 12C22 6.49 17.51 2 12 2ZM11.3 8.28C11.3 7.89 11.61 7.58 12 7.58C12.39 7.58 12.7 7.89 12.7 8.28V12.47C12.7 12.86 12.39 13.17 12 13.17C11.61 13.17 11.3 12.86 11.3 12.47V8.28ZM12.83 15.72C12.83 16.18 12.46 16.56 11.99 16.56C11.52 16.56 11.15 16.18 11.15 15.72C11.15 15.26 11.52 14.88 11.99 14.88C12.46 14.88 12.83 15.25 12.83 15.71V15.72Z" fill="#B71C1C" />
              </svg>
              <div className="status-text">
                Заказ ожидает оплаты
                {countdown && <> <strong className="timer-value">{countdown}</strong></>}
              </div>
            </div>
            <div className="order-actions">
              {order.paymentUrl ? (
                <a
                  href={order.paymentUrl}
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

    if (['transit', 'available-warehouse', 'assembly-process', 'customs-poland', 'customs-belarus'].includes(order.status)) {
      return (
        <div className="order-address order-track">
          <div className="order-address__inner">
            <svg className="address-icon" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16.1416 3.83329L13.875 2.73329C12.4 2.01663 11.6583 1.66663 10.775 1.66663C9.89163 1.66663 9.14996 2.02496 7.67496 2.74163L5.40829 3.84163C3.99996 4.52496 3.21663 4.89996 3.21663 5.74163V8.06663C3.21663 8.39163 3.47496 8.64996 3.79996 8.64996C4.12496 8.64996 4.38329 8.39163 4.38329 8.06663V7.12496C4.67496 7.28329 5.01663 7.44996 5.41663 7.64163L7.68329 8.73329C8.83329 9.29163 9.53329 9.62496 10.2 9.74996V17.075C9.79996 16.9583 9.29996 16.7416 8.55829 16.425C7.18329 15.825 6.09996 15.35 5.37496 14.925C5.28329 14.875 5.18329 14.8416 5.08329 14.8416H2.24996C1.92496 14.8416 1.66663 15.1 1.66663 15.425C1.66663 15.75 1.92496 16.0083 2.24996 16.0083H4.92496C5.69996 16.45 6.76663 16.9166 8.09996 17.4916C9.38329 18.05 10.025 18.3333 10.7833 18.3333C11.5416 18.3333 12.1833 18.05 13.4666 17.4916C16.7083 16.075 18.3416 15.3666 18.3416 13.875V5.73329C18.3416 4.89163 17.5666 4.51663 16.15 3.83329H16.1416Z" fill="#181818" />
            </svg>
            <div className="address-text where-oreder">Где мой заказ</div>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12.775 9.99999C12.775 10.9333 10.2417 13.1667 8.125 14.875C7.88334 15.0667 7.53334 15.0333 7.34167 14.7917C7.15 14.55 7.18333 14.2 7.425 14.0083C9.28333 12.5083 11.375 10.5917 11.65 9.99999C11.375 9.40833 9.28333 7.49166 7.425 5.99166C7.18333 5.79999 7.15 5.44999 7.34167 5.20833C7.53334 4.96666 7.88334 4.93333 8.125 5.12499C10.25 6.83333 12.775 9.07499 12.775 9.99999Z" fill="#BDBDBD" />
            </svg>
          </div>
        </div>
      );
    }

    if (['in-transit-pvz', 'arrived-pvz'].includes(order.status)) {
      return (
        <div className="orders-statuses">
          <div className="order-address">
            <div className="address-text">
              <strong>{order.trackNumber || '—'}</strong><br />Трек-номер
            </div>
          </div>
          <div className="order-status status-info">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
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
      'assembly':           'badge-assembly',
      'awaiting':           'badge-awaiting',
      'transit':            'badge-available',
      'available-warehouse':'badge-available',
      'assembly-process':   'badge-available',
      'customs-poland':     'badge-available',
      'customs-belarus':    'badge-available',
      'in-transit-pvz':     'badge-available',
      'arrived-pvz':        'badge-ready',
    };
    return map[order.status] || '';
  };

  const getStatusText = () => {
    const map = {
      'assembly':           'В обработке',
      'awaiting':           'Ждёт оплаты',
      'transit':            'В пути',
      'available-warehouse':'Получен на склад',
      'assembly-process':   'Подготовка и сборка',
      'customs-poland':     'Таможня Польша',
      'customs-belarus':    'Таможня Беларусь',
      'in-transit-pvz':     'В доставке ПВЗ',
      'arrived-pvz':        'Прибыл в ПВЗ',
    };
    return map[order.status] || 'В обработке';
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
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M16.0001 2.66667C8.65341 2.66667 2.66675 8.65334 2.66675 16C2.66675 23.3467 8.65341 29.3333 16.0001 29.3333C23.3467 29.3333 29.3334 23.3467 29.3334 16C29.3334 8.65334 23.3467 2.66667 16.0001 2.66667ZM21.6534 12.9067L14.8267 20.3467C14.6534 20.5333 14.4134 20.64 14.1601 20.6533H14.1467C13.9067 20.6533 13.6667 20.56 13.4934 20.3867L10.3867 17.28C10.0267 16.92 10.0267 16.3333 10.3867 15.96C10.7467 15.6 11.3334 15.6 11.7067 15.96L14.1201 18.3733L20.2801 11.6533C20.6267 11.28 21.2134 11.2533 21.6001 11.6C21.9734 11.9467 22.0001 12.5333 21.6534 12.92V12.9067Z" fill="#00910A" />
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M20.9798 9.53C20.1798 8.73 19.0798 8.56 17.3498 8.52C17.3398 6.08 17.2198 4.68 16.3498 3.61C16.1698 3.39 15.9598 3.18 15.7398 3C14.5198 2 12.8998 2 9.67977 2C6.45977 2 4.83977 2 3.61977 3C3.39977 3.18 3.18977 3.39 3.00977 3.61C2.00977 4.83 2.00977 6.45 2.00977 9.67C2.00977 12.89 2.00977 14.51 3.00977 15.73C3.18977 15.95 3.39977 16.16 3.61977 16.34C4.68977 17.22 6.08977 17.33 8.52977 17.34C8.56977 19.08 8.73977 20.18 9.53977 20.97C10.5598 21.99 12.0698 21.99 14.7998 21.99H15.7298C18.4598 21.99 19.9698 21.99 20.9898 20.97C22.0098 19.95 22.0098 18.44 22.0098 15.71V14.78C22.0098 12.05 22.0098 10.54 20.9898 9.52L20.9798 9.53Z" fill="#757575" />
                  </svg>
                )}
              </button>
              {' '}от {order.date}
            </div>
            <div className={`order-badge ${getBadgeClass()}`}>{getStatusText()}</div>
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