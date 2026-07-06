// src/components/auth/LoginModal.js
'use client';

import {
  isBelarusPhoneComplete,
} from '@/lib/utils/phone';
import PhoneInput from '@/components/auth/PhoneInput';

export default function LoginModal({
  isOpen,
  onClose,
  onOpenCode,
  onOpenRegister,
  phoneDigits,
  setPhoneDigits,
  loading = false,
  errorText = '',
}) {
  const localPhoneError =
    phoneDigits && !isBelarusPhoneComplete(phoneDigits)
      ? 'Введите номер в формате +375 (__) ___-__-__.'
      : '';
  const shownError = localPhoneError || errorText;
  const isPhoneComplete = isBelarusPhoneComplete(phoneDigits);
  const hasError = !!shownError;

  return (
    <div
      className={`modal fade login-modal ${isOpen ? 'show' : ''}`}
      id="loginModal"
      tabIndex="-1"
      aria-labelledby="loginModalLabel"
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
            <h1 className="modal-title up-the-hide" id="loginModalLabel">
              Вход
            </h1>
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={onClose}
            />
          </div>

          <div className="modal-body">
            <div className="login-modal-inner">
              <div className="login-container">
                <div className="login-card">
                  <div className="phone-input-group">

                    <div
                      className="phone-input-container"
                      id="phoneContainer"
                      style={{ borderColor: hasError ? '#B71C1C' : undefined }}
                    >
                      <div className="country-code">
                        <span className="flag-icon">
                          <img src="/assets/img/icons/rb.svg" alt="" />
                        </span>
                        <span>+375</span>
                      </div>

                      <PhoneInput
                        id="phoneInput"
                        value={phoneDigits}
                        onChange={setPhoneDigits}
                        error={hasError}
                        aria-describedby={hasError ? 'loginPhoneError' : undefined}
                      />
                    </div>
                  </div>

                  {!!shownError && (
                    <p id="loginPhoneError" style={{ color: '#B71C1C', marginTop: 8, fontSize: 14 }}>{shownError}</p>
                  )}

                  <button
                    className="get-code-btn"
                    id="getCodeBtn"
                    type="button"
                    onClick={onOpenCode}
                    disabled={loading || !isPhoneComplete}
                  >
                    {loading ? 'Отправляем…' : 'Получить код'}
                  </button>

                  <div className="register-link">
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        onOpenRegister?.();
                      }}
                    >
                      Зарегистрироваться
                    </a>
                  </div>

                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
