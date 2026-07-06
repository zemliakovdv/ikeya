// src/components/auth/RegisterModal.js
'use client';

import { useState } from 'react';
import {
  isBelarusPhoneComplete,
} from '@/lib/utils/phone';
import PhoneInput from '@/components/auth/PhoneInput';
import { isEmailFormatValid } from '@/lib/utils/email';
import { isValidPersonName, normalizePersonName } from '@/lib/utils/personName';

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

  loading = false,
  errorText = '',
  isPhoneLocked = false,
  submitLabel = 'Получить код',
}) {
  const [emailTouched, setEmailTouched] = useState(false);
  const [nameTouched, setNameTouched] = useState(false);

  const isPhoneComplete = isBelarusPhoneComplete(phoneDigits);
  const normalizedName = normalizePersonName(username);
  const isNameValid = isValidPersonName(username);
  const showNameError = nameTouched && !isNameValid;
  const isEmailValid = !email || isEmailFormatValid(email);
  const showEmailError = emailTouched && email && !isEmailValid;

  const localPhoneError =
    phoneDigits && !isBelarusPhoneComplete(phoneDigits)
      ? 'Введите номер в формате +375 (__) ___-__-__.'
      : '';
  const shownPhoneError = localPhoneError || errorText;
  const hasPhoneError = !!shownPhoneError;
  const canSubmit = isPhoneComplete && isNameValid && !!consentPersonal && !loading && isEmailValid;

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

            {/* Имя */}
            <div className="form-floating the-name">
              <input
                type="text"
                className={`form-control${showNameError ? ' is-invalid' : ''}`}
                id="floatingPassword"
                placeholder="Имя"
                required
                value={username}
                onChange={(e) => setUsername?.(e.target.value)}
                onBlur={() => {
                  setNameTouched(true);
                  setUsername?.(normalizedName);
                }}
              />
              <label htmlFor="floatingPassword">
                Имя <span>*</span>
              </label>
            </div>
            {showNameError && (
              <p style={{ color: '#B71C1C', fontSize: 13, marginTop: 4 }}>
                Используйте только кириллицу, пробел и дефис
              </p>
            )}

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

              <PhoneInput
                id="phoneInput"
                required
                value={phoneDigits}
                onChange={setPhoneDigits}
                error={hasPhoneError}
                aria-describedby={hasPhoneError ? 'registerPhoneError' : undefined}
                readOnly={isPhoneLocked}
              />
            </div>
            {!!shownPhoneError && (
              <p id="registerPhoneError" style={{ color: '#B71C1C', fontSize: 13, marginTop: 4 }}>
                {shownPhoneError}
              </p>
            )}

            {/* Email */}
            <div className="form-floating the-mail">
              <input
                type="email"
                className="form-control"
                id="floatingInput"
                placeholder="Электронная почта"
                inputMode="email"
                autoComplete="email"
                spellCheck={false}
                value={email}
                onChange={(e) => setEmail?.(e.target.value.trim().replace(/[а-яёА-ЯЁ]/g, ''))}
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
                  <a href="/help/privacy-policy-clients-ikeya-by/">Политикой обработки персональных данных</a> и <a href="/help/public-offer-commission-ikeya/">Договором-офертой</a>
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

              {!!errorText && !shownPhoneError && (
                <p style={{ color: '#B71C1C', marginTop: 8, fontSize: 14 }}>{errorText}</p>
              )}

              <button
                className="get-code-btn"
                id="getCodeBtn"
                type="button"
                onClick={() => {
                  setNameTouched(true);
                  setUsername?.(normalizedName);
                  onOpenCode?.();
                }}
                disabled={!canSubmit}
              >
                {loading ? 'Отправляем…' : submitLabel}
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
