'use client';

// components/cookie/CookieSettingsModal.js

import { useState } from 'react';

const ITEMS = [
  {
    key: 'technical',
    label: 'Технические файлы cookie',
    description:
      'Необходимы для корректной работы сайта и не могут быть отключены. Эти файлы cookie не позволяют идентифицировать вашу личность',
    disabled: true,
  },
  {
    key: 'analytics',
    label: 'Аналитические файлы cookie',
    description:
      'Собирают статистику, чтобы мы могли улучшить сервис, а также обеспечивают работу полезных функций, например, выбора пунктов выдачи заказов на карте или онлайн-чат. Эти файлы не позволяют идентифицировать вашу личность',
    disabled: false,
  },
  {
    key: 'advertising',
    label: 'Рекламные файлы cookie',
    description:
      'Обеспечивают получение вами более персонализированного опыта при использовании нашего сайта. Например, вы будете видеть больше актуальных для вас товаров',
    disabled: false,
  },
];

export default function CookieSettingsModal({ initialPrefs, onSave, onReject, onClose }) {
  const [prefs, setPrefs] = useState(
    initialPrefs || { technical: true, analytics: false, advertising: false }
  );

  const toggle = (key) => {
    setPrefs((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div className="cookie-modal-overlay" onClick={handleOverlayClick}>
      <div className="cookie-modal">
        <h3 className="cookie-modal__title">Параметры файлов cookie</h3>

        <div className="cookie-modal__list">
          {ITEMS.map((item, idx) => (
            <div key={item.key}>
              <div className="cookie-modal__item">
                <div className="cookie-modal__item-text">
                  <span className="cookie-modal__item-label">{item.label}</span>
                  <span className="cookie-modal__item-desc">{item.description}</span>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={prefs[item.key]}
                  disabled={item.disabled}
                  className={`cookie-toggle${prefs[item.key] ? ' cookie-toggle--on' : ''}${item.disabled ? ' cookie-toggle--disabled' : ''}`}
                  onClick={() => !item.disabled && toggle(item.key)}
                >
                  <span className="cookie-toggle__thumb" />
                </button>
              </div>
              {idx < ITEMS.length - 1 && <div className="cookie-modal__divider" />}
            </div>
          ))}
        </div>

        <div className="cookie-modal__footer">
          <p>Подробнее <a href="/help/cookie-policy-ikeya-by/" className="cookie-modal__policy-link">о Политике обработки файлов cookie</a></p>
          <div className="cookie-modal__actions">
            <button
              className="cookie-banner__btn cookie-banner__btn--outline"
              onClick={onReject}
            >
              Отклонить
            </button>
            <button
              className="cookie-banner__btn cookie-banner__btn--primary"
              onClick={() => onSave(prefs)}
            >
              Принять
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}