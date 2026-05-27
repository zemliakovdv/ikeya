// components/profile/PersonalSettings.js
'use client';

import { useState, useEffect } from 'react';
import { getProfile, updateProfile } from '@/lib/api/account';
import { useAuth } from '@/contexts/AuthContext';

export default function PersonalSettings() {
  const { isAuth, isHydrated } = useAuth();

  const [telegramConsent,  setTelegramConsent]  = useState(false);
  const [emailConsent,     setEmailConsent]     = useState(false);
  const [loading,          setLoading]          = useState(true);
  const [savingTelegram,   setSavingTelegram]   = useState(false);
  const [savingEmail,      setSavingEmail]      = useState(false);

  useEffect(() => {
    if (!isHydrated || !isAuth) return;

    async function load() {
      try {
        const profile = await getProfile();
        // gdpr_consent → Telegram, newsletter_consent → Email
        setTelegramConsent(!!profile.gdpr_consent);
        setEmailConsent(!!profile.newsletter_consent);
      } catch (e) {
        console.error('PersonalSettings: ошибка загрузки', e);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [isHydrated, isAuth]);

  async function handleTelegramToggle() {
    const newValue = !telegramConsent;
    setTelegramConsent(newValue);
    setSavingTelegram(true);
    try {
      await updateProfile({ gdpr_consent: newValue });
    } catch (e) {
      // Откатываем если ошибка
      setTelegramConsent(!newValue);
      console.error('Ошибка сохранения Telegram consent', e);
    } finally {
      setSavingTelegram(false);
    }
  }

  async function handleEmailToggle() {
    const newValue = !emailConsent;
    setEmailConsent(newValue);
    setSavingEmail(true);
    try {
      await updateProfile({ newsletter_consent: newValue });
    } catch (e) {
      setEmailConsent(!newValue);
      console.error('Ошибка сохранения Email consent', e);
    } finally {
      setSavingEmail(false);
    }
  }

  if (loading) {
    return <div className="profile-loading">Загружаем настройки…</div>;
  }

  return (
    <div className="settings-page">
      <div className="profile-mobile-topbar">
        <a className="profile-mobile-topbar__back" href="/profile" aria-label="Назад в профиль">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M12.5 15L7.5 10L12.5 5" stroke="#181818" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
        <span className="profile-mobile-topbar__title">Настройки</span>
      </div>

      <div className="content">

      {/* Telegram */}
      <div className="setting">
        <label className="toggle">
          <input
            type="checkbox"
            checked={telegramConsent}
            onChange={handleTelegramToggle}
            disabled={savingTelegram}
          />
          <span className="slider" />
        </label>
        <div className="setting-info">
          <div className="setting-title">
            Получение рекламно-информационных рассылок через Telegram
          </div>
          <div className="setting-desc">
            Без согласия вы не сможете оперативно получать специальные предложения,
            получать промокоды и можете пропустить акции
          </div>
        </div>
      </div>

      {/* Email */}
      <div className="setting">
        <label className="toggle">
          <input
            type="checkbox"
            checked={emailConsent}
            onChange={handleEmailToggle}
            disabled={savingEmail}
          />
          <span className="slider" />
        </label>
        <div className="setting-info">
          <div className="setting-title">
            Получение рекламно-информационных рассылок через Email
          </div>
          <div className="setting-desc">
            Без согласия вы не сможете получать на ваш email специальные предложения,
            получать промокоды и можете пропустить акции
          </div>
        </div>
      </div>

      </div>
    </div>
  );
}
