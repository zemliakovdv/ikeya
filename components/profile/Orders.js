// components/profile/Orders.js
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import ActiveOrders from '@/components/profile/ActiveOrders';
import OrderHistory from '@/components/profile/OrderHistory';
import Purchases from '@/components/profile/Purchases';

const API_BASE_URL = 'https://test.ikeya.by/api/v1';

const ACTIVE_STATUSES  = ['created', 'paid', 'assembly', 'transit', 'customs-belarus', 'in-transit-pvz', 'arrived-pvz'];
const HISTORY_STATUSES = ['completed', 'canceled', 'delivered'];

function formatDate(dateStr) {
  if (!dateStr) return '—';
  const date = new Date(dateStr);
  const day = date.getDate();
  const months = ['января','февраля','марта','апреля','мая','июня','июля','августа','сентября','октября','ноября','декабря'];
  return `${day} ${months[date.getMonth()]}`;
}

function resolveImage(imageUrl) {
  if (!imageUrl) return null;
  let urls = imageUrl;
  if (typeof urls === 'string') {
    try { urls = JSON.parse(urls); } catch { return null; }
  }
  if (!Array.isArray(urls) || urls.length === 0) return null;
  const first = urls[0];
  if (!first) return null;
  if (first.startsWith('http')) return first;
  if (first.startsWith('/')) return `https://test.ikeya.by${first}`;
  return null;
}

function mapStatus(rawStatus) {
  const map = {
    'created':   'awaiting',
    'paid':      'assembly',
    'shipped':   'transit',
    'completed': 'delivered',
    'canceled':  'canceled',
  };
  return map[rawStatus] || rawStatus;
}

function parseOrders(data) {
  const included = data.included || [];

  const itemsMap = {};
  included.forEach(inc => {
    if (inc.type === 'order_item') {
      itemsMap[inc.id] = inc.attributes;
    }
  });

  return (data.data || []).map(order => {
    const attr = order.attributes;
    const rawStatus = attr.status;
    const mappedStatus = mapStatus(rawStatus);

    const orderItemIds = order.relationships?.order_items?.data?.map(d => d.id) || [];
    const items = orderItemIds
      .map(id => itemsMap[id])
      .filter(Boolean)
      .map(item => ({
        name:     item.name || '—',
        desc:     item.product_sku || '',
        quantity: item.quantity || 1,
        price:    parseFloat(item.price_byn || 0).toFixed(2),
        image:    resolveImage(item.image_url),
      }));

    let paymentSecondsLeft = null;
    if (rawStatus === 'created' && attr.payment_expires_at && !attr.payment_expired) {
      const expiresAt = new Date(attr.payment_expires_at);
      const now = new Date();
      const diff = Math.floor((expiresAt - now) / 1000);
      paymentSecondsLeft = diff > 0 ? diff : 0;
    }

    return {
      id:                 String(attr.public_uid || attr.id),
      date:               formatDate(attr.created_at),
      rawDate:            attr.created_at,
      rawStatus,
      status:             mappedStatus,
      price:              parseFloat(attr.total_amount || 0).toLocaleString('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      trackNumber:        attr.track_number || null,
      paymentUrl:         attr.payment_url || null,
      paymentSecondsLeft,
      dateRange:          attr.delivery_date || null,
      items,
    };
  });
}

function parsePurchases(data) {
  return (data.purchases || []).map(p => {
    const product = p.product || {};
    const localImages = product.images?.local_images || [];
    const remoteImages = product.images?.images || [];

    const image =
      (localImages[0] ? `https://test.ikeya.by${localImages[0]}` : null) ||
      remoteImages[0] ||
      null;

    return {
      id:          p.product_sku,
      orderId:     p.order_id,
      purchasedAt: formatDate(p.purchased_at),
      quantity:    p.quantity || 1,
      price_byn:   parseFloat(p.price_byn || 0).toFixed(2),
      product:     { sku: product.sku, name: product.name || '—', price_byn: product.price_byn, images: product.images },
      title:       product.name || '—',
      priceWhole:  String(Math.floor(parseFloat(p.price_byn || 0))),
      priceCents:  (parseFloat(p.price_byn || 0) % 1).toFixed(2).split('.')[1],
      images:      image ? [image] : [],
    };
  });
}

export default function Orders() {
  const { token } = useAuth();
  const [activeTab, setActiveTab]             = useState('active');
  const [allOrders, setAllOrders]             = useState([]);
  const [purchases, setPurchases]             = useState([]);
  const [ordersLoading, setOrdersLoading]     = useState(true);
  const [purchasesLoading, setPurchasesLoading] = useState(false);
  const [error, setError]                     = useState(null);

  // Загрузка заказов
  useEffect(() => {
    if (!token) { setOrdersLoading(false); return; }

    async function loadOrders() {
      setOrdersLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_BASE_URL}/account/orders?per_page=50&page=1`, {
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          cache: 'no-store',
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setAllOrders(parseOrders(data));
      } catch {
        setError('Не удалось загрузить заказы');
      } finally {
        setOrdersLoading(false);
      }
    }

    loadOrders();
  }, [token]);

  // Загрузка покупок — только при переходе на вкладку
  useEffect(() => {
    if (activeTab !== 'purchases' || !token || purchases.length > 0) return;

    async function loadPurchases() {
      setPurchasesLoading(true);
      try {
        const res = await fetch(`${API_BASE_URL}/account/purchases?sort=newest&page=1`, {
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          cache: 'no-store',
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setPurchases(parsePurchases(data));
      } catch {
        setPurchases([]);
      } finally {
        setPurchasesLoading(false);
      }
    }

    loadPurchases();
  }, [activeTab, token]);

  const activeOrders  = allOrders.filter(o => ACTIVE_STATUSES.includes(o.rawStatus));
  const historyOrders = allOrders.filter(o => HISTORY_STATUSES.includes(o.rawStatus));

  if (ordersLoading) {
    return <div className="orders-lists"><p style={{ padding: 24 }}>Загрузка заказов...</p></div>;
  }

  if (error) {
    return <div className="orders-lists"><p style={{ padding: 24, color: '#b71c1c' }}>{error}</p></div>;
  }

  return (
    <div className="orders-lists">
      <div className="orders-tabs orders-container">

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

        <div className="tab-content" id="ordersTabsContent">
          {activeTab === 'active' && (
            <div>
              {activeOrders.length === 0 ? (
                <div className="empty" style={{ padding: '32px 0', textAlign: 'center' }}>
                  <div className="empty-title">Активных заказов нет</div>
                </div>
              ) : (
                <ActiveOrders orders={activeOrders} />
              )}
            </div>
          )}

          {activeTab === 'history' && (
            <div>
              {historyOrders.length === 0 ? (
                <div className="empty" style={{ padding: '32px 0', textAlign: 'center' }}>
                  <div className="empty-title">История заказов пуста</div>
                </div>
              ) : (
                <OrderHistory orders={historyOrders} />
              )}
            </div>
          )}

          {activeTab === 'purchases' && (
            <div>
              {purchasesLoading ? (
                <p style={{ padding: 24 }}>Загрузка покупок...</p>
              ) : purchases.length === 0 ? (
                <div className="empty" style={{ padding: '32px 0', textAlign: 'center' }}>
                  <div className="empty-title">Покупок пока нет</div>
                </div>
              ) : (
                <Purchases products={purchases} />
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}