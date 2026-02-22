// app/profile/orders/page.js
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ProfileLayout from '@/components/profile/ProfileLayout';
import ActiveOrders from '@/components/profile/ActiveOrders';
import OrderHistory from '@/components/profile/OrderHistory';
import Purchases from '@/components/profile/Purchases';
import { getOrders, getOrderById, getPurchases, isActiveOrder, reorder } from '@/lib/api/account';
import { useAuth } from '@/contexts/AuthContext';

const breadcrumbs = [
  { label: 'Профиль', href: '/profile' },
  { label: 'Заказы', href: null },
];

// Маппер: API формат → формат компонентов
function mapApiOrder(apiOrder, included = []) {
  const a = apiOrder.attributes;

  // Статусы: API (underscore) → компонент (hyphen)
  const statusMap = {
    awaiting_payment:   'awaiting',
    pending:            'assembly',
    processing:         'assembly',
    assembly:           'assembly',
    assembly_process:   'assembly-process',
    transit:            'transit',
    customs_poland:     'customs-poland',
    customs_belarus:    'customs-belarus',
    available_warehouse:'available-warehouse',
    delivering:         'in-transit-pvz',
    delivered_to_pvz:   'arrived-pvz',
    delivered:          'delivered',
    completed:          'delivered',
    canceled:           'canceled',
    cancelled:          'canceled',
    returned:           'canceled',
  };

  const items = (included || []).map(item => ({
    image:    item.attributes.image_url || '/assets/img/profile/active_1.png',
    name:     item.attributes.name      || '—',
    desc:     item.attributes.product_sku || '',
    quantity: item.attributes.quantity  || 1,
    price:    item.attributes.price_byn || 0,
  }));

  return {
    id:          a.id,
    status:      statusMap[a.status] || 'assembly',
    rawStatus:   a.status,
    date:        new Date(a.created_at).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' }),
    dateRange:   '—',
    price:       a.total_amount       || 0,
    trackNumber: a.track_number       || '',
    items,
  };
}

export default function OrdersPage() {
  const { isAuth, isHydrated } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('active');

  const [activeOrders,  setActiveOrders]  = useState([]);
  const [historyOrders, setHistoryOrders] = useState([]);
  const [purchases,     setPurchases]     = useState([]);

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

        // Загружаем детали всех заказов параллельно (нужны товары из included[])
        const detailed = await Promise.all(
          all.map(async (order) => {
            try {
              const detail = await getOrderById(order.attributes.id);
              return mapApiOrder(detail.data, detail.included || []);
            } catch {
              // Если детали не загрузились — показываем без товаров
              return mapApiOrder(order, []);
            }
          })
        );

        setActiveOrders(detailed.filter(o => isActiveOrder(o.rawStatus)));
        setHistoryOrders(detailed.filter(o => !isActiveOrder(o.rawStatus)));
      } catch (e) {
        setError(e.message || 'Не удалось загрузить заказы');
      } finally {
        setLoadingOrders(false);
      }
    }

    loadOrders();
  }, [isHydrated, isAuth]);

  useEffect(() => {
    if (!isHydrated || !isAuth) return;
    if (activeTab !== 'purchases') return;

    async function loadPurchases() {
      setLoadingPurchases(true);
      try {
        const resp = await getPurchases({ sort: 'newest' });
        setPurchases(resp.purchases || []);
      } catch (e) {
        setError(e.message || 'Не удалось загрузить покупки');
      } finally {
        setLoadingPurchases(false);
      }
    }

    loadPurchases();
  }, [isHydrated, isAuth, activeTab]);

  async function handleReorder(orderId) {
    try {
      const resp = await reorder(orderId);
      if (resp.has_missing) {
        alert(`Часть товаров недоступна: ${resp.missing_skus?.join(', ')}`);
      }
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
                      <OrderHistory orders={historyOrders} onReorder={handleReorder} />
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
                    ) : purchases.length === 0 ? (
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
                      <Purchases products={purchases} />
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
