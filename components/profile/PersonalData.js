// components/profile/PersonalData.js
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getProfile } from '@/lib/api/account';

export default function PersonalData() {
  const { isAuth, isHydrated } = useAuth();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPassportData, setShowPassportData] = useState(false);

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

  // Форматируем телефон: 375295706731 → +375 (29) 570-67-31
  function formatPhone(raw) {
    if (!raw) return '—';
    const d = raw.replace(/\D/g, '');
    if (d.length === 12) {
      return `+${d.slice(0, 3)} (${d.slice(3, 5)}) ${d.slice(5, 8)}-${d.slice(8, 10)}-${d.slice(10, 12)}`;
    }
    return `+${d}`;
  }

  if (loading) {
    return <div className="profile-loading">Загружаем данные…</div>;
  }

  return (
    <div className="in_processing-layout persdat-layout">
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
                <label className="data-item__label">Имя</label>
                <p className="data-item__value">{profile?.username || '—'}</p>
              </div>
              {/* Заглушки — нет данных от API */}
              <div className="data-item">
                <label className="data-item__label">Дата рождения</label>
                <p className="data-item__value">—</p>
              </div>
              <div className="data-item">
                <label className="data-item__label">Пол</label>
                <p className="data-item__value">—</p>
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
                <p className="data-item__value">{formatPhone(profile?.phone)}</p>
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
                <p className="data-item__value">
                  {profile?.email || '—'}
                </p>

                {profile?.email && (
                  // email_verified появится когда бэк добавит поле
                  // пока всегда показываем "не подтверждена"
                  profile?.email_verified
                    ? (
                      <div className="data-item__status verified">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M8 1.33334C4.32 1.33334 1.33334 4.32 1.33334 8C1.33334 11.68 4.32 14.6667 8 14.6667C11.68 14.6667 14.6667 11.68 14.6667 8C14.6667 4.32 11.68 1.33334 8 1.33334ZM11.0267 6.36L7.36001 10.0267C7.24667 10.14 7.09334 10.2 6.94001 10.2C6.78667 10.2 6.63334 10.14 6.52001 10.0267L4.97334 8.48C4.74 8.24667 4.74 7.86667 4.97334 7.63334C5.20667 7.4 5.58667 7.4 5.82001 7.63334L6.94001 8.75334L10.18 5.51334C10.4133 5.28 10.7933 5.28 11.0267 5.51334C11.26 5.74667 11.26 6.12667 11.0267 6.36Z" fill="#04A31A" />
                        </svg>
                        Почта подтверждена
                      </div>
                    ) : (
                      <div className="data-item__status not-verified">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M7.99998 1.33301C4.32665 1.33301 1.33331 4.32634 1.33331 7.99967C1.33331 11.673 4.32665 14.6663 7.99998 14.6663C11.6733 14.6663 14.6666 11.673 14.6666 7.99967C14.6666 4.32634 11.6733 1.33301 7.99998 1.33301ZM7.53331 5.51967C7.53331 5.25967 7.73998 5.05301 7.99998 5.05301C8.25998 5.05301 8.46665 5.25967 8.46665 5.51967V8.31301C8.46665 8.57301 8.25998 8.77967 7.99998 8.77967C7.73998 8.77967 7.53331 8.57301 7.53331 8.31301V5.51967ZM8.55331 10.4797C8.55331 10.7863 8.30665 11.0397 7.99331 11.0397C7.67998 11.0397 7.43331 10.7863 7.43331 10.4797C7.43331 10.173 7.67998 9.91967 7.99331 9.91967C8.30665 9.91667 8.55331 10.1663 8.55331 10.473V10.4797Z" fill="#B71C1C" />
                        </svg>
                        Почта не подтверждена
                      </div>
                    )
                )}
              </div>
            </div>

          </div>

          {/* Адреса доставки — заглушка */}
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
              <div className="data-item">
                <p className="data-item__value" style={{ color: '#9e9e9e' }}>
                  Адреса появятся после добавления
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Боковая панель — паспортные данные */}
      <aside className="profile-data-aside">
        <div className="passport-data">
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
              {profile?.passport_verified ? (
                <>
                  <div className="data-item">
                    <label className="data-item__label">Статус</label>
                    <p className="data-item__value" style={{ color: '#04A31A' }}>
                      Паспорт верифицирован
                    </p>
                  </div>
                  <button
                    className="data-toggle"
                    onClick={() => setShowPassportData(!showPassportData)}
                  >
                    {showPassportData ? 'Скрыть данные' : 'Показать данные'}
                  </button>
                </>
              ) : (
                <div className="data-item">
                  <p className="data-item__value" style={{ color: '#9e9e9e' }}>
                    Паспорт не верифицирован
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
