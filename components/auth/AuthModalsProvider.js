// src/components/auth/AuthModalsProvider.js
'use client';

import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { a1Request, a1Verify, phoneVerify } from '@/lib/api/auth';
import { getCartToken } from '@/lib/api/cart';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { isEmailFormatValid } from '@/lib/utils/email';

const AuthModalsContext = createContext(null);

export function AuthModalsProvider({ children }) {
  const { setAuth } = useAuth();
  const { loadCart } = useCart(); // у тебя в CartContext есть loadCart()
  const [active, setActive] = useState(null); // null | 'login' | 'register' | 'code' | 'success'
  const [flow, setFlow] = useState('login'); // 'login' | 'register'

  // общие данные
  const [phoneDigits, setPhoneDigits] = useState(''); // 9 цифр без +375
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [consent1, setConsent1] = useState(true);
  const [consent2, setConsent2] = useState(true);

  // A1
  const [verificationId, setVerificationId] = useState(null);
  const [callerMasked, setCallerMasked] = useState('');
  const [displayMessage, setDisplayMessage] = useState('');

  // code inputs
  const [last4, setLast4] = useState(['', '', '', '']);

  // UI state/errors
  const [loading, setLoading] = useState(false);
  const [errorText, setErrorText] = useState('');
  const [noticeText, setNoticeText] = useState(''); // для login-notice

  const codeInputsRef = useRef([]);

  const isOpen = !!active;

  // блокируем скролл при открытой модалке
  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  // ESC закрывает только верхнюю модалку
  useEffect(() => {
    function onKeyDown(e) {
      if (e.key === 'Escape' && isOpen) closeAll();
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen]);

  function openLogin() {
    resetErrors();
    setFlow('login');
    setActive('login');
  }

  function openRegister() {
    resetErrors();
    setFlow('register');
    setActive('register');
  }

  function openCode() {
    resetErrors();
    setActive('code');
    // фокус на первый инпут кода
    setTimeout(() => {
      codeInputsRef.current?.[0]?.focus?.();
    }, 0);
  }

  function openSuccess() {
    resetErrors();
    setActive('success');
  }

  function closeAll() {
    setActive(null);
    resetErrors();
    // не чистим поля телефона/имени автоматически — UX проще
  }

  function resetErrors() {
    setErrorText('');
    setNoticeText('');
  }

  function normalizePhone() {
    const onlyDigits = (phoneDigits || '').replace(/\D/g, '').slice(0, 9);
    // +375 фиксированный, поэтому полный телефон:
    return `375${onlyDigits}`;
  }

  async function requestCall() {
    resetErrors();

    const fullPhone = normalizePhone();
    if (!/^375\d{9}$/.test(fullPhone)) {
      setErrorText('Введите корректный номер (9 цифр после +375).');
      return;
    }

    // регистрация: имя must-have по верстке
    if (flow === 'register') {
      if (!username.trim()) {
        setErrorText('Введите имя.');
        return;
      }
      if (!consent1) {
        setErrorText('Нужно согласие на обработку персональных данных.');
        return;
      }
      if (email.trim() && !isEmailFormatValid(email)) {
        setErrorText('Введите корректный email.');
        return;
      }
      // consent2 опционально
    }

    setLoading(true);
    try {
      const resp = await a1Request({ phone: fullPhone, context: 'auth' });
      setVerificationId(resp.verification_id);
      setCallerMasked(resp.caller_number_masked || '');
      setDisplayMessage(resp.display_message || '');
      // переходим на ввод кода
      openCode();
    } catch (e) {
      setErrorText(e.message || 'Не удалось запросить звонок.');
    } finally {
      setLoading(false);
    }
  }

  function setCodeDigit(idx, val) {
    const digit = (val || '').replace(/\D/g, '').slice(0, 1);
    setLast4((prev) => {
      const next = [...prev];
      next[idx] = digit;
      return next;
    });

    if (digit && idx < 3) {
      codeInputsRef.current[idx + 1]?.focus?.();
    }
  }

  function onCodeKeyDown(idx, e) {
    if (e.key === 'Backspace') {
      if (last4[idx]) {
        setCodeDigit(idx, '');
      } else if (idx > 0) {
        codeInputsRef.current[idx - 1]?.focus?.();
      }
    }
  }

  async function submitCode() {
    resetErrors();

    const fullPhone = normalizePhone();
    const code = last4.join('');
    if (!verificationId) {
      setErrorText('Нет verification_id. Запросите звонок заново.');
      return;
    }
    if (!/^\d{4}$/.test(code)) {
      setErrorText('Введите 4 цифры.');
      return;
    }

    setLoading(true);
    try {
      // 1) A1 verify
      await a1Verify({ verification_id: verificationId, last4: code });

      // 2) auth/phone/verify (получаем token+user)
      const cart_token = getCartToken();
      const resp = await phoneVerify({ phone: fullPhone, code, cart_token });

      // user/token
      const token = resp.token;
      const user = resp.user || null;

      // Важно: backend может вернуть user без username/email —
      // если у нас register-flow, заполним локально для UI (без претензии к бэку).
      const mergedUser =
        flow === 'register'
          ? {
              ...(user || {}),
              username: (user && user.username) || username.trim() || (user?.email ? user.email : ''),
              email: (user && user.email) || email.trim() || '',
            }
          : user;

      setAuth({ token, user: mergedUser });

      // подгружаем корзину, чтобы подтянуть объединение
      try {
        await loadCart?.();
      } catch {}

      if (flow === 'register') {
        openSuccess();
      } else {
        // login: просто закрываем
        closeAll();
      }
    } catch (e) {
      // В login-flow: если номер не зарегистрирован — показываем notice и остаёмся в login
      const msg = e.message || 'Ошибка подтверждения.';
      if (flow === 'login') {
        // грубая эвристика по сообщению/статусу
        if (e.status === 422 || e.status === 404 || /не зарегистрирован/i.test(msg)) {
          setNoticeText('Данный номер не зарегистрирован. Проверьте правильность ввода или зарегистрируйтесь.');
          setActive('login');
        } else {
          setErrorText(msg);
        }
      } else {
        setErrorText(msg);
      }
    } finally {
      setLoading(false);
    }
  }

  const ctxValue = useMemo(
    () => ({
      openLogin,
      openRegister,
      closeAll,
    }),
    []
  );

  return (
    <AuthModalsContext.Provider value={ctxValue}>
      {children}

      {/* Backdrop */}
      {isOpen && <div className="modal-backdrop fade show" onClick={closeAll} />}

      {/* ===== Login modal ===== */}
      <ModalShell id="loginModal" title="Вход в систему" show={active === 'login'} onClose={closeAll}>
        <div className="login-modal-inner">
          <div className="login-container">
            <div className="login-card">
              {!!noticeText && (
                <div className="login-notice">
                  <img src="/assets/img/icons/alert-fill.svg" alt="" />
                  <p>{noticeText}</p>
                </div>
              )}

              <div className="phone-input-group">
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
                    placeholder="25 895 26 84"
                    inputMode="numeric"
                    maxLength={9}
                    value={phoneDigits}
                    onChange={(e) => setPhoneDigits(e.target.value.replace(/\D/g, '').slice(0, 9))}
                  />
                </div>
              </div>

              {!!errorText && <p style={{ color: 'crimson', marginTop: 10 }}>{errorText}</p>}

              <button className="get-code-btn" onClick={requestCall} disabled={loading}>
                {loading ? 'Отправляем…' : 'Получить код'}
              </button>

              <div className="register-link">
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    openRegister();
                  }}
                >
                  Зарегистрироваться
                </a>
              </div>
            </div>
          </div>
        </div>
      </ModalShell>

      {/* ===== Register modal ===== */}
      <ModalShell id="regModal" title="Регистрация" show={active === 'register'} onClose={closeAll}>
        <div className="modal-body">
          {!!noticeText && (
            <div className="login-notice">
              <img src="/assets/img/icons/alert-fill.svg" alt="" />
              <p>{noticeText}</p>
            </div>
          )}

          <div className="form-floating the-name">
            <input
              type="text"
              className="form-control"
              placeholder="Имя"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <label>
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
              placeholder="25 895 26 84"
              inputMode="numeric"
              maxLength={9}
              required
              value={phoneDigits}
              onChange={(e) => setPhoneDigits(e.target.value.replace(/\D/g, '').slice(0, 9))}
            />
          </div>

          <div className="form-floating the-mail">
            <input
              type="email"
              className="form-control"
              placeholder="Электронная почта"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              inputMode="email"
              autoComplete="email"
              spellCheck={false}
            />
            <label>Электронная почта</label>
          </div>

          <div className="policy-inner">
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                checked={consent1}
                onChange={(e) => setConsent1(e.target.checked)}
              />
              <label className="form-check-label">
                Даю согласие на обработку персональных данных…
              </label>
            </div>

            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                checked={consent2}
                onChange={(e) => setConsent2(e.target.checked)}
              />
              <label className="form-check-label">Даю согласие на рассылки…</label>
            </div>

            {!!errorText && <p style={{ color: 'crimson', marginTop: 10 }}>{errorText}</p>}

            <button className="get-code-btn" onClick={requestCall} disabled={loading}>
              {loading ? 'Отправляем…' : 'Получить код'}
            </button>

            <div className="register-link">
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  openLogin();
                }}
              >
                Уже есть аккаунт
              </a>
            </div>
          </div>
        </div>
      </ModalShell>

      {/* ===== Code modal ===== */}
      <ModalShell id="codeModal" title="Подтверждение входа" show={active === 'code'} onClose={closeAll}>
        <div className="code-modal-inner">
          <p className="note">
            {displayMessage ||
              `Введите последние 4 цифры номера, с которого мы звоним на Ваш номер: ${callerMasked || ''}`}
          </p>

          <div className="aply-code">
            {[0, 1, 2, 3].map((i) => (
              <input
                key={i}
                ref={(el) => (codeInputsRef.current[i] = el)}
                type="text"
                className="codes"
                inputMode="numeric"
                maxLength={1}
                value={last4[i]}
                onChange={(e) => setCodeDigit(i, e.target.value)}
                onKeyDown={(e) => onCodeKeyDown(i, e)}
              />
            ))}
          </div>

          {!!errorText && <p style={{ color: 'crimson', marginTop: 10 }}>{errorText}</p>}

          <button className="get-code-btn" onClick={submitCode} disabled={loading} style={{ marginTop: 12 }}>
            {loading ? 'Проверяем…' : 'Подтвердить'}
          </button>

          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              requestCall();
            }}
            style={{ display: 'inline-block', marginTop: 10 }}
          >
            Повторный запрос звонка
          </a>
        </div>
      </ModalShell>

      {/* ===== Success modal ===== */}
      <ModalShell id="succsModal" title={`Добро пожаловать${username ? `, ${username.trim()}!` : '!'}`} show={active === 'success'} onClose={closeAll} hideCloseIcon>
        <div className="succssec-reg-inner">
          <p className="congrats">
            На ваш адрес <a href="#">{email?.trim() || 'email'}</a> отправлено письмо для подтверждения. Пожалуйста,
            проверьте почту и подтвердите.
          </p>
          <button type="button" className="succssec-reg-close" onClick={closeAll}>
            Закрыть
          </button>
        </div>
      </ModalShell>
    </AuthModalsContext.Provider>
  );
}

export function useAuthModals() {
  const ctx = useContext(AuthModalsContext);
  if (!ctx) throw new Error('useAuthModals must be used inside <AuthModalsProvider>');
  return ctx;
}

/**
 * Минимальный "Bootstrap-like" shell:
 * - классы .modal .fade .show
 * - display: block когда show
 * - backdrop рисуется выше
 */
function ModalShell({ id, title, show, onClose, children, hideCloseIcon = false }) {
  return (
    <div
      className={`modal fade ${show ? 'show' : ''}`}
      id={id}
      tabIndex={-1}
      aria-hidden={!show}
      style={{ display: show ? 'block' : 'none' }}
      role="dialog"
      onMouseDown={(e) => {
        // клик по оверлею (контейнеру модалки) закроет
        if (e.target?.classList?.contains('modal')) onClose();
      }}
    >
      <div className="modal-dialog" role="document" onMouseDown={(e) => e.stopPropagation()}>
        <div className="modal-content">
          <div className="modal-header">
            <h1 className="modal-title">{title}</h1>
            {!hideCloseIcon && (
              <button type="button" className="btn-close" aria-label="Close" onClick={onClose} />
            )}
          </div>
          <div className="modal-body">{children}</div>
        </div>
      </div>
    </div>
  );
}
