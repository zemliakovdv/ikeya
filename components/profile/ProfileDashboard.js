// components/profile/ProfileDashboard.js
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useFavorites } from '@/contexts/FavoritesContext';
import { getOrderStatusLabel, getOrders, getPurchases, isProfileActiveOrder } from '@/lib/api/account';
import { openJivoChat } from '@/components/FloatingChatButton';
import { useProfileCounts } from './ProfileCountsContext';

import { buildAssetUrl } from '@/lib/config/api';

function resolveImage(imageUrl) {
  const FALLBACK = '/assets/img/profile/active_1.png';
  if (!imageUrl) return FALLBACK;

  let first = imageUrl;

  // image_url может быть строкой-путём, JSON-строкой с массивом или массивом
  if (typeof first === 'string' && first.trim().startsWith('[')) {
    try { first = JSON.parse(first); } catch { return FALLBACK; }
  }
  if (Array.isArray(first)) {
    first = first[0];
  }

  if (!first || typeof first !== 'string' || first.startsWith('as:')) return FALLBACK;
  if (first.startsWith('http')) return first;
  if (first.startsWith('/')) return buildAssetUrl(first);
  return FALLBACK;
}

function pluralize(n) {
  if (n === null || n === undefined || n === 0) return 'Пока пусто';
  const abs = Math.abs(n) % 100;
  const mod = abs % 10;
  if (abs >= 11 && abs <= 19) return `${n} товаров`;
  if (mod === 1) return `${n} товар`;
  if (mod >= 2 && mod <= 4) return `${n} товара`;
  return `${n} товаров`;
}

const BADGE_CLASS = {
  awaiting: 'badge-awaiting',
  assembly: 'badge-assembly',
  transit: 'badge-available',
  'customs-belarus': 'badge-available',
  'in-transit-pvz': 'badge-available',
  'arrived-pvz': 'badge-ready',
  delivered: 'badge-havit',
  canceled: 'badge-canceled',
};

const STATUS_FRONT_MAP = {
  created: 'awaiting',
  processing: 'assembly',
  confirmed: 'assembly',
  paid: 'assembly',
  purchased: 'assembly',
  received_poland: 'transit',
  preparing_for_shipment: 'transit',
  export_eu: 'transit',
  customs_poland: 'transit',
  on_border: 'customs-belarus',
  customs_belarus: 'customs-belarus',
  shipped: 'in-transit-pvz',
  handed_to_courier: 'in-transit-pvz',
  arrived_pvz: 'arrived-pvz',
  completed: 'delivered',
  cancelled: 'canceled',
  canceled: 'canceled',
};

export default function ProfileDashboard() {
  const router = useRouter();
  const { isAuth, isHydrated } = useAuth();
  const { items: favoriteItems } = useFavorites();
  const { setActiveOrdersCount } = useProfileCounts();

  const [activeOrders, setActiveOrders] = useState([]);
  const [purchasesTotal, setPurchasesTotal] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isHydrated || !isAuth) return;

    async function loadData() {
      try {
        const [ordersResp, purchasesResp] = await Promise.allSettled([
          getOrders({ per_page: 50 }),
          getPurchases({ per_page: 1 }),
        ]);

        if (ordersResp.status === 'fulfilled') {
          const all = ordersResp.value.data || [];
          const included = ordersResp.value.included || [];

          // Строим map товаров из included
          const itemsMap = {};
          included.forEach(inc => {
            if (inc.type === 'order_item') itemsMap[inc.id] = inc.attributes;
          });

          const activeAll = all.filter(isProfileActiveOrder);
          setActiveOrdersCount(activeAll.length);

          const active = activeAll
            .slice(0, 3)
            .map(order => {
              const a = order.attributes;
              // Берём картинку первого товара из included
              const firstItemId = order.relationships?.order_items?.data?.[0]?.id;
              const firstItem = firstItemId ? itemsMap[firstItemId] : null;
              const imageUrl = firstItem?.image_url || null;

              const frontStatus = STATUS_FRONT_MAP[a.status] || 'assembly';
              const badgeCls = BADGE_CLASS[frontStatus] || 'badge-assembly';

              return {
                publicId: order.id, // public_uid
                statusDescription: getOrderStatusLabel(order),
                badgeCls,
                date: new Date(a.created_at).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' }),
                imageUrl,
              };
            });

          setActiveOrders(active);
        } else {
          setActiveOrdersCount(0);
        }

        if (purchasesResp.status === 'fulfilled') {
          setPurchasesTotal(purchasesResp.value.meta?.total ?? 0);
        }
      } catch (e) {
        console.error('ProfileDashboard: ошибка загрузки', e);
        setActiveOrdersCount(0);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [isHydrated, isAuth, setActiveOrdersCount]);

  const favCount = favoriteItems?.length ?? 0;

  return (
    <>
      {/* Summary Cards */}
      <div className="summary">
        <div className="summary-card" onClick={() => router.push('/profile/favorite')} style={{ cursor: 'pointer' }}>
          <div className="summary-title">
            Избранное
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M12 20.61C11.34 20.61 10.67 20.4 10.1 19.97C7.66 18.15 2 13.43 2 8.92C2 5.82 4.35 3.39 7.35 3.39C9.01 3.39 10.43 4.01 12 5.45C13.57 4.01 14.99 3.39 16.65 3.39C19.65 3.39 22 5.82 22 8.92C22 13.42 16.33 18.14 13.9 19.97C13.33 20.39 12.67 20.61 12 20.61Z" fill="#E0E0E0" />
            </svg>
          </div>
          <div className="summary-sub">{pluralize(favCount)}</div>
        </div>

        <div className="summary-card" onClick={() => router.push('/profile/orders')} style={{ cursor: 'pointer' }}>
          <div className="summary-title">
            Покупки
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M8.71997 16.42H15.04C19.89 16.42 20.58 13.02 21.3 9.41001C21.55 8.15001 21.69 7.46001 21.25 6.84001C20.77 6.18001 20.02 6.18001 18.88 6.18001H6.98997L6.51997 3.93001C6.22997 2.79001 5.20997 1.99001 4.03997 1.99001H3.16997C2.77997 1.99001 2.46997 2.30001 2.46997 2.69001C2.46997 3.08001 2.77997 3.39001 3.16997 3.39001H4.03997C4.56997 3.39001 5.03997 3.75001 5.15997 4.25001L7.47997 15.31C6.44997 15.8 5.71997 16.87 5.71997 18.12C5.71997 18.73 6.19997 19.22 6.79997 19.22H8.63997C8.55997 19.44 8.50997 19.67 8.50997 19.92C8.50997 21.07 9.44997 22.01 10.6 22.01C11.75 22.01 12.69 21.07 12.69 19.92C12.69 19.67 12.64 19.44 12.56 19.22H15.14C15.06 19.44 15.01 19.67 15.01 19.92C15.01 21.07 15.95 22.01 17.1 22.01C18.25 22.01 19.19 21.07 19.19 19.92C19.19 18.77 18.25 17.83 17.1 17.83H7.13997C7.26997 17.04 7.92997 16.43 8.70997 16.43L8.71997 16.42Z" fill="#E0E0E0" />
            </svg>
          </div>
          <div className="summary-sub">{pluralize(purchasesTotal)}</div>
        </div>

        <div className="summary-card" onClick={() => router.push('/profile/reviews')} style={{ cursor: 'pointer' }}>
          <div className="summary-title">
            Ждут отзыв
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M17.27 22C16.77 22 16.14 21.84 15.35 21.37L12.57 19.71C12.29 19.54 11.73 19.54 11.44 19.71L8.65999 21.37C7.01999 22.35 6.04999 21.97 5.61999 21.65C5.17999 21.33 4.51999 20.52 4.94999 18.64L5.60999 15.76C5.67999 15.45 5.52999 14.94 5.30999 14.71L2.99999 12.38C2.14999 11.52 1.82999 10.58 2.09999 9.74001C2.25999 9.25001 2.75999 8.40001 4.35999 8.13001L7.32999 7.63001C7.59999 7.58001 8.00999 7.28001 8.12999 7.03001L9.76999 3.72001C10.52 2.21001 11.5 1.99001 12.01 1.99001C12.52 1.99001 13.5 2.22001 14.24 3.72001L15.88 7.02001C16.01 7.28001 16.41 7.58001 16.69 7.63001L19.66 8.13001C20.85 8.33001 21.65 8.90001 21.92 9.75001C22.08 10.24 22.17 11.23 21.01 12.39L18.71 14.71C18.49 14.94 18.34 15.45 18.41 15.77L19.07 18.64C19.5 20.52 18.84 21.33 18.4 21.65C18.18 21.81 17.81 21.99 17.28 21.99L17.27 22Z" fill="#E0E0E0" />
            </svg>
          </div>
          <div className="summary-sub">Пока пусто</div>
        </div>
      </div>

      {/* Active Orders */}
      <div className="block">
        <div className="block-header">
          <div className="block-title">Активные заказы</div>
          <div className="block-link" onClick={() => router.push('/profile/orders')} style={{ cursor: 'pointer' }}>
            Все
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M10.22 8C10.22 8.74666 8.19331 10.5333 6.49998 11.9C6.30664 12.0533 6.02664 12.0267 5.87331 11.8333C5.71998 11.64 5.74664 11.36 5.93998 11.2067C7.42664 10.0067 9.09998 8.47333 9.31998 8C9.09998 7.52666 7.42664 5.99333 5.93998 4.79333C5.74664 4.63999 5.71998 4.35999 5.87331 4.16666C6.02664 3.97333 6.30664 3.94666 6.49998 4.09999C8.19998 5.46666 10.22 7.26 10.22 8Z" fill="#757575" />
            </svg>
          </div>
        </div>

        <div className="orders orders-grid">
          {loading && <div className="orders-loading">Загружаем заказы…</div>}

          {!loading && activeOrders.length === 0 && (
            <div className="orders-empty">У вас нет ни одного заказа</div>
          )}

          {!loading && activeOrders.map((order) => (
            <div
              key={order.publicId}
              className="order-card order-card--dashboard"
              onClick={() => router.push('/profile/orders')}
              style={{ cursor: 'pointer' }}
            >
              <div className="order-image">
                <img
                  src={resolveImage(order.imageUrl)}
                  alt="Товар"
                  width={56}
                  height={56}
                  onError={(e) => { e.target.src = '/assets/img/profile/active_1.png'; }}
                />
              </div>
              <div className="order-info">
                <div className="order-title">Заказ № {order.publicId} от {order.date}</div>
                <span className={`order-badge ${order.badgeCls}`}>{order.statusDescription}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Нужна помощь */}
      <div className="block">
        <div className="block-title">Нужна помощь?</div>
        <div className="help-links">
          <button className="help-link-card" type="button" onClick={openJivoChat}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C6.49 2 2 6.3 2 11.6C2 14.06 2.97 16.4 4.73 18.19C4.95 18.42 5.06 18.68 5.02 18.89C4.89 19.58 4.59 20.23 4.15 20.77C3.99 20.96 3.95 21.22 4.04 21.45C4.12 21.68 4.33 21.85 4.57 21.9C4.97 21.97 5.37 22.01 5.78 22.01C6.88 22.01 7.98 21.74 8.97 21.21C9.23 21.07 9.47 20.95 9.51 20.93C9.56 20.93 9.84 20.98 10.08 21.02C10.71 21.14 11.36 21.2 11.99 21.2H12.01C17.52 21.2 22.01 16.89 22.01 11.6C22.01 6.31 17.51 2 12 2ZM8.29 12.93C7.78 12.93 7.36 12.51 7.36 12C7.36 11.49 7.77 11.07 8.29 11.07C8.8 11.07 9.22 11.49 9.22 12C9.22 12.51 8.8 12.93 8.29 12.93ZM12.01 12.93C11.5 12.93 11.08 12.51 11.08 12C11.08 11.49 11.49 11.07 12.01 11.07C12.52 11.07 12.94 11.49 12.94 12C12.94 12.51 12.52 12.93 12.01 12.93ZM15.73 12.93C15.22 12.93 14.8 12.51 14.8 12C14.8 11.49 15.21 11.07 15.73 11.07C16.24 11.07 16.66 11.49 16.66 12C16.66 12.51 16.24 12.93 15.73 12.93Z" fill="#E0E0E0" />
            </svg>
            Написать в чат-бот
          </button>

          <button className="help-link-card" type="button" onClick={() => router.push('/help/delivery')}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15.47 6.18999C15.43 5.41999 15.3 4.89999 14.87 4.46999C14.26 3.85999 13.45 3.85999 11.99 3.85999H5.49001C4.03001 3.85999 3.23001 3.85999 2.61001 4.46999C1.99001 5.07999 2.00001 5.88999 2.00001 7.34999V14.79C2.00001 15.75 2.00001 16.28 2.28001 16.77C2.46001 17.09 2.73001 17.36 3.05001 17.54C3.42001 17.75 3.82001 17.8 4.42001 17.82C4.74001 19.15 5.93001 20.15 7.36001 20.15C8.79001 20.15 9.98001 19.15 10.29 17.82H13.72C14.04 19.15 15.23 20.15 16.65 20.15C18.07 20.15 19.27 19.15 19.58 17.82H19.68C19.93 17.82 20.05 17.82 20.16 17.8C21.11 17.68 21.86 16.93 21.98 15.98C21.99 15.88 22 15.75 22 15.5V12.93C22 9.27999 19.09 6.29999 15.47 6.18999ZM6.18001 7.34999C6.18001 6.95999 6.49001 6.64999 6.88001 6.64999C7.27001 6.64999 7.58001 6.95999 7.58001 7.34999V11.07C7.58001 11.46 7.27001 11.77 6.88001 11.77C6.49001 11.77 6.18001 11.46 6.18001 11.07V7.34999ZM7.34001 18.75C6.44001 18.75 5.71001 18.02 5.71001 17.12C5.71001 16.22 6.44001 15.49 7.34001 15.49C8.24001 15.49 8.97001 16.22 8.97001 17.12C8.97001 18.02 8.24001 18.75 7.34001 18.75ZM11.29 11.08C11.29 11.47 10.98 11.78 10.59 11.78C10.2 11.78 9.89001 11.47 9.89001 11.08V7.35999C9.89001 6.96999 10.2 6.65999 10.59 6.65999C10.98 6.65999 11.29 6.96999 11.29 7.35999V11.08ZM16.64 18.75C15.74 18.75 15.01 18.02 15.01 17.12C15.01 16.22 15.74 15.49 16.64 15.49C17.54 15.49 18.27 16.22 18.27 17.12C18.27 18.02 17.54 18.75 16.64 18.75Z" fill="#E0E0E0" />
            </svg>
            Условия доставки
          </button>

          <button className="help-link-card" type="button" onClick={() => router.push('/profile/returns')}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22 7.86001C22 7.86001 21.98 7.78001 21.97 7.73001C21.97 7.68001 21.96 7.63001 21.94 7.59001L21.05 5.60001C20.32 3.98001 19.92 3.09001 19.04 2.55001C18.17 2.01001 17.14 2.01001 15.26 2.01001H8.75002C6.88002 2.01001 5.85002 2.01001 4.98002 2.55001C4.09002 3.10001 3.69002 3.99001 2.97002 5.60001L2.08002 7.59001C2.08002 7.59001 2.06002 7.68001 2.05002 7.73001C2.04002 7.78001 2.02002 7.82001 2.02002 7.87001V13.05C2.02002 17.14 2.02002 19.19 3.44002 20.6C4.86002 22.02 6.91002 22.02 10.99 22.02H13.06C17.15 22.02 19.2 22.02 20.61 20.6C22.03 19.18 22.03 17.13 22.03 13.05V7.87001L22 7.86001ZM4.23002 6.16001C4.91002 4.65001 5.20002 4.03001 5.70002 3.72001C6.23002 3.39001 7.07002 3.39001 8.74002 3.39001H11.3V7.16001H3.78002L4.23002 6.16001ZM14.07 18.38H13.04C12.65 18.38 12.34 18.07 12.34 17.68C12.34 17.29 12.65 16.98 13.04 16.98H14.07C14.82 16.98 15.44 16.37 15.44 15.61C15.44 14.85 14.83 14.24 14.07 14.24H9.55002L10.43 15.12C10.7 15.39 10.7 15.83 10.43 16.11C10.16 16.39 9.72002 16.38 9.44002 16.11L7.37002 14.04C7.24002 13.91 7.17002 13.73 7.17002 13.55C7.17002 13.37 7.24002 13.19 7.37002 13.06L9.44002 10.99C9.71002 10.72 10.15 10.72 10.43 10.99C10.71 11.26 10.7 11.7 10.43 11.98L9.55002 12.86H14.07C15.59 12.86 16.83 14.1 16.83 15.62C16.83 17.14 15.59 18.39 14.07 18.39V18.38ZM12.7 7.17001V3.40001H15.26C16.93 3.40001 17.77 3.40001 18.3 3.73001C18.8 4.04001 19.1 4.66001 19.77 6.17001L20.22 7.17001H12.69H12.7Z" fill="#E0E0E0" />
            </svg>
            Как вернуть товар
          </button>
        </div>
      </div>
    </>
  );
}
