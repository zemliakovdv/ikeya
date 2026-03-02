'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getProfile } from '@/lib/api/account';

import EditPersonalDataModal from './modals/EditPersonalDataModal';
import DeliveryPickupModal   from './modals/DeliveryPickupModal';
import EditPhoneModal        from './modals/EditPhoneModal';
import EditEmailModal        from './modals/EditEmailModal';
import EditPassportModal     from './modals/EditPassportModal';

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

      // Восстанавливаем сохранённый адрес из профиля
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


  // После сохранения любой модалки обновляем профиль локально
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
    if (val === 'male')   return 'Мужской';
    if (val === 'female') return 'Женский';
    return '—';
  }

  function formatFullName() {
    const parts = [profile?.last_name, profile?.first_name, profile?.middle_name].filter(Boolean);
    return parts.length ? parts.join(' ') : '—';
  }

  function formatAddress() {
    const p = profile?.passport_data;
    if (!p) return '—';
    const parts = [p.region, p.city, p.street, p.house, p.building, p.apartment].filter(Boolean);
    return parts.length ? parts.join(', ') : '—';
  }

  if (loading) return <div className="profile-loading">Загружаем данные…</div>;

  return (
    <div className="in_processing-layout persdat-layout">
      <section className="profile-data-main">
        <div className="profile-data">

          {/* Личные данные */}
          <div className="data-section">
            <div className="data-section__header">
              <h3 className="data-section__title">Личные данные</h3>
              <button className="data-section__edit" onClick={() => setModal('personal')}>Изменить</button>
            </div>
            <div className="data-section__body">
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
            </div>
          </div>

          {/* Телефон */}
          <div className="data-section">
            <div className="data-section__header">
              <h3 className="data-section__title">Телефон</h3>
              <button className="data-section__edit" onClick={() => setModal('phone')}>Изменить</button>
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
              <button className="data-section__edit" onClick={() => setModal('email')}>Изменить</button>
            </div>
            <div className="data-section__body">
              <div className="data-item">
                <p className="data-item__value">{profile?.email || '—'}</p>
              </div>
            </div>
          </div>

          {/* Адреса доставки */}
          <div className="data-section">
            <div className="data-section__header">
              <h3 className="data-section__title">Адреса доставки</h3>
              <button className="data-section__edit add" onClick={() => setModal('address')}>
                {selectedPickupPoint ? 'Изменить' : 'Добавить'}
              </button>
            </div>
            <div className="data-section__body">
              {selectedPickupPoint ? (
                <div className="data-item">
                  <label className="data-item__label">{selectedPickupPoint.name}</label>
                  <p className="data-item__value">{selectedPickupPoint.city}, {selectedPickupPoint.address}</p>
                  {selectedPickupPoint.working_hours && (
                    <p className="data-item__value" style={{ color: '#757575', fontSize: '13px' }}>
                      {selectedPickupPoint.working_hours}
                    </p>
                  )}
                </div>
              ) : (
                <div className="data-item">
                  <p className="data-item__value" style={{ color: '#9e9e9e' }}>
                    Адреса появятся после добавления
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
              <button className="data-section__edit" onClick={() => setModal('passport')}>Изменить</button>
            </div>
            <div className="data-section__body">
              {profile?.passport_verified ? (
                <>
                  <div className="data-item">
                    <label className="data-item__label">Статус</label>
                    <p className="data-item__value" style={{ color: '#04A31A' }}>Паспорт верифицирован</p>
                  </div>
                  <button className="data-toggle" onClick={() => setShowPassportData(p => !p)}>
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
                        <label className="data-item__label">Адрес прописки</label>
                        <p className="data-item__value">{formatAddress()}</p>
                      </div>
                    </div>
                  )}
                </>
              ) : profile?.passport_data?.series ? (
                <div className="data-item">
                  <p className="data-item__value" style={{ color: '#E65100' }}>
                    На проверке у менеджера
                  </p>
                </div>
              ) : (
                <div className="data-item">
                  <p className="data-item__value" style={{ color: '#9e9e9e' }}>
                    Паспорт не добавлен
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </aside>

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
    </div>
  );
}
