// components/profile/PersonalData.js
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getProfile, updateProfile } from '@/lib/api/account';

import EditPersonalDataModal from './modals/EditPersonalDataModal';
import DeliveryPickupModal from './modals/DeliveryPickupModal';
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
  const { isAuth, isHydrated } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPassportData, setShowPassportData] = useState(false);
  const [modal, setModal] = useState(null);
  const [selectedPickupPoint, setSelectedPickupPoint] = useState(null);

  useEffect(() => {
    if (!isHydrated || !isAuth) return;
    getProfile()
      .then(data => {
        setProfile(data);
        if (data?.city && data?.address) {
          setSelectedPickupPoint({
            name: data.city,
            city: data.city,
            address: data.address,
          });
        }
      })
      .catch(e => console.error('PersonalData: ошибка загрузки профиля', e))
      .finally(() => setLoading(false));
  }, [isHydrated, isAuth]);

  function handleSave(updated) {
    if (updated) setProfile(updated);
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
    if (val === 'male') return 'Мужской';
    if (val === 'female') return 'Женский';
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
  const hasAddress = !!selectedPickupPoint;

  // Баннер: показываем если нет личных данных ИЛИ нет паспорта
  const showBanner = !hasPersonalData || !hasPassport;

  if (loading) return <div className="profile-loading">Загружаем данные…</div>;

  return (
    <>
      {/* Баннер-предупреждение — над основным блоком */}
      {showBanner && (
        <div className="profile-warning-banner">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C6.49 2 2 6.49 2 12C2 17.51 6.49 22 12 22C17.51 22 22 17.51 22 12C22 6.49 17.51 2 12 2ZM11.3 8.28C11.3 7.89 11.61 7.58 12 7.58C12.39 7.58 12.7 7.89 12.7 8.28V12.47C12.7 12.86 12.39 13.17 12 13.17C11.61 13.17 11.3 12.86 11.3 12.47V8.28ZM12.83 15.72C12.83 16.18 12.46 16.56 11.99 16.56C11.52 16.56 11.15 16.18 11.15 15.72C11.15 15.26 11.52 14.88 11.99 14.88C12.46 14.88 12.83 15.25 12.83 15.71V15.72Z" fill="#B71C1C" />
          </svg>
          <p>
            Для таможенного оформления посылок необходимо добавить{' '}
            {!hasPersonalData && (
              <strong
                style={{ cursor: 'pointer' }}
                onClick={() => setModal('personal')}
              >
                личные
              </strong>
            )}
            {!hasPersonalData && !hasPassport && ' и '}
            {!hasPassport && (
              <strong
                style={{ cursor: 'pointer' }}
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
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M7.99998 1.33331C4.32665 1.33331 1.33331 4.32665 1.33331 7.99998C1.33331 11.6733 4.32665 14.6666 7.99998 14.6666C11.6733 14.6666 14.6666 11.6733 14.6666 7.99998C14.6666 4.32665 11.6733 1.33331 7.99998 1.33331ZM10.8266 6.45331L7.41331 10.1733C7.32665 10.2666 7.20665 10.32 7.07998 10.3266H7.07331C6.95331 10.3266 6.83331 10.28 6.74665 10.1933L5.19331 8.63998C5.01331 8.45998 5.01331 8.16665 5.19331 7.97998C5.37331 7.79998 5.66665 7.79998 5.85331 7.97998L7.05998 9.18665L10.14 5.82665C10.3133 5.63998 10.6066 5.62665 10.8 5.79998C10.9866 5.97331 11 6.26665 10.8266 6.45998V6.45331Z" fill="#00910A" />
                        </svg>
                        Почта подтверждена
                      </div>
                    ) : (
                      <>
                        <div className="email-status email-status--unverified">
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M7.99998 1.33301C4.32665 1.33301 1.33331 4.32634 1.33331 7.99967C1.33331 11.673 4.32665 14.6663 7.99998 14.6663C11.6733 14.6663 14.6666 11.673 14.6666 7.99967C14.6666 4.32634 11.6733 1.33301 7.99998 1.33301ZM7.53331 5.51967C7.53331 5.25967 7.73998 5.05301 7.99998 5.05301C8.25998 5.05301 8.46665 5.25967 8.46665 5.51967V8.31301C8.46665 8.57301 8.25998 8.77967 7.99998 8.77967C7.73998 8.77967 7.53331 8.57301 7.53331 8.31301V5.51967ZM8.55331 10.4797C8.55331 10.7863 8.30665 11.0397 7.99331 11.0397C7.67998 11.0397 7.43331 10.7863 7.43331 10.4797C7.43331 10.173 7.67998 9.91967 7.99331 9.91967C8.30665 9.91967 8.55331 10.1663 8.55331 10.473V10.4797Z" fill="#B71C1C" />
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
                  className={`data-section__edit ${!hasAddress ? 'add' : ''}`}
                  onClick={() => setModal('address')}
                >
                  {hasAddress ? 'Изменить' : 'Добавить'}
                </button>
              </div>
              <div className="data-section__body">
                {hasAddress ? (
                  <div className="data-item">
                    <label className="data-item__label">{selectedPickupPoint.name}</label>
                    <p className="data-item__value">
                      {selectedPickupPoint.city}, {selectedPickupPoint.address}
                    </p>
                    {selectedPickupPoint.working_hours && (
                      <p className="data-item__value" style={{ color: '#757575', fontSize: '13px' }}>
                        {selectedPickupPoint.working_hours}
                      </p>
                    )}
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
                    {/* Маскированные данные */}
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

                    <button
                      className="data-toggle"
                      onClick={() => setShowPassportData(p => !p)}
                    >
                      {showPassportData ? 'Скрыть данные' : 'Показать данные'}
                    </button>

                    {showPassportData && (
                      <div className="passport-details" style={{ marginTop: '12px' }}>
                        <div className="data-item">
                          <label className="data-item__label">ФИО</label>
                          <p className="data-item__value">
                            {[profile.passport_data?.last_name, profile.passport_data?.first_name, profile.passport_data?.middle_name].filter(Boolean).join(' ') || '—'}
                          </p>
                        </div>
                        <div className="data-item">
                          <label className="data-item__label">Серия / Номер</label>
                          <p className="data-item__value">
                            {profile.passport_data?.series} {profile.passport_data?.number}
                          </p>
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
                      </div>
                    )}

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
        <DeliveryPickupModal
          onClose={closeModal}
          onSelect={(point) => { setSelectedPickupPoint(point); closeModal(); }}
        />
      )}
      {modal === 'passport' && (
        <EditPassportModal profile={profile} onClose={closeModal} onSave={handleSave} />
      )}
      {modal && <div className="modal-backdrop fade show" onClick={closeModal} />}
    </>
  );
}