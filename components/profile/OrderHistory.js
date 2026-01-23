// components/profile/OrderHistory.js
'use client';

import EmptyState from './EmptyState';

export default function OrderHistory({ orders }) {
  return (
    <div className="orders-hisrory_wrapper">
      <div className="orders-hisrory">
        {!orders || orders.length === 0 ? (
          <EmptyState type="history" />
        ) : (
          <>
            {/* Датапикер */}
            <div className="date-picker-wrapper">
              <div className="date-picker-input">
                <input type="text" id="dateRangePicker" placeholder="Выберите период" readOnly />
                <svg className="calendar-icon" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6.21752 12.4875C5.83502 12.4875 5.52002 12.8025 5.52002 13.185C5.52002 13.5675 5.83502 13.8825 6.21752 13.8825C6.60002 13.8825 6.91502 13.5675 6.91502 13.185C6.91502 12.8025 6.60002 12.4875 6.21752 12.4875Z" fill="#757575" />
                </svg>
              </div>
            </div>

            {/* Список заказов */}
            {orders.map((order) => (
              <div key={order.id} className="order-card">
                <div className="order-header">
                  <div className="odrer-header_inner">
                    <div className="order-header_top">
                      <div className="order-title">Заказ № {order.id} от {order.date}</div>
                      <div className={`order-badge ${order.status === 'canceled' ? 'badge-canceled' : 'badge-havit'}`}>
                        {order.status === 'canceled' ? 'Отменён' : 'Получен'}
                      </div>
                    </div>
                  </div>
                  <div className="order-price">{order.price} р.</div>
                </div>

                {order.status === 'canceled' && (
                  <div className="order-canceled">
                    <div className="order-canceled_inner">
                      <div className="canceled-inner-why">
                        <p>Почему заказ отменён?</p>
                      </div>
                      <button className="order-repeit">Повторить заказ</button>
                    </div>
                  </div>
                )}

                <div className="order-items">
                  {order.items?.map((item, idx) => (
                    <div key={idx} className="order-item">
                      <img src={item.image} alt={item.name} className="item-image" />
                      <div className="flex-grow-1">
                        <div className="item-infos">
                          <div className="item-name">{item.name}</div>
                          <div className="item-desc">{item.desc}</div>
                        </div>
                        <div className="item-meta">
                          <span className="item-quantity">{item.quantity} шт</span>
                          <span className="item-price">{item.price} р.</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
