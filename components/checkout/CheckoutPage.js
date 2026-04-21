'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import CartSummary from '@/components/cart/CartSummary';
import DeliveryPickupModal from '@/components/profile/modals/DeliveryPickupModal';
import EditPersonalDataModal from '@/components/profile/modals/EditPersonalDataModal';
import EditPassportModal from '@/components/profile/modals/EditPassportModal';
import { getProfile, checkout, getCartToken } from '@/lib/api/cart';
import { requestA1Verification, verifyA1Code } from '@/lib/api/account';
import SmsVerifyModal from '@/components/profile/modals/SmsVerifyModal';

const PROVIDER_NAMES = {
  europost: 'Европочта',
  autolight: 'Автолайт',
}

// Маскировка — те же функции что в PersonalData.js
function mask(str, visible = 2) {
  if (!str) return '—'
  const s = String(str)
  if (s.length <= visible) return s
  return s.slice(0, visible) + '*'.repeat(s.length - visible)
}

function maskDate(dateStr) {
  if (!dateStr) return '—'
  const [y, m, d] = dateStr.split('-')
  return `${d}.**.**** `
}

function formatDate(dateStr) {
  if (!dateStr) return '—'
  const [y, m, d] = dateStr.split('-')
  return `${d}.${m}.${y}`
}

// Иконки провайдеров
function PvzProviderIcon({ provider }) {
  if (provider === 'europost') {
    return (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="12" fill="white" />
        <circle cx="12" cy="12" r="10.8" fill="#FF0000" />
        <path d="M16.3933 8.81333L17.1733 8.36667L12.1333 5.45333L7.09333 8.36667L8.56 9.19333L12.1333 7.09333L15.7067 9.2L16.3933 8.81333Z" fill="white" />
        <path d="M12.7333 11.96V16.2533L14.1867 15.4133V12.52L16.3933 11.26V14.14L17.8533 13.3V9.04667H17.84L12.7333 11.96Z" fill="white" />
        <path d="M12.7333 17.2267V18.6733H12.74L17.8533 15.7467V14.2867L12.7333 17.2267Z" fill="white" />
        <path d="M11.54 18.6333V17.24L7.87333 15.16V13.8533L11.54 15.96V14.6333L7.87333 12.5333V11.1933L11.54 13.2867V11.96L7.87333 9.87333L6.42667 9.04667H6.41333V15.68L11.54 18.6333Z" fill="white" />
      </svg>
    )
  }
  if (provider === 'autolight') {
    return <img src="/assets/img/icon/autolight.png" alt="Автолайт" width="32" height="32" />
  }
  return null
}

// Дата доставки: +20 дней, время открытия из working_hours
function getDeliveryDate(workingHours) {
  const date = new Date()
  date.setDate(date.getDate() + 20)

  const day = date.getDate()
  const months = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря']
  const month = months[date.getMonth()]

  // Парсим время открытия из строки типа "пн-пт 9:00-18:00" или "Пн,Вт,Ср,Чт,Пт с 09:00 до 18:00"
  const timeMatch = workingHours?.match(/(\d{1,2}:\d{2})/)
  const openTime = timeMatch ? timeMatch[1] : null

  return openTime ? `${day} ${month} с ${openTime}` : `${day} ${month}`
}

export default function CheckoutPage() {
  const router = useRouter()
  const { token } = useAuth()
  const { cart, totals, items } = useCart()

  // Данные
  const [profile, setProfile] = useState(null)
  const [loadingProfile, setLoadingProfile] = useState(true)

  // Форма
  const [selectedPvz, setSelectedPvz] = useState(() => {
    if (typeof window === 'undefined') return null
    // 1. Сначала смотрим в sessionStorage — пользователь уже выбрал ПВЗ в этой сессии чекаута
    try {
      const fromSession = JSON.parse(sessionStorage.getItem('selectedPvz') || 'null')
      if (fromSession) return fromSession
    } catch { }
    // 2. Иначе подтягиваем активный адрес из личного кабинета (localStorage)
    try {
      const addresses = JSON.parse(localStorage.getItem('delivery_addresses') || '[]')
      const activeId = localStorage.getItem('delivery_address_active')
      if (addresses.length > 0) {
        const active = activeId
          ? addresses.find(a => (a.localId || a.id) === activeId) || addresses[0]
          : addresses[0]
        return active || null
      }
    } catch { }
    return null
  })
  const [paymentMethod, setPaymentMethod] = useState('card')
  const [selectedServices, setSelectedServices] = useState([])

  function handleServiceToggle(value) {
    setSelectedServices(prev =>
      prev.includes(value) ? prev.filter(s => s !== value) : [...prev, value]
    )
  }
  const [showPvzModal, setShowPvzModal] = useState(false)
  const [showPassportData, setShowPassportData] = useState(false)
  const [showPersonalModal, setShowPersonalModal] = useState(false)
  const [showPassportModal, setShowPassportModal] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  // A1-верификация паспорта
  const [a1Modal, setA1Modal] = useState(false)
  const [a1VerificationId, setA1VerificationId] = useState(null)
  const [a1CallerNumber, setA1CallerNumber] = useState(null)
  const [a1Loading, setA1Loading] = useState(false)
  const [a1Error, setA1Error] = useState(null)

  // Загрузка профиля
  useEffect(() => {
    if (!token) { setLoadingProfile(false); return }
    getProfile(token)
      .then(data => setProfile(data))
      .catch(() => setProfile(null))
      .finally(() => setLoadingProfile(false))
  }, [token])

  // Суммы из корзины — берём из sessionStorage (данные по выбранным товарам из CartPage)
  const checkoutSummary = (() => {
    if (typeof window === 'undefined') return null
    try { return JSON.parse(sessionStorage.getItem('checkoutSummary') || 'null') } catch { return null }
  })()

  const subtotal = checkoutSummary?.subtotal ?? parseFloat(totals?.subtotal_new_byn || totals?.subtotal || 0)
  const promoDiscount = checkoutSummary?.promoDiscount ?? parseFloat(totals?.discount_total_byn || totals?.discount || 0)
  const deliveryCost = checkoutSummary?.delivery ?? parseFloat(totals?.delivery || 0)
  const totalWeight = checkoutSummary?.totalWeight ?? (totals?.total_weight_kg || 0)
  const customsDuty = checkoutSummary?.customsDuty ?? 0
  const itemCount = checkoutSummary?.itemCount ?? items.length

  // Полное имя
  const fullName = profile
    ? [profile.last_name, profile.first_name, profile.middle_name].filter(Boolean).join(' ')
    : ''

  // Паспорт заполнен?
  const hasPassport = Boolean(profile?.passport_data?.number && profile?.passport_data?.series)

  // Адрес прописки заполнен?
  const passportAddress = profile?.passport_data
  const hasAddress = Boolean(passportAddress?.city || passportAddress?.street)

  // Можно оформить?
  const canCheckout = !!(fullName && profile?.phone && selectedPvz && itemCount > 0 && !submitting)

  function handlePvzSelect(pvz) {
    setSelectedPvz(pvz)
    sessionStorage.setItem('selectedPvz', JSON.stringify(pvz))
    setShowPvzModal(false)
  }

  // Формируем orderData — используется и при первом чекауте и после A1
  function buildOrderData(a1Id = null) {
    const data = {
      full_name: fullName,
      phone: profile.phone,
      delivery_type: 'pickup',
      payment_method: paymentMethod,
      pickup_point_id: selectedPvz.pickup_point_id || selectedPvz.id,
      a1_verification_id: a1Id,
      services: selectedServices,
    }
    return data
  }

  async function handleCheckout() {
    if (!canCheckout) return
    setError(null)
    await handleRequestA1()
  }

  // Шаг 1: запрашиваем звонок A1
  async function handleRequestA1() {
    setA1Loading(true)
    setA1Error(null)
    try {
      const res = await requestA1Verification(profile.phone, 'checkout')
      setA1VerificationId(res.verification_id)
      setA1CallerNumber(res.caller_number_masked || null)
      setA1Modal(true)
    } catch (err) {
      setError('Не удалось запросить верификацию: ' + (err.message || ''))
    } finally {
      setA1Loading(false)
    }
  }

  // Шаг 2: SmsVerifyModal передаёт code напрямую в onVerify(code)
  async function handleA1Verify(code) {
    setA1Loading(true)
    setA1Error(null)
    try {
      await verifyA1Code(a1VerificationId, code)
      setA1Modal(false)
      // Повторяем чекаут с подтверждённым a1_verification_id
      setSubmitting(true)
      const response = await checkout(buildOrderData(a1VerificationId), token)
      sessionStorage.setItem('selectedServices', JSON.stringify(selectedServices))
      router.push(`/order-success?order_id=${response.order_id}`)
    } catch (err) {
      setA1Error(err.message || 'Неверный код, попробуйте ещё раз')
    } finally {
      setA1Loading(false)
      setSubmitting(false)
    }
  }

  return (
    <main className="korzina">
      <section className="zakaz">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="zakaz-inner">

                {/* Заголовок */}
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

                          {/* ===== ПУНКТ ВЫДАЧИ ===== */}
                          <section className="checkout-section pickup-section">
                            {!selectedPvz && (
                              <div className="section-header">
                                <h2 className="section-title">Выберите способ получения</h2>
                              </div>
                            )}

                            {selectedPvz ? (
                              <>
                                {/* Заголовок: иконка + название провайдера + адрес + кнопка изменить */}
                                <div className="section-header" style={{ marginTop: '12px' }}>
                                  <div className="pickup-header-left">
                                    <div className="pickup-icon">
                                      <PvzProviderIcon provider={selectedPvz.provider} />
                                    </div>
                                    <div className="pickup-info">
                                      <span className="pickup-provider-name">{PROVIDER_NAMES[selectedPvz.provider] || selectedPvz.provider}</span>
                                      <h3 className="section-title">{selectedPvz.city}, {selectedPvz.address}</h3>
                                    </div>
                                  </div>
                                  <button
                                    className="change-link"
                                    type="button"
                                    onClick={() => setShowPvzModal(true)}
                                  >
                                    Изменить
                                  </button>
                                </div>

                                {/* Алерт паспорт */}
                                <div className="alert alert-info" style={{ marginTop: '12px' }}>
                                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                    <path d="M12 2C6.49 2 2 6.49 2 12C2 17.51 6.49 22 12 22C17.51 22 22 17.51 22 12C22 6.49 17.51 2 12 2ZM12.7 15.72C12.7 16.11 12.39 16.42 12 16.42C11.61 16.42 11.3 16.11 11.3 15.72V11.53C11.3 11.14 11.61 10.83 12 10.83C12.39 10.83 12.7 11.14 12.7 11.53V15.72ZM12 9.12C11.54 9.12 11.16 8.75 11.16 8.29C11.16 7.82 11.53 7.44 12 7.44C12.47 7.44 12.84 7.81 12.84 8.28C12.84 8.75 12.47 9.12 12 9.12Z" fill="#0058A3" />
                                  </svg>
                                  <span>Для получения заказа необходим паспорт</span>
                                </div>

                                {/* Контакты ПВЗ */}
                                <div className="contact-details">
                                  {selectedPvz.phone && (
                                    <div className="contact-item">
                                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                        <path d="M11.3332 14.6667C11.1065 14.6667 10.8798 14.6467 10.6532 14.6C9.64652 14.4 8.77318 14.06 7.79985 13.5067C5.65985 12.28 3.72652 10.3467 2.49318 8.2C1.93985 7.23333 1.59985 6.35333 1.39985 5.34667C1.12652 4.00667 1.68652 2.58 2.84652 1.63333C3.14652 1.38667 3.49318 1.29333 3.83318 1.35333C4.17318 1.42 4.46652 1.64 4.65318 1.98L5.19318 2.95333C5.65318 3.78 5.90652 4.24 5.85318 4.79333C5.79318 5.34667 5.45318 5.74 4.83318 6.45333L3.46652 8.02C4.55985 9.82 6.17985 11.4333 7.97985 12.5333L9.54652 11.1667C10.2598 10.5467 10.6532 10.2 11.2065 10.1467C11.7598 10.0867 12.2132 10.34 13.0465 10.8067L14.0199 11.3467C14.3599 11.5333 14.5799 11.8267 14.6465 12.1667C14.7132 12.5067 14.6132 12.86 14.3665 13.1533C13.5799 14.12 12.4598 14.6667 11.3332 14.6667Z" fill="#181818" />
                                      </svg>
                                      <span>{selectedPvz.phone}</span>
                                    </div>
                                  )}
                                  {selectedPvz.email && (
                                    <div className="contact-item">
                                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                        <path d="M13.76 3.20005C12.9267 2.36672 11.82 2.33339 9.81334 2.28672C8.59334 2.25339 7.41334 2.25339 6.19334 2.28672C4.18667 2.34005 3.08 2.36672 2.24667 3.20005C1.41334 4.03339 1.39334 5.11339 1.34667 7.07339C1.33334 7.69339 1.33334 8.30672 1.34667 8.92005C1.38667 10.8801 1.41334 11.9601 2.24667 12.7934C3.08 13.6267 4.18667 13.6601 6.19334 13.7067C6.8 13.7201 7.40667 13.7267 8.00667 13.7267C8.60667 13.7267 9.20667 13.7201 9.82 13.7067C11.8267 13.6534 12.9333 13.6267 13.7667 12.7934C14.6 11.9534 14.62 10.8801 14.6667 8.92005C14.68 8.30005 14.68 7.68672 14.6667 7.07339C14.6267 5.11339 14.6 4.03339 13.7667 3.20005H13.76Z" fill="#181818" />
                                      </svg>
                                      <span>{selectedPvz.email}</span>
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

                                {/* Timeline */}
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
                              </>
                            ) : (
                              <button
                                className="select-button"
                                type="button"
                                onClick={() => setShowPvzModal(true)}
                              >
                                Выбрать
                              </button>
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
                              <label className={`service-card${selectedServices.includes('furniture_delivery') ? ' selected' : ''}`}>
                                <input type="checkbox" name="service" value="furniture_delivery"
                                  checked={selectedServices.includes('furniture_delivery')}
                                  onChange={() => handleServiceToggle('furniture_delivery')} />
                                <div className="service-content">
                                  <div className="service-content_wrap">
                                    <div className="service-header">
                                      <div className="checkbox-custom">
                                        {selectedServices.includes('furniture_delivery') && (
                                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                            <path d="M3 8L6 11L13 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                          </svg>
                                        )}
                                      </div>
                                      <h3 className="service-name">Подъем и занос мебели</h3>
                                    </div>
                                    <p className="service-description">Стоимость подъема мебели определяется исходя из количества единиц изделия, веса изделия и габаритных размеров.</p>
                                  </div>
                                  <div className="service-price">от 75.00 р.</div>
                                </div>
                              </label>

                              <label className={`service-card${selectedServices.includes('furniture_assembly') ? ' selected' : ''}`}>
                                <input type="checkbox" name="service" value="furniture_assembly"
                                  checked={selectedServices.includes('furniture_assembly')}
                                  onChange={() => handleServiceToggle('furniture_assembly')} />
                                <div className="service-content">
                                  <div className="service-content_wrap">
                                    <div className="service-header">
                                      <div className="checkbox-custom">
                                        {selectedServices.includes('furniture_assembly') && (
                                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                            <path d="M3 8L6 11L13 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                          </svg>
                                        )}
                                      </div>
                                      <h3 className="service-name">Сборка мебели</h3>
                                    </div>
                                    <p className="service-description">Качественная и надежная сборка мебели специалистами IKEA</p>
                                  </div>
                                  <div className="service-price">от 50.00 р.</div>
                                </div>
                              </label>
                            </div>
                          </section>

                          {/* ===== СПОСОБ ОПЛАТЫ ===== */}
                          <section className="checkout-section">
                            <div className="section-header">
                              <h2 className="section-title">Способ оплаты</h2>
                            </div>

                            <div className="payment-methods">
                              {/* Картой онлайн */}
                              <label className="payment-method">
                                <input type="radio" name="payment_method" value="card"
                                  checked={paymentMethod === 'card'}
                                  onChange={e => setPaymentMethod(e.target.value)} />
                                <div className="payment-card">
                                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                                    <path d="M27.7867 7.33333C27.5467 7.05333 27.2667 6.8 26.9867 6.57333C25.1733 5.14667 22.7333 5.14667 17.8667 5.14667H14.1467C9.27999 5.14667 6.82666 5.14667 5.02666 6.57333C4.73333 6.8 4.46666 7.05333 4.22666 7.33333C2.67999 9.06667 2.67999 11.3867 2.67999 16C2.67999 20.6133 2.67999 22.9333 4.22666 24.6667C4.46666 24.9333 4.74666 25.2 5.02666 25.4267C6.83999 26.8533 9.27999 26.8533 14.1467 26.8533H17.8667C22.7333 26.8533 25.1867 26.8533 27 25.4267C27.2933 25.2 27.56 24.9467 27.8 24.6667C29.3467 22.9333 29.3467 20.6133 29.3467 16C29.3467 11.3867 29.3467 9.06667 27.8 7.33333H27.7867ZM5.58666 8.57333C5.75999 8.37333 5.94666 8.2 6.15999 8.04C7.46666 7.01333 9.69333 7.01333 14.1333 7.01333H17.8533C22.2933 7.01333 24.52 7.01333 25.8267 8.04C26.0267 8.2 26.2267 8.38667 26.4 8.57333C26.96 9.2 27.2267 10.08 27.3467 11.3467H4.65333C4.78666 10.0667 5.03999 9.2 5.59999 8.57333H5.58666ZM26.4 23.4267C26.2267 23.6267 26.0267 23.8 25.8267 23.96C24.52 24.9867 22.2933 24.9867 17.8533 24.9867H14.1333C9.69333 24.9867 7.46666 24.9867 6.15999 23.96C5.94666 23.8 5.75999 23.6133 5.58666 23.4267C4.51999 22.2267 4.51999 20.1467 4.51999 16C4.51999 14.9467 4.51999 14.0133 4.53333 13.2133H27.4533C27.4667 14.0267 27.4667 14.9467 27.4667 16C27.4667 20.1467 27.4667 22.2267 26.4 23.4267Z" fill="#181818" />
                                    <path d="M15.3733 20.0267H13.5067C12.9867 20.0267 12.5733 20.44 12.5733 20.96C12.5733 21.48 12.9867 21.8933 13.5067 21.8933H15.3733C15.8933 21.8933 16.3067 21.48 16.3067 20.96C16.3067 20.44 15.8933 20.0267 15.3733 20.0267Z" fill="#181818" />
                                    <path d="M23.44 20.0267H19.0933C18.5733 20.0267 18.16 20.44 18.16 20.96C18.16 21.48 18.5733 21.8933 19.0933 21.8933H23.44C23.96 21.8933 24.3733 21.48 24.3733 20.96C24.3733 20.44 23.96 20.0267 23.44 20.0267Z" fill="#181818" />
                                  </svg>
                                  <span>Картой онлайн</span>
                                </div>
                              </label>

                              {/* ЕРИП */}
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
                                <button
                                  className="change-link"
                                  type="button"
                                  onClick={() => setShowPersonalModal(true)}
                                >
                                  Изменить
                                </button>
                              )}
                            </div>

                            {loadingProfile ? (
                              <p>Загрузка...</p>
                            ) : (
                              <>
                                {(!profile?.first_name || !profile?.phone) && (
                                  <div className="alert alert-warning">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                      <path d="M12 2C6.49 2 2 6.49 2 12C2 17.51 6.49 22 12 22C17.51 22 22 17.51 22 12C22 6.49 17.51 2 12 2ZM11.3 8.28C11.3 7.89 11.61 7.58 12 7.58C12.39 7.58 12.7 7.89 12.7 8.28V12.47C12.7 12.86 12.39 13.17 12 13.17C11.61 13.17 11.3 12.86 11.3 12.47V8.28ZM12.83 15.72C12.83 16.18 12.46 16.56 11.99 16.56C11.52 16.56 11.15 16.18 11.15 15.72C11.15 15.26 11.52 14.88 11.99 14.88C12.46 14.88 12.83 15.25 12.83 15.71V15.72Z" fill="#B71C1C" />
                                    </svg>
                                    <span>Для таможенного оформления необходимо дополнить <strong style={{ cursor: 'pointer', textDecoration: 'underline' }} onClick={() => setShowPersonalModal(true)}>личные данные</strong>.</span>
                                  </div>
                                )}
                                <div className="recipient-info">
                                  {fullName && (
                                    <div className="info-row">
                                      <span className="info-label">ФИО</span>
                                      <span className="info-value">{fullName}</span>
                                    </div>
                                  )}
                                  {profile?.phone && (
                                    <div className="info-row">
                                      <span className="info-label">Телефон</span>
                                      <span className="info-value">+{profile.phone}</span>
                                    </div>
                                  )}
                                  {profile?.email && (
                                    <div className="info-row">
                                      <span className="info-label">Email</span>
                                      <span className="info-value">{profile.email}</span>
                                    </div>
                                  )}
                                </div>
                              </>
                            )}
                          </section>

                          <div className="for-white_bg">
                            {/* ===== ПАСПОРТНЫЕ ДАННЫЕ ===== */}
                            {profile && (
                              <section className="checkout-section">
                                <div className="section-header">
                                  <h2 className="section-title">Паспортные данные</h2>
                                  <button
                                    className="change-link"
                                    type="button"
                                    onClick={() => setShowPassportModal(true)}
                                  >
                                    {hasPassport ? 'Изменить' : 'Изменить'}
                                  </button>
                                </div>

                                {!hasPassport ? (
                                  <div className="alert alert-warning">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                      <path d="M12 2C6.49 2 2 6.49 2 12C2 17.51 6.49 22 12 22C17.51 22 22 17.51 22 12C22 6.49 17.51 2 12 2ZM11.3 8.28C11.3 7.89 11.61 7.58 12 7.58C12.39 7.58 12.7 7.89 12.7 8.28V12.47C12.7 12.86 12.39 13.17 12 13.17C11.61 13.17 11.3 12.86 11.3 12.47V8.28ZM12.83 15.72C12.83 16.18 12.46 16.56 11.99 16.56C11.52 16.56 11.15 16.18 11.15 15.72C11.15 15.26 11.52 14.88 11.99 14.88C12.46 14.88 12.83 15.25 12.83 15.71V15.72Z" fill="#B71C1C" />
                                    </svg>
                                    <span>Для таможенного оформления посылок необходимо добавить <strong style={{ cursor: 'pointer', textDecoration: 'underline' }} onClick={() => setShowPassportModal(true)}>паспортные данные</strong>.</span>
                                  </div>
                                ) : (
                                  <>
                                    <div className="passport-data">
                                      {/* ФИО */}
                                      {(profile.passport_data.last_name || profile.passport_data.first_name) && (
                                        <div className="data-row">
                                          <span className="data-label">ФИО</span>
                                          <span className="data-value">
                                            {showPassportData
                                              ? [profile.passport_data.last_name, profile.passport_data.first_name, profile.passport_data.middle_name].filter(Boolean).join(' ')
                                              : [mask(profile.passport_data.last_name, 5), mask(profile.passport_data.first_name, 3), profile.passport_data.middle_name ? mask(profile.passport_data.middle_name, 3) : ''].filter(Boolean).join(' ')
                                            }
                                          </span>
                                        </div>
                                      )}
                                      {/* Серия / Номер */}
                                      {profile.passport_data.series && profile.passport_data.number && (
                                        <div className="data-row data-row-split">
                                          <div className="data-column">
                                            <span className="data-label">Серия паспорта</span>
                                            <span className="data-value">{profile.passport_data.series}</span>
                                          </div>
                                          <div className="data-column">
                                            <span className="data-label">Номер паспорта</span>
                                            <span className="data-value">
                                              {showPassportData ? profile.passport_data.number : mask(profile.passport_data.number, 3)}
                                            </span>
                                          </div>
                                        </div>
                                      )}
                                      {/* Дата выдачи / Кем выдан */}
                                      {profile.passport_data.issue_date && (
                                        <div className="data-row data-row-split">
                                          <div className="data-column">
                                            <span className="data-label">Дата выдачи</span>
                                            <span className="data-value">
                                              {showPassportData ? formatDate(profile.passport_data.issue_date) : maskDate(profile.passport_data.issue_date)}
                                            </span>
                                          </div>
                                          {profile.passport_data.issued_by && (
                                            <div className="data-column">
                                              <span className="data-label">Кем выдан</span>
                                              <span className="data-value">
                                                {showPassportData ? profile.passport_data.issued_by : mask(profile.passport_data.issued_by, 4)}
                                              </span>
                                            </div>
                                          )}
                                        </div>
                                      )}
                                      {/* Идентификационный номер / Дата рождения */}
                                      {profile.passport_data.identification_number && (
                                        <div className="data-row data-row-split">
                                          <div className="data-column">
                                            <span className="data-label">Идентификационный номер</span>
                                            <span className="data-value">
                                              {showPassportData ? profile.passport_data.identification_number : mask(profile.passport_data.identification_number, 5)}
                                            </span>
                                          </div>
                                          {profile.passport_data.dob && (
                                            <div className="data-column">
                                              <span className="data-label">Дата рождения</span>
                                              <span className="data-value">
                                                {showPassportData ? formatDate(profile.passport_data.dob) : maskDate(profile.passport_data.dob)}
                                              </span>
                                            </div>
                                          )}
                                        </div>
                                      )}
                                    </div>
                                    <button className="show-data-btn" type="button"
                                      onClick={() => setShowPassportData(v => !v)}>
                                      {showPassportData ? 'Скрыть данные' : 'Показать данные'}
                                    </button>
                                  </>
                                )}
                              </section>
                            )}

                            {/* ===== АДРЕС ПРОПИСКИ ===== */}
                            {profile && hasAddress && (
                              <section className="checkout-section address-section">
                                <h2 className="section-title">Адрес прописки</h2>
                                <div className="address-data">
                                  {(passportAddress.region || passportAddress.city) && (
                                    <div className="data-row data-row-split">
                                      {passportAddress.region && (
                                        <div className="data-column">
                                          <span className="data-label">Область</span>
                                          <span className="data-value">{passportAddress.region}</span>
                                        </div>
                                      )}
                                      {passportAddress.city && (
                                        <div className="data-column">
                                          <span className="data-label">Город</span>
                                          <span className="data-value">{passportAddress.city}</span>
                                        </div>
                                      )}
                                    </div>
                                  )}
                                  {(passportAddress.postcode || passportAddress.street) && (
                                    <div className="data-row data-row-split">
                                      {passportAddress.postcode && (
                                        <div className="data-column">
                                          <span className="data-label">Индекс</span>
                                          <span className="data-value">{passportAddress.postcode}</span>
                                        </div>
                                      )}
                                      {passportAddress.street && (
                                        <div className="data-column">
                                          <span className="data-label">Улица</span>
                                          <span className="data-value">{passportAddress.street}</span>
                                        </div>
                                      )}
                                    </div>
                                  )}
                                  {(passportAddress.house || passportAddress.building) && (
                                    <div className="data-row data-row-split">
                                      {passportAddress.house && (
                                        <div className="data-column">
                                          <span className="data-label">Дом</span>
                                          <span className="data-value">{passportAddress.house}</span>
                                        </div>
                                      )}
                                      {passportAddress.building && (
                                        <div className="data-column">
                                          <span className="data-label">Корпус</span>
                                          <span className="data-value">{passportAddress.building}</span>
                                        </div>
                                      )}
                                    </div>
                                  )}
                                  {passportAddress.apartment && (
                                    <div className="data-row">
                                      <span className="data-label">Квартира</span>
                                      <span className="data-value">{passportAddress.apartment}</span>
                                    </div>
                                  )}
                                </div>
                              </section>
                            )}

                          </div>{/* /for-white_bg */}

                          {/* Ошибка оформления */}
                          {error && (
                            <div className="alert alert-warning" style={{ marginTop: '16px' }}>
                              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <path d="M12 2C6.49 2 2 6.49 2 12C2 17.51 6.49 22 12 22C17.51 22 22 17.51 22 12C22 6.49 17.51 2 12 2ZM11.3 8.28C11.3 7.89 11.61 7.58 12 7.58C12.39 7.58 12.7 7.89 12.7 8.28V12.47C12.7 12.86 12.39 13.17 12 13.17C11.61 13.17 11.3 12.86 11.3 12.47V8.28ZM12.83 15.72C12.83 16.18 12.46 16.56 11.99 16.56C11.52 16.56 11.15 16.18 11.15 15.72C11.15 15.26 11.52 14.88 11.99 14.88C12.46 14.88 12.83 15.25 12.83 15.71V15.72Z" fill="#B71C1C" />
                              </svg>
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
                        pvzDelivery={0}
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

      {/* Модалка выбора ПВЗ */}
      {showPvzModal && (
        <DeliveryPickupModal
          onClose={() => setShowPvzModal(false)}
          onSelect={handlePvzSelect}
        />
      )}

      {/* Модалка редактирования личных данных */}
      {showPersonalModal && (
        <EditPersonalDataModal
          profile={profile}
          onClose={() => setShowPersonalModal(false)}
          onSave={(updated) => {
            setProfile(updated)
            setShowPersonalModal(false)
          }}
        />
      )}

      {/* Модалка редактирования паспортных данных */}
      {showPassportModal && (
        <EditPassportModal
          profile={profile}
          onClose={() => setShowPassportModal(false)}
          onSave={(updated) => {
            setProfile(updated)
            setShowPassportModal(false)
          }}
        />
      )}

      {/* Модалка A1-верификации паспорта */}
      {a1Modal && (
        <>
          <SmsVerifyModal
            userPhone={profile?.phone ? `+${profile.phone}` : ''}
            callerNumber={a1CallerNumber || ''}
            onVerify={handleA1Verify}
            onResend={handleRequestA1}
            onClose={() => { setA1Modal(false); setA1Error(null) }}
            loading={a1Loading}
            error={a1Error || ''}
          />
          <div className="modal-backdrop fade show" style={{ zIndex: 1054 }} onClick={() => { setA1Modal(false); setA1Error(null) }} />
        </>
      )}
    </main>
  )
}