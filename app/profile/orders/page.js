// app/profile/orders/page.js
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ProfileLayout from '@/components/profile/ProfileLayout';
import ActiveOrders from '@/components/profile/ActiveOrders';
import OrderHistory from '@/components/profile/OrderHistory';
import Purchases from '@/components/profile/Purchases';
import { getOrders, getPurchases, isActiveOrder, reorder } from '@/lib/api/account';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';

const breadcrumbs = [
  { label: 'Профиль', href: '/profile' },
  { label: 'Заказы', href: null },
];

function mapApiOrder(apiOrder) {
  const a = apiOrder.attributes;

  const statusMap = {
    awaiting_payment:    'awaiting',
    pending:             'assembly',
    processing:          'assembly',
    assembly:            'assembly',
    assembly_process:    'assembly-process',
    transit:             'transit',
    customs_poland:      'customs-poland',
    customs_belarus:     'customs-belarus',
    available_warehouse: 'available-warehouse',
    delivering:          'in-transit-pvz',
    delivered_to_pvz:    'arrived-pvz',
    delivered:           'delivered',
    completed:           'delivered',
    canceled:            'canceled',
    cancelled:           'canceled',
    returned:            'canceled',
  };

  return {
    id:          a.id,
    status:      statusMap[a.status] || 'assembly',
    rawStatus:   a.status,
    rawDate:     a.created_at,
    date:        new Date(a.created_at).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' }),
    dateRange:   '—',
    price:       a.total_amount  || 0,
    trackNumber: a.track_number  || '',
  };
}

// Группируем purchases по order_id → { [order_id]: [purchase, ...] }
function groupPurchasesByOrderId(purchases) {
  return (purchases || []).reduce((acc, p) => {
    const key = p.order_id;
    if (!acc[key]) acc[key] = [];
    acc[key].push(p);
    return acc;
  }, {});
}

export default function OrdersPage() {
  const { isAuth, isHydrated } = useAuth();
  const { refreshCart } = useCart();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('active');

  const [activeOrders,        setActiveOrders]        = useState([]);
  const [historyOrders,       setHistoryOrders]       = useState([]);
  const [purchasesByOrderId,  setPurchasesByOrderId]  = useState({});
  const [allPurchases,        setAllPurchases]        = useState([]);

  const [loadingOrders,    setLoadingOrders]    = useState(true);
  const [loadingPurchases, setLoadingPurchases] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isHydrated || !isAuth) return;

    async function loadOrders() {
      setLoadingOrders(true);
      try {
        const resp = await getOrders({ per_page: 50 });
        const all = resp.data || [];
        const mapped = all.map(o => mapApiOrder(o));
        setActiveOrders(mapped.filter(o => isActiveOrder(o.rawStatus)));
        setHistoryOrders(mapped.filter(o => !isActiveOrder(o.rawStatus)));
      } catch (e) {
        setError(e.message || 'Не удалось загрузить заказы');
      } finally {
        setLoadingOrders(false);
      }
    }

    async function loadPurchases() {
      setLoadingPurchases(true);
      try {
        let allPages = [];
        let page = 1;
        while (true) {
          const resp = await getPurchases({ sort: 'newest', page, per_page: 100 });
          const purchases = resp.purchases || [];
          allPages = [...allPages, ...purchases];
          if (page >= (resp.meta?.total_pages || 1)) break;
          page++;
        }
        setAllPurchases(allPages);
        setPurchasesByOrderId(groupPurchasesByOrderId(allPages));
      } catch (e) {
        // не блокируем UI — purchases опциональны
        console.error('Не удалось загрузить покупки:', e.message);
      } finally {
        setLoadingPurchases(false);
      }
    }

    loadOrders();
    loadPurchases();
  }, [isHydrated, isAuth]);

  async function handleReorder(orderId) {
    try {
      const resp = await reorder(orderId);
      if (resp.has_missing) {
        alert(`Часть товаров недоступна: ${resp.missing_skus?.join(', ')}`);
      }
      await refreshCart();
      router.push('/cart');
    } catch (e) {
      alert(e.message || 'Не удалось повторить заказ');
    }
  }

  return (
    <ProfileLayout breadcrumbs={breadcrumbs}>
      <div className="orders-lists">
        <div className="orders-tabs orders-container">

          {/* Табы */}
          <ul className="nav nav-tabs" id="ordersTabs" role="tablist">
            <li className="nav-item" role="presentation">
              <button
                className={`nav-link ${activeTab === 'active' ? 'active' : ''}`}
                onClick={() => setActiveTab('active')}
              >
                Активные заказы
                {activeOrders.length > 0 && (
                  <span className="active_tab_number">{activeOrders.length}</span>
                )}
              </button>
            </li>
            <li className="nav-item" role="presentation">
              <button
                className={`nav-link ${activeTab === 'history' ? 'active' : ''}`}
                onClick={() => setActiveTab('history')}
              >
                История заказов
              </button>
            </li>
            <li className="nav-item" role="presentation">
              <button
                className={`nav-link ${activeTab === 'purchases' ? 'active' : ''}`}
                onClick={() => setActiveTab('purchases')}
              >
                Покупки
              </button>
            </li>
          </ul>

          {!!error && (
            <p style={{ color: 'crimson', padding: '16px 0' }}>{error}</p>
          )}

          <div className="tab-content" id="ordersTabsContent">

            {activeTab === 'active' && (
              <div className="tab-pane fade show active" role="tabpanel">
                <div className="actulas-order">
                  {loadingOrders ? (
                    <div className="orders-loading">Загружаем заказы…</div>
                  ) : activeOrders.length === 0 ? (
                    <div className="empty">
                      <div className="empty-illustration">
                        <img src="/assets/img/profile/empty-orders.svg" alt="" />
                      </div>
                      <div className="empty-title">У вас пока нет актуальных заказов</div>
                      <div className="empty-text">
                        Когда появятся, будут отображаться здесь. Остальные заказы находятся в истории заказов
                      </div>
                      <button className="empty-btn" onClick={() => router.push('/')}>
                        Перейти к покупкам
                      </button>
                    </div>
                  ) : (
                    <ActiveOrders orders={activeOrders} />
                  )}
                </div>
              </div>
            )}

            {activeTab === 'history' && (
              <div className="tab-pane fade show active" role="tabpanel">
                <div className="orders-hisrory_wrapper">
                  <div className="orders-hisrory">
                    {loadingOrders ? (
                      <div className="orders-loading">Загружаем заказы…</div>
                    ) : historyOrders.length === 0 ? (
                      <div className="empty">
                        <div className="empty-illustration">
                          <img src="/assets/img/profile/empty-history.svg" alt="" />
                        </div>
                        <div className="empty-title">У вас пока нет истории заказов</div>
                        <div className="empty-text">Когда появятся, будут отображаться здесь.</div>
                        <button className="empty-btn" onClick={() => router.push('/')}>
                          Перейти к покупкам
                        </button>
                      </div>
                    ) : (
                      <OrderHistory
                        orders={historyOrders}
                        purchasesByOrderId={purchasesByOrderId}
                        onReorder={handleReorder}
                      />
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'purchases' && (
              <div className="tab-pane fade show active" role="tabpanel">
                <div className="orders-shopping_wrapper">
                  <div className="orders-shopping">
                    {loadingPurchases ? (
                      <div className="orders-loading">Загружаем покупки…</div>
                    ) : allPurchases.length === 0 ? (
                      <div className="empty">
                        <div className="empty-illustration">
                          <img src="/assets/img/profile/empty-buys.svg" alt="" />
                        </div>
                        <div className="empty-title">Купленных товаров пока нет</div>
                        <div className="empty-text">Когда появятся, будут отображаться здесь.</div>
                        <button className="empty-btn" onClick={() => router.push('/')}>
                          Перейти к покупкам
                        </button>
                      </div>
                    ) : (
                      <Purchases products={allPurchases} />
                    )}
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </ProfileLayout>
  );
}