'use client';

import { useState } from 'react';

export default function PersonalData() {
  const [showPassportData, setShowPassportData] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState('address1');

  const addresses = [
    { id: 'address1', text: 'Минск, пр-т Пушкина, д. 28, под. 7, этаж 9, кв. 456' },
    { id: 'address2', text: 'Кричев, пер. Полевой, д. 8' },
    { id: 'address3', text: 'Могилев, ул. Кирова, д. 56, под. 2, этаж 1, кв. 23' }
  ];

  return (
    <div className="in_processing-layout persdat-layout">
      {/* Основной контент */}
      <section className="profile-data-main">
        <div className="profile-data">
          {/* Личные данные */}
          <div className="data-section">
            <div className="data-section__header">
              <h3 className="data-section__title">Личные данные</h3>
              <button 
                className="data-section__edit" 
                data-bs-toggle="modal" 
                data-bs-target="#editPersonalDataModal"
              >
                Изменить
              </button>
            </div>
            <div className="data-section__body">
              <div className="data-item">
                <label className="data-item__label">ФИО</label>
                <p className="data-item__value">Христорождественский Иннокентий Адольфович</p>
              </div>
              <div className="data-item">
                <label className="data-item__label">Дата рождения</label>
                <p className="data-item__value">22 Июня 1993</p>
              </div>
              <div className="data-item">
                <label className="data-item__label">Пол</label>
                <p className="data-item__value">Мужской</p>
              </div>
            </div>
          </div>

          {/* Телефон */}
          <div className="data-section">
            <div className="data-section__header">
              <h3 className="data-section__title">Телефон</h3>
              <button 
                className="data-section__edit" 
                data-bs-toggle="modal" 
                data-bs-target="#editPhoneModal"
              >
                Изменить
              </button>
            </div>
            <div className="data-section__body">
              <div className="data-item">
                <p className="data-item__value">+375 (12) 598-23-56</p>
              </div>
            </div>
          </div>

          {/* Почта */}
          <div className="data-section">
            <div className="data-section__header">
              <h3 className="data-section__title">Почта</h3>
              <button 
                className="data-section__edit" 
                data-bs-toggle="modal" 
                data-bs-target="#editEmailModal"
              >
                Изменить
              </button>
            </div>
            <div className="data-section__body">
              <div className="data-item">
                <p className="data-item__value">qwerty@gmail.com</p>
                <div className="data-item__status verified">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8 1.33334C4.32 1.33334 1.33334 4.32 1.33334 8C1.33334 11.68 4.32 14.6667 8 14.6667C11.68 14.6667 14.6667 11.68 14.6667 8C14.6667 4.32 11.68 1.33334 8 1.33334ZM11.0267 6.36L7.36001 10.0267C7.24667 10.14 7.09334 10.2 6.94001 10.2C6.78667 10.2 6.63334 10.14 6.52001 10.0267L4.97334 8.48C4.74 8.24667 4.74 7.86667 4.97334 7.63334C5.20667 7.4 5.58667 7.4 5.82001 7.63334L6.94001 8.75334L10.18 5.51334C10.4133 5.28 10.7933 5.28 11.0267 5.51334C11.26 5.74667 11.26 6.12667 11.0267 6.36Z" fill="#04A31A" />
                  </svg>
                  Почта подтверждена
                </div>
              </div>
            </div>
          </div>

          {/* Адреса доставки */}
          <div className="data-section">
            <div className="data-section__header">
              <h3 className="data-section__title">Адреса доставки</h3>
              <button 
                className="data-section__edit add" 
                data-bs-toggle="modal" 
                data-bs-target="#addAddressModal"
              >
                Добавить
              </button>
            </div>
            <div className="data-section__body">
              {addresses.map((address) => (
                <div key={address.id} className="address-item">
                  <label className="address-radio">
                    <input 
                      type="radio" 
                      name="delivery-address" 
                      checked={selectedAddress === address.id}
                      onChange={() => setSelectedAddress(address.id)}
                    />
                    <span className="radio-custom"></span>
                    <span className="address-text">{address.text}</span>
                  </label>
                  <button 
                    className="address-edit" 
                    data-bs-toggle="modal" 
                    data-bs-target="#editAddressModal"
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M4.34999 22H2.68999C2.29999 22 1.98999 21.69 1.98999 21.3V19.64C1.98999 18.25 1.98999 17.49 2.28999 16.76C2.58999 16.03 3.12999 15.49 4.10999 14.51L14.92 3.71C15.97 2.66 16.55 2.08 17.39 2.01C17.53 2 17.67 2 17.81 2.01C18.66 2.09 19.23 2.66 20.28 3.71C21.33 4.76 21.91 5.34 21.98 6.18C21.99 6.32 21.99 6.46 21.98 6.6C21.9 7.44 21.33 8.02 20.28 9.07L9.47999 19.87C8.49999 20.85 7.95999 21.39 7.22999 21.7C6.49999 22 5.72999 22 4.34999 22ZM3.38999 20.6H4.34999C5.59999 20.6 6.21999 20.6 6.69999 20.4C7.17999 20.2 7.61999 19.76 8.49999 18.88L19.3 8.08C20.09 7.29 20.57 6.81 20.6 6.47C20.6 6.41 20.6 6.36 20.6 6.3C20.57 5.96 20.09 5.48 19.3 4.69C18.5 3.89 18.03 3.42 17.69 3.39C17.63 3.39 17.57 3.39 17.52 3.39C17.18 3.42 16.7 3.9 15.91 4.69L5.10999 15.49C4.22999 16.37 3.77999 16.82 3.58999 17.29C3.38999 17.77 3.38999 18.39 3.38999 19.64V20.6Z" fill="#757575" />
                      <path d="M18.02 11.06C17.84 11.06 17.66 10.99 17.53 10.86L13.15 6.48002C12.88 6.21002 12.88 5.77002 13.15 5.49002C13.42 5.21002 13.86 5.22002 14.14 5.49002L18.52 9.87002C18.79 10.14 18.79 10.58 18.52 10.86C18.38 11 18.21 11.06 18.03 11.06H18.02Z" fill="#757575" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Боковая панель справа */}
      <aside className="profile-data-aside">
        <div className="passport-data">
          {/* Паспортные данные */}
          <div className="data-section">
            <div className="data-section__header">
              <h3 className="data-section__title">Паспортные данные</h3>
              <button 
                className="data-section__edit" 
                data-bs-toggle="modal" 
                data-bs-target="#editPassportModal"
              >
                Изменить
              </button>
            </div>
            <div className="data-section__body">
              <div className="data-item">
                <label className="data-item__label">ФИО</label>
                <p className={`data-item__value ${!showPassportData ? 'masked' : ''}`}>
                  {showPassportData ? 'Christorozzhdestvensky Innokenty' : 'Chris******* Inn*******'}
                </p>
              </div>

              <div className="data-item">
                <label className="data-item__label">Серия паспорта</label>
                <p className="data-item__value">HB</p>
              </div>

              <div className="data-item">
                <label className="data-item__label">Номер паспорта</label>
                <p className={`data-item__value ${!showPassportData ? 'masked' : ''}`}>
                  {showPassportData ? '5628901' : '562****'}
                </p>
              </div>

              <div className="data-item">
                <label className="data-item__label">Дата выдачи</label>
                <p className={`data-item__value ${!showPassportData ? 'masked' : ''}`}>
                  {showPassportData ? '08.12.2014' : '08.**,****'}
                </p>
              </div>

              <div className="data-item">
                <label className="data-item__label">Кем выдан</label>
                <p className={`data-item__value ${!showPassportData ? 'masked' : ''}`}>
                  {showPassportData ? 'Минским РУВД' : 'Минс**********'}
                </p>
              </div>

              <div className="data-item">
                <label className="data-item__label">Идентификационный номер</label>
                <p className={`data-item__value ${!showPassportData ? 'masked' : ''}`}>
                  {showPassportData ? '4220689A012PB4' : '42206*********'}
                </p>
              </div>

              <div className="data-item">
                <label className="data-item__label">Дата рождения</label>
                <p className={`data-item__value ${!showPassportData ? 'masked' : ''}`}>
                  {showPassportData ? '08.12.1989' : '08.**,****'}
                </p>
              </div>

              <button 
                className="data-toggle" 
                onClick={() => setShowPassportData(!showPassportData)}
              >
                {showPassportData ? 'Скрыть данные' : 'Показать данные'}
              </button>
            </div>
          </div>

          <div className="data-border"></div>

          {/* Адрес прописки */}
          <div className="data-section">
            <div className="data-section__header">
              <h3 className="data-section__title">Адрес прописки</h3>
            </div>
            <div className="data-section__body">
              <div className="data-item">
                <label className="data-item__label">Область</label>
                <p className="data-item__value">Минская</p>
              </div>

              <div className="data-item">
                <label className="data-item__label">Город</label>
                <p className="data-item__value">Минск</p>
              </div>

              <div className="data-item">
                <label className="data-item__label">Индекс</label>
                <p className="data-item__value">220658</p>
              </div>

              <div className="data-item">
                <label className="data-item__label">Улица</label>
                <p className="data-item__value">Кирова</p>
              </div>

              <div className="data-item">
                <label className="data-item__label">Дом</label>
                <p className="data-item__value">45</p>
              </div>

              <div className="data-item">
                <label className="data-item__label">Корпус</label>
                <p className="data-item__value">0</p>
              </div>

              <div className="data-item">
                <label className="data-item__label">Квартира</label>
                <p className="data-item__value">43</p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
