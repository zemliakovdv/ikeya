// components/profile/OrderHistory.js
'use client';

import { useState } from 'react';
import RangeDatePicker from '@/components/ui/RangeDatePicker';

const API_BASE_URL = 'https://test.ikeya.by';

function resolveImage(path) {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  const clean = path.startsWith('/') ? path.slice(1) : path;
  return `${API_BASE_URL}/${clean}`;
}

export default function OrderHistory({ orders, purchasesByOrderId = {}, onReorder }) {
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  if (!orders || orders.length === 0) return null;

  // Фильтрация по диапазону дат
  const filteredOrders = orders.filter(order => {
    if (!dateFrom && !dateTo) return true;
    // order.date — локализованная строка, берём оригинальную дату из created_at
    // Используем order.rawDate если есть, иначе парсим из order.date
    const orderDate = order.rawDate ? new Date(order.rawDate) : null;
    if (!orderDate) return true;
    if (dateFrom && orderDate < new Date(dateFrom)) return false;
    if (dateTo) {
      const toEnd = new Date(dateTo);
      toEnd.setHours(23, 59, 59, 999);
      if (orderDate > toEnd) return false;
    }
    return true;
  });

  return (
    <>
      <div className="orders-hisrory_wrapper">
        <div className="orders-hisrory">

          {/* Датапикер */}
          <div className="date-picker-wrapper">
            <RangeDatePicker
              from={dateFrom}
              to={dateTo}
              onChange={({ from, to }) => { setDateFrom(from); setDateTo(to); }}
              placeholder="Выберите период"
            />
          </div>

          {filteredOrders.length === 0 ? (
            <div className="empty">
              <div className="empty-illustration">
                <img src="/assets/img/profile/empty-history.svg" alt="" />
              </div>
              <div className="empty-title">Заказов за выбранный период нет</div>
              <div className="empty-text">Попробуйте выбрать другой период.</div>
            </div>
          ) : filteredOrders.map((order) => {
            const isCanceled = order.status === 'canceled';
            // Ключ группировки — число (p.order_id), order.id может быть строкой
            const items = purchasesByOrderId[order.id] || purchasesByOrderId[Number(order.id)] || [];

            return (
              <div key={order.id} className="order-card">
                <div className="order-header">
                  <div className="odrer-header_inner">
                    <div className="order-header_top">
                      <div className="order-title">Заказ № {order.id} от {order.date}</div>
                      <div className={`order-badge ${isCanceled ? 'badge-canceled' : 'badge-havit'}`}>
                        {isCanceled ? 'Отменён' : 'Получен'}
                      </div>
                    </div>
                  </div>
                  <div className="order-price">{order.price} р.</div>
                </div>

                {isCanceled && (
                  <div className="order-canceled">
                    <div className="order-canceled_inner">
                      <div className="canceled-inner-why">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M9.99996 18.3334C5.40829 18.3334 1.66663 14.5917 1.66663 10.0001C1.66663 5.40841 5.40829 1.66675 9.99996 1.66675C14.5916 1.66675 18.3333 5.40841 18.3333 10.0001C18.3333 14.5917 14.5916 18.3334 9.99996 18.3334ZM9.99996 2.83341C6.04996 2.83341 2.83329 6.05008 2.83329 10.0001C2.83329 13.9501 6.04996 17.1667 9.99996 17.1667C13.95 17.1667 17.1666 13.9501 17.1666 10.0001C17.1666 6.05008 13.95 2.83341 9.99996 2.83341Z" fill="#181818" />
                          <path d="M9.99998 11.7417C9.67498 11.7417 9.41664 11.4834 9.41664 11.1584C9.41664 10.2084 10.1833 9.57508 10.7666 9.17508C11.1333 8.92508 11.3583 8.50008 11.3583 8.05841C11.3583 7.30841 10.75 6.70008 9.99998 6.70008C9.24998 6.70008 8.64164 7.30841 8.64164 8.05841C8.64164 8.38341 8.38331 8.64175 8.05831 8.64175C7.73331 8.64175 7.47498 8.38341 7.47498 8.05841C7.47498 6.66675 8.60831 5.54175 9.99164 5.54175C11.375 5.54175 12.5083 6.67508 12.5083 8.05841C12.5083 8.89175 12.1 9.66675 11.4083 10.1417C10.8416 10.5334 10.5666 10.8667 10.5666 11.1667C10.5666 11.4917 10.3083 11.7501 9.98331 11.7501L9.99998 11.7417Z" fill="#181818" />
                          <path d="M10.0083 14.575C9.62502 14.575 9.30835 14.2584 9.30835 13.875C9.30835 13.4917 9.61668 13.175 10 13.175C10.3833 13.175 10.7 13.4917 10.7 13.875C10.7 14.2584 10.3917 14.575 10 14.575H10.0083Z" fill="#181818" />
                        </svg>
                        <p
                          style={{ cursor: 'pointer' }}
                          onClick={() => setCancelModalOpen(true)}
                        >
                          Почему заказ отменён?
                        </p>
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12.775 9.99999C12.775 10.9333 10.2417 13.1667 8.125 14.875C7.88334 15.0667 7.53334 15.0333 7.34167 14.7917C7.15 14.55 7.18333 14.2 7.425 14.0083C9.28333 12.5083 11.375 10.5917 11.65 9.99999C11.375 9.40833 9.28333 7.49166 7.425 5.99166C7.18333 5.79999 7.15 5.44999 7.34167 5.20833C7.53334 4.96666 7.88334 4.93333 8.125 5.12499C10.25 6.83333 12.775 9.07499 12.775 9.99999Z" fill="#BDBDBD" />
                        </svg>
                      </div>
                      <button
                        className="order-repeit"
                        onClick={() => onReorder?.(order.id)}
                      >
                        Повторить заказ
                      </button>
                    </div>
                  </div>
                )}

                <div className="order-items">
                  {items.length > 0 ? (
                    items.map((purchase, idx) => {
                      const product = purchase.product || {};

                      // local_images приходит как JSON-строка — парсим
                      let localImagesRaw = product.images?.local_images || [];
                      if (typeof localImagesRaw === 'string') {
                        try { localImagesRaw = JSON.parse(localImagesRaw); } catch { localImagesRaw = []; }
                      }

                      const image =
                        resolveImage(localImagesRaw[0]) ||
                        product.images?.images?.[0] ||
                        '/assets/img/profile/active_1.png';

                      return (
                        <div key={purchase.product_sku || idx} className="order-item">
                          <img
                            src={image}
                            alt={product.name || ''}
                            className="item-image"
                            onError={(e) => { e.target.src = '/assets/img/profile/active_1.png'; }}
                          />
                          <div className="flex-grow-1">
                            <div className="item-infos">
                              <div className="item-name">{product.name || '—'}</div>
                              {purchase.product_sku && (
                                <div className="item-desc">{purchase.product_sku}</div>
                              )}
                            </div>
                            <div className="item-meta">
                              <span className="item-quantity">{purchase.quantity} шт</span>
                              <span className="item-price">{purchase.price_byn} р.</span>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div style={{ color: '#9e9e9e', padding: '8px 0' }}>
                      Список товаров недоступен
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Модалка "Почему заказ отменён?" */}
      {cancelModalOpen && (
        <div
          className="modal-overlay"
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999,
          }}
          onClick={() => setCancelModalOpen(false)}
        >
          <div
            className="modal-box"
            style={{
              background: '#fff', borderRadius: '8px', padding: '16px 24px 24px 24px',
              maxWidth: '560px', width: '90%', position: 'relative',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ marginBottom: '12px', fontSize: '18px', fontWeight: 600 }}>
              Заказ не оплатили
            </h3>
            <p style={{ color: '#424242', lineHeight: 1.6 }}>
              Мы не получили оплату, поэтому заказ пришлось отменить. Вы можете оформить заказ заново
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px' }}>
              <button
                onClick={() => setCancelModalOpen(false)}
                className="order-repeit"
              >
                Закрыть
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}