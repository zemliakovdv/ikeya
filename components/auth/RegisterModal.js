// src/components/auth/RegisterModal.js
'use client';

import { useState } from 'react';

export default function RegisterModal({
  isOpen,
  onClose,
  onOpenCode,
  onOpenLogin,

  username,
  setUsername,
  phoneDigits,
  setPhoneDigits,
  email,
  setEmail,
  consentPersonal,
  setConsentPersonal,
  consentMarketing,
  setConsentMarketing,

  showPhoneUsed = false,
  loading = false,
  errorText = '',
}) {
  const [emailTouched, setEmailTouched] = useState(false);

  const isPhoneComplete = (phoneDigits || '').replace(/\D/g, '').length === 9;
  const isEmailValid = !email || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const showEmailError = emailTouched && email && !isEmailValid;

  const hasPhoneError = showPhoneUsed || !!errorText;
  const canSubmit = isPhoneComplete && !loading && isEmailValid;

  return (
    <div
      className={`modal fade reg-start ${isOpen ? 'show' : ''}`}
      id="regModal"
      tabIndex="-1"
      aria-labelledby="regModalLabel"
      aria-hidden={!isOpen}
      style={{ display: isOpen ? 'block' : 'none' }}
      role="dialog"
      onMouseDown={(e) => {
        if (e.target?.classList?.contains('modal')) onClose?.();
      }}
    >
      <div className="modal-dialog" onMouseDown={(e) => e.stopPropagation()}>
        <div className="modal-content">
          <div className="modal-header">
            <h1 className="modal-title" id="regModalLabel">
              Регистрация
            </h1>
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={onClose}
            />
          </div>

          <div className="modal-body">

            {/* Уведомление — номер уже используется */}
            {showPhoneUsed && (
              <div className="login-notice">
                <img src="/assets/img/icons/alert-fill.svg" alt="" />
                <p>
                  Такой номер телефона уже используется. Укажите другой или воспользуйтесь формой входа.
                </p>
              </div>
            )}

            {/* Имя */}
            <div className="form-floating the-name">
              <input
                type="text"
                className="form-control"
                id="floatingPassword"
                placeholder="Имя"
                required
                value={username}
                onChange={(e) => setUsername?.(e.target.value)}
              />
              <label htmlFor="floatingPassword">
                Имя <span>*</span>
              </label>
            </div>

            {/* Телефон */}
            <div
              className="phone-input-container"
              id="phoneContainer"
              style={{ borderColor: hasPhoneError ? '#B71C1C' : undefined }}
            >
              <div className="country-code">
                <span className="flag-icon">
                  <img src="/assets/img/icons/rb.svg" alt="" />
                </span>
                <span>+375</span>
              </div>

              <input
                type="tel"
                className="phone-input"
                id="phoneInput"
                placeholder="25 895 26 84"
                inputMode="numeric"
                maxLength={9}
                required
                value={phoneDigits}
                onChange={(e) => {
                  const v = (e.target.value || '').replace(/\D/g, '').slice(0, 9);
                  setPhoneDigits?.(v);
                }}
              />
            </div>

            {/* Email */}
            <div className="form-floating the-mail">
              <input
                type="text"
                className="form-control"
                id="floatingInput"
                placeholder="Электронная почта"
                value={email}
                onChange={(e) => setEmail?.(e.target.value.trim())}
                onBlur={() => {
                  setEmailTouched(true);
                  setEmail?.(email.trim());
                }}
                style={{ borderColor: showEmailError ? '#B71C1C' : undefined }}
              />
              <label htmlFor="floatingInput">Электронная почта</label>
            </div>
            {showEmailError && (
              <p style={{ color: '#B71C1C', fontSize: 13, marginTop: 4 }}>
                Неверный формат электронной почты
              </p>
            )}

            <div className="policy-inner">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="gridCheckPersonal"
                  checked={!!consentPersonal}
                  onChange={(e) => setConsentPersonal?.(e.target.checked)}
                />
                <label className="form-check-label" htmlFor="gridCheckPersonal">
                  Даю согласие на обработку персональных данных в соответствии с{' '}
                  <a>Политикой обработки персональных данных</a> и <a>Договором-офертой</a>
                </label>
              </div>

              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="gridCheckMarketing"
                  checked={!!consentMarketing}
                  onChange={(e) => setConsentMarketing?.(e.target.checked)}
                />
                <label className="form-check-label" htmlFor="gridCheckMarketing">
                  Даю согласие на получение рекламно-информационных рассылок по Email/Telegram
                </label>
              </div>

              {!!errorText && (
                <p style={{ color: '#B71C1C', marginTop: 8, fontSize: 14 }}>{errorText}</p>
              )}

              <button
                className="get-code-btn"
                id="getCodeBtn"
                type="button"
                onClick={onOpenCode}
                disabled={!canSubmit}
              >
                {loading ? 'Отправляем…' : 'Получить код'}
              </button>

              <div className="register-link">
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    onOpenLogin?.();
                  }}
                >
                  Уже есть аккаунт
                </a>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}