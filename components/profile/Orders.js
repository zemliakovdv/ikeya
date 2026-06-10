// components/profile/Orders.js
'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import ActiveOrders from '@/components/profile/ActiveOrders';
import OrderHistory from '@/components/profile/OrderHistory';
import Purchases from '@/components/profile/Purchases';
import { reorder } from '@/lib/api/account';
import { buildApiUrl, buildAssetUrl } from '@/lib/config/api';

// ─── Константы ───────────────────────────────────────────────────────────────

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
];

const HISTORY_STATUSES = [
  'completed',
  'cancelled',
  'canceled',
];

const UNPAID_STATUSES = ['created', 'processing'];

const PAYMENT_LIFETIME_MS = 20 * 60 * 1000;

const PURCHASES_PER_PAGE = 20;

// ─── Утилиты ─────────────────────────────────────────────────────────────────

function formatDate(dateStr) {
  if (!dateStr) return '—';
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return '—';
  const months = [
    'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
    'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря',
  ];
  return `${date.getDate()} ${months[date.getMonth()]}`;
}

function formatPrice(value) {
  const num = Number.parseFloat(value || 0);
  return Number.isFinite(num)
    ? num.toLocaleString('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    : '0,00';
}

function resolveImage(imageUrl) {
  if (!imageUrl) return null;

  if (Array.isArray(imageUrl)) {
    const first = imageUrl.find((url) => url && !String(url).startsWith('as:'));
    if (!first) return null;
    return resolveImage(first);
  }

  if (typeof imageUrl === 'string') {
    const value = imageUrl.trim();
    if (!value || value.startsWith('as:')) return null;

    if (value.startsWith('[')) {
      try {
        return resolveImage(JSON.parse(value));
      } catch {
        return null;
      }
    }

    if (value.startsWith('http://') || value.startsWith('https://')) return value;
    if (value.startsWith('/')) return buildAssetUrl(value);
    if (value.startsWith('images/')) return buildAssetUrl(`/${value}`);

    return null;
  }

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

function mapStatus(rawStatus, isDraft, isAwaitingPayment, isExpiredUnpaid) {
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
      !isDraft && paymentExpired && UNPAID_STATUSES.includes(rawStatus);

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
  .map((item) => {
    const image =
      resolveImage(item.image_url) ||
      resolveImage(item.image) ||
      resolveImage(item.local_image) ||
      resolveImage(item.local_images) ||
      resolveImage(item.images) ||
      resolveImage(item.product?.image_url) ||
      resolveImage(item.product?.image) ||
      resolveImage(item.product?.local_images) ||
      resolveImage(item.product?.images);

    return {
      name: item.name || '—',
      desc: item.product_sku || '',
      product_sku: item.product_sku || null,
      quantity: item.quantity || 1,
      price: Number.parseFloat(item.price_byn || 0).toFixed(2),
      image,
      image_url: item.image_url || null,
      local_image: item.local_image || null,
      local_images: item.local_images || null,
      images: item.images || null,
      product: item.product || null,
    };
  });

    return {
      id: String(attr.public_uid || attr.id || order.id),
      draftId: String(attr.id || order.id),
      publicUid: attr.public_uid || null,
      isDraft,
      isExpiredUnpaid,
      date: formatDate(attr.created_at),
      rawDate: attr.created_at,
      rawStatus,
      deliveryType: attr.delivery_type || null,
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
      dateRange: (() => {
        const raw = attr.address?.delivery?.delivery_date || attr.delivery_eta?.delivery_date || attr.delivery_date;
        if (raw) {
          const months = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
          const d = new Date(raw);
          if (!Number.isNaN(d.getTime())) return `${d.getDate()} ${months[d.getMonth()]}`;
          return raw;
        }
        if (raw) return raw;
        const created = new Date(attr.created_at);
        if (Number.isNaN(created.getTime())) return null;
        const fallback = new Date(created);
        fallback.setDate(fallback.getDate() + 10);
        const months = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
        return `${fallback.getDate()} ${months[fallback.getMonth()]}`;
      })(),
      items,
    };
  });
}

function parsePurchases(data) {
  return (data?.purchases || []).map((purchase) => {
    const product = purchase.product || {};
    const productSku = purchase.product_sku || purchase.sku || product.sku || null;
    const purchasedAt = purchase.purchased_at || purchase.purchasedAt || purchase.created_at || null;
    const quantity = purchase.quantity ?? product.quantity ?? 1;
    const priceByn = purchase.price_byn ?? product.price_byn ?? '0';
    const productImages = product.images || {};
    const localImages = productImages.local_images || [];
    const remoteImages = productImages.images || [];
    const image =
      (localImages[0] ? buildAssetUrl(localImages[0]) : null) ||
      remoteImages[0] ||
      null;
    const price = Number.parseFloat(priceByn || 0);
    const normalizedProduct = {
      ...product,
      sku: product.sku || productSku,
      name: product.name || '—',
      price_byn: product.price_byn ?? priceByn,
      quantity: product.quantity ?? quantity,
      category_id: product.category_id ?? null,
      collection: product.collection ?? null,
      images: productImages,
    };

    return {
      order_id: purchase.order_id,
      status: purchase.status || null,
      purchased_at: purchasedAt,
      product_sku: productSku,
      quantity,
      price_byn: price.toFixed(2),
      product: normalizedProduct,
      id: productSku,
      orderId: purchase.order_id,
      purchasedAt: formatDate(purchasedAt),
      title: normalizedProduct.name,
      priceWhole: String(Math.floor(price)),
      priceCents: (price % 1).toFixed(2).split('.')[1],
      images: image ? [image] : [],
    };
  });
}

// ─── Хук: бесконечная прокрутка покупок ──────────────────────────────────────

function usePurchasesInfinite(token, enabled) {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [loadedOnce, setLoadedOnce] = useState(false);

  const loadingRef = useRef(false);
  const hasMoreRef = useRef(true);
  const pageRef = useRef(1);
  const triggerRef = useRef(null);
  const observerRef = useRef(null);
  const abortRef = useRef(null);

  useEffect(() => {
    setPurchases([]);
    setLoading(false);
    setHasMore(true);
    setLoadedOnce(false);
    loadingRef.current = false;
    hasMoreRef.current = true;
    pageRef.current = 1;
    observerRef.current?.disconnect();
    abortRef.current?.abort();
  }, [token]);

  const loadMore = useCallback(async () => {
    if (loadingRef.current || !hasMoreRef.current || !token) return;

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    loadingRef.current = true;
    setLoading(true);

    try {
      const page = pageRef.current;
      const res = await fetch(
        buildApiUrl(`/account/purchases?sort=newest&page=${page}&per_page=${PURCHASES_PER_PAGE}`),
        {
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          cache: 'no-store',
          signal: controller.signal,
        }
      );

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = await res.json();
      if (controller.signal.aborted) return;

      const newItems = parsePurchases(data);
      const totalPages = data?.meta?.total_pages || 1;
      const more = page < totalPages;

      setPurchases((prev) => [...prev, ...newItems]);
      pageRef.current = page + 1;
      hasMoreRef.current = more;
      setHasMore(more);
    } catch (err) {
      if (err.name === 'AbortError') return;
      hasMoreRef.current = false;
      setHasMore(false);
    } finally {
      if (!abortRef.current?.signal.aborted) {
        setLoadedOnce(true);
        loadingRef.current = false;
        setLoading(false);
      }
    }
  }, [token]);

  useEffect(() => {
    if (!enabled || !token) return;
    if (loadedOnce) return;
    if (loadingRef.current || !hasMoreRef.current) return;
    if (pageRef.current !== 1) return;
    loadMore();
  }, [enabled, token, loadedOnce, loadMore]);

  // IntersectionObserver — запуск при появлении триггера в зоне видимости
  useEffect(() => {
    if (!enabled) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) loadMore();
      },
      { threshold: 0, rootMargin: '200px' }
    );

    observerRef.current = observer;

    if (triggerRef.current) observer.observe(triggerRef.current);

    return () => {
      observer.disconnect();
      abortRef.current?.abort();
    };
  }, [enabled, loadMore]);

  const setTrigger = useCallback((node) => {
    triggerRef.current = node;
    if (!node || !observerRef.current) return;
    observerRef.current.disconnect();
    observerRef.current.observe(node);
  }, []);

  return { purchases, loading, hasMore, loadedOnce, setTrigger };
}

// ─── Основной компонент ───────────────────────────────────────────────────────

export default function Orders() {
  const { token } = useAuth();
  const { refreshCart } = useCart();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState('active');
  const [allOrders, setAllOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [error, setError] = useState(null);

  const refreshTimerRef = useRef(null);

  // ── Загрузка заказов ────────────────────────────────────────────────────────

  const loadOrders = useCallback(async () => {
    if (!token) return;
    setError(null);

    try {
      const res = await fetch(buildApiUrl('/account/orders?per_page=50&page=1'), {
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
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
  }, [token]);

  useEffect(() => {
    if (!token) { setOrdersLoading(false); return; }
    setOrdersLoading(true);
    loadOrders();
  }, [token, loadOrders]);

  // ── Авторефреш при истечении таймера оплаты ────────────────────────────────

  useEffect(() => {
    if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current);

    const unpaid = allOrders.filter(
      (o) => !o.isDraft && !o.isExpiredUnpaid &&
        UNPAID_STATUSES.includes(o.rawStatus) &&
        o.paymentSecondsLeft > 0
    );

    if (unpaid.length === 0) return;

    const minSeconds = Math.min(...unpaid.map((o) => o.paymentSecondsLeft));
    const delay = (minSeconds + 2) * 1000;

    refreshTimerRef.current = setTimeout(() => {
      loadOrders();
    }, delay);

    return () => clearTimeout(refreshTimerRef.current);
  }, [allOrders, loadOrders]);

  // ── Повторить заказ ─────────────────────────────────────────────────────────

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

  // ── Бесконечная прокрутка покупок ──────────────────────────────────────────

  const purchasesEnabled = activeTab === 'purchases';
  const {
    purchases,
    loading: purchasesLoading,
    hasMore: purchasesHasMore,
    loadedOnce: purchasesLoadedOnce,
    setTrigger,
  } = usePurchasesInfinite(token, purchasesEnabled);

  // ── Фильтрация заказов ──────────────────────────────────────────────────────

  const activeOrders = allOrders.filter(
    (o) => o.isDraft || (!o.isExpiredUnpaid && ACTIVE_STATUSES.includes(o.rawStatus))
  );

  const historyOrders = allOrders.filter(
    (o) => !o.isDraft && (o.isExpiredUnpaid || HISTORY_STATUSES.includes(o.rawStatus))
  );

  // ── Рендер ──────────────────────────────────────────────────────────────────

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
          )}

          {activeTab === 'history' && (
            <div>
              {historyOrders.length === 0 ? (
                <div className="empty" style={{ padding: '32px 0', textAlign: 'center' }}>
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
          )}

          {activeTab === 'purchases' && (
            <div>
              {purchasesLoadedOnce && purchases.length === 0 && !purchasesLoading ? (
                <div className="empty" style={{ padding: '32px 0', textAlign: 'center' }}>
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
                <>
                  {purchases.length > 0 && <Purchases products={purchases} />}

                  {(purchasesHasMore || purchasesLoading) && (
                    <div
                      ref={setTrigger}
                      className="loading-trigger"
                      style={{
                        height: '80px',
                        margin: '32px 0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {purchasesLoading && <div className="page-loader__spinner" />}
                    </div>
                  )}
                </>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
