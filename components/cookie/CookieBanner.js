'use client';

// components/cookie/CookieBanner.js

import { useState, useEffect } from 'react';
import CookieSettingsModal from './CookieSettingsModal';

const STORAGE_KEY = 'ikeya_cookie_consent';

export default function CookieBanner() {
  const [visible, setVisible]       = useState(false);
  const [modalOpen, setModalOpen]   = useState(false);

  // Показываем баннер только если согласие ещё не дано
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) setVisible(true);
    } catch {}
  }, []);

  const saveConsent = (prefs) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
    } catch {}
    setVisible(false);
    setModalOpen(false);
  };

  const handleAcceptAll = () => {
    saveConsent({ technical: true, analytics: true, advertising: true });
  };

  const handleRejectAll = () => {
    saveConsent({ technical: true, analytics: false, advertising: false });
  };

  if (!visible) return null;

  return (
    <>
      <div className="cookie-banner">
        <div className="cookie-banner__body">
          <h3 className="cookie-banner__title">Политика обработки файлов cookie</h3>
          <p className="cookie-banner__text">
            Сайт использует файлы cookie для корректной работы, сбора статистики и
            персонализации рекомендаций.
          </p>
          <button
            className="cookie-banner__settings-link"
            onClick={() => setModalOpen(true)}
          >
            Настроить cookie
          </button>
        </div>
        <div className="cookie-banner__actions">
          <button className="cookie-banner__btn cookie-banner__btn--outline" onClick={handleRejectAll}>
            Отклонить
          </button>
          <button className="cookie-banner__btn cookie-banner__btn--primary" onClick={handleAcceptAll}>
            Принять все
          </button>
        </div>
      </div>

      {modalOpen && (
        <CookieSettingsModal
          onSave={saveConsent}
          onReject={handleRejectAll}
          onClose={() => setModalOpen(false)}
        />
      )}
    </>
  );
}