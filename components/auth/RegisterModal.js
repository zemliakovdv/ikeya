// src/components/auth/RegisterModal.js
'use client';

export default function RegisterModal({
  isOpen,
  onClose,
  onOpenCode,     // запрос звонка + открыть CodeModal
  onOpenLogin,    // открыть LoginModal

  // form state
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

  // UI
  showPhoneUsed = false,
  loading = false,
  errorText = '',
}) {
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
            <div className={`login-notice ${showPhoneUsed ? '' : 'the-hide'}`}>
              <img src="/assets/img/icons/alert-fill.svg" alt="" />
              <p>
                Такой номер телефона уже используется. Укажите другой или воспользоваться формой входа.
              </p>
            </div>

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

            <div className="phone-input-container" id="phoneContainer">
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

            <div className="form-floating the-mail">
              <input
                type="email"
                className="form-control"
                id="floatingInput"
                placeholder="Электронная почта"
                value={email}
                onChange={(e) => setEmail?.(e.target.value)}
              />
              <label htmlFor="floatingInput">Электронная почта</label>
            </div>

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
                <p style={{ color: 'crimson', marginTop: 10 }}>{errorText}</p>
              )}

              <button
                className="get-code-btn"
                id="getCodeBtn"
                type="button"
                onClick={onOpenCode}
                disabled={loading}
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
