'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import CartSummary from '@/components/cart/CartSummary';

export default function CheckoutFilledErrorPage() {
  const router = useRouter();
  const [paymentMethod, setPaymentMethod] = useState('card_online');
  const [showPassportData, setShowPassportData] = useState(false);

  const handleBack = () => {
    router.push('/cart');
  };

  const handleCheckout = () => {
    console.log('Proceed to order confirmation');
    router.push('/order-success');
  };

  return (
    <main className="korzina">
      <section className="zakaz">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="zakaz-inner">
                {/* Заголовок с кнопкой назад */}
                <div className="zakaz-title">
                  <svg 
                    width="24" 
                    height="24" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    xmlns="http://www.w3.org/2000/svg"
                    onClick={handleBack}
                    style={{ cursor: 'pointer' }}
                  >
                    <path d="M8.67004 12C8.67004 10.88 11.71 8.19999 14.25 6.14999C14.54 5.91999 14.96 5.95999 15.19 6.24999C15.42 6.53999 15.38 6.95999 15.09 7.18999C12.86 8.98999 10.35 11.29 10.02 12C10.35 12.71 12.86 15.01 15.09 16.81C15.38 17.04 15.42 17.46 15.19 17.75C14.96 18.04 14.54 18.08 14.25 17.85C11.7 15.8 8.67004 13.11 8.67004 12Z" fill="#181818" />
                  </svg>
                  <h2>Оформление заказа</h2>
                </div>

                <div className="zakaz-content">
                  <div className="cart">
                    <div className="cart-layout">
                      {/* Левая колонка: форма оформления */}
                      <div className="cart-main">
                        <div className="checkout-container">
                          {/* Способ получения с ОШИБКОЙ */}
                          <section className="checkout-section">
                            <div className="section-header">
                              <h2 className="section-title">Выберите способ получения</h2>
                            </div>

                            {/* БЛОК ОШИБКИ */}
                            <div className="checkout-section_errori">
                              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 2C6.49 2 2 6.49 2 12C2 17.51 6.49 22 12 22C17.51 22 22 17.51 22 12C22 6.49 17.51 2 12 2ZM11.3 8.28C11.3 7.89 11.61 7.58 12 7.58C12.39 7.58 12.7 7.89 12.7 8.28V12.47C12.7 12.86 12.39 13.17 12 13.17C11.61 13.17 11.3 12.86 11.3 12.47V8.28ZM12.83 15.72C12.83 16.18 12.46 16.56 11.99 16.56C11.52 16.56 11.15 16.18 11.15 15.72C11.15 15.26 11.52 14.88 11.99 14.88C12.46 14.88 12.83 15.25 12.83 15.71V15.72Z" fill="#B71C1C" />
                              </svg>
                              <div className="checkou-errori_content">
                                <p>Некоторые объекты недоступны из-за превышения весогабаритных характеристик заказа</p>
                                <a href="#" data-bs-toggle="modal" data-bs-target="#nondeliveryModal">Подробнее</a>
                              </div>
                            </div>

                            <button 
                              className="select-button" 
                              data-bs-toggle="modal"
                              data-bs-target="#deliveryModal"
                            >
                              Выбрать
                            </button>
                          </section>

                          {/* Способ оплаты */}
                          <section className="checkout-section">
                            <div className="section-header">
                              <h2 className="section-title">Способ оплаты</h2>
                            </div>

                            <div className="payment-methods">
                              {/* Картой онлайн */}
                              <label className="payment-method">
                                <input 
                                  type="radio" 
                                  name="payment_method"
                                  value="card_online" 
                                  checked={paymentMethod === 'card_online'}
                                  onChange={(e) => setPaymentMethod(e.target.value)}
                                />
                                <div className="payment-card">
                                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M27.7867 7.33333C27.5467 7.05333 27.2667 6.8 26.9867 6.57333C25.1733 5.14667 22.7333 5.14667 17.8667 5.14667H14.1467C9.27999 5.14667 6.82666 5.14667 5.02666 6.57333C4.73333 6.8 4.46666 7.05333 4.22666 7.33333C2.67999 9.06667 2.67999 11.3867 2.67999 16C2.67999 20.6133 2.67999 22.9333 4.22666 24.6667C4.46666 24.9333 4.74666 25.2 5.02666 25.4267C6.83999 26.8533 9.27999 26.8533 14.1467 26.8533H17.8667C22.7333 26.8533 25.1867 26.8533 27 25.4267C27.2933 25.2 27.56 24.9467 27.8 24.6667C29.3467 22.9333 29.3467 20.6133 29.3467 16C29.3467 11.3867 29.3467 9.06667 27.8 7.33333H27.7867ZM5.58666 8.57333C5.75999 8.37333 5.94666 8.2 6.15999 8.04C7.46666 7.01333 9.69333 7.01333 14.1333 7.01333H17.8533C22.2933 7.01333 24.52 7.01333 25.8267 8.04C26.0267 8.2 26.2267 8.38667 26.4 8.57333C26.96 9.2 27.2267 10.08 27.3467 11.3467H4.65333C4.78666 10.0667 5.03999 9.2 5.59999 8.57333H5.58666ZM26.4 23.4267C26.2267 23.6267 26.0267 23.8 25.8267 23.96C24.52 24.9867 22.2933 24.9867 17.8533 24.9867H14.1333C9.69333 24.9867 7.46666 24.9867 6.15999 23.96C5.94666 23.8 5.75999 23.6133 5.58666 23.4267C4.51999 22.2267 4.51999 20.1467 4.51999 16C4.51999 14.9467 4.51999 14.0133 4.53333 13.2133H27.4533C27.4667 14.0267 27.4667 14.9467 27.4667 16C27.4667 20.1467 27.4667 22.2267 26.4 23.4267Z" fill="#181818" />
                                    <path d="M15.3733 20.0267H13.5067C12.9867 20.0267 12.5733 20.44 12.5733 20.96C12.5733 21.48 12.9867 21.8933 13.5067 21.8933H15.3733C15.8933 21.8933 16.3067 21.48 16.3067 20.96C16.3067 20.44 15.8933 20.0267 15.3733 20.0267Z" fill="#181818" />
                                    <path d="M23.44 20.0267H19.0933C18.5733 20.0267 18.16 20.44 18.16 20.96C18.16 21.48 18.5733 21.8933 19.0933 21.8933H23.44C23.96 21.8933 24.3733 21.48 24.3733 20.96C24.3733 20.44 23.96 20.0267 23.44 20.0267Z" fill="#181818" />
                                  </svg>
                                  <span>Картой онлайн</span>
                                </div>
                              </label>

                              {/* Картой рассрочки */}
                              <label className="payment-method">
                                <input 
                                  type="radio" 
                                  name="payment_method"
                                  value="card_installment"
                                  checked={paymentMethod === 'card_installment'}
                                  onChange={(e) => setPaymentMethod(e.target.value)}
                                />
                                <div className="payment-card">
                                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M16.6267 24.9867H14.1467C9.70666 24.9867 7.47999 24.9867 6.17333 23.96C5.97333 23.8 5.77333 23.6133 5.59999 23.4267C4.53333 22.2267 4.53333 20.1467 4.53333 16C4.53333 14.9467 4.53333 14.0133 4.54666 13.2133H27.4533C27.4533 13.5067 27.4533 13.8133 27.4667 14.1467C27.4667 14.6667 27.88 15.08 28.4 15.0667C28.92 15.0667 29.32 14.64 29.32 14.1333C29.2933 11.04 29.1733 8.89333 27.7867 7.33333C27.5467 7.06667 27.2667 6.8 26.9867 6.57333C25.1733 5.14667 22.7333 5.14667 17.8667 5.14667H14.1467C9.27999 5.14667 6.82666 5.14667 5.02666 6.57333C4.73333 6.8 4.46666 7.05333 4.22666 7.33333C2.67999 9.06667 2.67999 11.3867 2.67999 16C2.67999 20.6133 2.67999 22.9333 4.22666 24.6667C4.46666 24.9467 4.74666 25.2 5.02666 25.4267C6.83999 26.8533 9.27999 26.8533 14.1467 26.8533H16.6267C17.1467 26.8533 17.56 26.44 17.56 25.92C17.56 25.4 17.1467 24.9867 16.6267 24.9867ZM5.59999 8.57333C5.77333 8.37333 5.95999 8.2 6.17333 8.04C7.47999 7.01333 9.70666 7.01333 14.1467 7.01333H17.8667C22.3067 7.01333 24.5333 7.01333 25.84 8.04C26.0533 8.2 26.24 8.38667 26.4133 8.57333C26.9733 9.2 27.24 10.04 27.36 11.3467H4.65333C4.78666 10.0667 5.03999 9.2 5.59999 8.57333Z" fill="#757575" />
                                    <path d="M28.4 20.6533H24.9867V17.24C24.9867 16.72 24.5733 16.3067 24.0533 16.3067C23.5333 16.3067 23.12 16.72 23.12 17.24V20.6533H19.7067C19.1867 20.6533 18.7733 21.0667 18.7733 21.5867C18.7733 22.1067 19.1867 22.52 19.7067 22.52H23.12V25.9333C23.12 26.4533 23.5333 26.8667 24.0533 26.8667C24.5733 26.8667 24.9867 26.4533 24.9867 25.9333V22.52H28.4C28.92 22.52 29.3333 22.1067 29.3333 21.5867C29.3333 21.0667 28.92 20.6533 28.4 20.6533Z" fill="#757575" />
                                  </svg>
                                  <span>Картой рассрочки</span>
                                </div>
                              </label>

                              {/* QR-код */}
                              <label className="payment-method">
                                <input 
                                  type="radio" 
                                  name="payment_method" 
                                  value="qr"
                                  checked={paymentMethod === 'qr'}
                                  onChange={(e) => setPaymentMethod(e.target.value)}
                                />
                                <div className="payment-card">
                                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M7.73335 12.8C5.60002 12.8 4.42669 12.8 3.54669 11.92C2.66669 11.04 2.66669 9.86666 2.66669 7.73332C2.66669 5.59999 2.66669 4.42666 3.54669 3.54666C4.42669 2.66666 5.60002 2.66666 7.73335 2.66666C9.86669 2.66666 11.04 2.66666 11.92 3.54666C12.8 4.42666 12.8 5.59999 12.8 7.73332C12.8 9.86666 12.8 11.04 11.92 11.92C11.04 12.8 9.86669 12.8 7.73335 12.8ZM7.73335 4.53332C6.14669 4.53332 5.20002 4.53332 4.86669 4.86666C4.53335 5.19999 4.53335 6.15999 4.53335 7.73332C4.53335 9.30666 4.53335 10.2667 4.86669 10.6C5.20002 10.9333 6.16002 10.9333 7.73335 10.9333C9.30669 10.9333 10.2667 10.9333 10.6 10.6C10.9334 10.2667 10.9334 9.30666 10.9334 7.73332C10.9334 6.15999 10.9334 5.19999 10.6 4.86666C10.2667 4.53332 9.30669 4.53332 7.73335 4.53332Z" fill="#757575" />
                                    <path d="M7.73335 29.3333C5.60002 29.3333 4.42669 29.3333 3.54669 28.4533C2.66669 27.5733 2.66669 26.4 2.66669 24.2667C2.66669 22.1333 2.66669 20.96 3.54669 20.08C4.42669 19.2 5.60002 19.2 7.73335 19.2C9.86669 19.2 11.04 19.2 11.92 20.08C12.8 20.96 12.8 22.1333 12.8 24.2667C12.8 26.4 12.8 27.5733 11.92 28.4533C11.04 29.3333 9.86669 29.3333 7.73335 29.3333ZM7.73335 21.0667C6.14669 21.0667 5.20002 21.0667 4.86669 21.4C4.53335 21.7333 4.53335 22.6933 4.53335 24.2667C4.53335 25.84 4.53335 26.8 4.86669 27.1333C5.20002 27.4667 6.16002 27.4667 7.73335 27.4667C9.30669 27.4667 10.2667 27.4667 10.6 27.1333C10.9334 26.8 10.9334 25.84 10.9334 24.2667C10.9334 22.6933 10.9334 21.7333 10.6 21.4C10.2667 21.0667 9.30669 21.0667 7.73335 21.0667Z" fill="#757575" />
                                    <path d="M11.8667 16.9333H3.60002C3.08002 16.9333 2.66669 16.52 2.66669 16C2.66669 15.48 3.08002 15.0667 3.60002 15.0667H11.8667C12.3867 15.0667 12.8 15.48 12.8 16C12.8 16.52 12.3867 16.9333 11.8667 16.9333Z" fill="#757575" />
                                    <path d="M16 11.4133C15.48 11.4133 15.0667 11 15.0667 10.48V3.59999C15.0667 3.07999 15.48 2.66666 16 2.66666C16.52 2.66666 16.9333 3.07999 16.9333 3.59999V10.4933C16.9333 11.0133 16.52 11.4267 16 11.4267V11.4133Z" fill="#757575" />
                                    <path d="M24.2667 12.8C22.1333 12.8 20.96 12.8 20.08 11.92C19.2 11.04 19.2 9.86666 19.2 7.73332C19.2 5.59999 19.2 4.42666 20.08 3.54666C20.96 2.66666 22.1333 2.66666 24.2667 2.66666C26.4 2.66666 27.5733 2.66666 28.4533 3.54666C29.3333 4.42666 29.3333 5.59999 29.3333 7.73332C29.3333 9.86666 29.3333 11.04 28.4533 11.92C27.5733 12.8 26.4 12.8 24.2667 12.8ZM24.2667 4.53332C22.68 4.53332 21.7333 4.53332 21.4 4.86666C21.0667 5.19999 21.0667 6.15999 21.0667 7.73332C21.0667 9.30666 21.0667 10.2667 21.4 10.6C21.7333 10.9333 22.6933 10.9333 24.2667 10.9333C25.84 10.9333 26.8 10.9333 27.1333 10.6C27.4667 10.2667 27.4667 9.30666 27.4667 7.73332C27.4667 6.15999 27.4667 5.19999 27.1333 4.86666C26.8 4.53332 25.84 4.53332 24.2667 4.53332Z" fill="#757575" />
                                    <path d="M25.64 29.3333C25.1333 29.3333 24.72 28.9333 24.7067 28.4267C24.6933 27.9067 25.0933 27.48 25.6133 27.4667C26.64 27.44 26.96 27.32 27.1333 27.1467C27.4667 26.8133 27.4667 25.8533 27.4667 24.2667C27.4667 22.68 27.4667 21.72 27.1333 21.3867C26.8 21.0533 25.84 21.0533 24.2667 21.0533C23.7467 21.0533 23.3333 20.64 23.3333 20.12C23.3333 19.6 23.7467 19.1867 24.2667 19.1867C26.4 19.1867 27.5733 19.1867 28.4533 20.0667C29.3333 20.9467 29.3333 22.12 29.3333 24.2533C29.3333 26.3867 29.3333 27.56 28.4533 28.44C27.7067 29.1867 26.6667 29.28 25.6667 29.3067H25.64V29.3333ZM21.5066 29.3333H20.1333C19.6133 29.3333 19.2 28.92 19.2 28.4C19.2 27.88 19.6133 27.4667 20.1333 27.4667H21.5066C22.0266 27.4667 22.44 27.88 22.44 28.4C22.44 28.92 22.0266 29.3333 21.5066 29.3333ZM16 28.6933C15.48 28.6933 15.0667 28.28 15.0667 27.76V23.9467C15.0667 23.4267 15.48 23.0133 16 23.0133C16.52 23.0133 16.9333 23.4267 16.9333 23.9467V27.76C16.9333 28.28 16.52 28.6933 16 28.6933ZM24.2667 26.5733C23.7467 26.5733 23.3333 26.16 23.3333 25.64C23.3333 25.4 23.1333 25.1867 22.88 25.1867C21.4133 25.1867 19.1867 25.1867 19.1867 22.1867V20.12C19.1867 19.6 19.6 19.1867 20.12 19.1867C20.64 19.1867 21.0533 19.6 21.0533 20.12V22.1867C21.0533 23.2133 21.1066 23.32 22.88 23.32C24.1467 23.32 25.1866 24.36 25.1866 25.6267C25.1866 26.1467 24.7733 26.56 24.2533 26.56L24.2667 26.5733ZM16 21.0667C15.48 21.0667 15.0667 20.6533 15.0667 20.1333C15.0667 18 15.0667 16.8267 15.9467 15.9467C16.8267 15.0667 18 15.0667 20.1333 15.0667H28.4C28.92 15.0667 29.3333 15.48 29.3333 16C29.3333 16.52 28.92 16.9333 28.4 16.9333H20.1333C18.5467 16.9333 17.6 16.9333 17.2666 17.2667C16.9333 17.6 16.9333 18.56 16.9333 20.1333C16.9333 20.6533 16.52 21.0667 16 21.0667Z" fill="#757575" />
                                  </svg>
                                  <span>QR-код</span>
                                </div>
                              </label>

                              {/* ЕРИП */}
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

                              {/* Оплати */}
                              <label className="payment-method">
                                <input 
                                  type="radio" 
                                  name="payment_method" 
                                  value="oplati"
                                  checked={paymentMethod === 'oplati'}
                                  onChange={(e) => setPaymentMethod(e.target.value)}
                                />
                                <div className="payment-card">
                                  <img src="/assets/img/cart/oplati.png" alt="Оплати" width="89" height="48" />
                                </div>
                              </label>
                            </div>
                          </section>

                          {/* Получатель */}
                          <section className="checkout-section">
                            <div className="section-header">
                              <h2 className="section-title">Получатель</h2>
                              <button 
                                className="change-link" 
                                data-bs-toggle="modal"
                                data-bs-target="#editPersonalDataModal"
                              >
                                Изменить
                              </button>
                            </div>

                            {/* Скрытый warning - данные заполнены */}
                            <div className="alert alert-warning" style={{ display: 'none' }}>
                              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 2C6.49 2 2 6.49 2 12C2 17.51 6.49 22 12 22C17.51 22 22 17.51 22 12C22 6.49 17.51 2 12 2ZM11.3 8.28C11.3 7.89 11.61 7.58 12 7.58C12.39 7.58 12.7 7.89 12.7 8.28V12.47C12.7 12.86 12.39 13.17 12 13.17C11.61 13.17 11.3 12.86 11.3 12.47V8.28ZM12.83 15.72C12.83 16.18 12.46 16.56 11.99 16.56C11.52 16.56 11.15 16.18 11.15 15.72C11.15 15.26 11.52 14.88 11.99 14.88C12.46 14.88 12.83 15.25 12.83 15.71V15.72Z" fill="#B71C1C" />
                              </svg>
                              <span>Для таможенного оформления посылок необходимо дополнить <strong>личные данные</strong>.</span>
                            </div>

                            <div className="recipient-info">
                              <div className="info-row">
                                <span className="info-label">ФИО</span>
                                <span className="info-value">Христорождественский Иннокентий Адольфович</span>
                              </div>

                              <div className="info-row">
                                <span className="info-label">Телефон</span>
                                <span className="info-value">+375 (12) 598-23-56</span>
                              </div>
                            </div>
                          </section>

                          {/* Паспортные данные */}
                          <section className="checkout-section passport-section">
                            <div className="section-header">
                              <h2 className="section-title">Паспортные данные</h2>
                              <button 
                                className="change-link" 
                                data-bs-toggle="modal"
                                data-bs-target="#editPassportModal"
                              >
                                Изменить
                              </button>
                            </div>

                            <div className="passport-data">
                              {/* ФИО */}
                              <div className="data-row">
                                <span className="data-label">ФИО</span>
                                <span className="data-value">
                                  {showPassportData ? 'Christorozzhdestvensky Innokenty' : 'Chris******* Inn*******'}
                                </span>
                              </div>

                              {/* Серия и номер паспорта */}
                              <div className="data-row data-row-split">
                                <div className="data-column">
                                  <span className="data-label">Серия паспорта</span>
                                  <span className="data-value">HB</span>
                                </div>
                                <div className="data-column">
                                  <span className="data-label">Номер паспорта</span>
                                  <span className="data-value">
                                    {showPassportData ? '5628901' : '562****'}
                                  </span>
                                </div>
                              </div>

                              {/* Дата выдачи и кем выдан */}
                              <div className="data-row data-row-split">
                                <div className="data-column">
                                  <span className="data-label">Дата выдачи</span>
                                  <span className="data-value">
                                    {showPassportData ? '08.12.2014' : '08.**,****'}
                                  </span>
                                </div>
                                <div className="data-column">
                                  <span className="data-label">Кем выдан</span>
                                  <span className="data-value">
                                    {showPassportData ? 'Минским РУВД' : 'Минс**********'}
                                  </span>
                                </div>
                              </div>

                              {/* Идентификационный номер и дата рождения */}
                              <div className="data-row data-row-split">
                                <div className="data-column">
                                  <span className="data-label">Идентификационный номер</span>
                                  <span className="data-value">
                                    {showPassportData ? '4220689A012PB4' : '42206*********'}
                                  </span>
                                </div>
                                <div className="data-column">
                                  <span className="data-label">Дата рождения</span>
                                  <span className="data-value">
                                    {showPassportData ? '08.12.1989' : '08.**,****'}
                                  </span>
                                </div>
                              </div>

                              {/* Кнопка показать/скрыть данные */}
                              <button 
                                className="show-data-btn" 
                                onClick={() => setShowPassportData(!showPassportData)}
                              >
                                <span>{showPassportData ? 'Скрыть данные' : 'Показать данные'}</span>
                              </button>
                            </div>
                          </section>

                          {/* Адрес прописки */}
                          <section className="checkout-section address-section">
                            <h2 className="section-title">Адрес прописки</h2>

                            <div className="address-data">
                              {/* Область и город */}
                              <div className="data-row data-row-split">
                                <div className="data-column">
                                  <span className="data-label">Область</span>
                                  <span className="data-value">Минская</span>
                                </div>
                                <div className="data-column">
                                  <span className="data-label">Город</span>
                                  <span className="data-value">Минск</span>
                                </div>
                              </div>

                              {/* Индекс и улица */}
                              <div className="data-row data-row-split">
                                <div className="data-column">
                                  <span className="data-label">Индекс</span>
                                  <span className="data-value">220658</span>
                                </div>
                                <div className="data-column">
                                  <span className="data-label">Улица</span>
                                  <span className="data-value">Кирова</span>
                                </div>
                              </div>

                              {/* Дом и корпус */}
                              <div className="data-row data-row-split">
                                <div className="data-column">
                                  <span className="data-label">Дом</span>
                                  <span className="data-value">45</span>
                                </div>
                                <div className="data-column">
                                  <span className="data-label">Корпус</span>
                                  <span className="data-value">0</span>
                                </div>
                              </div>

                              {/* Квартира */}
                              <div className="data-row">
                                <span className="data-label">Квартира</span>
                                <span className="data-value">43</span>
                              </div>
                            </div>
                          </section>
                        </div>
                      </div>

                      {/* Правая колонка: итог заказа */}
                      <CartSummary
                        subtotal={2430.93}
                        promoDiscount={0}
                        delivery={56.00}
                        pvzDelivery={5.00}
                        total={2491.93}
                        itemCount={3}
                        totalWeight={4.5}
                        canCheckout={true}
                        onCheckout={handleCheckout}
                        checkoutButtonText="Оформить заказ"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
