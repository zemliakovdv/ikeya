'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import CartSummary from '@/components/cart/CartSummary';
import DeliveryModal from '@/components/delivery/modal/DeliveryModal';
import SavedAddressesModal from '@/components/delivery/modal/SavedAddressesModal';
import EditPersonalDataModal from '@/components/profile/modals/EditPersonalDataModal';
import EditPassportModal from '@/components/profile/modals/EditPassportModal';
import { getProfile, checkout } from '@/lib/api/cart';
import { resolvePaymentUrl } from '@/lib/utils/paymentUrl';
import { requestA1Verification, verifyA1Code } from '@/lib/api/account';
import SmsVerifyModal from '@/components/profile/modals/SmsVerifyModal';

const API_BASE_URL = 'https://test.ikeya.by/api/v1';
const LS_SAVED_PVZ = 'saved_pvz_addresses';
const LS_SAVED_ADDR = 'saved_delivery_addresses';
const LS_RECEIVE_METHOD = 'checkout_receive_method';

// ─── Хелперы ──────────────────────────────────────────────────────────────────

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

function getDeliveryDate(workingHours) {
  const date = new Date();
  date.setDate(date.getDate() + 20);
  const day = date.getDate();
  const months = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
  const month = months[date.getMonth()];
  const timeMatch = workingHours?.match(/(\d{1,2}:\d{2})/);
  const openTime = timeMatch ? timeMatch[1] : null;
  return openTime ? `${day} ${month} с ${openTime}` : `${day} ${month}`;
}

function readLS(key) {
  if (typeof window === 'undefined') return [];
  try { return JSON.parse(localStorage.getItem(key) || '[]'); } catch { return []; }
}

function writeLS(key, value) {
  if (typeof window === 'undefined') return;
  try { localStorage.setItem(key, JSON.stringify(value)); } catch { }
}

function genId() {
  return Math.random().toString(36).slice(2);
}

// ─── Иконки ───────────────────────────────────────────────────────────────────

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

// ─── Компонент ────────────────────────────────────────────────────────────────

export default function CheckoutPage() {
  const router = useRouter();
  const { token } = useAuth();
  const { cart, totals, items, clearCart } = useCart();

  // Профиль
  const [profile, setProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  // Способ получения: null | 'pickup' | 'delivery'
  const [receiveMethod, setReceiveMethod] = useState(() => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(LS_RECEIVE_METHOD) || null;
  });

  const saveReceiveMethod = (method) => {
    setReceiveMethod(method);
    if (typeof window !== 'undefined') localStorage.setItem(LS_RECEIVE_METHOD, method);
  };

  // ВГХ — доступен ли самовывоз
  const [pickupEligible, setPickupEligible] = useState(true);
  const [vghLoading, setVghLoading] = useState(false);
  const [showVghModal, setShowVghModal] = useState(false);

  // Выбранный ПВЗ
  const [selectedPvz, setSelectedPvz] = useState(() => {
    if (typeof window === 'undefined') return null;
    return readLS(LS_SAVED_PVZ)[0] || null;
  });
  const [pvzCalcResult, setPvzCalcResult] = useState(null);

  // Выбранный адрес доставки
  const [selectedAddr, setSelectedAddr] = useState(() => {
    if (typeof window === 'undefined') return null;
    return readLS(LS_SAVED_ADDR)[0] || null;
  });
  const [addrCalcResult, setAddrCalcResult] = useState(null);

  // Комментарий курьеру (только для IKEYA)
  const [courierComment, setCourierComment] = useState('');

  // Сохранённые адреса
  const [savedPvzList, setSavedPvzList] = useState([]);
  const [savedAddrList, setSavedAddrList] = useState([]);

  // Модалки
  const [showDeliveryModal, setShowDeliveryModal] = useState(false);
  const [deliveryModalTab, setDeliveryModalTab] = useState('pickup');
  const [showSavedPvz, setShowSavedPvz] = useState(false);
  const [showSavedAddr, setShowSavedAddr] = useState(false);

  // Оплата и услуги
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [selectedServices, setSelectedServices] = useState([]);

  // Паспорт
  const [showPassportData, setShowPassportData] = useState(false);
  const [showPersonalModal, setShowPersonalModal] = useState(false);
  const [showPassportModal, setShowPassportModal] = useState(false);

  // Чекаут
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // A1-верификация
  const [a1Modal, setA1Modal] = useState(false);
  const [a1VerificationId, setA1VerificationId] = useState(null);
  const [a1CallerNumber, setA1CallerNumber] = useState(null);
  const [a1Loading, setA1Loading] = useState(false);
  const [a1Error, setA1Error] = useState(null);

  // ─── Загрузка ───────────────────────────────────────────────────────────────

  useEffect(() => {
    if (!token) { setLoadingProfile(false); return; }
    getProfile(token)
      .then(data => setProfile(data))
      .catch(() => setProfile(null))
      .finally(() => setLoadingProfile(false));
  }, [token]);

  // Загружаем сохранённые адреса из localStorage
  useEffect(() => {
    setSavedPvzList(readLS(LS_SAVED_PVZ));
    setSavedAddrList(readLS(LS_SAVED_ADDR));
  }, []);

  // Проверка ВГХ при загрузке
  useEffect(() => {
    if (!items?.length) return;
    const cartToken = typeof window !== 'undefined'
      ? localStorage.getItem('cart_token') || ''
      : '';
    if (!cartToken) return;

    setVghLoading(true);
    fetch(`${API_BASE_URL}/delivery/calculate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        cart_token: cartToken,
        delivery_type: 'pickup',
        items: items.map(it => ({ sku: it.sku, quantity: it.quantity })),
      }),
    })
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        // Если ни один ПВЗ не eligible — самовывоз недоступен
        const eligible = data?.pickup_point?.eligible !== false;
        setPickupEligible(eligible);
        if (!eligible) saveReceiveMethod('delivery');
      })
      .catch(() => { })
      .finally(() => setVghLoading(false));
  }, [items]);

  // ─── Суммы ──────────────────────────────────────────────────────────────────

  const checkoutSummary = (() => {
    if (typeof window === 'undefined') return null;
    try { return JSON.parse(sessionStorage.getItem('checkoutSummary') || 'null'); } catch { return null; }
  })();

  const subtotal = checkoutSummary?.subtotal ?? parseFloat(totals?.subtotal_new_byn || totals?.subtotal || 0);
  const promoDiscount = checkoutSummary?.promoDiscount ?? parseFloat(totals?.discount_total_byn || totals?.discount || 0);
  const deliveryCost = checkoutSummary?.delivery ?? parseFloat(totals?.delivery || 0);
  const totalWeight = checkoutSummary?.totalWeight ?? (totals?.total_weight_kg || 0);
  const customsDuty = checkoutSummary?.customsDuty ?? 0;
  const itemCount = checkoutSummary?.itemCount ?? items.length;

  // Стоимость доставки до ПВЗ / курьером — из calcResult
  const pvzDeliveryCost = pvzCalcResult?.delivery?.free_delivery_eligible
    ? 0
    : parseFloat(pvzCalcResult?.delivery?.base_cost_byn || 0);

  const addrDeliveryCost = addrCalcResult?.delivery?.free_delivery_eligible
    ? 0
    : parseFloat(addrCalcResult?.delivery?.base_cost_byn || 0);

  const isIkeyaDelivery = selectedAddr?.deliveryType !== 'europost_courier';

  // ─── Хелперы профиля ────────────────────────────────────────────────────────

  const fullName = profile ? [profile.last_name, profile.first_name, profile.middle_name].filter(Boolean).join(' ') : '';
  const hasPassport = Boolean(profile?.passport_data?.number && profile?.passport_data?.series);
  const passportAddress = profile?.passport_data;
  const hasAddress = Boolean(passportAddress?.city || passportAddress?.street);

  const canCheckout = !!(
    fullName &&
    profile?.phone &&
    (selectedPvz || selectedAddr) &&
    itemCount > 0 &&
    !submitting
  );

  // ─── Выбор ПВЗ ──────────────────────────────────────────────────────────────

  const handleSelectPvz = useCallback((pvz, calcResult) => {
    setSelectedPvz(pvz);
    setPvzCalcResult(calcResult);
    saveReceiveMethod('pickup');

    // Сохраняем в localStorage
    const label = pvz.city ? `${pvz.city}, ${pvz.address}` : pvz.address;
    const entry = { id: genId(), label, ...pvz };
    const updated = [entry, ...savedPvzList.filter(a => a.address !== pvz.address)].slice(0, 5);
    setSavedPvzList(updated);
    writeLS(LS_SAVED_PVZ, updated);
  }, [savedPvzList]);

  const handleSelectAddr = useCallback((addr, calcResult) => {
    setSelectedAddr(addr);
    setAddrCalcResult(calcResult);
    saveReceiveMethod('delivery');

    // Сохраняем в localStorage
    const label = addr.apartment ? `${addr.address}, кв.${addr.apartment}` : addr.address;
    const entry = { id: genId(), label, ...addr };
    const updated = [entry, ...savedAddrList.filter(a => a.address !== addr.address)].slice(0, 5);
    setSavedAddrList(updated);
    writeLS(LS_SAVED_ADDR, updated);
  }, [savedAddrList]);

  // «Изменить» для ПВЗ
  const handleChangePvz = () => {
    if (savedPvzList.length > 0) setShowSavedPvz(true);
    else { setDeliveryModalTab('pickup'); setShowDeliveryModal(true); }
  };

  // «Изменить» для адреса доставки
  const handleChangeAddr = () => {
    if (savedAddrList.length > 0) setShowSavedAddr(true);
    else { setDeliveryModalTab('delivery'); setShowDeliveryModal(true); }
  };

  // Выбор из сохранённых ПВЗ
  const handleSelectSavedPvz = (id) => {
    const found = savedPvzList.find(a => a.id === id);
    if (found) { setSelectedPvz(found); saveReceiveMethod('pickup'); }
    setShowSavedPvz(false);
  };

  // Выбор из сохранённых адресов
  const handleSelectSavedAddr = (id) => {
    const found = savedAddrList.find(a => a.id === id);
    if (found) { setSelectedAddr(found); saveReceiveMethod('delivery'); }
    setShowSavedAddr(false);
  };

  const handleDeletePvz = (id) => {
    const updated = savedPvzList.filter(a => a.id !== id);
    setSavedPvzList(updated);
    writeLS(LS_SAVED_PVZ, updated);
  };

  const handleDeleteAddr = (id) => {
    const updated = savedAddrList.filter(a => a.id !== id);
    setSavedAddrList(updated);
    writeLS(LS_SAVED_ADDR, updated);
  };

  // Клик на карточку «Самовывоз»
  const handlePickupCardClick = () => {
    if (!pickupEligible) return;
    if (selectedPvz) { saveReceiveMethod('pickup'); return; }
    setDeliveryModalTab('pickup');
    setShowDeliveryModal(true);
  };

  // Клик на карточку «Доставка»
  const handleDeliveryCardClick = () => {
    if (selectedAddr) { saveReceiveMethod('delivery'); return; }
    setDeliveryModalTab('delivery');
    setShowDeliveryModal(true);
  };

  function handleServiceToggle(value) {
    setSelectedServices(prev =>
      prev.includes(value) ? prev.filter(s => s !== value) : [...prev, value]
    );
  }

  // ─── Чекаут + A1 ────────────────────────────────────────────────────────────

  const cartToken = typeof window !== 'undefined' ? localStorage.getItem('cart_token') || '' : '';
  const cartItems = items.map(it => ({ sku: it.sku, quantity: it.quantity }));

  function buildOrderData(a1Id = null) {
    const isPickup = receiveMethod === 'pickup';
    return {
      full_name: fullName,
      phone: profile.phone,
      delivery_type: isPickup ? 'pickup' : 'courier',
      payment_method: paymentMethod,
      pickup_point_id: isPickup ? (selectedPvz?.id || null) : null,
      courier_comment: !isPickup && isIkeyaDelivery ? courierComment : null,
      delivery_address: !isPickup ? selectedAddr?.address : null,
      a1_verification_id: a1Id,
      services: selectedServices,
    };
  }

  async function handleCheckout() {
    if (!canCheckout) return;
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
      await verifyA1Code(a1VerificationId, code);
      setA1Modal(false);
      setSubmitting(true);
      const response = await checkout(buildOrderData(a1VerificationId), token);
      await clearCart();
      // Сохраняем данные о доставке для success page
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
      sessionStorage.setItem('checkoutOrder', JSON.stringify(response.order || null));
      sessionStorage.setItem('checkoutItems', JSON.stringify(
        items.map(it => ({
          id: it.sku,
          attributes: {
            product_sku: it.sku,
            name: it.product?.small_desc_name || it.product?.name_ru || '',
            description: it.product?.name_ru || '',
            quantity: it.quantity,
            price_byn: it.product?.price_byn || 0,
            image_url: it.product?.local_images?.[0] || it.product?.images?.[0] || '',
          }
        }))
      ));

      const paymentUrl = resolvePaymentUrl(response.order?.attributes?.payment_url);
      if (paymentMethod === 'card' && paymentUrl) {
        window.location.href = paymentUrl;
      } else {
        router.push(`/order-success?order_id=${response.order_id}`);
      }
    } catch (err) {
      setA1Error(err.message || 'Неверный код, попробуйте ещё раз');
    } finally {
      setA1Loading(false);
      setSubmitting(false);
    }
  }

  // ─── Рендер ─────────────────────────────────────────────────────────────────

  return (
    <main className="korzina">
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

                          {/* ===== СПОСОБ ПОЛУЧЕНИЯ ===== */}
                          <section className="checkout-section pickup-section">
                            <h2 className="section-title">Способ получения</h2>

                            {/* ВГХ — нотификейшн если самовывоз недоступен */}
                            {!pickupEligible && !vghLoading && (
                              <div className="alert alert-danger" style={{ marginBottom: 16 }}>
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                  <path d="M10 1.66666C5.40002 1.66666 1.66669 5.39999 1.66669 9.99999C1.66669 14.6 5.40002 18.3333 10 18.3333C14.6 18.3333 18.3334 14.6 18.3334 9.99999C18.3334 5.39999 14.6 1.66666 10 1.66666ZM9.37502 6.66666C9.37502 6.32499 9.65835 6.04166 10 6.04166C10.3417 6.04166 10.625 6.32499 10.625 6.66666V10.8333C10.625 11.175 10.3417 11.4583 10 11.4583C9.65835 11.4583 9.37502 11.175 9.37502 10.8333V6.66666ZM10.7667 13.65C10.725 13.7583 10.6584 13.8583 10.575 13.9417C10.4917 14.025 10.3917 14.0917 10.2834 14.1333C10.175 14.175 10.0584 14.2 9.93335 14.2C9.81669 14.2 9.70002 14.175 9.58335 14.1333C9.47502 14.0917 9.37502 14.025 9.29169 13.9417C9.20835 13.8583 9.14169 13.7583 9.10002 13.65C9.05835 13.5417 9.03335 13.425 9.03335 13.3083C9.03335 13.1917 9.05835 13.075 9.10002 12.9667C9.14169 12.8583 9.20835 12.7583 9.29169 12.675C9.37502 12.5917 9.47502 12.525 9.58335 12.4833C9.80002 12.4 10.0667 12.4 10.2834 12.4833C10.3917 12.525 10.4917 12.5917 10.575 12.675C10.6584 12.7583 10.725 12.8583 10.7667 12.9667C10.8084 13.075 10.8334 13.1917 10.8334 13.3083C10.8334 13.425 10.8084 13.5417 10.7667 13.65Z" fill="#B71C1C" />
                                </svg>
                                <div>
                                  <span>Самовывоз недоступен из-за превышения весогабаритных характеристик заказа</span>
                                  <button
                                    type="button"
                                    className="vgh-details-link"
                                    onClick={() => setShowVghModal(true)}
                                  >
                                    Подробнее
                                  </button>
                                </div>
                              </div>
                            )}

                            {/* Карточки выбора */}
                            <div className="receive-methods">
                              {pickupEligible && (
                                <label
                                  className={`receive-method${receiveMethod === 'pickup' ? ' receive-method--active' : ''}`}
                                  onClick={handlePickupCardClick}
                                >
                                  <input
                                    type="radio"
                                    name="receive_method"
                                    value="pickup"
                                    checked={receiveMethod === 'pickup'}
                                    onChange={() => { }}
                                    readOnly
                                  />
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
                                <input
                                  type="radio"
                                  name="receive_method"
                                  value="delivery"
                                  checked={receiveMethod === 'delivery'}
                                  onChange={() => { }}
                                  readOnly
                                />
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

                            {/* ─── Блок после выбора: САМОВЫВОЗ ─── */}
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
                                  <button
                                    type="button"
                                    className="change-link"
                                    onClick={handleChangePvz}
                                  >
                                    Изменить
                                  </button>
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
                                    <span className="timeline-value">{getDeliveryDate(selectedPvz.working_hours)}</span>
                                  </div>
                                  <div className="timeline-item">
                                    <span className="timeline-label">Срок хранения заказа</span>
                                    <span className="timeline-value">14 дней</span>
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* ─── Блок после выбора: ДОСТАВКА ─── */}
                            {receiveMethod === 'delivery' && selectedAddr && (
                              <div className="selected-delivery-block">
                                <div className="selected-delivery-header">
                                  <div className="selected-delivery-left">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                      <path d="M12.0002 22C11.2602 22 10.5502 21.72 10.0202 21.22C9.7202 20.94 9.4102 20.65 9.1002 20.37C5.5802 17.12 1.2102 13.07 3.6202 7.43C5.0102 4.18 8.3802 2 12.0002 2C15.6202 2 18.9902 4.18 20.3802 7.43C22.8002 13.09 18.3902 17.16 14.8502 20.43L13.9902 21.23C13.4502 21.73 12.7502 22.01 12.0102 22.01L12.0002 22ZM12.0002 3.4C8.9302 3.4 6.0802 5.24 4.9102 7.98C2.8902 12.71 6.5302 16.09 10.0502 19.35C10.3602 19.64 10.6702 19.93 10.9702 20.21C11.5202 20.72 12.4702 20.72 13.0202 20.21L13.8902 19.4C17.4502 16.12 21.1202 12.73 19.0902 7.98C17.9202 5.24 15.0702 3.4 12.0002 3.4Z" fill="#9E9E9E" />
                                      <path d="M11.9998 15.0191C9.8198 15.0191 8.0498 13.2491 8.0498 11.0691C8.0498 8.88914 9.8198 7.11914 11.9998 7.11914C14.1798 7.11914 15.9498 8.88914 15.9498 11.0691C15.9498 13.2491 14.1798 15.0191 11.9998 15.0191ZM11.9998 8.50914C10.5898 8.50914 9.4398 9.65914 9.4398 11.0691C9.4398 12.4791 10.5898 13.6291 11.9998 13.6291C13.4098 13.6291 14.5598 12.4791 14.5598 11.0691C14.5598 9.65914 13.4098 8.50914 11.9998 8.50914Z" fill="#9E9E9E" />
                                    </svg>
                                    <div className="selected-delivery-address">
                                      {selectedAddr.apartment
                                        ? `${selectedAddr.address}, кв.${selectedAddr.apartment}`
                                        : selectedAddr.address
                                      }
                                    </div>
                                  </div>
                                  <button
                                    type="button"
                                    className="change-link"
                                    onClick={handleChangeAddr}
                                  >
                                    Изменить
                                  </button>
                                </div>

                                <div className="alert alert-info">
                                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                    <path d="M10 1.66666C5.40002 1.66666 1.66669 5.39999 1.66669 9.99999C1.66669 14.6 5.40002 18.3333 10 18.3333C14.6 18.3333 18.3334 14.6 18.3334 9.99999C18.3334 5.39999 14.6 1.66666 10 1.66666ZM10.625 13.5417C10.625 13.8833 10.3417 14.1667 10 14.1667C9.65835 14.1667 9.37502 13.8833 9.37502 13.5417V9.37499C9.37502 9.03332 9.65835 8.74999 10 8.74999C10.3417 8.74999 10.625 9.03332 10.625 9.37499V13.5417ZM10 7.70832C9.65002 7.70832 9.37502 7.43332 9.37502 7.08332C9.37502 6.73332 9.65002 6.45832 10 6.45832C10.35 6.45832 10.625 6.73332 10.625 7.08332C10.625 7.43332 10.35 7.70832 10 7.70832Z" fill="#0058A3" />
                                  </svg>
                                  <span>Для получения заказа необходим паспорт</span>
                                </div>

                                {/* Блок доставки Европочта */}
                                {!isIkeyaDelivery && (
                                  <div className="delivery-info-block">
                                    <div className="delivery-info-header">
                                      <span className="delivery-info-name">Доставка Европочта</span>
                                      <EuropostIcon size={24} />
                                    </div>
                                    {addrCalcResult?.delivery?.base_cost_byn && (
                                      <div className="delivery-info-row">
                                        <span>Стоимость доставки</span>
                                        <span>
                                          {addrCalcResult.delivery.free_delivery_eligible
                                            ? <span className="text-success">бесплатно</span>
                                            : `${addrCalcResult.delivery.base_cost_byn} р.`
                                          }
                                        </span>
                                      </div>
                                    )}
                                    <button type="button" className="delivery-conditions-link">
                                      Условия получения товаров
                                    </button>
                                    <p className="delivery-conditions-note">
                                      Окно доставки будет дополнительно согласовано с вами службой доставки Европочты
                                    </p>
                                  </div>
                                )}

                                {/* Блок доставки IKEYA */}
                                {isIkeyaDelivery && (
                                  <div className="delivery-info-block">
                                    <div className="delivery-info-header">
                                      <span className="delivery-info-name">Доставка IKEYA</span>
                                      <IkeyaLogo />
                                    </div>
                                    <div className="alert alert-info" style={{ marginTop: 8 }}>
                                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                        <path d="M8 1.33334C4.32667 1.33334 1.33334 4.32667 1.33334 8.00001C1.33334 11.6733 4.32667 14.6667 8 14.6667C11.6733 14.6667 14.6667 11.6733 14.6667 8.00001C14.6667 4.32667 11.6733 1.33334 8 1.33334ZM8.46667 10.48C8.46667 10.74 8.26 10.9467 8 10.9467C7.74 10.9467 7.53334 10.74 7.53334 10.48V7.68667C7.53334 7.42667 7.74 7.22 8 7.22C8.26 7.22 8.46667 7.42667 8.46667 7.68667V10.48ZM8 6.08C7.69334 6.08 7.44667 5.83334 7.44667 5.52667C7.44667 5.22 7.69334 4.97334 8 4.97334C8.30667 4.97334 8.55334 5.22 8.55334 5.52667C8.55334 5.83334 8.30667 6.08 8 6.08Z" fill="#0058A3" />
                                      </svg>
                                      <span>С вами свяжется сотрудник IKEYA для согласования сроков и стоимости доставки заказа. Данная услуга оплачивается отдельно от заказа.</span>
                                    </div>

                                    {/* Комментарий курьеру */}
                                    <textarea
                                      className="courier-comment"
                                      placeholder="Комментарий курьеру"
                                      value={courierComment}
                                      onChange={e => setCourierComment(e.target.value)}
                                      rows={3}
                                    />
                                  </div>
                                )}
                              </div>
                            )}
                          </section>

                          {/* ===== УСЛУГИ ===== */}
                          <section className="checkout-section services-section">
                            <h2 className="section-title services-title">Услуги в г. Минск (+20 км от Минска)</h2>
                            <div className="alert alert-info">
                              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <path d="M12 2C6.49 2 2 6.49 2 12C2 17.51 6.49 22 12 22C17.51 22 22 17.51 22 12C22 6.49 17.51 2 12 2ZM12.7 15.72C12.7 16.11 12.39 16.42 12 16.42C11.61 16.42 11.3 16.11 11.3 15.72V11.53C11.3 11.14 11.61 10.83 12 10.83C12.39 10.83 12.7 11.14 12.7 11.53V15.72ZM12 9.12C11.54 9.12 11.16 8.75 11.16 8.29C11.16 7.82 11.53 7.44 12 7.44C12.47 7.44 12.84 7.81 12.84 8.28C12.84 8.75 12.47 9.12 12 9.12Z" fill="#0058A3" />
                              </svg>
                              <span>Услуги оплачиваются отдельно. С Вами свяжется сотрудник колл-центра для уточнения всех деталей.</span>
                            </div>
                            <div className="services-list">
                              {[
                                { value: 'furniture_delivery', title: 'Подъем и занос мебели', desc: 'Стоимость подъема мебели определяется исходя из количества единиц изделия, веса изделия и габаритных размеров.', price: 'от 75.00 р.' },
                                { value: 'furniture_assembly', title: 'Сборка мебели', desc: 'Качественная и надежная сборка мебели специалистами IKEA', price: 'от 50.00 р.' },
                              ].map(service => (
                                <label
                                  key={service.value}
                                  className={`service-card${selectedServices.includes(service.value) ? ' selected' : ''}`}
                                >
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

                          {/* ===== СПОСОБ ОПЛАТЫ ===== */}
                          <section className="checkout-section">
                            <div className="section-header">
                              <h2 className="section-title">Способ оплаты</h2>
                            </div>
                            <div className="payment-methods">
                              <label className="payment-method">
                                <input type="radio" name="payment_method" value="card"
                                  checked={paymentMethod === 'card'}
                                  onChange={e => setPaymentMethod(e.target.value)} />
                                <div className="payment-card">
                                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M27.7868 7.3351C27.5468 7.0551 27.2668 6.80177 26.9868 6.5751C25.1735 5.14844 22.7335 5.14844 17.8668 5.14844H14.1468C9.28017 5.14844 6.82684 5.14844 5.02684 6.5751C4.73351 6.80177 4.46684 7.0551 4.22684 7.3351C2.68018 9.06844 2.68018 11.3884 2.68018 16.0018C2.68018 20.6151 2.68018 22.9351 4.22684 24.6684C4.46684 24.9351 4.74684 25.2018 5.02684 25.4284C6.84018 26.8551 9.28017 26.8551 14.1468 26.8551H17.8668C22.7335 26.8551 25.1868 26.8551 27.0002 25.4284C27.2935 25.2018 27.5602 24.9484 27.8002 24.6684C29.3468 22.9351 29.3468 20.6151 29.3468 16.0018C29.3468 11.3884 29.3468 9.06844 27.8002 7.3351H27.7868ZM5.58684 8.5751C5.76018 8.3751 5.94684 8.20177 6.16018 8.04177C7.46684 7.0151 9.69351 7.0151 14.1335 7.0151H17.8535C22.2935 7.0151 24.5202 7.0151 25.8268 8.04177C26.0268 8.20177 26.2268 8.38844 26.4002 8.5751C26.9602 9.20177 27.2268 10.0818 27.3468 11.3484H4.65351C4.78684 10.0684 5.04018 9.20177 5.60018 8.5751H5.58684ZM26.4002 23.4284C26.2268 23.6284 26.0268 23.8018 25.8268 23.9618C24.5202 24.9884 22.2935 24.9884 17.8535 24.9884H14.1335C9.69351 24.9884 7.46684 24.9884 6.16018 23.9618C5.94684 23.8018 5.76018 23.6151 5.58684 23.4284C4.52018 22.2284 4.52018 20.1484 4.52018 16.0018C4.52018 14.9484 4.52018 14.0151 4.53351 13.2151H27.4535C27.4668 14.0284 27.4668 14.9484 27.4668 16.0018C27.4668 20.1484 27.4668 22.2284 26.4002 23.4284Z" fill="#181818" />
                                    <path d="M15.3732 20.0273H13.5066C12.9866 20.0273 12.5732 20.4407 12.5732 20.9607C12.5732 21.4807 12.9866 21.894 13.5066 21.894H15.3732C15.8932 21.894 16.3066 21.4807 16.3066 20.9607C16.3066 20.4407 15.8932 20.0273 15.3732 20.0273Z" fill="#757575" />
                                    <path d="M23.4402 20.0273H19.0935C18.5735 20.0273 18.1602 20.4407 18.1602 20.9607C18.1602 21.4807 18.5735 21.894 19.0935 21.894H23.4402C23.9602 21.894 24.3735 21.4807 24.3735 20.9607C24.3735 20.4407 23.9602 20.0273 23.4402 20.0273Z" fill="#757575" />
                                  </svg>
                                  <span>Картой онлайн</span>
                                </div>
                              </label>
                              <label className="payment-method">
                                <input type="radio" name="payment_method" value="erip"
                                  checked={paymentMethod === 'erip'}
                                  onChange={e => setPaymentMethod(e.target.value)} />
                                <div className="payment-card">
                                  <img src="/assets/img/cart/erip.png" alt="ЕРИП" width="89" height="49" />
                                </div>
                              </label>
                            </div>
                          </section>

                          {/* ===== ПОЛУЧАТЕЛЬ ===== */}
                          <section className="checkout-section">
                            <div className="section-header">
                              <h2 className="section-title">Получатель</h2>
                              {profile && (
                                <button className="change-link" type="button" onClick={() => setShowPersonalModal(true)}>
                                  Изменить
                                </button>
                              )}
                            </div>
                            {loadingProfile ? <p>Загрузка...</p> : (
                              <>
                                {(!profile?.first_name || !profile?.phone) && (
                                  <div className="alert alert-warning">
                                    <span>Для таможенного оформления необходимо дополнить{' '}
                                      <strong style={{ cursor: 'pointer', textDecoration: 'underline' }}
                                        onClick={() => setShowPersonalModal(true)}>
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

                          {/* ===== ПАСПОРТНЫЕ ДАННЫЕ ===== */}
                          {profile && (
                            <div className="for-white_bg">
                              <section className="checkout-section">
                                <div className="section-header">
                                  <h2 className="section-title">Паспортные данные</h2>
                                  <button className="change-link" type="button" onClick={() => setShowPassportModal(true)}>
                                    Изменить
                                  </button>
                                </div>
                                {!hasPassport ? (
                                  <div className="alert alert-warning">
                                    <span>Для таможенного оформления посылок необходимо добавить{' '}
                                      <strong style={{ cursor: 'pointer', textDecoration: 'underline' }}
                                        onClick={() => setShowPassportModal(true)}>
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
                                              : [mask(profile.passport_data.last_name, 5), mask(profile.passport_data.first_name, 3)].filter(Boolean).join(' ')
                                            }
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
                                    <button className="show-data-btn" type="button" onClick={() => setShowPassportData(v => !v)}>
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

                      {/* Правая колонка */}
                      <CartSummary
                        cart={cart}
                        subtotal={subtotal}
                        promoDiscount={promoDiscount}
                        delivery={deliveryCost}
                        pvzDelivery={receiveMethod === 'pickup' ? pvzDeliveryCost : (receiveMethod === 'delivery' && !isIkeyaDelivery ? addrDeliveryCost : 0)}
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

      {/* ─── Модалка выбора доставки ─── */}
      {showDeliveryModal && (
        <DeliveryModal
          initialTab={deliveryModalTab}
          cartToken={cartToken}
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
          activePvzId={savedPvzList[0]?.id}
          activeDeliveryId={savedAddrList[0]?.id}
          onSelectPvz={handleSelectSavedPvz}
          onSelectDelivery={handleSelectSavedAddr}
          onDeletePvz={handleDeletePvz}
          onDeleteDelivery={handleDeleteAddr}
          onAddPvz={() => { setShowSavedPvz(false); setShowSavedAddr(false); setDeliveryModalTab('pickup'); setShowDeliveryModal(true); }}
          onAddDelivery={() => { setShowSavedPvz(false); setShowSavedAddr(false); setDeliveryModalTab('delivery'); setShowDeliveryModal(true); }}
          onClose={() => { setShowSavedPvz(false); setShowSavedAddr(false); }}
        />
      )}

      {/* ─── Модалка ВГХ ─── */}
      {showVghModal && (
        <>
          <div className="modal fade show d-block" style={{ zIndex: 1055 }}>
            <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: 480 }}>
              <div className="modal-content" style={{ padding: 24 }}>
                <h5 style={{ marginBottom: 16 }}>Самовывоз недоступен</h5>
                <p style={{ marginBottom: 12 }}>К пересылке принимаются почтовые отправления:</p>
                <ul style={{ paddingLeft: 20, marginBottom: 24 }}>
                  <li>весом до 30 кг (в отдельных пунктах — до 50 кг).</li>
                  <li>максимальные габариты любой из сторон (длина\высота\ширина) — до 250 см.</li>
                  <li>общие габариты отправления — сумма 3-х сторон (длина + высота + ширина) — не более 350 см.</li>
                </ul>
                <button
                  type="button"
                  className="pvz-select-btn"
                  onClick={() => setShowVghModal(false)}
                >
                  Закрыть
                </button>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show" style={{ zIndex: 1054 }} onClick={() => setShowVghModal(false)} />
        </>
      )}

      {/* ─── Личные данные ─── */}
      {showPersonalModal && (
        <EditPersonalDataModal
          profile={profile}
          onClose={() => setShowPersonalModal(false)}
          onSave={(updated) => { setProfile(updated); setShowPersonalModal(false); }}
        />
      )}

      {/* ─── Паспортные данные ─── */}
      {showPassportModal && (
        <EditPassportModal
          profile={profile}
          onClose={() => setShowPassportModal(false)}
          onSave={(updated) => { setProfile(updated); setShowPassportModal(false); }}
        />
      )}

      {/* ─── A1 верификация ─── */}
      {a1Modal && (
        <>
          <SmsVerifyModal
            userPhone={profile?.phone ? `+${profile.phone}` : ''}
            callerNumber={a1CallerNumber || ''}
            onVerify={handleA1Verify}
            onResend={handleCheckout}
            onClose={() => { setA1Modal(false); setA1Error(null); }}
            loading={a1Loading}
            error={a1Error || ''}
          />
          <div className="modal-backdrop fade show" style={{ zIndex: 1054 }}
            onClick={() => { setA1Modal(false); setA1Error(null); }} />
        </>
      )}
    </main>
  );
}