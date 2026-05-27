// components/profile/PersonalData.js
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getProfile, updateProfile } from '@/lib/api/account';

import EditPersonalDataModal from './modals/EditPersonalDataModal';
import DeliveryModal from '@/components/delivery/modal/DeliveryModal';
import EditPhoneModal from './modals/EditPhoneModal';
import EditEmailModal from './modals/EditEmailModal';
import EditPassportModal from './modals/EditPassportModal';

// Маскирует строку: показывает первые N символов, остальное — звёздочки
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

export default function PersonalData() {
  const { isAuth, isHydrated, setUser, user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPassportData, setShowPassportData] = useState(false);
  const [modal, setModal] = useState(null);

  // Список адресов доставки из localStorage
  const [addresses, setAddresses] = useState(() => {
    if (typeof window === 'undefined') return [];
    try {
      return JSON.parse(localStorage.getItem('delivery_addresses') || '[]');
    } catch { return []; }
  });

  const [activeAddressId, setActiveAddressId] = useState(() => {
    if (typeof window === 'undefined') return null;
    try {
      const saved = JSON.parse(localStorage.getItem('delivery_addresses') || '[]');
      return localStorage.getItem('delivery_address_active') || saved[0]?.id || null;
    } catch { return null; }
  });

  // Загружаем адреса из localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const saved = JSON.parse(localStorage.getItem('delivery_addresses') || '[]');
      const active = localStorage.getItem('delivery_address_active');
      setAddresses(saved);
      setActiveAddressId(active || saved[0]?.id || null);
    } catch { }
  }, []);

  // Сохраняем адреса в localStorage при изменении
  useEffect(() => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('delivery_addresses', JSON.stringify(addresses));
  }, [addresses]);

  useEffect(() => {
    if (typeof window === 'undefined' || !activeAddressId) return;
    localStorage.setItem('delivery_address_active', activeAddressId);
  }, [activeAddressId]);

  function handleAddAddress(point) {
    // Сохраняем оригинальный ID пункта выдачи от провайдера (нужен бэку при чекауте)
    // localId используется только как ключ в нашем списке адресов
    const localId = point.id || point.external_id || `${point.provider}-${Date.now()}`;
    const newAddress = {
      ...point,
      localId,           // ключ для списка адресов в localStorage
      pickup_point_id: point.id,  // оригинальный ID для передачи в checkout
    };
    setAddresses(prev => {
      // Не добавляем дубликаты
      if (prev.find(a => a.localId === localId)) return prev;
      return [...prev, newAddress];
    });
    setActiveAddressId(localId);
  }

  function handleDeleteAddress(localId) {
    setAddresses(prev => {
      const next = prev.filter(a => a.localId !== localId);
      if (activeAddressId === localId) {
        setActiveAddressId(next[0]?.localId || null);
      }
      return next;
    });
  }

  useEffect(() => {
    if (!isHydrated || !isAuth) return;
    getProfile()
      .then(data => {
        setProfile(data);
      })
      .catch(e => console.error('PersonalData: ошибка загрузки профиля', e))
      .finally(() => setLoading(false));
  }, [isHydrated, isAuth]);

  // onSave вызывается из EditPersonalDataModal с (updatedProfile, firstName)
  function handleSave(updated, firstName) {
    if (updated) {
      setProfile(updated);
      // Сохраняем first_name в user — хедер и сайдбар читают user?.first_name
      const name = firstName || updated.first_name;
      if (name) {
        setUser({ ...user, first_name: name });
      }
    }
  }

  const closeModal = () => setModal(null);

  function formatPhone(raw) {
    if (!raw) return '—';
    const d = raw.replace(/\D/g, '');
    if (d.length === 12) {
      return `+${d.slice(0, 3)} (${d.slice(3, 5)}) ${d.slice(5, 8)}-${d.slice(8, 10)}-${d.slice(10, 12)}`;
    }
    return `+${d}`;
  }

  function formatDate(raw) {
    if (!raw) return '—';
    const [y, m, d] = raw.split('-');
    return `${d}.${m}.${y}`;
  }

function formatGender(val) {
  if (!val) return '—';
  const v = val.toLowerCase();
  if (v === 'male') return 'Мужской';
  if (v === 'female') return 'Женский';
  return '—';
}

  function formatFullName() {
    const parts = [profile?.last_name, profile?.first_name, profile?.middle_name].filter(Boolean);
    return parts.length ? parts.join(' ') : null;
  }

  // Определяем заполненность данных
  const hasPersonalData = !!(profile?.last_name || profile?.first_name);
  const hasEmail = !!profile?.email;
  const hasEmailVerified = !!profile?.email_verified;
  const hasPassport = !!profile?.passport_data?.series;
  const hasAddress = addresses.length > 0;

  // Баннер: показываем если нет личных данных ИЛИ нет паспорта
  const showBanner = !hasPersonalData || !hasPassport;

  if (loading) return (
    <div className="profile-loading">
      <div className="profile-loading__spinner" />
    </div>
  );

  return (
    <div className="personal-data-page">
      <div className="profile-mobile-topbar">
        <a className="profile-mobile-topbar__back" href="/profile" aria-label="Назад в профиль">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M12.5 15L7.5 10L12.5 5" stroke="#181818" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
        <span className="profile-mobile-topbar__title">Личные данные</span>
      </div>
      {/* Баннер-предупреждение — над основным блоком */}
      {showBanner && (
        <div className="profile-warning-banner">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 1.66663C5.40833 1.66663 1.66667 5.40829 1.66667 9.99996C1.66667 14.5916 5.40833 18.3333 10 18.3333C14.5917 18.3333 18.3333 14.5916 18.3333 9.99996C18.3333 5.40829 14.5917 1.66663 10 1.66663ZM10 14.1666C9.54167 14.1666 9.16667 13.7916 9.16667 13.3333V9.99996C9.16667 9.54163 9.54167 9.16663 10 9.16663C10.4583 9.16663 10.8333 9.54163 10.8333 9.99996V13.3333C10.8333 13.7916 10.4583 14.1666 10 14.1666ZM10.8333 7.49996H9.16667V5.83329H10.8333V7.49996Z" fill="#B71C1C" />
          </svg>
          <p>
            Для таможенного оформления посылок необходимо добавить{' '}
            {!hasPersonalData && (
              <strong
                style={{ cursor: 'pointer', textDecoration: 'underline' }}
                onClick={() => setModal('personal')}
              >
                личные
              </strong>
            )}
            {!hasPersonalData && !hasPassport && ' и '}
            {!hasPassport && (
              <strong
                style={{ cursor: 'pointer', textDecoration: 'underline' }}
                onClick={() => setModal('passport')}
              >
                паспортные данные
              </strong>
            )}
            .
          </p>
        </div>
      )}

      <div className="in_processing-layout persdat-layout">
        <section className="profile-data-main">
          <div className="profile-data">

            {/* Личные данные */}
            <div className="data-section">
              <div className="data-section__header">
                <h3 className="data-section__title">Личные данные</h3>
                <button
                  className="data-section__edit"
                  onClick={() => setModal('personal')}
                >
                  {hasPersonalData ? 'Изменить' : 'Добавить'}
                </button>
              </div>
              <div className="data-section__body">
                {hasPersonalData ? (
                  <>
                    <div className="data-item">
                      <label className="data-item__label">ФИО</label>
                      <p className="data-item__value">{formatFullName()}</p>
                    </div>
                    <div className="data-item">
                      <label className="data-item__label">Дата рождения</label>
                      <p className="data-item__value">{formatDate(profile?.dob)}</p>
                    </div>
                    <div className="data-item">
                      <label className="data-item__label">Пол</label>
                      <p className="data-item__value">{formatGender(profile?.gender)}</p>
                    </div>
                  </>
                ) : (
                  <div className="data-item">
                    <label className="data-item__label">ФИО</label>
                    <p className="data-item__value">
                      {profile?.username || 'Не заполнено'}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Телефон */}
            <div className="data-section">
              <div className="data-section__header">
                <h3 className="data-section__title">Телефон</h3>
                <button className="data-section__edit" onClick={() => setModal('phone')}>
                  Изменить
                </button>
              </div>
              <div className="data-section__body">
                <div className="data-item">
                  <p className="data-item__value">{formatPhone(profile?.phone)}</p>
                </div>
              </div>
            </div>

            {/* Почта */}
            <div className="data-section">
              <div className="data-section__header">
                <h3 className="data-section__title">Почта</h3>
                <button className="data-section__edit" onClick={() => setModal('email')}>
                  {hasEmail ? 'Изменить' : 'Добавить'}
                </button>
              </div>
              <div className="data-section__body">
                {hasEmail ? (
                  <div className="data-item">
                    <p className="data-item__value">{profile.email}</p>
                    {hasEmailVerified ? (
                      <div className="email-status email-status--verified">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <path d="M8 1.33337C4.32 1.33337 1.33333 4.32004 1.33333 8.00004C1.33333 11.68 4.32 14.6667 8 14.6667C11.68 14.6667 14.6667 11.68 14.6667 8.00004C14.6667 4.32004 11.68 1.33337 8 1.33337ZM6.66667 11L3.33333 7.66671L4.27333 6.72671L6.66667 9.11337L11.7267 4.05337L12.6667 5.00004L6.66667 11Z" fill="#04A31A" />
                        </svg>
                        Почта подтверждена
                      </div>
                    ) : (
                      <>
                        <div className="email-status email-status--unverified">
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M8 1.33337C4.32 1.33337 1.33333 4.32004 1.33333 8.00004C1.33333 11.68 4.32 14.6667 8 14.6667C11.68 14.6667 14.6667 11.68 14.6667 8.00004C14.6667 4.32004 11.68 1.33337 8 1.33337ZM8.66667 10.6667H7.33333V9.33337H8.66667V10.6667ZM8.66667 8.00004H7.33333V4.66671H8.66667V8.00004Z" fill="#B71C1C" />
                          </svg>
                          Почта не подтверждена
                        </div>
                        <button
                          className="btn-confirm-email"
                          onClick={() => setModal('email-verify')}
                          type="button"
                        >
                          Подтвердить
                        </button>
                      </>
                    )}
                  </div>
                ) : (
                  <div className="data-item">
                    <p className="data-item__value data-item__value--empty">Не указана</p>
                  </div>
                )}
              </div>
            </div>

            {/* Адреса доставки */}
            <div className="data-section">
              <div className="data-section__header">
                <h3 className="data-section__title">Адреса доставки</h3>
                <button
                  className="data-section__edit add"
                  onClick={() => setModal('address')}
                >
                  Добавить
                </button>
              </div>
              <div className="data-section__body">
                {hasAddress ? (
                  <div className="delivery-addresses">
                    {addresses.map(addr => (
                      <div key={addr.id} className="delivery-address-item">
                        <label className="delivery-address-item__radio">
                          <input
                            type="radio"
                            name="delivery_address"
                            checked={activeAddressId === addr.id}
                            onChange={() => setActiveAddressId(addr.id)}
                          />
                          <span className="delivery-address-item__text">
                            {addr.city}, {addr.address}
                          </span>
                        </label>
                        <button
                          className="delivery-address-item__delete"
                          type="button"
                          onClick={() => handleDeleteAddress(addr.id)}
                          aria-label="Удалить адрес"
                        >
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M4.34999 22.0004H2.68999C2.29999 22.0004 1.98999 21.6904 1.98999 21.3004V19.6404C1.98999 18.2504 1.98999 17.4904 2.28999 16.7604C2.58999 16.0304 3.12999 15.4904 4.10999 14.5104L14.92 3.71043C15.97 2.66043 16.55 2.08043 17.39 2.01043C17.53 2.00043 17.67 2.00043 17.81 2.01043C18.66 2.09043 19.23 2.66043 20.28 3.71043C21.33 4.76043 21.91 5.34043 21.98 6.18043C21.99 6.32043 21.99 6.46043 21.98 6.60043C21.9 7.44043 21.33 8.02043 20.28 9.07043L9.47999 19.8704C8.49999 20.8504 7.95999 21.3904 7.22999 21.7004C6.49999 22.0004 5.72999 22.0004 4.34999 22.0004ZM3.38999 20.6004H4.34999C5.59999 20.6004 6.21999 20.6004 6.69999 20.4004C7.17999 20.2004 7.61999 19.7604 8.49999 18.8804L19.3 8.08043C20.09 7.29043 20.57 6.81043 20.6 6.47043C20.6 6.41043 20.6 6.36043 20.6 6.30043C20.57 5.96043 20.09 5.48043 19.3 4.69043C18.5 3.89043 18.03 3.42043 17.69 3.39043C17.63 3.39043 17.57 3.39043 17.52 3.39043C17.18 3.42043 16.7 3.90043 15.91 4.69043L5.10999 15.4904C4.22999 16.3704 3.77999 16.8204 3.58999 17.2904C3.38999 17.7704 3.38999 18.3904 3.38999 19.6404V20.6004Z" fill="#757575" />
                            <path d="M18.02 11.0604C17.84 11.0604 17.66 10.9904 17.53 10.8604L13.15 6.48045C12.88 6.21045 12.88 5.77045 13.15 5.49045C13.42 5.21045 13.86 5.22045 14.14 5.49045L18.52 9.87045C18.79 10.1404 18.79 10.5804 18.52 10.8604C18.38 11.0004 18.21 11.0604 18.03 11.0604H18.02Z" fill="#757575" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="data-item">
                    <p className="data-item__value data-item__value--empty">
                      Добавьте адрес доставки, чтобы не заполнять его каждый раз при оформлении заказа.
                    </p>
                  </div>
                )}
              </div>
            </div>

          </div>
        </section>

        {/* Паспорт */}
        <aside className="profile-data-aside">
          <div className="passport-data">
            <div className="data-section">
              <div className="data-section__header">
                <h3 className="data-section__title">Паспортные данные</h3>
                <button className="data-section__edit" onClick={() => setModal('passport')}>
                  {hasPassport ? 'Изменить' : 'Добавить'}
                </button>
              </div>
              <div className="data-section__body">

                {!hasPassport ? (
                  <div className="data-item">
                    <p className="data-item__value data-item__value--empty">
                      Для таможенного оформления посылок необходимо добавить личные данные.
                    </p>
                  </div>
                ) : profile?.passport_verified ? (
                  <>
                    {/* Маскированные данные — скрываются когда showPassportData = true */}
                    {!showPassportData && (
                      <>
                        <div className="data-item">
                          <label className="data-item__label">ФИО</label>
                          <p className="data-item__value">
                            {mask(profile.passport_data?.last_name, 5)}
                            {' '}{mask(profile.passport_data?.first_name, 3)}
                            {profile.passport_data?.middle_name ? ' ' + mask(profile.passport_data.middle_name, 3) : ''}
                          </p>
                        </div>
                        <div className="data-item">
                          <label className="data-item__label">Серия паспорта</label>
                          <p className="data-item__value">{profile.passport_data?.series || '—'}</p>
                        </div>
                        <div className="data-item">
                          <label className="data-item__label">Номер паспорта</label>
                          <p className="data-item__value">{mask(profile.passport_data?.number, 3)}</p>
                        </div>
                        <div className="data-item">
                          <label className="data-item__label">Дата выдачи</label>
                          <p className="data-item__value">{maskDate(profile.passport_data?.issue_date)}</p>
                        </div>
                        <div className="data-item">
                          <label className="data-item__label">Кем выдан</label>
                          <p className="data-item__value">{mask(profile.passport_data?.issued_by, 4)}</p>
                        </div>
                        <div className="data-item">
                          <label className="data-item__label">Идентификационный номер</label>
                          <p className="data-item__value">{mask(profile.passport_data?.identification_number, 5)}</p>
                        </div>
                        <div className="data-item">
                          <label className="data-item__label">Дата рождения</label>
                          <p className="data-item__value">{maskDate(profile.passport_data?.dob)}</p>
                        </div>
                      </>
                    )}

                    {/* Реальные данные — показываются когда showPassportData = true */}
                    {showPassportData && (
                      <div className="passport-details">
                        <div className="data-item">
                          <label className="data-item__label">ФИО</label>
                          <p className="data-item__value">
                            {[profile.passport_data?.last_name, profile.passport_data?.first_name, profile.passport_data?.middle_name].filter(Boolean).join(' ') || '—'}
                          </p>
                        </div>
                        <div className="data-item">
                          <label className="data-item__label">Серия паспорта</label>
                          <p className="data-item__value">{profile.passport_data?.series || '—'}</p>
                        </div>
                        <div className="data-item">
                          <label className="data-item__label">Номер паспорта</label>
                          <p className="data-item__value">{profile.passport_data?.number || '—'}</p>
                        </div>
                        <div className="data-item">
                          <label className="data-item__label">Дата выдачи</label>
                          <p className="data-item__value">{formatDate(profile.passport_data?.issue_date)}</p>
                        </div>
                        <div className="data-item">
                          <label className="data-item__label">Кем выдан</label>
                          <p className="data-item__value">{profile.passport_data?.issued_by || '—'}</p>
                        </div>
                        <div className="data-item">
                          <label className="data-item__label">Идентификационный номер</label>
                          <p className="data-item__value">{profile.passport_data?.identification_number || '—'}</p>
                        </div>
                        <div className="data-item">
                          <label className="data-item__label">Дата рождения</label>
                          <p className="data-item__value">{formatDate(profile.passport_data?.dob)}</p>
                        </div>
                      </div>
                    )}

                    <button
                      className="data-toggle"
                      style={showPassportData ? { marginTop: '16px' } : undefined}
                      onClick={() => setShowPassportData(p => !p)}
                    >
                      {showPassportData ? 'Скрыть данные' : 'Показать данные'}
                    </button>

                    {/* Адрес прописки — отдельный блок */}
                    <div className="passport-address" style={{ marginTop: '24px' }}>
                      <h4 className="data-section__title" style={{ marginBottom: '12px' }}>Адрес прописки</h4>
                      {[
                        ['Область', profile.passport_data?.region],
                        ['Город', profile.passport_data?.city],
                        ['Индекс', profile.passport_data?.postcode],
                        ['Улица', profile.passport_data?.street],
                        ['Дом', profile.passport_data?.house],
                        ['Корпус', profile.passport_data?.building],
                        ['Квартира', profile.passport_data?.apartment],
                      ].map(([label, value]) => value ? (
                        <div className="data-item" key={label}>
                          <label className="data-item__label">{label}</label>
                          <p className="data-item__value">{value}</p>
                        </div>
                      ) : null)}
                    </div>
                  </>
                ) : (
                  // Паспорт есть, но на проверке
                  <div className="data-item">
                    <p className="data-item__value" style={{ color: '#E65100' }}>
                      На проверке у менеджера
                    </p>
                  </div>
                )}

              </div>
            </div>
          </div>
        </aside>
      </div>{/* end in_processing-layout persdat-layout */}

      {/* Модалки */}
      {modal === 'personal' && (
        <EditPersonalDataModal profile={profile} onClose={closeModal} onSave={handleSave} />
      )}
      {modal === 'phone' && (
        <EditPhoneModal profile={profile} onClose={closeModal} onSave={handleSave} />
      )}
      {modal === 'email' && (
        <EditEmailModal profile={profile} onClose={closeModal} onSave={handleSave} />
      )}
      {modal === 'email-verify' && (
        <EditEmailModal
          profile={profile}
          onClose={closeModal}
          onSave={handleSave}
          verifyOnly={true}
        />
      )}
      {modal === 'address' && (
        <DeliveryModal
          initialTab="pickup"
          onClose={closeModal}
          onSelectPvz={(point) => { handleAddAddress(point); closeModal(); }}
          onSelectAddr={(addr) => { handleAddAddress(addr); closeModal(); }}
        />
      )}
      {modal === 'passport' && (
        <EditPassportModal profile={profile} onClose={closeModal} onSave={handleSave} />
      )}
      {modal && <div className="modal-backdrop fade show" onClick={closeModal} />}
    </div>
  );
}
