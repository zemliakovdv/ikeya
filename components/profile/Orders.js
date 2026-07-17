// components/profile/Orders.js
'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import ActiveOrders from '@/components/profile/ActiveOrders';
import OrderHistory from '@/components/profile/OrderHistory';
import Purchases from '@/components/profile/Purchases';
import {
  canShowOrderTrackNumber,
  canShowWhereIsOrderButton,
  getOrderStatusLabel,
  ORDER_STATUS_FALLBACK_LABELS,
  getOrderStatusConfig,
  isProfileActiveOrder,
  isProfileDraftOrder,
  isProfileExpiredUnpaidOrder,
  isProfileHistoryOrder,
  normalizeOrderStatus,
  reorder,
} from '@/lib/api/account';
import { buildApiUrl, buildAssetUrl } from '@/lib/config/api';
import { useProfileCounts } from './ProfileCountsContext';

// ─── Константы ───────────────────────────────────────────────────────────────

const UNPAID_STATUSES = ['created', 'processing'];

const PAYMENT_LIFETIME_MS = 20 * 60 * 1000;

const PURCHASES_PER_PAGE = 20;

const PURCHASES_DEFAULT_SORT = 'newest';

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

function firstDefined(...values) {
  return values.find((value) => value !== undefined && value !== null && value !== '');
}

function toFiniteNumber(value) {
  if (value === undefined || value === null || value === '') return null;
  const normalized = typeof value === 'string'
    ? value.replace(/\s/g, '').replace(',', '.')
    : value;
  const num = Number.parseFloat(normalized);
  return Number.isFinite(num) ? num : null;
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

function parsePossibleJson(value) {
  if (typeof value !== 'string') return value;
  const trimmed = value.trim();
  if (!trimmed || (!trimmed.startsWith('[') && !trimmed.startsWith('{'))) return value;

  try {
    return JSON.parse(trimmed);
  } catch {
    return value;
  }
}

const ADDRESS_STRING_FIELDS = [
  'full_address',
  'fullAddress',
  'formatted',
  'formatted_address',
  'address_text',
  'address',
  'value',
  'label',
  'name',
];

const ADDRESS_PART_FIELDS = [
  'country',
  'region',
  'area',
  'district',
  'city',
  'locality',
  'settlement',
  'postal_code',
  'postcode',
  'zip',
  'street',
  'street_name',
  'avenue',
  'building',
  'building_number',
  'house',
  'house_number',
  'corpus',
  'block',
  'entrance',
  'porch',
  'floor',
  'apartment',
  'flat',
  'office',
  'pickup_point',
  'pvz',
];

const ADDRESS_NESTED_FIELDS = ['delivery', 'recipient', 'location', 'details'];

function cleanAddressString(value) {
  if (value === undefined || value === null) return null;
  if (typeof value === 'number') return Number.isFinite(value) ? String(value) : null;
  if (typeof value !== 'string') return null;

  const text = value.trim().replace(/\s+/g, ' ');
  if (!text) return null;

  const normalized = text.toLowerCase();
  if (
    normalized === '[object object]' ||
    normalized === 'undefined' ||
    normalized === 'null' ||
    normalized === 'nan' ||
    /^,+$/.test(text.replace(/\s/g, ''))
  ) {
    return null;
  }

  return text;
}

function uniqueAddressParts(parts) {
  const seen = new Set();
  const result = [];

  parts.forEach((part) => {
    const text = cleanAddressString(part);
    if (!text) return;

    const key = text.toLowerCase();
    if (seen.has(key)) return;

    seen.add(key);
    result.push(text);
  });

  return result;
}

function normalizeAddressValue(value, depth = 0) {
  if (depth > 6 || value === undefined || value === null) return null;

  const parsed = parsePossibleJson(value);
  if (parsed !== value) return normalizeAddressValue(parsed, depth + 1);

  if (typeof value === 'string' || typeof value === 'number') {
    return cleanAddressString(value);
  }

  if (Array.isArray(value)) {
    const parts = uniqueAddressParts(
      value
        .map((item) => normalizeAddressValue(item, depth + 1))
        .filter(Boolean)
    );
    return parts.join(', ') || null;
  }

  if (typeof value !== 'object') return null;

  for (const field of ADDRESS_STRING_FIELDS) {
    const fieldValue = value[field];
    if (typeof fieldValue === 'string') {
      const text = cleanAddressString(fieldValue);
      if (text) return text;
    }

    if (fieldValue && typeof fieldValue === 'object') {
      const nested = normalizeAddressValue(fieldValue, depth + 1);
      if (nested) return nested;
    }
  }

  const parts = [];

  ADDRESS_PART_FIELDS.forEach((field) => {
    const part = normalizeAddressValue(value[field], depth + 1);
    if (part) parts.push(part);
  });

  ADDRESS_NESTED_FIELDS.forEach((field) => {
    const nested = value[field];
    if (!nested || typeof nested !== 'object') return;

    ADDRESS_PART_FIELDS.forEach((partField) => {
      const part = normalizeAddressValue(nested[partField], depth + 1);
      if (part) parts.push(part);
    });
  });

  const unique = uniqueAddressParts(parts);
  return unique.join(', ') || null;
}

function formatAddress(attr = {}) {
  const candidates = [
    attr.delivery_address,
    attr.deliveryAddress,
    attr.address_text,
    attr.address,
    attr.delivery?.address,
    attr.recipient?.address,
    attr.location,
    attr.details,
  ];

  for (const candidate of candidates) {
    const address = normalizeAddressValue(candidate);
    if (address) return address;
  }

  return null;
}

function normalizeServices(value) {
  const parsed = parsePossibleJson(value);
  const values = Array.isArray(parsed) ? parsed : parsed ? [parsed] : [];

  const services = values
    .map((service) => {
      if (typeof service === 'string') return service;
      if (!service || typeof service !== 'object') return '';
      return firstDefined(
        service.name,
        service.title,
        service.label,
        service.service_name,
        service.description
      ) || '';
    })
    .map((service) => String(service).trim())
    .filter(Boolean);

  return [...new Set(services)];
}

function getPaymentMethodLabel(attr = {}) {
  const method = firstDefined(
    attr.payment_method_name,
    attr.payment_method,
    attr.payment_type,
    attr.payment?.method_name,
    attr.payment?.method,
    attr.payment?.type
  );

  return method ? String(method).trim() : null;
}

function getPaymentStatusLabel(status) {
  if (!status) return null;
  const value = String(status).trim();
  const normalized = value.toLowerCase();

  const labels = {
    paid: 'оплачено',
    success: 'оплачено',
    succeeded: 'оплачено',
    completed: 'оплачено',
    unpaid: 'не оплачено',
    pending: 'ожидает оплаты',
    created: 'ожидает оплаты',
    processing: 'ожидает оплаты',
    awaiting: 'ожидает оплаты',
    awaiting_payment: 'ожидает оплаты',
    failed: 'ошибка оплаты',
    cancelled: 'оплата отменена',
    canceled: 'оплата отменена',
    expired: 'не оплачено',
  };

  return labels[normalized] || null;
}

function isPaidStatus(status) {
  if (!status) return false;
  return ['paid', 'success', 'succeeded', 'completed'].includes(String(status).toLowerCase());
}

export function parseOrders(data) {
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
    const canonicalStatus = normalizeOrderStatus(rawStatus);
    const isDraft = isProfileDraftOrder(order);

    const paymentUrl = getPaymentUrl(attr);
    const paymentExpired = isPaymentExpired(attr, rawStatus);
    const paymentSecondsLeft = getPaymentSecondsLeft(attr, rawStatus);
    const isExpiredUnpaid = isProfileExpiredUnpaidOrder(order);
    const paymentStatus = firstDefined(attr.payment_status, attr.payment?.status);
    const paymentMethodLabel = getPaymentMethodLabel(attr);
    const paymentStatusLabel = getPaymentStatusLabel(paymentStatus);
    const explicitPaid = firstDefined(
      typeof attr.is_paid === 'boolean' ? attr.is_paid : null,
      typeof attr.paid === 'boolean' ? attr.paid : null,
      typeof attr.payment?.is_paid === 'boolean' ? attr.payment.is_paid : null,
      typeof attr.payment?.paid === 'boolean' ? attr.payment.paid : null
    );
    const isPaid = typeof explicitPaid === 'boolean'
      ? explicitPaid
      : isPaidStatus(paymentStatus) || null;

    const isAwaitingPayment =
      !isDraft &&
      !paymentExpired &&
      Boolean(paymentUrl) &&
      UNPAID_STATUSES.includes(rawStatus);

    const statusConfig = getOrderStatusConfig({
      ...order,
      rawStatus,
      canonicalStatus,
      isDraft,
      isExpiredUnpaid,
      trackNumber: attr.track_number || null,
    });
    const mappedStatus = isDraft
      ? 'draft'
      : (statusConfig?.frontendStatus || canonicalStatus || rawStatus || 'unknown');

    const orderItemIds =
      order.relationships?.order_items?.data?.map((item) => item.id) || [];

    const items = orderItemIds
      .map((id) => itemsMap[id])
      .filter(Boolean)
      .map((item) => {
        const priceAmount = toFiniteNumber(firstDefined(
          item.price_byn,
          item.price,
          item.unit_price_byn,
          item.total_byn
        ));
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
          priceAmount,
          image,
          image_url: item.image_url || null,
          local_image: item.local_image || null,
          local_images: item.local_images || null,
          images: item.images || null,
          product: item.product || null,
        };
      });

    const itemsCount = toFiniteNumber(firstDefined(attr.items_count, attr.items?.length));
    const totalWeight = toFiniteNumber(firstDefined(
      attr.total_weight_kg,
      attr.weight_kg,
      attr.total_weight,
      attr.weight,
      attr.delivery?.total_weight_kg
    ));
    const totalAmount = toFiniteNumber(firstDefined(
      attr.total_amount,
      attr.total_byn,
      attr.final_total_byn
    ));
    const deliveryName = firstDefined(
      attr.address?.delivery?.provider,
      attr.delivery_name,
      attr.delivery_provider,
      attr.delivery_method,
      attr.delivery?.name,
      attr.delivery?.provider,
      attr.delivery?.method
    );
    const deliveryProvider = firstDefined(
      attr.address?.delivery?.provider,
      attr.delivery_provider,
      attr.delivery_name,
      attr.delivery?.provider,
      attr.delivery?.name
    );
    const deliveryMethod = firstDefined(
      attr.delivery_method,
      attr.delivery?.method
    );
    const rawDeliveryType = firstDefined(
      attr.delivery_type,
      attr.delivery?.type,
      attr.delivery?.code,
      attr.address?.delivery?.type,
      attr.address?.delivery?.code
    );

    return {
      id: String(attr.public_uid || attr.id || order.id),
      draftId: String(attr.id || order.id),
      publicUid: attr.public_uid || null,
      isDraft,
      isExpiredUnpaid,
      date: formatDate(attr.created_at),
      rawDate: attr.created_at,
      rawStatus,
      canonicalStatus,
      deliveryType: attr.delivery_type || null,
      rawDeliveryType: rawDeliveryType || null,
      deliveryName: deliveryName || null,
      deliveryProvider: deliveryProvider || null,
      deliveryMethod: deliveryMethod || null,
      deliveryAddress: formatAddress(attr),
      status: mappedStatus,
      statusConfig,
      statusDescription: isExpiredUnpaid
        ? ORDER_STATUS_FALLBACK_LABELS.cancelled
        : getOrderStatusLabel(order),
      paymentStatus: paymentStatus || null,
      paymentMethodLabel,
      paymentStatusLabel,
      isPaid,
      price: formatPrice(attr.total_amount),
      itemsCount,
      totalWeight,
      itemsSubtotal: toFiniteNumber(firstDefined(
        attr.items_total_byn,
        attr.subtotal_byn,
        attr.subtotal,
        attr.products_total_byn,
        attr.goods_total_byn
      )),
      deliveryToBelarus: toFiniteNumber(firstDefined(
        attr.delivery_to_belarus_byn,
        attr.international_delivery_byn,
        attr.delivery?.delivery_to_belarus_byn
      )),
      localDeliveryCost: toFiniteNumber(firstDefined(
        attr.delivery_total_byn,
        attr.local_delivery_byn,
        attr.courier_delivery_byn,
        attr.delivery_cost_byn,
        attr.delivery?.total_byn,
        attr.delivery?.cost_byn
      )),
      customsDuty: toFiniteNumber(firstDefined(
        attr.customs_total_byn,
        attr.customs_duty_byn,
        attr.customsDuty,
        attr.customs?.duty_byn,
        attr.customs?.total_byn
      )),
      customsDutyApprox: Boolean(
        attr.customs_estimated ||
        attr.customs_duty_estimated ||
        attr.customs?.estimated
      ),
      totalAmount,
      trackNumber: attr.track_number || null,
      canShowTrackNumber: canShowOrderTrackNumber(order),
      canShowWhereIsOrderButton: canShowWhereIsOrderButton(order),
      trackingUrl:
        attr.tracking_info?.tracking_url ||
        attr.tracking_url ||
        attr.tracking?.url ||
        attr.delivery?.tracking_url ||
        null,
      trackingInfo: attr.tracking_info || null,
      paymentUrl,
      paymentSecondsLeft,
      paymentExpired,
      isAwaitingPayment,
      services: normalizeServices(firstDefined(
        attr.services,
        attr.order_services,
        attr.additional_services,
        attr.service_items
      )),
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

// Поля картинок могут приходить JSON-строками — приводим к массиву
function parseImagesField(value) {
  if (Array.isArray(value)) return value;
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
}

function parsePurchases(data) {
  return (data?.purchases || []).map((purchase) => {
    const product = purchase.product || {};
    const productSku = purchase.product_sku || purchase.sku || product.sku || null;
    const purchasedAt = purchase.purchased_at || purchase.purchasedAt || purchase.created_at || null;
    const quantity = purchase.quantity ?? product.quantity ?? 1;
    const priceByn =
      purchase.price_byn ??
      purchase.price ??
      purchase.unit_price_byn ??
      purchase.unit_price ??
      purchase.final_price_byn ??
      purchase.final_price ??
      purchase.product_price_byn ??
      purchase.product_price ??
      product.price_byn ??
      product.price ??
      product.new_price ??
      product.price_new ??
      '0';
    const productImages = product.images || {};
    const localImages = parseImagesField(productImages.local_images);
    const remoteImages = parseImagesField(productImages.images);
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
      sku: purchase.sku ?? product.sku ?? productSku,
      slug: purchase.slug ?? product.slug ?? null,
      product_slug: purchase.product_slug ?? product.product_slug ?? null,
      product_sku: productSku,
      quantity,
      small_desc_name: purchase.small_desc_name ?? product.small_desc_name ?? null,
      description: purchase.description ?? product.description ?? null,
      short_description: purchase.short_description ?? product.short_description ?? null,
      subtitle: purchase.subtitle ?? product.subtitle ?? null,
      variants: purchase.variants ?? product.variants ?? null,
      product_variants: purchase.product_variants ?? product.product_variants ?? null,
      price_byn: price.toFixed(2),
      price: purchase.price ?? purchase.price_byn ?? null,
      unit_price_byn: purchase.unit_price_byn ?? null,
      unit_price: purchase.unit_price ?? null,
      final_price_byn: purchase.final_price_byn ?? null,
      final_price: purchase.final_price ?? null,
      product_price_byn: purchase.product_price_byn ?? null,
      product_price: purchase.product_price ?? null,
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

function usePurchasesInfinite(token, enabled, sort = PURCHASES_DEFAULT_SORT) {
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

  // Сброс накопленных страниц при смене токена ИЛИ сортировки
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
  }, [token, sort]);

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
        buildApiUrl(`/account/purchases?sort=${encodeURIComponent(sort)}&page=${page}&per_page=${PURCHASES_PER_PAGE}`),
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
  }, [token, sort]);

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
  const { setActiveOrdersCount } = useProfileCounts();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState('active');
  const [allOrders, setAllOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [error, setError] = useState(null);
  const [purchasesSort, setPurchasesSort] = useState(PURCHASES_DEFAULT_SORT);

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
  } = usePurchasesInfinite(token, purchasesEnabled, purchasesSort);

  // ── Фильтрация заказов ──────────────────────────────────────────────────────

  const activeOrders = allOrders.filter(isProfileActiveOrder);

  const historyOrders = allOrders.filter(isProfileHistoryOrder);

  useEffect(() => {
    setActiveOrdersCount(activeOrders.length);
  }, [activeOrders.length, setActiveOrdersCount]);

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
                  {purchases.length > 0 && (
                    <Purchases
                      products={purchases}
                      sort={purchasesSort}
                      onSortChange={setPurchasesSort}
                    />
                  )}

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
