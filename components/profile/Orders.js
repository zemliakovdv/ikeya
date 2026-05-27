// components/profile/Orders.js
'use client';

import { useEffect, useRef, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import ActiveOrders from '@/components/profile/ActiveOrders';
import OrderHistory from '@/components/profile/OrderHistory';
import Purchases from '@/components/profile/Purchases';

import { buildApiUrl, buildAssetUrl } from '@/lib/config/api';

const ACTIVE_STATUSES = [
  'created',
  'processing',
  'confirmed',
  'paid',
  'purchased',
  'received_poland',
  'preparing_for_shipment',
  'export_eu',
  'customs_poland',
  'on_border',
  'customs_belarus',
  'shipped',
  'handed_to_courier',
  'handed_to_courier_ikeya',
  'arrived_pvz',
  'assembly',
  'transit',
  'customs-belarus',
  'in-transit-pvz',
  'arrived-pvz',
];

const HISTORY_STATUSES = [
  'completed',
  'cancelled',
  'canceled',
  'delivered',
];

const UNPAID_STATUSES = ['created', 'processing'];

const PAYMENT_LIFETIME_MS = 20 * 60 * 1000;

function formatDate(dateStr) {
  if (!dateStr) return '—';

  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return '—';

  const day = date.getDate();
  const months = [
    'января',
    'февраля',
    'марта',
    'апреля',
    'мая',
    'июня',
    'июля',
    'августа',
    'сентября',
    'октября',
    'ноября',
    'декабря',
  ];

  return `${day} ${months[date.getMonth()]}`;
}

function formatPrice(value) {
  const num = Number.parseFloat(value || 0);

  return Number.isFinite(num)
    ? num.toLocaleString('ru-RU', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    : '0,00';
}

function resolveImage(imageUrl) {
  if (!imageUrl) return null;

  let urls = imageUrl;

  if (typeof urls === 'string') {
    try {
      urls = JSON.parse(urls);
    } catch {
      return null;
    }
  }

  if (!Array.isArray(urls) || urls.length === 0) return null;

  const first = urls[0];

  if (!first || String(first).startsWith('as:')) return null;
  if (String(first).startsWith('http')) return first;
  if (String(first).startsWith('/')) return buildAssetUrl(first);

  return null;
}

function getPaymentUrl(attr = {}) {
  return (
    attr.payment_url ||
    attr.payment_link ||
    attr.payment?.url ||
    attr.payment?.payment_url ||
    attr.payment_url_full ||
    null
  );
}

function isPaymentExpired(attr = {}, rawStatus) {
  if (attr.payment_expired === true) return true;

  if (!UNPAID_STATUSES.includes(rawStatus)) return false;

  if (attr.payment_expires_at) {
    return new Date(attr.payment_expires_at).getTime() <= Date.now();
  }

  const createdAt = new Date(attr.created_at);
  if (Number.isNaN(createdAt.getTime())) return false;
  return createdAt.getTime() + PAYMENT_LIFETIME_MS <= Date.now();
}

function getPaymentSecondsLeft(attr = {}, rawStatus) {
  if (!UNPAID_STATUSES.includes(rawStatus)) return null;

  const expiresAt = attr.payment_expires_at
    ? new Date(attr.payment_expires_at).getTime()
    : new Date(attr.created_at).getTime() + PAYMENT_LIFETIME_MS;

  if (Number.isNaN(expiresAt)) return null;
  const diff = Math.floor((expiresAt - Date.now()) / 1000);
  return diff > 0 ? diff : null;
}

function mapStatus(rawStatus, isDraft = false, isAwaitingPayment = false, isExpiredUnpaid = false) {
  if (isDraft) return 'draft';
  if (isExpiredUnpaid) return 'canceled';
  if (isAwaitingPayment) return 'awaiting';

  const map = {
    created: 'awaiting',
    processing: 'awaiting',
    confirmed: 'assembly',
    paid: 'assembly',
    purchased: 'assembly',
    received_poland: 'transit',
    preparing_for_shipment: 'transit',
    export_eu: 'transit',
    customs_poland: 'transit',
    on_border: 'transit',
    customs_belarus: 'customs-belarus',
    shipped: 'transit',
    handed_to_courier: 'transit',
    handed_to_courier_ikeya: 'transit',
    arrived_pvz: 'arrived-pvz',
    completed: 'delivered',
    delivered: 'delivered',
    cancelled: 'canceled',
    canceled: 'canceled',
  };

  return map[rawStatus] || rawStatus;
}

function parseOrders(data) {
  const included = data?.included || [];
  const itemsMap = {};

  included.forEach((inc) => {
    if (inc.type === 'order_item') {
      itemsMap[inc.id] = inc.attributes;
    }
  });

  return (data?.data || []).map((order) => {
    const attr = order.attributes || {};
    const rawStatus = attr.status;
    const isDraft = attr.checkout_draft === true;

    const paymentUrl = getPaymentUrl(attr);
    const paymentExpired = isPaymentExpired(attr, rawStatus);
    const paymentSecondsLeft = getPaymentSecondsLeft(attr, rawStatus);

    const isExpiredUnpaid =
      !isDraft &&
      paymentExpired &&
      UNPAID_STATUSES.includes(rawStatus);

    const isAwaitingPayment =
      !isDraft &&
      !paymentExpired &&
      Boolean(paymentUrl) &&
      UNPAID_STATUSES.includes(rawStatus);

    const mappedStatus = mapStatus(rawStatus, isDraft, isAwaitingPayment, isExpiredUnpaid);

    const orderItemIds =
      order.relationships?.order_items?.data?.map((item) => item.id) || [];

    const items = orderItemIds
      .map((id) => itemsMap[id])
      .filter(Boolean)
      .map((item) => ({
        name: item.name || '—',
        desc: item.product_sku || '',
        quantity: item.quantity || 1,
        price: Number.parseFloat(item.price_byn || 0).toFixed(2),
        image: resolveImage(item.image_url),
      }));

    return {
      id: String(attr.public_uid || attr.id || order.id),
      draftId: String(attr.id || order.id),
      publicUid: attr.public_uid || null,
      isDraft,
      isExpiredUnpaid,
      date: formatDate(attr.created_at),
      rawDate: attr.created_at,
      rawStatus,
      status: mappedStatus,
      statusDescription: isExpiredUnpaid
        ? 'Истёк срок оплаты'
        : attr.status_description || null,
      price: formatPrice(attr.total_amount),
      trackNumber: attr.track_number || null,
      paymentUrl,
      paymentSecondsLeft,
      paymentExpired,
      isAwaitingPayment,
      dateRange: attr.delivery_eta?.delivery_date || attr.delivery_date || null,
      items,
    };
  });
}

function parsePurchases(data) {
  return (data?.purchases || []).map((purchase) => {
    const product = purchase.product || {};
    const localImages = product.images?.local_images || [];
    const remoteImages = product.images?.images || [];

    const image =
      (localImages[0] ? buildAssetUrl(localImages[0]) : null) ||
      remoteImages[0] ||
      null;

    const price = Number.parseFloat(purchase.price_byn || 0);

    return {
      id: purchase.product_sku,
      orderId: purchase.order_id,
      purchasedAt: formatDate(purchase.purchased_at),
      quantity: purchase.quantity || 1,
      price_byn: price.toFixed(2),
      product: {
        sku: product.sku,
        name: product.name || '—',
        price_byn: product.price_byn,
        images: product.images,
      },
      title: product.name || '—',
      priceWhole: String(Math.floor(price)),
      priceCents: (price % 1).toFixed(2).split('.')[1],
      images: image ? [image] : [],
    };
  });
}

export default function Orders() {
  const { token } = useAuth();

  const [activeTab, setActiveTab] = useState('active');
  const [allOrders, setAllOrders] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [purchasesLoading, setPurchasesLoading] = useState(false);
  const [error, setError] = useState(null);
  const refreshTimerRef = useRef(null);

  useEffect(() => {
    if (!token) {
      setOrdersLoading(false);
      return;
    }

    async function loadOrders() {
      setOrdersLoading(true);
      setError(null);

      try {
        const res = await fetch(buildApiUrl('/account/orders?per_page=50&page=1'), {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          cache: 'no-store',
        });

        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }

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

  // Автообновление когда истекает таймер оплаты
  useEffect(() => {
    if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current);

    const unpaidOrders = allOrders.filter(o =>
      !o.isDraft && !o.isExpiredUnpaid && UNPAID_STATUSES.includes(o.rawStatus) && o.paymentSecondsLeft > 0
    );

    if (unpaidOrders.length === 0) return;

    const minSecondsLeft = Math.min(...unpaidOrders.map(o => o.paymentSecondsLeft));
    const delay = (minSecondsLeft + 2) * 1000;

    refreshTimerRef.current = setTimeout(async () => {
      if (!token) return;
      try {
        const res = await fetch(buildApiUrl('/account/orders?per_page=50&page=1'), {
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          cache: 'no-store',
        });
        if (res.ok) {
          const data = await res.json();
          setAllOrders(parseOrders(data));
        }
      } catch {}
    }, delay);

    return () => clearTimeout(refreshTimerRef.current);
  }, [allOrders, token]);

  useEffect(() => {
    if (activeTab !== 'purchases' || !token || purchases.length > 0) return;

    async function loadPurchases() {
      setPurchasesLoading(true);

      try {
        const res = await fetch(buildApiUrl('/account/purchases?sort=newest&page=1'), {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          cache: 'no-store',
        });

        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }

        const data = await res.json();
        setPurchases(parsePurchases(data));
      } catch {
        setPurchases([]);
      } finally {
        setPurchasesLoading(false);
      }
    }

    loadPurchases();
  }, [activeTab, token, purchases.length]);

  const activeOrders = allOrders.filter((order) =>
    order.isDraft ||
    (!order.isExpiredUnpaid && ACTIVE_STATUSES.includes(order.rawStatus))
  );

  const historyOrders = allOrders.filter((order) =>
    !order.isDraft &&
    (order.isExpiredUnpaid || HISTORY_STATUSES.includes(order.rawStatus))
  );

  if (ordersLoading) {
    return (
      <div className="orders-lists">
        <p style={{ padding: 24 }}>Загрузка заказов...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="orders-lists">
        <p style={{ padding: 24, color: '#b71c1c' }}>{error}</p>
      </div>
    );
  }

  return (
    <div className="orders-lists">
      <div className="orders-tabs orders-container">
        <ul className="nav nav-tabs" id="ordersTabs" role="tablist">
          <li className="nav-item" role="presentation">
            <button
              className={`nav-link ${activeTab === 'active' ? 'active' : ''}`}
              type="button"
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
              type="button"
              onClick={() => setActiveTab('history')}
            >
              История заказов
            </button>
          </li>

          <li className="nav-item" role="presentation">
            <button
              className={`nav-link ${activeTab === 'purchases' ? 'active' : ''}`}
              type="button"
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