'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getProfile } from '@/lib/api/account';

import EditPersonalDataModal from './modals/EditPersonalDataModal';
import EditPhoneModal from './modals/EditPhoneModal';
import EditEmailModal from './modals/EditEmailModal';
import EditPassportModal from './modals/EditPassportModal';
import SmsVerifyModal from './modals/SmsVerifyModal';

const API_BASE_URL = 'http://45.135.234.22/api/v1';

export default function PersonalData() {
  const { isAuth, isHydrated } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPassportData, setShowPassportData] = useState(false);
  const [modal, setModal] = useState(null);

  const [verificationId, setVerificationId] = useState(null);
  const [callerMasked, setCallerMasked] = useState('');
  const [smsCode, setSmsCode] = useState('');
  const [smsError, setSmsError] = useState('');
  const [smsLoading, setSmsLoading] = useState(false);

  useEffect(() => {
    if (!isHydrated || !isAuth) return;
    async function loadProfile() {
      try {
        const data = await getProfile();
        setProfile(data);
      } catch (e) {
        console.error('PersonalData: ошибка загрузки профиля', e);
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, [isHydrated, isAuth]);

  function formatPhone(raw) {
    if (!raw) return '—';
    const d = raw.replace(/\D/g, '');
    if (d.length === 12) {
      return `+${d.slice(0, 3)} (${d.slice(3, 5)}) ${d.slice(5, 8)}-${d.slice(8, 10)}-${d.slice(10, 12)}`;
    }
    return `+${d}`;
  }

  const closeModal = () => { setModal(null); setSmsError(''); setSmsCode(''); };

  async function requestSms(phone, context) {
    setSmsLoading(true);
    setSmsError('');
    try {
      const res = await fetch(`${API_BASE_URL}/a1/request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: phone.replace(/\D/g, ''), context }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Ошибка запроса кода');
      setVerificationId(data.verification_id);
      setCallerMasked(data.caller_number_masked || '');
      setSmsCode('');
      setModal('sms');
    } catch (e) {
      setSmsError(e.message);
    } finally {
      setSmsLoading(false);
    }
  }

  async function verifySms() {
    if (smsCode.length !== 4) { setSmsError('Введите 4 цифры'); return; }
    setSmsLoading(true);
    setSmsError('');
    try {
      const res = await fetch(`${API_BASE_URL}/a1/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ verification_id: verificationId, last4: smsCode }),
      });
      if (!res.ok) throw new Error('Неверный код');
      closeModal();
    } catch (e) {
      setSmsError(e.message);
    } finally {
      setSmsLoading(false);
    }
  }

  if (loading) return <div className="profile-loading">Загружаем данные…</div>;

  return (
    <div className="in_processing-layout persdat-layout">
      <section className="profile-data-main">
        <div className="profile-data">
          <div className="data-section">
            <div className="data-section__header">
              <h3 className="data-section__title">Личные данные</h3>
              <button className="data-section__edit" onClick={() => setModal('personal')}>Изменить</button>
            </div>
            <div className="data-section__body">
              <div className="data-item"><label className="data-item__label">Имя</label><p className="data-item__value">{profile?.username || '—'}</p></div>
              <div className="data-item"><label className="data-item__label">Дата рождения</label><p className="data-item__value">—</p></div>
              <div className="data-item"><label className="data-item__label">Пол</label><p className="data-item__value">—</p></div>
            </div>
          </div>
          <div className="data-section">
            <div className="data-section__header">
              <h3 className="data-section__title">Телефон</h3>
              <button className="data-section__edit" onClick={() => setModal('phone')}>Изменить</button>
            </div>
            <div className="data-section__body">
              <div className="data-item"><p className="data-item__value">{formatPhone(profile?.phone)}</p></div>
            </div>
          </div>
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
          <div className="data-section">
            <div className="data-section__header">
              <h3 className="data-section__title">Адреса доставки</h3>
              <button className="data-section__edit add" onClick={() => setModal('address')}>Добавить</button>
            </div>
            <div className="data-section__body">
              <div className="data-item"><p className="data-item__value" style={{ color: '#9e9e9e' }}>Адреса появятся после добавления</p></div>
            </div>
          </div>
        </div>
      </section>

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
                  <div className="data-item"><label className="data-item__label">Статус</label><p className="data-item__value" style={{ color: '#04A31A' }}>Паспорт верифицирован</p></div>
                  <button className="data-toggle" onClick={() => setShowPassportData(!showPassportData)}>
                    {showPassportData ? 'Скрыть данные' : 'Показать данные'}
                  </button>
                </>
              ) : (
                <div className="data-item"><p className="data-item__value" style={{ color: '#9e9e9e' }}>Паспорт не верифицирован</p></div>
              )}
            </div>
          </div>
        </div>
      </aside>

      {modal === 'personal' && <EditPersonalDataModal profile={profile} onClose={closeModal} />}
      {modal === 'phone'    && <EditPhoneModal profile={profile} onClose={closeModal} onRequestSms={requestSms} loading={smsLoading} error={smsError} />}
      {modal === 'email'    && <EditEmailModal profile={profile} onClose={closeModal} />}
      {modal === 'passport' && <EditPassportModal profile={profile} onClose={closeModal} onRequestSms={requestSms} loading={smsLoading} error={smsError} />}
      {modal === 'sms'      && <SmsVerifyModal callerMasked={callerMasked} smsCode={smsCode} onChange={setSmsCode} onConfirm={verifySms} onClose={closeModal} loading={smsLoading} error={smsError} />}
      {modal && <div className="modal-backdrop fade show" onClick={closeModal} />}
    </div>
  );
}
