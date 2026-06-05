'use client';

import { useState, useEffect, useCallback, useMemo, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import CartSummary from '@/components/cart/CartSummary';
import DeliveryModal from '@/components/delivery/modal/DeliveryModal';
import SavedAddressesModal from '@/components/delivery/modal/SavedAddressesModal';
import EditPersonalDataModal from '@/components/profile/modals/EditPersonalDataModal';
import EditPassportModal from '@/components/profile/modals/EditPassportModal';
import { getProfile, getDraft, finalizeDraft, updateCheckoutDraft } from '@/lib/api/cart';
import { resolvePaymentUrl } from '@/lib/utils/paymentUrl';
import { requestA1Verification, verifyA1Code } from '@/lib/api/account';
import SmsVerifyModal from '@/components/profile/modals/SmsVerifyModal';
import {
  calculateDelivery,
  getSavedPickupPoints,
  savePickupPoint,
  deleteSavedPickupPoint,
  getDeliveryAddresses,
  createDeliveryAddress,
  deleteDeliveryAddress,
} from '@/lib/api/delivery';

const LS_SAVED_PVZ = 'saved_pvz_addresses';
const LS_SAVED_ADDR = 'saved_delivery_addresses';
const LS_RECEIVE_METHOD = 'checkout_receive_method';
const LS_SELECTED_PVZ = 'checkout_selected_pvz';
const LS_SELECTED_ADDR = 'checkout_selected_addr';
const LS_PVZ_CALC = 'checkout_pvz_calc';
const LS_ADDR_CALC = 'checkout_addr_calc';

function mask(str, visible = 2) {
  if (!str) return '—';
  const s = String(str);
  if (s.length <= visible) return s;
  return s.slice(0, visible) + '*'.repeat(s.length - visible);
}

function maskDate(dateStr) {
  if (!dateStr) return '—';
  const [y, m, d] = dateStr.split('-');
  return `${d}.**.**** `;
}

function formatDate(dateStr) {
  if (!dateStr) return '—';
  const [y, m, d] = dateStr.split('-');
  return `${d}.${m}.${y}`;
}

function formatDeliveryDate(dateStr) {
  if (!dateStr) return '—';
  const date = new Date(dateStr);
  const day = date.getDate();
  const months = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
  return `${day} ${months[date.getMonth()]}`;
}

function readLS(key, fallback = null) {
  if (typeof window === 'undefined') return fallback;
  try {
    const val = localStorage.getItem(key);
    return val ? JSON.parse(val) : fallback;
  } catch {
    return fallback;
  }
}

function writeLS(key, value) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch { }
}

function removeLS(key) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(key);
  } catch { }
}

function readSessionJSON(key, fallback = null) {
  if (typeof window === 'undefined') return fallback;
  try {
    const value = sessionStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function readSessionValue(key, fallback = null) {
  if (typeof window === 'undefined') return fallback;
  try {
    return sessionStorage.getItem(key) ?? fallback;
  } catch {
    return fallback;
  }
}

function genId() {
  return Math.random().toString(36).slice(2);
}

function getItemSku(item) {
  return (
    item?.sku ||
    item?.product_sku ||
    item?.product?.sku ||
    item?.product?.data?.attributes?.sku ||
    item?.product?.attributes?.sku ||
    item?.attributes?.sku ||
    item?.attributes?.product_sku ||
    null
  );
}

function toNumber(value, fallback = 0) {
  const num = parseFloat(String(value ?? '').replace(/\s/g, ''));
  return Number.isFinite(num) ? num : fallback;
}

function getDeliveryPrice(calcResult) {
  const delivery = calcResult?.delivery || {};

  const candidates = [
    delivery.total_delivery_price_byn,
    delivery.total_delivery_byn,
    delivery.delivery_price_byn,
    delivery.delivery_total_byn,
    delivery.price_byn,
    delivery.base_cost_byn,
    delivery.poland_delivery_byn,
    delivery.pricing?.internal?.total_delivery_byn,
    delivery.pricing?.internal?.total_delivery_price_byn,
    delivery.pricing?.internal?.delivery_total_byn,
    delivery.pricing?.internal?.delivery_price_byn,
    delivery.pricing?.internal?.base_cost_byn,
    delivery.pricing?.internal?.poland_delivery_byn,
  ];

  const found = candidates.find((value) => value !== undefined && value !== null && value !== '');

  return toNumber(found);
}

function getAvailableMethodsFromError(error) {
  const payload = error?.payload || {};

  const candidates = [
    payload.available_methods,
    payload.delivery?.available_methods,
    payload.cart?.delivery?.available_methods,
    payload.data?.available_methods,
    payload.data?.delivery?.available_methods,
  ];

  const found = candidates.find((item) => Array.isArray(item));

  return found || [];
}

function extractCheckoutPayload(payload) {
  if (!payload) return {};
  return payload?.checkout || payload?.data?.checkout || payload?.data || payload;
}

function extractPricing(payload) {
  const checkout = extractCheckoutPayload(payload);
  return checkout?.pricing || payload?.pricing || null;
}

function extractDeliveryOptions(payload) {
  const checkout = extractCheckoutPayload(payload);
  return checkout?.delivery_options || payload?.delivery_options || null;
}

function parseAddressToFields(addr) {
  return {
    city: addr.city || '',
    street: addr.street || '',
    house: addr.house || '',
    building: addr.building || '',
    apartment: addr.apartment || '',
    entrance: addr.entrance || '',
    floor: addr.floor || '',
    has_elevator: addr.has_elevator || false,
    intercom: addr.intercom || '',
    is_private_house: addr.isPrivateHouse || addr.is_private_house || false,
    lat: addr.lat ?? addr.coords?.[0] ?? null,
    lng: addr.lng ?? addr.coords?.[1] ?? null,
  };
}

function normalizeCheckoutItem(item) {
  const product = item?.product || {};

  return {
    sku: item?.product_sku || item?.sku || '',
    quantity: item?.quantity || 1,
    name: item?.name || item?.small_desc_name || product?.small_desc_name || product?.name_ru || '',
    description: item?.description || product?.name_ru || item?.name || '',
    price_byn: item?.price_byn || product?.price_byn || 0,
    image_url:
      item?.image_url ||
      item?.local_images?.[0] ||
      item?.images?.[0] ||
      product?.local_images?.[0] ||
      product?.images?.[0] ||
      '',
  };
}

function getDraftItemLineTotal(item = {}) {
  const candidates = [
    item.line_total_new_byn,
    item.line_total_byn,
    item.price_total_byn,
    item.total_byn,
  ];

  for (const value of candidates) {
    if (value !== null && value !== undefined && value !== '') {
      return toNumber(value);
    }
  }

  const quantity = Number(item.quantity || 1);
  const safeQuantity = Number.isFinite(quantity) && quantity > 0 ? quantity : 1;

  return toNumber(item.price_byn) * safeQuantity;
}

function EuropostIcon({ size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="12" fill="white" />
      <circle cx="12" cy="12" r="10.8" fill="#FF0000" />
      <path d="M16.3933 8.81333L17.1733 8.36667L12.1333 5.45333L7.09333 8.36667L8.56 9.19333L12.1333 7.09333L15.7067 9.2L16.3933 8.81333Z" fill="white" />
      <path d="M12.7333 11.96V16.2533L14.1867 15.4133V12.52L16.3933 11.26V14.14L17.8533 13.3V9.04667H17.84L12.7333 11.96Z" fill="white" />
      <path d="M12.7333 17.2267V18.6733H12.74L17.8533 15.7467V14.2867L12.7333 17.2267Z" fill="white" />
      <path d="M11.54 18.6333V17.24L7.87333 15.16V13.8533L11.54 15.96V14.6333L7.87333 12.5333V11.1933L11.54 13.2867V11.96L7.87333 9.87333L6.42667 9.04667H6.41333V15.68L11.54 18.6333Z" fill="white" />
    </svg>
  );
}

function IkeyaLogo() {
  return (
    <span style={{ fontFamily: 'Arial', fontWeight: 900, fontSize: 18, color: '#0058A3' }}>
      IKE<span style={{ color: '#FFDB00' }}>YA</span>
    </span>
  );
}

function CheckoutPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [draftId, setDraftId] = useState(() => {
    const queryDraftId = searchParams.get('draft_id');
    return queryDraftId || readSessionValue('checkoutDraftId', '');
  });

  useEffect(() => {
    const queryDraftId = searchParams.get('draft_id');

    if (queryDraftId) {
      sessionStorage.setItem('checkoutDraftId', String(queryDraftId));
      setDraftId(String(queryDraftId));
      return;
    }

    const storedDraftId = readSessionValue('checkoutDraftId', '');
    setDraftId(storedDraftId || '');
  }, [searchParams]);

  const { token } = useAuth();
  const { cart, totals, items, refreshCart } = useCart();

  const [profile, setProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [draftLoading, setDraftLoading] = useState(true);
  const [draftItems, setDraftItems] = useState([]);

  const [receiveMethod, setReceiveMethod] = useState(() => readLS(LS_RECEIVE_METHOD));

  const saveReceiveMethod = (method) => {
    setReceiveMethod(method);
    writeLS(LS_RECEIVE_METHOD, method);
  };

  const [pickupEligible, setPickupEligible] = useState(true);
  const [showVghModal, setShowVghModal] = useState(false);

  const [selectedPvz, setSelectedPvz] = useState(() => readLS(LS_SELECTED_PVZ));
  const [pvzCalcResult, setPvzCalcResult] = useState(() => readLS(LS_PVZ_CALC));

  const [selectedAddr, setSelectedAddr] = useState(() => readLS(LS_SELECTED_ADDR));
  const [addrCalcResult, setAddrCalcResult] = useState(() => readLS(LS_ADDR_CALC));

  const [savedPvzList, setSavedPvzList] = useState([]);
  const [savedAddrList, setSavedAddrList] = useState([]);

  const [showDeliveryModal, setShowDeliveryModal] = useState(false);
  const [deliveryModalTab, setDeliveryModalTab] = useState('pickup');
  const [showSavedPvz, setShowSavedPvz] = useState(false);
  const [showSavedAddr, setShowSavedAddr] = useState(false);

  const [paymentMethod, setPaymentMethod] = useState('card');
  const [selectedServices, setSelectedServices] = useState([]);

  const [showPassportData, setShowPassportData] = useState(false);
  const [showPersonalModal, setShowPersonalModal] = useState(false);
  const [showPassportModal, setShowPassportModal] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const [a1Modal, setA1Modal] = useState(false);
  const [a1VerificationId, setA1VerificationId] = useState(null);
  const [a1CallerNumber, setA1CallerNumber] = useState(null);
  const [a1Loading, setA1Loading] = useState(false);
  const [a1Error, setA1Error] = useState(null);

  const [checkoutSummary, setCheckoutSummary] = useState(() => readSessionJSON('checkoutSummary'));
  const [checkoutPricing, setCheckoutPricing] = useState(null);
  const [checkoutDeliveryOptions, setCheckoutDeliveryOptions] = useState(null);

  const cartToken = typeof window !== 'undefined' ? (localStorage.getItem('cart_token') || cart?.token || '') : '';

  const availableMethods = useMemo(() => {
    const methodsFromDraft = checkoutDeliveryOptions?.methods;
    if (Array.isArray(methodsFromDraft) && methodsFromDraft.length) return methodsFromDraft;

    const fromSummary = checkoutSummary?.availableMethods;
    const fromCart = cart?.delivery?.available_methods;

    if (Array.isArray(fromSummary) && fromSummary.length) return fromSummary;
    if (Array.isArray(fromCart) && fromCart.length) return fromCart;

    return [];
  }, [checkoutSummary?.availableMethods, cart?.delivery?.available_methods, checkoutDeliveryOptions]);

  const getMethodOption = useCallback((code) => {
    return availableMethods.find((item) => item?.code === code) || null;
  }, [availableMethods]);

  const methodIsAvailable = useCallback((code) => {
    if (!availableMethods.length) return true;

    const method = availableMethods.find((item) => item?.code === code);

    return method ? method.available !== false : true;
  }, [availableMethods]);

  const europostEligible = (
    cart?.delivery?.europost_eligible ??
    checkoutSummary?.europostEligible ??
    true
  ) !== false;

  const europostPickupAvailable =
    europostEligible &&
    methodIsAvailable('europost_pickup');

  const courierAvailable = methodIsAvailable('courier');
  const ikeyaDeliveryAvailable = methodIsAvailable('ikeya_delivery');

  const selectedSkus = useMemo(() => {
    const parsed = readSessionJSON('selectedSkus', []);

    return Array.isArray(parsed)
      ? parsed.map((sku) => String(sku))
      : [];
  }, []);

  const storedCheckoutItems = useMemo(() => {
    const parsed = readSessionJSON('checkoutItemsPayload', []);
    return Array.isArray(parsed) ? parsed : [];
  }, []);

  const checkoutItemsSource = useMemo(() => {
    const filterUsableItems = (source) => {
      return (source || [])
        .map((item) => ({
          ...item,
          sku: getItemSku(item),
          quantity: item?.quantity || 1,
        }))
        .filter((item) => item.sku);
    };

    const draftSource = filterUsableItems(draftItems);
    const sessionSource = filterUsableItems(storedCheckoutItems);
    const cartSource = filterUsableItems(items);

    if (draftSource.length) {
      return draftSource;
    }

    if (sessionSource.length) {
      return sessionSource;
    }

    if (!selectedSkus?.length) {
      return cartSource;
    }

    const selectedSet = new Set(selectedSkus.map((sku) => String(sku)));
    return cartSource.filter((item) => selectedSet.has(String(item.sku)));
  }, [draftItems, items, selectedSkus, storedCheckoutItems]);

  const cartItems = useMemo(() => {
    return checkoutItemsSource
      .map((item) => ({
        sku: getItemSku(item),
        quantity: item?.quantity || 1,
      }))
      .filter((item) => item.sku);
  }, [checkoutItemsSource]);

  useEffect(() => {
    const storedSummary = readSessionJSON('checkoutSummary');
    if (storedSummary) {
      setCheckoutSummary(storedSummary);
    }
  }, []);

  useEffect(() => {
    if (!token) {
      setLoadingProfile(false);
      return;
    }

    getProfile(token)
      .then((data) => setProfile(data))
      .catch(() => setProfile(null))
      .finally(() => setLoadingProfile(false));
  }, [token]);

  useEffect(() => {
    if (!draftId) {
      setDraftLoading(false);
      return;
    }

    getDraft(draftId)
      .then((data) => {
        const attr = data?.data?.attributes || {};
        const included = data?.included || [];
        const itemIds = data?.data?.relationships?.order_items?.data?.map((d) => d.id) || [];
        const loadedDraftItems = itemIds
          .map((id) => included.find((i) => i.id === id)?.attributes)
          .filter(Boolean);

        const pricing = extractPricing(data);
        if (pricing) {
          setCheckoutPricing(pricing);
        }

        const deliveryOptions = extractDeliveryOptions(data);
        if (deliveryOptions) {
          setCheckoutDeliveryOptions(deliveryOptions);
        }

        if (attr.payment_method) setPaymentMethod(attr.payment_method);
        if (attr.address?.services?.length) setSelectedServices(attr.address.services);

        const subtotal = loadedDraftItems.reduce(
          (acc, item) => acc + getDraftItemLineTotal(item),
          0
        );
        const itemCount = loadedDraftItems.reduce((acc, item) => acc + (item.quantity || 1), 0);
        const totalWeight = parseFloat(attr.address?.weight_kg || 0);

        const previousSummary = readSessionJSON('checkoutSummary');

        const summary = {
          subtotal: toNumber(subtotal.toFixed(2)),
          promoDiscount: previousSummary?.promoDiscount ?? 0,
          itemCount,
          totalWeight: totalWeight > 0 ? totalWeight : previousSummary?.totalWeight ?? 0,
          customsDuty: previousSummary?.customsDuty ?? 0,
          delivery: previousSummary?.delivery ?? 0,
          logisticsDelivery: previousSummary?.logisticsDelivery ?? 0,
          finalTotal: previousSummary?.finalTotal ?? null,
          europostEligible: previousSummary?.europostEligible ?? null,
          availableMethods: deliveryOptions?.methods ?? previousSummary?.availableMethods ?? [],
        };

        sessionStorage.setItem('checkoutSummary', JSON.stringify(summary));

        setDraftItems(loadedDraftItems);
        setCheckoutSummary(summary);
      })
      .catch(() => {
        sessionStorage.removeItem('checkoutDraftId');
        setDraftItems([]);
        setError('Не удалось загрузить черновик заказа. Вернитесь в корзину и начните оформление заново.');
      })
      .finally(() => setDraftLoading(false));
  }, [draftId]);

  useEffect(() => {
    if (!token) {
      setSavedPvzList(readLS(LS_SAVED_PVZ, []));
      setSavedAddrList(readLS(LS_SAVED_ADDR, []));
      return;
    }

    getSavedPickupPoints()
      .then((res) => {
        const points = (res.data || []).map((d) => ({
          id: String(d.attributes.id),
          apiId: d.attributes.id,
          pickup_point_id: d.attributes.pickup_point_id,
          provider: d.attributes.provider,
          external_id: d.attributes.external_id,
          city: d.attributes.city,
          address: d.attributes.address,
          working_hours: d.attributes.working_hours,
          lat: d.attributes.lat,
          lng: d.attributes.lng,
          label: d.attributes.city
            ? `${d.attributes.city}, ${d.attributes.address}`
            : d.attributes.address,
        }));
        setSavedPvzList(points);
      })
      .catch(() => setSavedPvzList(readLS(LS_SAVED_PVZ, [])));

    getDeliveryAddresses()
      .then((res) => {
        const addrs = (res.data || []).map((d) => ({
          id: String(d.attributes.id),
          apiId: d.attributes.id,
          city: d.attributes.city,
          street: d.attributes.street,
          house: d.attributes.house,
          building: d.attributes.building,
          apartment: d.attributes.apartment,
          entrance: d.attributes.entrance,
          floor: d.attributes.floor,
          has_elevator: d.attributes.has_elevator,
          intercom: d.attributes.intercom,
          is_private_house: d.attributes.is_private_house,
          lat: d.attributes.lat,
          lng: d.attributes.lng,
          label: d.attributes.formatted_address || d.attributes.city,
          address: d.attributes.formatted_address || d.attributes.street,
        }));
        setSavedAddrList(addrs);
      })
      .catch(() => setSavedAddrList(readLS(LS_SAVED_ADDR, [])));
  }, [token]);

  useEffect(() => {
    setPickupEligible(europostPickupAvailable);

    if (!europostPickupAvailable) {
      setSelectedPvz(null);
      setPvzCalcResult(null);
      removeLS(LS_SELECTED_PVZ);
      removeLS(LS_PVZ_CALC);

      if (receiveMethod !== 'delivery') {
        saveReceiveMethod('delivery');
      }
    }

    if (!receiveMethod) {
      saveReceiveMethod(europostPickupAvailable ? 'pickup' : 'delivery');
    }
  }, [europostPickupAvailable, receiveMethod]);

  const pricingTotals = checkoutPricing?.totals || {};
  const pricingDelivery = checkoutPricing?.delivery || {};

  const subtotal = toNumber(
    pricingTotals?.subtotal_new_byn ??
    pricingTotals?.subtotal_byn ??
    pricingTotals?.subtotal ??
    totals?.subtotal_new_byn ??
    totals?.subtotal_byn ??
    totals?.subtotal ??
    checkoutSummary?.subtotal
  );
  const promoDiscount = checkoutSummary?.promoDiscount ?? toNumber(totals?.discount_total_byn || totals?.discount);

  const deliveryCost = toNumber(
    pricingTotals?.delivery_to_belarus_price_byn ??
    pricingDelivery?.delivery_to_belarus_price_byn ??
    checkoutSummary?.delivery ??
    cart?.delivery?.delivery_to_belarus_byn ??
    cart?.totals?.delivery_to_belarus_byn
  );

  const totalWeight = checkoutSummary?.totalWeight ?? toNumber(totals?.total_weight_kg);
  const customsDuty = checkoutSummary?.customsDuty ?? 0;
  const itemCount = checkoutSummary?.itemCount ?? cartItems.reduce((acc, item) => acc + (item.quantity || 1), 0);
  const finalTotal = toNumber(
    pricingTotals?.final_total_byn ??
    pricingTotals?.total_byn ??
    checkoutSummary?.finalTotal
  );

  const pvzDeliveryCost = getDeliveryPrice(pvzCalcResult);

  const addrDeliveryCost = getDeliveryPrice(addrCalcResult);
  const addrDeliveryType =
    addrCalcResult?.delivery?.normalized_delivery_type ||
    addrCalcResult?.delivery?.delivery_type ||
    addrCalcResult?.delivery?.type ||
    (courierAvailable ? 'courier' : ikeyaDeliveryAvailable ? 'ikeya_delivery' : null);
  const isIkeyaDelivery = addrDeliveryType === 'ikeya_delivery';
  const selectedPickupPointId =
    selectedPvz?.pickup_point_id ||
    selectedPvz?.external_id ||
    selectedPvz?.id ||
    null;
  const hasSelectedDeliveryAddressPayload = Boolean(
    selectedAddr?.apiId ||
    (
      selectedAddr?.city &&
      selectedAddr?.street &&
      selectedAddr?.house
    )
  );

  const fullName = profile ? [profile.last_name, profile.first_name, profile.middle_name].filter(Boolean).join(' ') : '';
  const hasPassport = Boolean(profile?.passport_data?.number && profile?.passport_data?.series);
  const passportAddress = profile?.passport_data;
  const hasAddress = Boolean(passportAddress?.city || passportAddress?.street);

  const isPickup = receiveMethod === 'pickup';
  const pickupOption = getMethodOption('europost_pickup');
  const courierOption = getMethodOption('courier');

  const formatMethodEstimate = (method) => {
    if (!method) return '';
    const total = toNumber(method.total_delivery_price_byn);
    const local = toNumber(method.delivery_price_byn);
    const crossBorder = toNumber(method.delivery_to_belarus_price_byn);
    if (total > 0) return `${total.toFixed(2)} р.`;
    if (local > 0 || crossBorder > 0) return `${(local + crossBorder).toFixed(2)} р.`;
    return '';
  };

  const hasValidDeliveryAddress = isPickup ? !!selectedPvz : true;

  const canCheckout = !!(
    fullName &&
    profile?.phone &&
    hasValidDeliveryAddress &&
    itemCount > 0 &&
    !submitting
  );

  const saveDeliveryToDraft = useCallback(async ({
    deliveryType,
    pickupPointId,
    deliveryAddressId,
    address,
  } = {}) => {
    if (!draftId) return;

    if (!['europost_pickup', 'courier', 'ikeya_delivery'].includes(deliveryType)) {
      throw new Error('Некорректный способ доставки');
    }

    if (!methodIsAvailable(deliveryType)) {
      throw new Error('Выбранный способ доставки недоступен');
    }

    if (deliveryType === 'europost_pickup' && !pickupPointId) {
      throw new Error('Не выбран пункт самовывоза Европочты');
    }

    if ((deliveryType === 'courier' || deliveryType === 'ikeya_delivery') && !deliveryAddressId && !address) {
      throw new Error('Не указан адрес доставки');
    }

    const payload = {
      delivery_type: deliveryType,
      payment_method: paymentMethod,
    };

    if (pickupPointId) {
      payload.pickup_point_id = pickupPointId;
    }

    if (deliveryAddressId) {
      payload.delivery_address_id = deliveryAddressId;
    }

    if (address) {
      payload.address = address;
    }

    const response = await updateCheckoutDraft(draftId, payload);
    const pricing = extractPricing(response);
    const deliveryOptions = extractDeliveryOptions(response);
    if (pricing) {
      setCheckoutPricing(pricing);
    }
    if (deliveryOptions) {
      setCheckoutDeliveryOptions(deliveryOptions);
    }
    return response;
  }, [draftId, paymentMethod, methodIsAvailable]);

  const handleSelectPvz = useCallback(async (pvz, calcResult) => {
    if (!europostPickupAvailable) {
      setError('Самовывоз Европочтой недоступен для текущего заказа.');
      return;
    }

    setSelectedPvz(pvz);
    setPvzCalcResult(calcResult);
    writeLS(LS_SELECTED_PVZ, pvz);
    writeLS(LS_PVZ_CALC, calcResult);
    saveReceiveMethod('pickup');

    try {
      await saveDeliveryToDraft({
        deliveryType: 'europost_pickup',
        pickupPointId: pvz.pickup_point_id || pvz.external_id || pvz.id,
      });
    } catch {
      setError('ПВЗ выбран, но не удалось сохранить способ доставки в заказе.');
    }

    if (token) {
      try {
        await savePickupPoint({
          pickup_point_id: pvz.id,
          provider: pvz.provider || 'europost',
          external_id: pvz.external_id || String(pvz.id),
          city: pvz.city || '',
          address: pvz.address || '',
          working_hours: pvz.working_hours || '',
          lat: pvz.lat || null,
          lng: pvz.lng || pvz.lon || null,
        });

        const res = await getSavedPickupPoints();
        const points = (res.data || []).map((d) => ({
          id: String(d.attributes.id),
          apiId: d.attributes.id,
          pickup_point_id: d.attributes.pickup_point_id,
          provider: d.attributes.provider,
          external_id: d.attributes.external_id,
          city: d.attributes.city,
          address: d.attributes.address,
          working_hours: d.attributes.working_hours,
          lat: d.attributes.lat,
          lng: d.attributes.lng,
          label: d.attributes.city
            ? `${d.attributes.city}, ${d.attributes.address}`
            : d.attributes.address,
        }));
        setSavedPvzList(points);
      } catch { }
    } else {
      const label = pvz.city ? `${pvz.city}, ${pvz.address}` : pvz.address;
      const entry = { id: genId(), label, ...pvz };
      const updated = [entry, ...savedPvzList.filter((addr) => addr.address !== pvz.address)].slice(0, 5);
      setSavedPvzList(updated);
      writeLS(LS_SAVED_PVZ, updated);
    }
  }, [token, savedPvzList, saveDeliveryToDraft, europostPickupAvailable]);

  const handleSelectAddr = useCallback(async (addr, calcResult) => {
    setSelectedAddr(addr);
    setAddrCalcResult(calcResult);
    writeLS(LS_SELECTED_ADDR, addr);
    writeLS(LS_ADDR_CALC, calcResult);
    saveReceiveMethod('delivery');

    const resolvedDeliveryType =
      calcResult?.delivery?.normalized_delivery_type ||
      calcResult?.delivery?.delivery_type ||
      calcResult?.delivery?.type ||
      'courier';

    if (!methodIsAvailable(resolvedDeliveryType)) {
      setError('Выбранный способ доставки недоступен для текущего заказа.');
      return;
    }

    try {
      const response = await saveDeliveryToDraft({
        deliveryType: resolvedDeliveryType,
        ...(addr?.apiId
          ? { deliveryAddressId: addr.apiId }
          : { address: parseAddressToFields(addr) }),
      });

      const pricing = extractPricing(response);
      if (pricing) setCheckoutPricing(pricing);
    } catch {
      setError('Адрес выбран, но не удалось сохранить способ доставки в заказе.');
    }

    if (token) {
      const street = String(addr?.street || '').trim();
      const house = String(addr?.house || '').trim();

      if (!street || !house) {
        setError('Не удалось сохранить адрес доставки: укажите улицу и номер дома.');
        return;
      }

      try {
        await createDeliveryAddress(parseAddressToFields(addr));

        const res = await getDeliveryAddresses();
        const addrs = (res.data || []).map((d) => ({
          id: String(d.attributes.id),
          apiId: d.attributes.id,
          city: d.attributes.city,
          street: d.attributes.street,
          house: d.attributes.house,
          building: d.attributes.building,
          apartment: d.attributes.apartment,
          entrance: d.attributes.entrance,
          floor: d.attributes.floor,
          has_elevator: d.attributes.has_elevator,
          intercom: d.attributes.intercom,
          is_private_house: d.attributes.is_private_house,
          lat: d.attributes.lat,
          lng: d.attributes.lng,
          label: d.attributes.formatted_address || d.attributes.city,
          address: d.attributes.formatted_address || d.attributes.street,
        }));
        setSavedAddrList(addrs);
      } catch (err) {
        const payload = err?.payload || {};
        const commonError =
          payload?.error ||
          payload?.message ||
          'Не удалось сохранить адрес доставки';

        const fieldErrors = Array.isArray(payload?.field_errors) ? payload.field_errors : [];
        const fallbackErrors = Array.isArray(payload?.errors) ? payload.errors : [];

        if (fieldErrors.length) {
          const text = fieldErrors
            .map((item) => item?.message)
            .filter(Boolean)
            .join(' ');
          setError(text ? `${commonError}: ${text}` : commonError);
        } else if (fallbackErrors.length) {
          setError(`${commonError}: ${fallbackErrors.join(' ')}`);
        } else {
          setError(commonError);
        }
      }
    } else {
      const label = addr.apartment ? `${addr.address}, кв.${addr.apartment}` : addr.address;
      const entry = { id: genId(), label, ...addr };
      const updated = [entry, ...savedAddrList.filter((savedAddr) => savedAddr.address !== addr.address)].slice(0, 5);
      setSavedAddrList(updated);
      writeLS(LS_SAVED_ADDR, updated);
    }
  }, [token, savedAddrList, saveDeliveryToDraft, methodIsAvailable]);

  const handleChangePvz = () => {
    if (!pickupEligible || !europostPickupAvailable) {
      setShowVghModal(true);
      return;
    }

    if (savedPvzList.length > 0) setShowSavedPvz(true);
    else {
      setDeliveryModalTab('pickup');
      setShowDeliveryModal(true);
    }
  };

  const handleChangeAddr = () => {
    if (savedAddrList.length > 0) setShowSavedAddr(true);
    else {
      setDeliveryModalTab('delivery');
      setShowDeliveryModal(true);
    }
  };

  const handleSelectSavedPvz = async (id) => {
    if (!pickupEligible || !europostPickupAvailable) {
      setShowVghModal(true);
      return;
    }

    const found = savedPvzList.find((addr) => addr.id === id);
    if (!found) return;

    setSelectedPvz(found);
    writeLS(LS_SELECTED_PVZ, found);
    saveReceiveMethod('pickup');

    if (!cartItems.length) return;

    const deliveryContext = draftId
      ? { order_id: draftId }
      : cartToken
        ? { cart_token: cartToken }
        : null;

    if (!deliveryContext) return;

    try {
      const result = await calculateDelivery({
        ...deliveryContext,
        delivery_type: 'europost_pickup',
        pickup_point_id: found.pickup_point_id || found.id,
        items: cartItems,
      });

      setPvzCalcResult(result);
      writeLS(LS_PVZ_CALC, result);

      try {
        const response = await saveDeliveryToDraft({
          deliveryType: 'europost_pickup',
          pickupPointId: found.pickup_point_id || found.external_id || found.id,
        });
        const pricing = extractPricing(response);
        if (pricing) setCheckoutPricing(pricing);
      } catch {
        setError('ПВЗ выбран, но не удалось сохранить способ доставки в заказе.');
      }
    } catch { }
  };

  const handleSelectSavedAddr = async (id) => {
    const found = savedAddrList.find((addr) => addr.id === id);
    if (!found) return;

    setSelectedAddr(found);
    writeLS(LS_SELECTED_ADDR, found);
    saveReceiveMethod('delivery');

    if (!cartItems.length) return;

    const deliveryContext = draftId
      ? { order_id: draftId }
      : cartToken
        ? { cart_token: cartToken }
        : null;

    if (!deliveryContext) return;

    const payload = {
      ...deliveryContext,
      delivery_type: 'courier',
      items: cartItems,
      address: parseAddressToFields(found),
    };

    try {
      const result = await calculateDelivery(payload);
      setAddrCalcResult(result);
      writeLS(LS_ADDR_CALC, result);

      const resolvedDeliveryType =
        result?.delivery?.normalized_delivery_type ||
        result?.delivery?.delivery_type ||
        result?.delivery?.type ||
        'courier';

      if (!methodIsAvailable(resolvedDeliveryType)) {
        setError('Выбранный способ доставки недоступен для текущего заказа.');
        return;
      }

      try {
        const response = await saveDeliveryToDraft({
          deliveryType: resolvedDeliveryType,
          ...(found?.apiId
            ? { deliveryAddressId: found.apiId }
            : { address: parseAddressToFields(found) }),
        });
        const pricing = extractPricing(response);
        if (pricing) setCheckoutPricing(pricing);
      } catch {
        setError('Адрес выбран, но не удалось сохранить способ доставки в заказе.');
      }
    } catch (err) {
      if (err.status !== 422) return;

      const available = getAvailableMethodsFromError(err);
      const hasIkeyaDelivery = available.some(
        (method) => method?.code === 'ikeya_delivery' && method?.available
      );

      if (!hasIkeyaDelivery) return;

      try {
        const fallback = await calculateDelivery({
          ...payload,
          delivery_type: 'ikeya_delivery',
        });

        setAddrCalcResult(fallback);
        writeLS(LS_ADDR_CALC, fallback);

        try {
          const response = await saveDeliveryToDraft({
            deliveryType: 'ikeya_delivery',
            ...(found?.apiId
              ? { deliveryAddressId: found.apiId }
              : { address: parseAddressToFields(found) }),
          });
          const pricing = extractPricing(response);
          if (pricing) setCheckoutPricing(pricing);
        } catch {
          setError('Адрес выбран, но не удалось сохранить способ доставки в заказе.');
        }
      } catch { }
    }
  };

  const handleDeletePvz = async (id) => {
    if (token) {
      const item = savedPvzList.find((addr) => addr.id === id);
      if (item?.apiId) {
        try {
          await deleteSavedPickupPoint(item.apiId);
        } catch { }
      }
    }

    const updated = savedPvzList.filter((addr) => addr.id !== id);
    setSavedPvzList(updated);

    if (!token) writeLS(LS_SAVED_PVZ, updated);
  };

  const handleDeleteAddr = async (id) => {
    if (token) {
      const item = savedAddrList.find((addr) => addr.id === id);
      if (item?.apiId) {
        try {
          await deleteDeliveryAddress(item.apiId);
        } catch { }
      }
    }

    const updated = savedAddrList.filter((addr) => addr.id !== id);
    setSavedAddrList(updated);

    if (!token) writeLS(LS_SAVED_ADDR, updated);
  };

  const handlePickupCardClick = () => {
    if (!pickupEligible || !europostPickupAvailable) {
      setShowVghModal(true);
      return;
    }

    if (selectedPvz) {
      saveReceiveMethod('pickup');
      return;
    }

    setDeliveryModalTab('pickup');
    setShowDeliveryModal(true);
  };

  const handleDeliveryCardClick = async () => {
    saveReceiveMethod('delivery');

    if (!courierAvailable && !ikeyaDeliveryAvailable) {
      setError('Доставка по адресу недоступна для текущего заказа.');
      return;
    }

    try {
      await saveDeliveryToDraft({
        deliveryType: courierAvailable ? 'courier' : 'ikeya_delivery',
      });
    } catch {}

    if (selectedAddr) return;

    setDeliveryModalTab('delivery');
    setShowDeliveryModal(true);
  };

  function handleServiceToggle(value) {
    setSelectedServices((prev) =>
      prev.includes(value) ? prev.filter((service) => service !== value) : [...prev, value]
    );
  }

  async function handleCheckout() {
    if (!canCheckout) {
      if (receiveMethod === 'delivery' && selectedAddr && !selectedAddr.house) {
        setError('Укажите номер дома для доставки.');
      }
      return;
    }

    if (receiveMethod === 'pickup') {
      if (!europostPickupAvailable) {
        setError('Самовывоз Европочтой недоступен для текущего заказа.');
        return;
      }

      if (!selectedPickupPointId) {
        setError('Выберите пункт самовывоза Европочты.');
        return;
      }
    }

    if (receiveMethod === 'delivery') {
      if (!methodIsAvailable(addrDeliveryType)) {
        setError('Выбранный способ доставки недоступен для текущего заказа.');
        return;
      }

      if (!hasSelectedDeliveryAddressPayload) {
        setError('Укажите адрес доставки.');
        return;
      }
    }

    setError(null);
    setA1Loading(true);
    setA1Error(null);

    try {
      const res = await requestA1Verification(profile.phone, 'checkout');
      setA1VerificationId(res.verification_id);
      setA1CallerNumber(res.caller_number_masked || null);
      setA1Modal(true);
    } catch (err) {
      setError('Не удалось запросить верификацию: ' + (err.message || ''));
    } finally {
      setA1Loading(false);
    }
  }

  async function handleA1Verify(code) {
    setA1Loading(true);
    setA1Error(null);

    try {
      const verifyResponse = await verifyA1Code(a1VerificationId, code);

      if (verifyResponse?.success !== true) {
        throw new Error('Проверка не пройдена');
      }

      if (!draftId) {
        throw new Error('Не найден черновик заказа');
      }

      if (!cartItems.length) {
        throw new Error('Нет товаров для оформления');
      }

      setA1Modal(false);
      setSubmitting(true);

      const deliveryType = receiveMethod === 'pickup'
        ? 'europost_pickup'
        : addrDeliveryType;

      if (!['europost_pickup', 'courier', 'ikeya_delivery'].includes(deliveryType)) {
        throw new Error('Некорректный способ доставки');
      }

      if (!methodIsAvailable(deliveryType)) {
        throw new Error('Выбранный способ доставки недоступен');
      }

      const finalizePayload = {
        full_name: fullName,
        phone: profile.phone,
        delivery_type: deliveryType,
        payment_method: paymentMethod,
        a1_verification_id: a1VerificationId,
        services: selectedServices,
        items: cartItems,
      };

      if (receiveMethod === 'pickup') {
        if (!selectedPickupPointId) {
          throw new Error('Не выбран пункт самовывоза Европочты');
        }

        finalizePayload.pickup_point_id = selectedPickupPointId;
      }

      if (receiveMethod === 'delivery') {
        if (selectedAddr?.apiId) {
          finalizePayload.delivery_address_id = selectedAddr.apiId;
        } else if (selectedAddr) {
          finalizePayload.address = parseAddressToFields(selectedAddr);
        } else {
          throw new Error('Не указан адрес доставки');
        }
      }

      const finalizeResponse = await finalizeDraft(draftId, finalizePayload);

      const order =
        finalizeResponse?.order ||
        finalizeResponse?.data?.order ||
        finalizeResponse?.data?.attributes ||
        finalizeResponse;

      const orderId =
        order?.public_uid ||
        order?.order_id ||
        order?.id ||
        finalizeResponse?.public_uid ||
        finalizeResponse?.order_id ||
        draftId;

      const paymentUrl = resolvePaymentUrl(
        order?.payment_url ||
        finalizeResponse?.payment_url ||
        finalizeResponse?.data?.payment_url
      );

      if (receiveMethod === 'pickup' && selectedPvz) {
        sessionStorage.setItem('selectedPvz', JSON.stringify(selectedPvz));
      }

      if (receiveMethod === 'delivery' && selectedAddr) {
        sessionStorage.setItem('selectedDeliveryAddr', JSON.stringify({
          ...selectedAddr,
          calcResult: addrCalcResult,
        }));
      }

      sessionStorage.setItem('selectedServices', JSON.stringify(selectedServices));

      sessionStorage.setItem('checkoutOrder', JSON.stringify({
        ...order,
        id: order?.id || orderId,
        public_uid: order?.public_uid || orderId,
        total_amount: order?.total_amount || finalTotal || subtotal,
        delivery_price: receiveMethod === 'pickup'
          ? pvzDeliveryCost
          : isIkeyaDelivery
            ? null
            : addrDeliveryCost,
        delivery_type: deliveryType,
        payment_method: paymentMethod,
        full_name: fullName,
        phone: profile.phone,
        payment_url: order?.payment_url || finalizeResponse?.payment_url || null,
        payment_expires_at: order?.payment_expires_at || finalizeResponse?.payment_expires_at || null,
        payment_expired: false,
        address: {
          delivery: receiveMethod === 'delivery' ? addrCalcResult?.delivery : pvzCalcResult?.delivery,
          services: selectedServices,
        },
      }));

      sessionStorage.setItem('checkoutItems', JSON.stringify(
        checkoutItemsSource.map((item) => {
          const normalized = normalizeCheckoutItem(item);

          return {
            id: normalized.sku,
            attributes: {
              product_sku: normalized.sku,
              name: normalized.name,
              description: normalized.description,
              quantity: normalized.quantity,
              price_byn: normalized.price_byn,
              image_url: normalized.image_url,
            },
          };
        })
      ));

      await refreshCart();

      sessionStorage.removeItem('selectedSkus');
      sessionStorage.removeItem('checkoutItemsPayload');
      sessionStorage.removeItem('checkoutSummary');
      sessionStorage.removeItem('checkoutDraftId');

      removeLS(LS_SELECTED_PVZ);
      removeLS(LS_SELECTED_ADDR);
      removeLS(LS_PVZ_CALC);
      removeLS(LS_ADDR_CALC);
      removeLS(LS_RECEIVE_METHOD);

      router.push(`/order-success?order_id=${orderId}`);
    } catch (err) {
      setA1Error(err.message || 'Неверный код, попробуйте ещё раз');
    } finally {
      setA1Loading(false);
      setSubmitting(false);
    }
  }

  if (draftLoading) {
    return (
      <main className="korzina">
        <section className="zakaz">
          <div className="container">
            <div style={{ padding: '40px 0', textAlign: 'center', color: '#9e9e9e' }}>Загрузка заказа...</div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="korzina checkout-page">
      <section className="zakaz">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="zakaz-inner">

                <div className="zakaz-title">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                    onClick={() => router.push('/cart')} style={{ cursor: 'pointer' }}>
                    <path d="M8.67004 12C8.67004 10.88 11.71 8.19999 14.25 6.14999C14.54 5.91999 14.96 5.95999 15.19 6.24999C15.42 6.53999 15.38 6.95999 15.09 7.18999C12.86 8.98999 10.35 11.29 10.02 12C10.35 12.71 12.86 15.01 15.09 16.81C15.38 17.04 15.42 17.46 15.19 17.75C14.96 18.04 14.54 18.08 14.25 17.85C11.7 15.8 8.67004 13.11 8.67004 12Z" fill="#181818" />
                  </svg>
                  <h2>Оформление заказа</h2>
                </div>

                <div className="zakaz-content">
                  <div className="cart">
                    <div className="cart-layout">
                      <div className="cart-main">
                        <div className="checkout-container">

                          <section className="checkout-section pickup-section">
                            <h2 className="section-title">Способ получения</h2>

                            {!pickupEligible && (
                              <div className="alert alert-danger" style={{ marginBottom: 16 }}>
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                  <path d="M10 1.66666C5.40002 1.66666 1.66669 5.39999 1.66669 9.99999C1.66669 14.6 5.40002 18.3333 10 18.3333C14.6 18.3333 18.3334 14.6 18.3334 9.99999C18.3334 5.39999 14.6 1.66666 10 1.66666ZM9.37502 6.66666C9.37502 6.32499 9.65835 6.04166 10 6.04166C10.3417 6.04166 10.625 6.32499 10.625 6.66666V10.8333C10.625 11.175 10.3417 11.4583 10 11.4583C9.65835 11.4583 9.37502 11.175 9.37502 10.8333V6.66666ZM10.7667 13.65C10.725 13.7583 10.6584 13.8583 10.575 13.9417C10.4917 14.025 10.3917 14.0917 10.2834 14.1333C10.175 14.175 10.0584 14.2 9.93335 14.2C9.81669 14.2 9.70002 14.175 9.58335 14.1333C9.47502 14.0917 9.37502 14.025 9.29169 13.9417C9.20835 13.8583 9.14169 13.7583 9.10002 13.65C9.05835 13.5417 9.03335 13.425 9.03335 13.3083C9.03335 13.1917 9.05835 13.075 9.10002 12.9667C9.14169 12.8583 9.20835 12.7583 9.29169 12.675C9.37502 12.5917 9.47502 12.525 9.58335 12.4833C9.80002 12.4 10.0667 12.4 10.2834 12.4833C10.3917 12.525 10.4917 12.5917 10.575 12.675C10.6584 12.7583 10.725 12.8583 10.7667 12.9667C10.8084 13.075 10.8334 13.1917 10.8334 13.3083C10.8334 13.425 10.8084 13.5417 10.7667 13.65Z" fill="#B71C1C" />
                                </svg>
                                <div>
                                  <span>Самовывоз недоступен из-за превышения весогабаритных характеристик заказа</span>
                                  <button type="button" className="vgh-details-link" onClick={() => setShowVghModal(true)}>
                                    Подробнее
                                  </button>
                                </div>
                              </div>
                            )}

                            <div className="receive-methods">
                              {pickupEligible && (
                                <label
                                  className={`receive-method${receiveMethod === 'pickup' ? ' receive-method--active' : ''}`}
                                  onClick={handlePickupCardClick}
                                >
                                  <input type="radio" name="receive_method" value="pickup"
                                    checked={receiveMethod === 'pickup'} onChange={() => { }} readOnly />
                                  <div className="receive-method__content">
                                    <div>
                                      <div className="receive-method__title">Самовывоз</div>
                                      <div className="receive-method__subtitle">Пункты выдачи заказов</div>
                                    </div>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                      <path d="M20.5999 7.2C20.1999 6.4 19.3999 5.9 18.0999 5.1L17.6999 5.7L17.2999 6.3C18.4999 7 19.0999 7.4 19.3999 7.9C19.6999 8.4 19.6999 9.1 19.6999 10.5V15.7C19.6999 18.1 19.6999 19.4 19.0999 20C18.7999 20.3 18.1999 20.5 17.3999 20.6V13.9C17.3999 12 17.3999 11 16.6999 10.2C15.9999 9.5 14.8999 9.5 12.9999 9.5H11.0999C9.1999 9.5 8.1999 9.5 7.3999 10.2C6.6999 10.9 6.6999 12 6.6999 13.9V20.6C5.8999 20.5 5.2999 20.4 4.9999 20C4.3999 19.4 4.3999 18.2 4.3999 15.7V10.5C4.3999 9.1 4.3999 8.4 4.6999 7.9C4.8999 7.4 5.4999 7 6.6999 6.3L9.4999 4.6C10.7999 3.8 11.4999 3.4 11.9999 3.4C12.4999 3.4 13.1999 3.8 14.4999 4.6L17.2999 6.3L17.6999 5.7L18.0999 5.1L15.2999 3.4C13.7999 2.5 12.9999 2 11.9999 2C10.9999 2 10.1999 2.5 8.6999 3.4L5.8999 5.1C4.5999 5.9 3.7999 6.4 3.3999 7.2C2.8999 8 2.8999 8.9 2.8999 10.5V15.7C2.8999 18.4 2.8999 19.9 3.8999 21C4.5999 21.7 5.5999 21.9 7.1999 22H7.2999H9.1999H14.7999H16.6999H16.7999C18.2999 21.9 19.2999 21.7 20.0999 21C21.0999 20 21.0999 18.5 21.0999 15.7V10.5C21.0999 8.9 21.0999 8 20.5999 7.2ZM7.9999 14.6H15.9999V16.9H7.9999V14.6ZM11.0999 10.8H12.9999C14.5999 10.8 15.3999 10.8 15.6999 11.1C15.9999 11.4 15.9999 11.9 15.9999 13.1H7.9999C7.9999 12 8.0999 11.4 8.2999 11.1C8.6999 10.9 9.3999 10.8 11.0999 10.8ZM9.1999 20.6C8.7999 20.6 8.3999 20.6 7.9999 20.6V18.3H15.9999V20.6C15.5999 20.6 15.2999 20.6 14.7999 20.6H9.1999Z" fill="#9E9E9E" />
                                    </svg>
                                  </div>
                                </label>
                              )}

                              <label
                                className={`receive-method${receiveMethod === 'delivery' ? ' receive-method--active' : ''}`}
                                onClick={handleDeliveryCardClick}
                              >
                                <input type="radio" name="receive_method" value="delivery"
                                  checked={receiveMethod === 'delivery'} onChange={() => { }} readOnly />
                                <div className="receive-method__content">
                                  <div>
                                    <div className="receive-method__title">Доставка</div>
                                    <div className="receive-method__subtitle">Курьерская доставка</div>
                                  </div>
                                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M19.37 4.6L16.65 3.28C14.88 2.42 13.99 2 12.93 2C11.87 2 10.98 2.43 9.21 3.29L6.49 4.61C4.8 5.43 3.86 5.88 3.86 6.89V9.68C3.86 10.07 4.17 10.38 4.56 10.38C4.95 10.38 5.26 10.07 5.26 9.68V8.55C5.61 8.74 6.02 8.94 6.5 9.17L9.22 10.48C10.6 11.15 11.44 11.55 12.24 11.7V20.49C11.76 20.35 11.16 20.09 10.27 19.71C8.62 18.99 7.32 18.42 6.45 17.91C6.34 17.85 6.22 17.81 6.1 17.81H2.7C2.31 17.81 2 18.12 2 18.51C2 18.9 2.31 19.21 2.7 19.21H5.91C6.84 19.74 8.12 20.3 9.72 20.99C11.26 21.66 12.03 22 12.94 22C13.85 22 14.62 21.66 16.16 20.99C20.05 19.29 22.01 18.44 22.01 16.65V6.88C22.01 5.87 21.08 5.42 19.38 4.6H19.37ZM5.26 6.92C5.38 6.69 6.26 6.27 7.1 5.86L9.82 4.54C12.97 3.02 12.88 3.01 16.04 4.54L16.1 4.57L8.15 8.42L7.09 7.91C6.24 7.5 5.37 7.08 5.25 6.92H5.26ZM9.76 9.19L17.71 5.34L18.77 5.85C19.62 6.26 20.51 6.69 20.62 6.84C20.51 7.05 19.63 7.48 18.77 7.9L16.05 9.21C12.89 10.74 12.98 10.74 9.82 9.21L9.76 9.18V9.19ZM15.6 19.71C14.71 20.1 14.11 20.36 13.63 20.49V11.7C14.44 11.55 15.28 11.15 16.65 10.48L19.37 9.17C19.85 8.94 20.25 8.74 20.61 8.55V16.66C20.61 17.53 18.72 18.36 15.6 19.72V19.71Z" fill="#9E9E9E" />
                                    <path d="M2.7 13.6305H5.49C5.88 13.6305 6.19 13.3205 6.19 12.9305C6.19 12.5405 5.88 12.2305 5.49 12.2305H2.7C2.31 12.2305 2 12.5405 2 12.9305C2 13.3205 2.31 13.6305 2.7 13.6305Z" fill="#9E9E9E" />
                                    <path d="M2.7 16.4195H5.49C5.88 16.4195 6.19 16.1095 6.19 15.7195C6.19 15.3295 5.88 15.0195 5.49 15.0195H2.7C2.31 15.0195 2 15.3295 2 15.7195C2 16.1095 2.31 16.4195 2.7 16.4195Z" fill="#9E9E9E" />
                                  </svg>
                                </div>
                              </label>
                            </div>

                            {receiveMethod === 'pickup' && selectedPvz && (
                              <div className="selected-delivery-block">
                                <div className="selected-delivery-header">
                                  <div className="selected-delivery-left">
                                    <EuropostIcon size={32} />
                                    <div>
                                      <div className="selected-delivery-provider">Европочта</div>
                                      <div className="selected-delivery-address">
                                        {selectedPvz.city ? `${selectedPvz.city}, ${selectedPvz.address}` : selectedPvz.address}
                                      </div>
                                    </div>
                                  </div>
                                  <button type="button" className="change-link" onClick={handleChangePvz}>Изменить</button>
                                </div>

                                <div className="alert alert-info">
                                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                    <path d="M10 1.66666C5.40002 1.66666 1.66669 5.39999 1.66669 9.99999C1.66669 14.6 5.40002 18.3333 10 18.3333C14.6 18.3333 18.3334 14.6 18.3334 9.99999C18.3334 5.39999 14.6 1.66666 10 1.66666ZM10.625 13.5417C10.625 13.8833 10.3417 14.1667 10 14.1667C9.65835 14.1667 9.37502 13.8833 9.37502 13.5417V9.37499C9.37502 9.03332 9.65835 8.74999 10 8.74999C10.3417 8.74999 10.625 9.03332 10.625 9.37499V13.5417ZM10 7.70832C9.65002 7.70832 9.37502 7.43332 9.37502 7.08332C9.37502 6.73332 9.65002 6.45832 10 6.45832C10.35 6.45832 10.625 6.73332 10.625 7.08332C10.625 7.43332 10.35 7.70832 10 7.70832Z" fill="#0058A3" />
                                  </svg>
                                  <span>Для получения заказа необходим паспорт</span>
                                </div>

                                <div className="contact-details">
                                  {selectedPvz.phone && (
                                    <div className="contact-item">
                                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                        <path d="M11.3332 14.6667C11.1065 14.6667 10.8798 14.6467 10.6532 14.6C9.64652 14.4 8.77318 14.06 7.79985 13.5067C5.65985 12.28 3.72652 10.3467 2.49318 8.2C1.93985 7.23333 1.59985 6.35333 1.39985 5.34667C1.12652 4.00667 1.68652 2.58 2.84652 1.63333C3.14652 1.38667 3.49318 1.29333 3.83318 1.35333C4.17318 1.42 4.46652 1.64 4.65318 1.98L5.19318 2.95333C5.65318 3.78 5.90652 4.24 5.85318 4.79333C5.79318 5.34667 5.45318 5.74 4.83318 6.45333L3.46652 8.02C4.55985 9.82 6.17985 11.4333 7.97985 12.5333L9.54652 11.1667C10.2598 10.5467 10.6532 10.2 11.2065 10.1467C11.7598 10.0867 12.2132 10.34 13.0465 10.8067L14.0199 11.3467C14.3599 11.5333 14.5799 11.8267 14.6465 12.1667C14.7132 12.5067 14.6132 12.86 14.3665 13.1533C13.5799 14.12 12.4598 14.6667 11.3332 14.6667Z" fill="#181818" />
                                      </svg>
                                      <span>{selectedPvz.phone}</span>
                                    </div>
                                  )}
                                  {selectedPvz.working_hours && (
                                    <div className="contact-item">
                                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                        <path d="M8.00016 14.6667C4.32683 14.6667 1.3335 11.6733 1.3335 8.00001C1.3335 4.32668 4.32683 1.33334 8.00016 1.33334C11.6735 1.33334 14.6668 4.32668 14.6668 8.00001C14.6668 11.6733 11.6735 14.6667 8.00016 14.6667ZM8.00016 2.26668C4.84016 2.26668 2.26683 4.84001 2.26683 8.00001C2.26683 11.16 4.84016 13.7333 8.00016 13.7333C11.1602 13.7333 13.7335 11.16 13.7335 8.00001C13.7335 4.84001 11.1602 2.26668 8.00016 2.26668Z" fill="#181818" />
                                        <path d="M9.24004 9.70666C9.12004 9.70666 9.00004 9.66 8.91337 9.57333L7.67337 8.33333C7.58671 8.24666 7.54004 8.12666 7.54004 8.00666V5.52666C7.54004 5.26666 7.74671 5.06 8.00671 5.06C8.26671 5.06 8.47337 5.26666 8.47337 5.52666V7.81333L9.58004 8.92C9.76004 9.1 9.76004 9.39333 9.58004 9.58C9.48671 9.67333 9.37337 9.71333 9.25337 9.71333L9.24004 9.70666Z" fill="#181818" />
                                      </svg>
                                      <span>{selectedPvz.working_hours}</span>
                                    </div>
                                  )}
                                </div>

                                <div className="order-timeline">
                                  <div className="timeline-item">
                                    <span className="timeline-label">Дата получения</span>
                                    <span className="timeline-value">
                                      {pvzCalcResult?.delivery?.delivery_date
                                        ? formatDeliveryDate(pvzCalcResult.delivery.delivery_date)
                                        : '—'}
                                    </span>
                                  </div>
                                  <div className="timeline-item">
                                    <span className="timeline-label">Срок хранения до</span>
                                    <span className="timeline-value">
                                      {pvzCalcResult?.delivery?.storage_until
                                        ? formatDeliveryDate(pvzCalcResult.delivery.storage_until)
                                        : '14 дней'}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            )}

                            {receiveMethod === 'delivery' && selectedAddr && (
                              <div className="selected-delivery-block">
                                <div className="selected-delivery-header">
                                  <div className="selected-delivery-left">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                      <path d="M12.0002 22C11.2602 22 10.5502 21.72 10.0202 21.22C9.7202 20.94 9.4102 20.65 9.1002 20.37C5.5802 17.12 1.2102 13.07 3.6202 7.43C5.0102 4.18 8.3802 2 12.0002 2C15.6202 2 18.9902 4.18 20.3802 7.43C22.8002 13.09 18.3902 17.16 14.8502 20.43L13.9902 21.23C13.4502 21.73 12.7502 22.01 12.0102 22.01L12.0002 22ZM12.0002 3.4C8.9302 3.4 6.0802 5.24 4.9102 7.98C2.8902 12.71 6.5302 16.09 10.0502 19.35C10.3602 19.64 10.6702 19.93 10.9702 20.21C11.5202 20.72 12.4702 20.72 13.0202 20.21L13.8902 19.4C17.4502 16.12 21.1202 12.73 19.0902 7.98C17.9202 5.24 15.0702 3.4 12.0002 3.4Z" fill="#9E9E9E" />
                                      <path d="M11.9998 15.0191C9.8198 15.0191 8.0498 13.2491 8.0498 11.0691C8.0498 8.88914 9.8198 7.11914 11.9998 7.11914C14.1798 7.11914 15.9498 8.88914 15.9498 11.0691C15.9498 13.2491 14.1798 15.0191 11.9998 15.0191ZM11.9998 8.50914C10.5898 8.50914 9.4398 9.65914 9.4398 11.0691C9.4398 12.4791 10.5898 13.6291 11.9998 13.6291C13.4098 13.6291 14.5598 12.4791 14.5598 11.0691C14.5598 9.65914 13.4098 8.50914 11.9998 8.50914Z" fill="#9E9E9E" />
                                    </svg>
                                    <div className="selected-delivery-address">
                                      {selectedAddr.label || selectedAddr.address}
                                    </div>
                                  </div>
                                  <button type="button" className="change-link" onClick={handleChangeAddr}>Изменить</button>
                                </div>

                                <div className="alert alert-info">
                                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                    <path d="M10 1.66666C5.40002 1.66666 1.66669 5.39999 1.66669 9.99999C1.66669 14.6 5.40002 18.3333 10 18.3333C14.6 18.3333 18.3334 14.6 18.3334 9.99999C18.3334 5.39999 14.6 1.66666 10 1.66666ZM10.625 13.5417C10.625 13.8833 10.3417 14.1667 10 14.1667C9.65835 14.1667 9.37502 13.8833 9.37502 13.5417V9.37499C9.37502 9.03332 9.65835 8.74999 10 8.74999C10.3417 8.74999 10.625 9.03332 10.625 9.37499V13.5417ZM10 7.70832C9.65002 7.70832 9.37502 7.43332 9.37502 7.08332C9.37502 6.73332 9.65002 6.45832 10 6.45832C10.35 6.45832 10.625 6.73732 10.625 7.08332C10.625 7.43332 10.35 7.70832 10 7.70832Z" fill="#0058A3" />
                                  </svg>
                                  <span>Для получения заказа необходим паспорт</span>
                                </div>

                                {!isIkeyaDelivery && (
                                  <div className="delivery-info-block">
                                    <div className="delivery-info-header">
                                      <span className="delivery-info-name">Доставка Европочта</span>
                                      <EuropostIcon size={24} />
                                    </div>
                                    <div className="delivery-info-row">
                                      <span>Стоимость доставки</span>
                                      <span>
                                        {(() => {
                                          const cost = addrCalcResult?.delivery?.pricing?.internal?.total_delivery_byn ||
                                            addrCalcResult?.delivery?.total_delivery_price_byn ||
                                            addrCalcResult?.delivery?.base_cost_byn;
                                          return cost && parseFloat(cost) > 0
                                            ? `${cost} р.`
                                            : '—';
                                        })()}
                                      </span>
                                    </div>
                                    {addrCalcResult?.delivery?.delivery_date && (
                                      <div className="delivery-info-row">
                                        <span>Дата доставки</span>
                                        <span>{formatDeliveryDate(addrCalcResult.delivery.delivery_date)}</span>
                                      </div>
                                    )}
                                    <p className="delivery-conditions-note">
                                      Окно доставки будет дополнительно согласовано с вами службой доставки Европочты
                                    </p>
                                  </div>
                                )}

                                {isIkeyaDelivery && (
                                  <div className="delivery-info-block">
                                    <div className="delivery-info-header">
                                      <span className="delivery-info-name">Доставка IKEYA</span>
                                      <IkeyaLogo />
                                    </div>
                                    <div className="alert alert-info" style={{ marginTop: 8 }}>
                                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M12 2C6.49 2 2 6.49 2 12C2 17.51 6.49 22 12 22C17.51 22 22 17.51 22 12C22 6.49 17.51 2 12 2ZM12.7 15.72C12.7 16.11 12.39 16.42 12 16.42C11.61 16.42 11.3 16.11 11.3 15.72V11.53C11.3 11.14 11.61 10.83 12 10.83C12.39 10.83 12.7 11.14 12.7 11.53V15.72ZM12 9.12C11.54 9.12 11.16 8.75 11.16 8.29C11.16 7.82 11.53 7.44 12 7.44C12.47 7.44 12.84 7.81 12.84 8.28C12.84 8.75 12.47 9.12 12 9.12Z" fill="#0058A3" />
                                      </svg>
                                      <span>С вами свяжется сотрудник IKEYA для согласования сроков и стоимости доставки заказа. Данная услуга оплачивается отдельно от заказа.</span>
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                          </section>

                          <section className="checkout-section services-section">
                            <h2 className="section-title services-title">Услуги в г. Минск (+20 км от Минска)</h2>
                            <div className="alert alert-info">
                              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 2C6.49 2 2 6.49 2 12C2 17.51 6.49 22 12 22C17.51 22 22 17.51 22 12C22 6.49 17.51 2 12 2ZM12.7 15.72C12.7 16.11 12.39 16.42 12 16.42C11.61 16.42 11.3 16.11 11.3 15.72V11.53C11.3 11.14 11.61 10.83 12 10.83C12.39 10.83 12.7 11.14 12.7 11.53V15.72ZM12 9.12C11.54 9.12 11.16 8.75 11.16 8.29C11.16 7.82 11.53 7.44 12 7.44C12.47 7.44 12.84 7.81 12.84 8.28C12.84 8.75 12.47 9.12 12 9.12Z" fill="#0058A3" />
                              </svg>
                              <span>Услуги оплачиваются отдельно. С Вами свяжется сотрудник колл-центра для уточнения всех деталей.</span>
                            </div>
                            <div className="services-list">
                              {[
                                { value: 'furniture_delivery', title: 'Подъем и занос мебели', desc: 'Стоимость подъема мебели определяется исходя из количества единиц изделия, веса изделия и габаритных размеров.', price: 'от 75.00 р.' },
                                { value: 'furniture_assembly', title: 'Сборка мебели', desc: 'Качественная и надежная сборка мебели специалистами IKEA', price: 'от 50.00 р.' },
                              ].map((service) => (
                                <label key={service.value} className={`service-card${selectedServices.includes(service.value) ? ' selected' : ''}`}>
                                  <input
                                    type="checkbox"
                                    value={service.value}
                                    checked={selectedServices.includes(service.value)}
                                    onChange={() => handleServiceToggle(service.value)}
                                  />
                                  <div className="service-content">
                                    <div className="service-content_wrap">
                                      <div className="service-header">
                                        <div className="checkbox-custom">
                                          {selectedServices.includes(service.value) && (
                                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                              <path d="M3 8L6 11L13 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                          )}
                                        </div>
                                        <h3 className="service-name">{service.title}</h3>
                                      </div>
                                      <p className="service-description">{service.desc}</p>
                                    </div>
                                    <div className="service-price">{service.price}</div>
                                  </div>
                                </label>
                              ))}
                            </div>
                          </section>

                          <section className="checkout-section">
                            <div className="section-header">
                              <h2 className="section-title">Способ оплаты</h2>
                            </div>
                            <div className="payment-methods">
                              <label className="payment-method">
                                <input
                                  type="radio"
                                  name="payment_method"
                                  value="card"
                                  checked={paymentMethod === 'card'}
                                  onChange={(e) => setPaymentMethod(e.target.value)}
                                />
                                <div className="payment-card">
                                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M27.7868 7.33315C27.5468 7.05315 27.2668 6.79982 26.9868 6.57315C25.1735 5.14648 22.7335 5.14648 17.8668 5.14648H14.1468C9.28017 5.14648 6.82684 5.14648 5.02684 6.57315C4.73351 6.79982 4.46684 7.05315 4.22684 7.33315C2.68018 9.06648 2.68018 11.3865 2.68018 15.9998C2.68018 20.6132 2.68018 22.9332 4.22684 24.6665C4.46684 24.9332 4.74684 25.1998 5.02684 25.4265C6.84018 26.8532 9.28017 26.8531 14.1468 26.8531H17.8668C22.7335 26.8531 25.1868 26.8532 27.0002 25.4265C27.2935 25.1998 27.5602 24.9465 27.8002 24.6665C29.3468 22.9332 29.3468 20.6132 29.3468 15.9998C29.3468 11.3865 29.3468 9.06648 27.8002 7.33315H27.7868ZM5.58684 8.57315C5.76018 8.37315 5.94684 8.19982 6.16018 8.03982C7.46684 7.01315 9.69351 7.01315 14.1335 7.01315H17.8535C22.2935 7.01315 24.5202 7.01315 25.8268 8.03982C26.0268 8.19982 26.2268 8.38648 26.4002 8.57315C26.9602 9.19982 27.2268 10.0798 27.3468 11.3465H4.65351C4.78684 10.0665 5.04018 9.19982 5.60018 8.57315H5.58684ZM26.4002 23.4265C26.2268 23.6265 26.0268 23.7998 25.8268 23.9598C24.5202 24.9865 22.2935 24.9865 17.8535 24.9865H14.1335C9.69351 24.9865 7.46684 24.9865 6.16018 23.9598C5.94684 23.7998 5.76018 23.6132 5.58684 23.4265C4.52018 22.2265 4.52018 20.1465 4.52018 15.9998C4.52018 14.9465 4.52018 14.0132 4.53351 13.2132H27.4535C27.4668 14.0265 27.4668 14.9465 27.4668 15.9998C27.4668 20.1465 27.4668 22.2265 26.4002 23.4265Z" fill="#757575" />
                                    <path d="M15.3732 20.0273H13.5066C12.9866 20.0273 12.5732 20.4407 12.5732 20.9607C12.5732 21.4807 12.9866 21.894 13.5066 21.894H15.3732C15.8932 21.894 16.3066 21.4807 16.3066 20.9607C16.3066 20.4407 15.8932 20.0273 15.3732 20.0273Z" fill="#757575" />
                                    <path d="M23.4402 20.0273H19.0935C18.5735 20.0273 18.1602 20.4407 18.1602 20.9607C18.1602 21.4807 18.5735 21.894 19.0935 21.894H23.4402C23.9602 21.894 24.3735 21.4807 24.3735 20.9607C24.3735 20.4407 23.9602 20.0273 23.4402 20.0273Z" fill="#757575" />
                                  </svg>
                                  <span>Картой онлайн</span>
                                </div>
                              </label>

                              <label className="payment-method">
                                <input
                                  type="radio"
                                  name="payment_method"
                                  value="erip"
                                  checked={paymentMethod === 'erip'}
                                  onChange={(e) => setPaymentMethod(e.target.value)}
                                />
                                <div className="payment-card">
                                  <img src="/assets/img/cart/erip.png" alt="ЕРИП" width="89" height="49" />
                                </div>
                              </label>
                            </div>
                          </section>

                          <section className="checkout-section">
                            <div className="section-header">
                              <h2 className="section-title">Получатель</h2>
                              {profile && (
                                <button className="change-link" type="button" onClick={() => setShowPersonalModal(true)}>Изменить</button>
                              )}
                            </div>

                            {loadingProfile ? <p>Загрузка...</p> : (
                              <>
                                {(!profile?.first_name || !profile?.phone) && (
                                  <div className="alert alert-warning">
                                    <span>Для таможенного оформления необходимо дополнить{' '}
                                      <strong style={{ cursor: 'pointer', textDecoration: 'underline' }} onClick={() => setShowPersonalModal(true)}>
                                        личные данные
                                      </strong>.
                                    </span>
                                  </div>
                                )}

                                <div className="recipient-info">
                                  {fullName && <div className="info-row"><span className="info-label">ФИО</span><span className="info-value">{fullName}</span></div>}
                                  {profile?.phone && <div className="info-row"><span className="info-label">Телефон</span><span className="info-value">+{profile.phone}</span></div>}
                                  {profile?.email && <div className="info-row"><span className="info-label">Email</span><span className="info-value">{profile.email}</span></div>}
                                </div>
                              </>
                            )}
                          </section>

                          {profile && (
                            <div className="for-white_bg">
                              <section className="checkout-section">
                                <div className="section-header">
                                  <h2 className="section-title">Паспортные данные</h2>
                                  <button className="change-link" type="button" onClick={() => setShowPassportModal(true)}>Изменить</button>
                                </div>

                                {!hasPassport ? (
                                  <div className="alert alert-warning">
                                    <span>Для таможенного оформления посылок необходимо добавить{' '}
                                      <strong style={{ cursor: 'pointer', textDecoration: 'underline' }} onClick={() => setShowPassportModal(true)}>
                                        паспортные данные
                                      </strong>.
                                    </span>
                                  </div>
                                ) : (
                                  <>
                                    <div className="passport-data">
                                      {(profile.passport_data.last_name || profile.passport_data.first_name) && (
                                        <div className="data-row">
                                          <span className="data-label">ФИО</span>
                                          <span className="data-value">
                                            {showPassportData
                                              ? [profile.passport_data.last_name, profile.passport_data.first_name, profile.passport_data.middle_name].filter(Boolean).join(' ')
                                              : [mask(profile.passport_data.last_name, 5), mask(profile.passport_data.first_name, 3)].filter(Boolean).join(' ')}
                                          </span>
                                        </div>
                                      )}

                                      {profile.passport_data.series && profile.passport_data.number && (
                                        <div className="data-row data-row-split">
                                          <div className="data-column">
                                            <span className="data-label">Серия паспорта</span>
                                            <span className="data-value">{profile.passport_data.series}</span>
                                          </div>
                                          <div className="data-column">
                                            <span className="data-label">Номер паспорта</span>
                                            <span className="data-value">{showPassportData ? profile.passport_data.number : mask(profile.passport_data.number, 3)}</span>
                                          </div>
                                        </div>
                                      )}

                                      {profile.passport_data.issue_date && (
                                        <div className="data-row data-row-split">
                                          <div className="data-column">
                                            <span className="data-label">Дата выдачи</span>
                                            <span className="data-value">{showPassportData ? formatDate(profile.passport_data.issue_date) : maskDate(profile.passport_data.issue_date)}</span>
                                          </div>
                                          {profile.passport_data.issued_by && (
                                            <div className="data-column">
                                              <span className="data-label">Кем выдан</span>
                                              <span className="data-value">{showPassportData ? profile.passport_data.issued_by : mask(profile.passport_data.issued_by, 4)}</span>
                                            </div>
                                          )}
                                        </div>
                                      )}

                                      {profile.passport_data.identification_number && (
                                        <div className="data-row data-row-split">
                                          <div className="data-column">
                                            <span className="data-label">Идентификационный номер</span>
                                            <span className="data-value">{showPassportData ? profile.passport_data.identification_number : mask(profile.passport_data.identification_number, 5)}</span>
                                          </div>
                                          {profile.passport_data.dob && (
                                            <div className="data-column">
                                              <span className="data-label">Дата рождения</span>
                                              <span className="data-value">{showPassportData ? formatDate(profile.passport_data.dob) : maskDate(profile.passport_data.dob)}</span>
                                            </div>
                                          )}
                                        </div>
                                      )}
                                    </div>

                                    <button className="show-data-btn" type="button" onClick={() => setShowPassportData((value) => !value)}>
                                      {showPassportData ? 'Скрыть данные' : 'Показать данные'}
                                    </button>
                                  </>
                                )}
                              </section>

                              {hasAddress && (
                                <section className="checkout-section address-section">
                                  <h2 className="section-title">Адрес прописки</h2>
                                  <div className="address-data">
                                    {(passportAddress.region || passportAddress.city) && (
                                      <div className="data-row data-row-split">
                                        {passportAddress.region && <div className="data-column"><span className="data-label">Область</span><span className="data-value">{passportAddress.region}</span></div>}
                                        {passportAddress.city && <div className="data-column"><span className="data-label">Город</span><span className="data-value">{passportAddress.city}</span></div>}
                                      </div>
                                    )}

                                    {(passportAddress.postcode || passportAddress.street) && (
                                      <div className="data-row data-row-split">
                                        {passportAddress.postcode && <div className="data-column"><span className="data-label">Индекс</span><span className="data-value">{passportAddress.postcode}</span></div>}
                                        {passportAddress.street && <div className="data-column"><span className="data-label">Улица</span><span className="data-value">{passportAddress.street}</span></div>}
                                      </div>
                                    )}

                                    {(passportAddress.house || passportAddress.building) && (
                                      <div className="data-row data-row-split">
                                        {passportAddress.house && <div className="data-column"><span className="data-label">Дом</span><span className="data-value">{passportAddress.house}</span></div>}
                                        {passportAddress.building && <div className="data-column"><span className="data-label">Корпус</span><span className="data-value">{passportAddress.building}</span></div>}
                                      </div>
                                    )}

                                    {passportAddress.apartment && (
                                      <div className="data-row"><span className="data-label">Квартира</span><span className="data-value">{passportAddress.apartment}</span></div>
                                    )}
                                  </div>
                                </section>
                              )}
                            </div>
                          )}

                          {error && (
                            <div className="alert alert-warning" style={{ marginTop: 16 }}>
                              <span>{error}</span>
                            </div>
                          )}

                        </div>
                      </div>

                      <CartSummary
                        cart={cart}
                        subtotal={subtotal}
                        promoDiscount={promoDiscount}
                        delivery={deliveryCost}
                        pvzDelivery={receiveMethod === 'pickup' ? pvzDeliveryCost : 0}
                        showPvzDelivery={receiveMethod === 'pickup' && !!selectedPvz}
                        courierDelivery={receiveMethod === 'delivery' && !isIkeyaDelivery ? addrDeliveryCost : 0}
                        showCourierDelivery={receiveMethod === 'delivery' && !!selectedAddr && !isIkeyaDelivery}
                        finalTotal={finalTotal}
                        itemCount={itemCount}
                        totalWeight={totalWeight}
                        customsDuty={customsDuty}
                        canCheckout={canCheckout}
                        onCheckout={handleCheckout}
                        checkoutLoading={submitting}
                        checkoutButtonText={submitting ? 'Оформляем...' : 'Оформить заказ'}
                      />
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </section>

      {showDeliveryModal && (
        <DeliveryModal
          initialTab={deliveryModalTab}
          orderId={draftId}
          cartToken={draftId ? '' : cartToken}
          cartItems={cartItems}
          onClose={() => setShowDeliveryModal(false)}
          onSelectPvz={handleSelectPvz}
          onSelectAddr={handleSelectAddr}
        />
      )}

      {(showSavedPvz || showSavedAddr) && (
        <SavedAddressesModal
          initialMode={showSavedPvz ? 'pickup' : 'delivery'}
          pvzAddresses={savedPvzList}
          deliveryAddresses={savedAddrList}
          activePvzId={selectedPvz?.id || savedPvzList[0]?.id}
          activeDeliveryId={selectedAddr?.id || savedAddrList[0]?.id}
          onSelectPvz={handleSelectSavedPvz}
          onSelectDelivery={handleSelectSavedAddr}
          onDeletePvz={handleDeletePvz}
          onDeleteDelivery={handleDeleteAddr}
          onAddPvz={() => {
            setShowSavedPvz(false);
            setShowSavedAddr(false);
            setDeliveryModalTab('pickup');
            setShowDeliveryModal(true);
          }}
          onAddDelivery={() => {
            setShowSavedPvz(false);
            setShowSavedAddr(false);
            setDeliveryModalTab('delivery');
            setShowDeliveryModal(true);
          }}
          onClose={() => {
            setShowSavedPvz(false);
            setShowSavedAddr(false);
          }}
        />
      )}

      {showVghModal && (
        <>
          <div className="modal fade show d-block" style={{ zIndex: 1055 }}>
            <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: 480 }}>
              <div className="modal-content" style={{ padding: 24 }}>
                <h5 style={{ marginBottom: 16 }}>Самовывоз недоступен</h5>
                <p style={{ marginBottom: 12 }}>К пересылке принимаются почтовые отправления:</p>
                <ul style={{ paddingLeft: 20, marginBottom: 24 }}>
                  <li>весом до 30 кг (в отдельных пунктах — до 50 кг).</li>
                  <li>максимальные габариты любой из сторон — до 250 см.</li>
                  <li>сумма трёх сторон — не более 350 см.</li>
                </ul>
                <button type="button" className="pvz-select-btn" onClick={() => setShowVghModal(false)}>Закрыть</button>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show" style={{ zIndex: 1054 }} onClick={() => setShowVghModal(false)} />
        </>
      )}

      {showPersonalModal && (
        <EditPersonalDataModal
          profile={profile}
          onClose={() => setShowPersonalModal(false)}
          onSave={(updated) => {
            setProfile(updated);
            setShowPersonalModal(false);
          }}
        />
      )}

      {showPassportModal && (
        <EditPassportModal
          profile={profile}
          onClose={() => setShowPassportModal(false)}
          onSave={(updated) => {
            setProfile(updated);
            setShowPassportModal(false);
          }}
        />
      )}

      {a1Modal && (
        <>
          <SmsVerifyModal
            userPhone={profile?.phone ? `+${profile.phone}` : ''}
            callerNumber={a1CallerNumber || ''}
            onVerify={handleA1Verify}
            onResend={handleCheckout}
            onClose={() => {
              setA1Modal(false);
              setA1Error(null);
            }}
            loading={a1Loading}
            error={a1Error || ''}
          />
          <div
            className="modal-backdrop fade show"
            style={{ zIndex: 1054 }}
            onClick={() => {
              setA1Modal(false);
              setA1Error(null);
            }}
          />
        </>
      )}
    </main>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <main className="korzina">
        <section className="zakaz">
          <div className="container">
            <div style={{ padding: '40px 0', textAlign: 'center', color: '#9e9e9e' }}>Загрузка...</div>
          </div>
        </section>
      </main>
    }>
      <CheckoutPageInner />
    </Suspense>
  );
}
