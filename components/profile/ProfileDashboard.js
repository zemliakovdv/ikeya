// components/profile/ProfileDashboard.js
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { getOrders, isActiveOrder } from '@/lib/api/account';

export default function ProfileDashboard() {
  const router = useRouter();
  const { isAuth, isHydrated } = useAuth();

  const [activeOrders, setActiveOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isHydrated || !isAuth) return;

    async function loadOrders() {
      try {
        const resp = await getOrders({ per_page: 50 });
        const all = resp.data || [];
        setActiveOrders(all.filter(o => isActiveOrder(o.attributes.status)));
      } catch (e) {
        console.error('ProfileDashboard: ошибка загрузки заказов', e);
      } finally {
        setLoading(false);
      }
    }

    loadOrders();
  }, [isHydrated, isAuth]);

  return (
    <>
      {/* Summary Cards */}
      <div className="summary">
        <div
          className="summary-card"
          onClick={() => router.push('/profile/favorite')}
          style={{ cursor: 'pointer' }}
        >
          <div className="summary-title">
            Избранное
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 20.61C11.34 20.61 10.67 20.4 10.1 19.97C7.66 18.15 2 13.43 2 8.92C2 5.82 4.35 3.39 7.35 3.39C9.01 3.39 10.43 4.01 12 5.45C13.57 4.01 14.99 3.39 16.65 3.39C19.65 3.39 22 5.82 22 8.92C22 13.42 16.33 18.14 13.9 19.97C13.33 20.39 12.67 20.61 12 20.61Z" fill="#E0E0E0" />
            </svg>
          </div>
          {/* Заглушка — нет эндпоинта */}
          <div className="summary-sub">—</div>
        </div>

        <div
          className="summary-card"
          onClick={() => router.push('/profile/orders')}
          style={{ cursor: 'pointer' }}
        >
          <div className="summary-title">
            Покупки
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8.71997 16.42H15.04C19.89 16.42 20.58 13.02 21.3 9.41001C21.55 8.15001 21.69 7.46001 21.25 6.84001C20.77 6.18001 20.02 6.18001 18.88 6.18001H6.98997L6.51997 3.93001C6.22997 2.79001 5.20997 1.99001 4.03997 1.99001H3.16997C2.77997 1.99001 2.46997 2.30001 2.46997 2.69001C2.46997 3.08001 2.77997 3.39001 3.16997 3.39001H4.03997C4.56997 3.39001 5.03997 3.75001 5.15997 4.25001L7.47997 15.31C6.44997 15.8 5.71997 16.87 5.71997 18.12C5.71997 18.73 6.19997 19.22 6.79997 19.22H8.63997C8.55997 19.44 8.50997 19.67 8.50997 19.92C8.50997 21.07 9.44997 22.01 10.6 22.01C11.75 22.01 12.69 21.07 12.69 19.92C12.69 19.67 12.64 19.44 12.56 19.22H15.14C15.06 19.44 15.01 19.67 15.01 19.92C15.01 21.07 15.95 22.01 17.1 22.01C18.25 22.01 19.19 21.07 19.19 19.92C19.19 18.77 18.25 17.83 17.1 17.83H7.13997C7.26997 17.04 7.92997 16.43 8.70997 16.43L8.71997 16.42Z" fill="#E0E0E0" />
            </svg>
          </div>
          {/* Заглушка — нет эндпоинта для счётчика */}
          <div className="summary-sub">—</div>
        </div>

        <div className="summary-card">
          <div className="summary-title">
            Ждут отзыв
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M17.27 22C16.77 22 16.14 21.84 15.35 21.37L12.57 19.71C12.29 19.54 11.73 19.54 11.44 19.71L8.65999 21.37C7.01999 22.35 6.04999 21.97 5.61999 21.65C5.17999 21.33 4.51999 20.52 4.94999 18.64L5.60999 15.76C5.67999 15.45 5.52999 14.94 5.30999 14.71L2.99999 12.38C2.14999 11.52 1.82999 10.58 2.09999 9.74001C2.25999 9.25001 2.75999 8.40001 4.35999 8.13001L7.32999 7.63001C7.59999 7.58001 8.00999 7.28001 8.12999 7.03001L9.76999 3.72001C10.52 2.21001 11.5 1.99001 12.01 1.99001C12.52 1.99001 13.5 2.22001 14.24 3.72001L15.88 7.02001C16.01 7.28001 16.41 7.58001 16.69 7.63001L19.66 8.13001C20.85 8.33001 21.65 8.90001 21.92 9.75001C22.08 10.24 22.17 11.23 21.01 12.39L18.71 14.71C18.49 14.94 18.34 15.45 18.41 15.77L19.07 18.64C19.5 20.52 18.84 21.33 18.4 21.65C18.18 21.81 17.81 21.99 17.28 21.99L17.27 22Z" fill="#E0E0E0" />
            </svg>
          </div>
          {/* Заглушка */}
          <div className="summary-sub">—</div>
        </div>
      </div>

      {/* Active Orders */}
      <div className="block">
        <div className="block-header">
          <div className="block-title">Активные заказы</div>
          <div
            className="block-link"
            onClick={() => router.push('/profile/orders')}
            style={{ cursor: 'pointer' }}
          >
            Все
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10.22 8C10.22 8.74666 8.19331 10.5333 6.49998 11.9C6.30664 12.0533 6.02664 12.0267 5.87331 11.8333C5.71998 11.64 5.74664 11.36 5.93998 11.2067C7.42664 10.0067 9.09998 8.47333 9.31998 8C9.09998 7.52666 7.42664 5.99333 5.93998 4.79333C5.74664 4.63999 5.71998 4.35999 5.87331 4.16666C6.02664 3.97333 6.30664 3.94666 6.49998 4.09999C8.19998 5.46666 10.22 7.26 10.22 8Z" fill="#757575" />
            </svg>
          </div>
        </div>

        <div className="orders">
          {loading && (
            <div className="orders-loading">Загружаем заказы…</div>
          )}

          {!loading && activeOrders.length === 0 && (
            <div className="orders-empty">Активных заказов нет</div>
          )}

          {!loading && activeOrders.map((order) => {
            const a = order.attributes;
            return (
              <div
                key={order.id}
                className="order-card"
                onClick={() => router.push('/profile/orders')}
                style={{ cursor: 'pointer' }}
              >
                <div className="order-image">
                  <Image
                    src="/assets/img/profile/active_1.png"
                    alt="Заказ"
                    width={56}
                    height={56}
                  />
                </div>
                <div className="order-info">
                  <div className="order-title">
                    Заказ №{a.id} от {new Date(a.created_at).toLocaleDateString('ru-RU', {
                      day: 'numeric', month: 'long'
                    })}
                  </div>
                  <span className="status gray">{a.status}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
