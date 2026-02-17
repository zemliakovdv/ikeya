// src/components/auth/AuthModalsHost.js
'use client';

import { createContext, useContext, useMemo, useState } from 'react';
import { a1Request, a1Verify, phoneVerify } from '@/lib/api/auth';
import { getCartToken } from '@/lib/api/cart';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';

import LoginModal from '@/components/auth/LoginModal';
import CodeModal from '@/components/auth/CodeModal';
import RegisterModal from '@/components/auth/RegisterModal';
import SuccessModal from '@/components/auth/SuccessModal';

const AuthModalsContext = createContext(null);

export function AuthModalsProvider({ children }) {
  const { setAuth } = useAuth();
  const { loadCart } = useCart();

  // какая модалка открыта: null | 'login' | 'register' | 'code' | 'success'
  const [active, setActive] = useState(null);

  // flow: login/register — влияет на поведение после успешного входа
  const [flow, setFlow] = useState('login');

  // form state
  const [phoneDigits, setPhoneDigits] = useState(''); // 9 цифр после +375
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [consentPersonal, setConsentPersonal] = useState(true);
  const [consentMarketing, setConsentMarketing] = useState(true);

  // A1 data
  const [verificationId, setVerificationId] = useState(null);
  const [callerMasked, setCallerMasked] = useState('');
  const [displayMessage, setDisplayMessage] = useState('');

  // code digits
  const [codeDigits, setCodeDigits] = useState(['', '', '', '']);

  // UI
  const [loading, setLoading] = useState(false);
  const [errorText, setErrorText] = useState('');
  const [showNotRegistered, setShowNotRegistered] = useState(false);
  const [showPhoneUsed, setShowPhoneUsed] = useState(false);

  // ===== helpers =====
  function resetUi() {
    setErrorText('');
    setShowNotRegistered(false);
    setShowPhoneUsed(false);
  }

  function closeAll() {
    setActive(null);
    resetUi();
  }

  function openLogin() {
    resetUi();
    setFlow('login');
    setActive('login');
  }

  function openRegister() {
    resetUi();
    setFlow('register');
    setActive('register');
  }

  function openCode() {
    resetUi();
    setActive('code');
  }

  function openSuccess() {
    resetUi();
    setActive('success');
  }

  function fullPhone() {
    const digits = (phoneDigits || '').replace(/\D/g, '').slice(0, 9);
    return `375${digits}`;
  }

  async function requestCall() {
    resetUi();

    const phone = fullPhone();
    if (!/^375\d{9}$/.test(phone)) {
      setErrorText('Введите корректный номер (9 цифр после +375).');
      return;
    }

    if (flow === 'register') {
      if (!username.trim()) {
        setErrorText('Введите имя.');
        return;
      }
      if (!consentPersonal) {
        setErrorText('Нужно согласие на обработку персональных данных.');
        return;
      }
    }

    setLoading(true);
    try {
      const resp = await a1Request({ phone, context: 'auth' });
      setVerificationId(resp.verification_id);
      setCallerMasked(resp.caller_number_masked || '');
      setDisplayMessage(resp.display_message || '');
      setCodeDigits(['', '', '', '']); // сброс
      openCode();
    } catch (e) {
      setErrorText(e.message || 'Не удалось запросить звонок.');
    } finally {
      setLoading(false);
    }
  }

  // Auto-submit при вводе 4-й цифры (без кнопки)
  async function handleCodeDigitsChange(nextDigits) {
    setCodeDigits(nextDigits);

    const code = nextDigits.join('');
    if (code.length !== 4) return;
    if (!/^\d{4}$/.test(code)) return;

    await submitCode(code);
  }

  async function submitCode(code) {
    resetUi();

    const phone = fullPhone();
    if (!verificationId) {
      setErrorText('Нет verification_id. Запросите звонок заново.');
      return;
    }

    setLoading(true);
    try {
      // 1) verify A1
      await a1Verify({ verification_id: verificationId, last4: code });

      // 2) auth verify -> token+user
      const cart_token = getCartToken();
      const resp = await phoneVerify({ phone, code, cart_token });

      const token = resp.token;
      const user = resp.user || null;

      // В register flow подмешиваем введённые поля локально (если бэк не вернул)
      const mergedUser =
        flow === 'register'
          ? {
              ...(user || {}),
              username: (user && user.username) || username.trim() || '',
              email: (user && user.email) || email.trim() || '',
            }
          : user;

      setAuth({ token, user: mergedUser });

      // подтянуть корзину после объединения
      try {
        await loadCart?.();
      } catch {}

      if (flow === 'register') {
        openSuccess();
      } else {
        closeAll();
      }
    } catch (e) {
      const msg = e.message || 'Ошибка подтверждения.';

      // эвристики для UX (как в верстке):
      // - login: если номер не зарегистрирован -> показать notice и вернуть в login
      if (flow === 'login') {
        if (e.status === 422 || e.status === 404 || /не зарегистрирован/i.test(msg)) {
          setShowNotRegistered(true);
          setActive('login');
        } else {
          setErrorText(msg);
        }
      } else {
        // register: если номер уже используется -> показать notice
        if (e.status === 422 || /уже используется|already/i.test(msg)) {
          setShowPhoneUsed(true);
          setActive('register');
        } else {
          setErrorText(msg);
        }
      }
    } finally {
      setLoading(false);
    }
  }

  async function resendCall() {
    // повторный запрос звонка из codeModal
    await requestCall();
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
      {active && <div className="modal-backdrop fade show" onClick={closeAll} />}

      <LoginModal
        isOpen={active === 'login'}
        onClose={closeAll}
        onOpenCode={requestCall}
        onOpenRegister={openRegister}
        phoneDigits={phoneDigits}
        setPhoneDigits={setPhoneDigits}
        showNotRegistered={showNotRegistered}
        loading={loading}
        errorText={errorText}
      />

      <RegisterModal
        isOpen={active === 'register'}
        onClose={closeAll}
        onOpenCode={requestCall}
        onOpenLogin={openLogin}
        username={username}
        setUsername={setUsername}
        phoneDigits={phoneDigits}
        setPhoneDigits={setPhoneDigits}
        email={email}
        setEmail={setEmail}
        consentPersonal={consentPersonal}
        setConsentPersonal={setConsentPersonal}
        consentMarketing={consentMarketing}
        setConsentMarketing={setConsentMarketing}
        showPhoneUsed={showPhoneUsed}
        loading={loading}
        errorText={errorText}
      />

      <CodeModal
        isOpen={active === 'code'}
        onClose={closeAll}
        callerNumberMasked={callerMasked}
        displayMessage={displayMessage}
        codeDigits={codeDigits}
        setCodeDigits={handleCodeDigitsChange}
        onSubmit={submitCode} // не обязателен, но пусть будет
        onResend={resendCall}
        loading={loading}
        errorText={errorText}
        countdownText="00:30"
      />

      <SuccessModal
        isOpen={active === 'success'}
        onClose={closeAll}
        username={username?.trim() || 'Имя'}
        email={email?.trim() || 'example@mail.ru'}
      />
    </AuthModalsContext.Provider>
  );
}

export function useAuthModals() {
  const ctx = useContext(AuthModalsContext);
  if (!ctx) throw new Error('useAuthModals must be used inside <AuthModalsProvider>');
  return ctx;
}
