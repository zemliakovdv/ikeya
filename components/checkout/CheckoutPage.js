'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import CartSummary from '@/components/cart/CartSummary';
import DeliveryPickupModal from '@/components/profile/modals/DeliveryPickupModal';
import EditPersonalDataModal from '@/components/profile/modals/EditPersonalDataModal';
import EditPassportModal from '@/components/profile/modals/EditPassportModal';
import { getProfile, checkout } from '@/lib/api/cart';

export default function CheckoutPage() {
  const router = useRouter()
  const { token } = useAuth()
  const { cart, totals, items } = useCart()

  // Данные
  const [profile, setProfile] = useState(null)
  const [loadingProfile, setLoadingProfile] = useState(true)

  // Форма
  const [selectedPvz, setSelectedPvz] = useState(null)
  const [paymentMethod, setPaymentMethod] = useState('card')
  const [showPvzModal, setShowPvzModal] = useState(false)
  const [showPassportData, setShowPassportData] = useState(false)
  const [showPersonalModal, setShowPersonalModal] = useState(false)
  const [showPassportModal, setShowPassportModal] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  // Загрузка профиля
  useEffect(() => {
    if (!token) { setLoadingProfile(false); return }
    getProfile(token)
      .then(data => setProfile(data))
      .catch(() => setProfile(null))
      .finally(() => setLoadingProfile(false))
  }, [token])

  // Суммы из корзины
  const subtotal = parseFloat(totals?.subtotal_new_byn || totals?.subtotal || 0)
  const promoDiscount = parseFloat(totals?.discount_total_byn || totals?.discount || 0)
  const deliveryCost = parseFloat(totals?.delivery || 0)
  const totalWeight = totals?.total_weight_kg || 0

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
  const canCheckout = !!(fullName && profile?.phone && selectedPvz && items.length > 0 && !submitting)

  function handlePvzSelect(pvz) {
    setSelectedPvz(pvz)
    setShowPvzModal(false)
  }

  async function handleCheckout() {
    if (!canCheckout) return
    setSubmitting(true)
    setError(null)

    try {
      const orderData = {
        full_name: fullName,
        phone: profile.phone,
        delivery_type: 'pickup',
        payment_method: paymentMethod,
        pickup_point_id: selectedPvz.id,
      }

      if (hasPassport) {
        orderData.passport = {
          passport_number: `${profile.passport_data.series}${profile.passport_data.number}`,
          full_name: [profile.passport_data.last_name, profile.passport_data.first_name, profile.passport_data.middle_name].filter(Boolean).join(' '),
          issue_date: profile.passport_data.issue_date,
        }
      }

      const response = await checkout(orderData, token)
      router.push(`/order-success?order_id=${response.order_id}`)
    } catch (err) {
      setError(err.message || 'Ошибка при оформлении заказа')
    } finally {
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
                            <div className="section-header">
                              <h2 className="section-title">Выберите способ получения</h2>
                            </div>

                            {selectedPvz ? (
                              <>
                                <div className="section-header" style={{ marginTop: '12px' }}>
                                  <div className="pickup-header-left">
                                    <div className="pickup-info">
                                      <h3 className="section-title">{selectedPvz.name}</h3>
                                      <p className="pickup-address">{selectedPvz.city}, {selectedPvz.address}</p>
                                      {selectedPvz.working_hours && (
                                        <p className="pickup-hours">{selectedPvz.working_hours}</p>
                                      )}
                                      {selectedPvz.phone && (
                                        <p className="pickup-phone">{selectedPvz.phone}</p>
                                      )}
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

                                <div className="alert alert-info" style={{ marginTop: '12px' }}>
                                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                    <path d="M12 2C6.49 2 2 6.49 2 12C2 17.51 6.49 22 12 22C17.51 22 22 17.51 22 12C22 6.49 17.51 2 12 2ZM12.7 15.72C12.7 16.11 12.39 16.42 12 16.42C11.61 16.42 11.3 16.11 11.3 15.72V11.53C11.3 11.14 11.61 10.83 12 10.83C12.39 10.83 12.7 11.14 12.7 11.53V15.72ZM12 9.12C11.54 9.12 11.16 8.75 11.16 8.29C11.16 7.82 11.53 7.44 12 7.44C12.47 7.44 12.84 7.81 12.84 8.28C12.84 8.75 12.47 9.12 12 9.12Z" fill="#0058A3" />
                                  </svg>
                                  <span>Для получения заказа необходим паспорт</span>
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
                                    <span>Для таможенного оформления необходимо дополнить <strong>личные данные</strong>.</span>
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
                                  <span>Необходимо добавить <strong>паспортные данные</strong> в профиле.</span>
                                </div>
                              ) : (
                                <>
                                  <div className="passport-data">
                                    {profile.passport_data.series && profile.passport_data.number && (
                                      <div className="data-row data-row-split">
                                        <div className="data-column">
                                          <span className="data-label">Серия</span>
                                          <span className="data-value">{profile.passport_data.series}</span>
                                        </div>
                                        <div className="data-column">
                                          <span className="data-label">Номер</span>
                                          <span className="data-value">
                                            {showPassportData ? profile.passport_data.number : `${profile.passport_data.number.slice(0, 3)}****`}
                                          </span>
                                        </div>
                                      </div>
                                    )}
                                    {profile.passport_data.issue_date && (
                                      <div className="data-row">
                                        <span className="data-label">Дата выдачи</span>
                                        <span className="data-value">
                                          {showPassportData ? profile.passport_data.issue_date : '**.**,****'}
                                        </span>
                                      </div>
                                    )}
                                    {profile.passport_data.issued_by && (
                                      <div className="data-row">
                                        <span className="data-label">Кем выдан</span>
                                        <span className="data-value">
                                          {showPassportData ? profile.passport_data.issued_by : `${profile.passport_data.issued_by.slice(0, 4)}****`}
                                        </span>
                                      </div>
                                    )}
                                    {profile.passport_data.identification_number && (
                                      <div className="data-row">
                                        <span className="data-label">Идентификационный номер</span>
                                        <span className="data-value">
                                          {showPassportData ? profile.passport_data.identification_number : `${profile.passport_data.identification_number.slice(0, 5)}*****`}
                                        </span>
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
                        itemCount={items.length}
                        totalWeight={totalWeight}
                        canCheckout={canCheckout}
                        onCheckout={handleCheckout}
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
    </main>
  )
}