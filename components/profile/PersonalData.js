// components/profile/PersonalData.js
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getProfile, updateProfile } from '@/lib/api/account';

import EditPersonalDataModal from './modals/EditPersonalDataModal';
import DeliveryPickupModal   from './modals/DeliveryPickupModal';
import EditPhoneModal        from './modals/EditPhoneModal';
import EditEmailModal        from './modals/EditEmailModal';
import EditPassportModal     from './modals/EditPassportModal';

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
  const [profile,            setProfile]            = useState(null);
  const [loading,            setLoading]            = useState(true);
  const [showPassportData,   setShowPassportData]   = useState(false);
  const [modal,              setModal]              = useState(null);
  const [selectedPickupPoint,setSelectedPickupPoint]= useState(null);

  useEffect(() => {
    if (!isHydrated || !isAuth) return;
    getProfile()
      .then(data => {
        setProfile(data);
        if (data?.city && data?.address) {
          setSelectedPickupPoint({
            name:    data.city,
            city:    data.city,
            address: data.address,
          });
        }
      })
      .catch(e => console.error('PersonalData: ошибка загрузки профиля', e))
      .finally(() => setLoading(false));
  }, [isHydrated, isAuth]);

  function handleSave(updated) {
    if (updated) {
      setProfile(updated);
      // Обновляем имя в сайдбаре
      if (updated.first_name || updated.last_name) {
        const displayName = [updated.first_name, updated.last_name].filter(Boolean).join(' ');
        setUser({ ...user, username: displayName });
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
    if (val === 'male')   return 'Мужской';
    if (val === 'female') return 'Женский';
    return '—';
  }

  function formatFullName() {
    const parts = [profile?.last_name, profile?.first_name, profile?.middle_name].filter(Boolean);
    return parts.length ? parts.join(' ') : null;
  }

  // Определяем заполненность данных
  const hasPersonalData  = !!(profile?.last_name || profile?.first_name);
  const hasEmail         = !!profile?.email;
  const hasEmailVerified = !!profile?.email_verified;
  const hasPassport      = !!profile?.passport_data?.series;
  const hasAddress       = !!selectedPickupPoint;

  // Баннер: показываем если нет личных данных ИЛИ нет паспорта
  const showBanner = !hasPersonalData || !hasPassport;

  if (loading) return (
    <div className="profile-loading">
      <div className="profile-loading__spinner" />
    </div>
  );

  return (
    <>
      {/* Баннер-предупреждение — над основным блоком */}
      {showBanner && (
        <div className="profile-warning-banner">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 1.66663C5.40833 1.66663 1.66667 5.40829 1.66667 9.99996C1.66667 14.5916 5.40833 18.3333 10 18.3333C14.5917 18.3333 18.3333 14.5916 18.3333 9.99996C18.3333 5.40829 14.5917 1.66663 10 1.66663ZM10 14.1666C9.54167 14.1666 9.16667 13.7916 9.16667 13.3333V9.99996C9.16667 9.54163 9.54167 9.16663 10 9.16663C10.4583 9.16663 10.8333 9.54163 10.8333 9.99996V13.3333C10.8333 13.7916 10.4583 14.1666 10 14.1666ZM10.8333 7.49996H9.16667V5.83329H10.8333V7.49996Z" fill="#B71C1C"/>
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
                        <path d="M8 1.33337C4.32 1.33337 1.33333 4.32004 1.33333 8.00004C1.33333 11.68 4.32 14.6667 8 14.6667C11.68 14.6667 14.6667 11.68 14.6667 8.00004C14.6667 4.32004 11.68 1.33337 8 1.33337ZM6.66667 11L3.33333 7.66671L4.27333 6.72671L6.66667 9.11337L11.7267 4.05337L12.6667 5.00004L6.66667 11Z" fill="#04A31A"/>
                      </svg>
                      Почта подтверждена
                    </div>
                  ) : (
                    <>
                      <div className="email-status email-status--unverified">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <path d="M8 1.33337C4.32 1.33337 1.33333 4.32004 1.33333 8.00004C1.33333 11.68 4.32 14.6667 8 14.6667C11.68 14.6667 14.6667 11.68 14.6667 8.00004C14.6667 4.32004 11.68 1.33337 8 1.33337ZM8.66667 10.6667H7.33333V9.33337H8.66667V10.6667ZM8.66667 8.00004H7.33333V4.66671H8.66667V8.00004Z" fill="#B71C1C"/>
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
                  {/* Данные — маскированные или открытые в зависимости от showPassportData */}
                  <div className="data-item">
                    <label className="data-item__label">ФИО</label>
                    <p className="data-item__value">
                      {showPassportData
                        ? [profile.passport_data?.last_name, profile.passport_data?.first_name, profile.passport_data?.middle_name].filter(Boolean).join(' ') || '—'
                        : <>{mask(profile.passport_data?.last_name, 5)}{' '}{mask(profile.passport_data?.first_name, 3)}{profile.passport_data?.middle_name ? ' ' + mask(profile.passport_data.middle_name, 3) : ''}</>
                      }
                    </p>
                  </div>
                  <div className="data-item">
                    <label className="data-item__label">Серия паспорта</label>
                    <p className="data-item__value">{profile.passport_data?.series || '—'}</p>
                  </div>
                  <div className="data-item">
                    <label className="data-item__label">Номер паспорта</label>
                    <p className="data-item__value">
                      {showPassportData ? profile.passport_data?.number : mask(profile.passport_data?.number, 3)}
                    </p>
                  </div>
                  <div className="data-item">
                    <label className="data-item__label">Дата выдачи</label>
                    <p className="data-item__value">
                      {showPassportData ? formatDate(profile.passport_data?.issue_date) : maskDate(profile.passport_data?.issue_date)}
                    </p>
                  </div>
                  <div className="data-item">
                    <label className="data-item__label">Кем выдан</label>
                    <p className="data-item__value">
                      {showPassportData ? profile.passport_data?.issued_by || '—' : mask(profile.passport_data?.issued_by, 4)}
                    </p>
                  </div>
                  <div className="data-item">
                    <label className="data-item__label">Идентификационный номер</label>
                    <p className="data-item__value">
                      {showPassportData ? profile.passport_data?.identification_number || '—' : mask(profile.passport_data?.identification_number, 5)}
                    </p>
                  </div>
                  <div className="data-item">
                    <label className="data-item__label">Дата рождения</label>
                    <p className="data-item__value">
                      {showPassportData ? formatDate(profile.passport_data?.dob) : maskDate(profile.passport_data?.dob)}
                    </p>
                  </div>

                  <button
                    className="data-toggle"
                    onClick={() => setShowPassportData(p => !p)}
                  >
                    {showPassportData ? 'Скрыть данные' : 'Показать данные'}
                  </button>

                  {/* Адрес прописки — отдельный блок */}
                  <div className="passport-address" style={{ marginTop: '24px' }}>
                    <h4 className="data-section__title" style={{ marginBottom: '12px' }}>Адрес прописки</h4>
                    {[
                      ['Область',  profile.passport_data?.region],
                      ['Город',    profile.passport_data?.city],
                      ['Индекс',   profile.passport_data?.postcode],
                      ['Улица',    profile.passport_data?.street],
                      ['Дом',      profile.passport_data?.house],
                      ['Корпус',   profile.passport_data?.building],
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