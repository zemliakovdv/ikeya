// components/auth/AuthModalsHost.js
'use client';

import { createContext, useContext, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { phoneSend, phoneVerify, phoneCheck } from '@/lib/api/auth';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { getCartToken, getCart } from '@/lib/api/cart';

import LoginModal    from '@/components/auth/LoginModal';
import CodeModal     from '@/components/auth/CodeModal';
import RegisterModal from '@/components/auth/RegisterModal';
import SuccessModal  from '@/components/auth/SuccessModal';

const AuthModalsContext = createContext(null);

export function AuthModalsProvider({ children }) {
  const { setAuth } = useAuth();
  const router = useRouter();
  const redirectAfterAuth = useRef(null);
  const { mergeGuestCart } = useCart();
  const [active, setActive]   = useState(null); // null|'login'|'register'|'code'|'success'
  const [flow,   setFlow]     = useState('login'); // 'login'|'register'

  // форма
  const [phoneDigits,       setPhoneDigits]       = useState('');
  const [username,          setUsername]           = useState('');
  const [email,             setEmail]              = useState('');
  const [consentPersonal,   setConsentPersonal]    = useState(true);
  const [consentMarketing,  setConsentMarketing]   = useState(true);

  // code modal
  const [codeDigits,    setCodeDigits]    = useState(['', '', '', '']);
  const [sendMessage,   setSendMessage]   = useState(''); // { message } из phoneSend

  // UI
  const [loading,           setLoading]           = useState(false);
  const [errorText,         setErrorText]          = useState('');
  const [showNotRegistered, setShowNotRegistered]  = useState(false);
  const [showPhoneUsed,     setShowPhoneUsed]      = useState(false);

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

  function openLogin(redirectTo = null) {
    resetUi();
    redirectAfterAuth.current = redirectTo;
    setFlow('login');
    setActive('login');
  }

  function openRegister() {
    resetUi();
    setPhoneDigits('');
    setFlow('register');
    setActive('register');
  }

  function openCode()    { resetUi(); setActive('code');    }
  function openSuccess() { resetUi(); setActive('success'); }

  function fullPhone() {
    return `375${(phoneDigits || '').replace(/\D/g, '').slice(0, 9)}`;
  }

  // ===== Шаг 1: запрос звонка =====

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
      // Проверяем существование номера
      const checkResp = await phoneCheck({ phone });
      if (flow === 'login' && !checkResp.exists) {
        setShowNotRegistered(true);
        return;
      }
      if (flow === 'register' && checkResp.exists) {
        setShowPhoneUsed(true);
        return;
      }

      const resp = await phoneSend({ phone });
      console.log('📞 phoneSend response:', resp);
      setSendMessage(resp.message || '');
      setCodeDigits(['', '', '', '']);
      openCode();
    } catch (e) {
      setErrorText(e.message || 'Не удалось запросить звонок.');
    } finally {
      setLoading(false);
    }
  }

  // ===== Шаг 2: авто-сабмит при вводе 4-й цифры =====

  async function handleCodeDigitsChange(nextDigits) {
    setCodeDigits(nextDigits);
    const code = nextDigits.join('');
    if (code.length !== 4 || !/^\d{4}$/.test(code)) return;
    await submitCode(code);
  }

  // ===== Шаг 2: подтверждение кода =====

  async function submitCode(code) {
    resetUi();

    const phone = fullPhone();

    setLoading(true);
    try {
      // ✅ Сохраняем гостевые товары ДО логина
      const guestCartResp = await getCart();
      const guestItems = guestCartResp?.cart?.items || [];
      console.log('🛒 guestItems:', guestItems, 'cart:', guestCartResp?.cart);

      const resp = await phoneVerify({
        phone,
        code,
        cart_token: getCartToken(),
        ...(flow === 'register' && {
          username: username.trim() || undefined,
          email:    email.trim()    || undefined,
        }),
      });

      console.log('✅ phoneVerify response:', resp);

      // ✅ Пишем auth_token в localStorage — addToCart уже уйдёт авторизованным
      setAuth({ token: resp.token, user: resp.user || null });

      // ✅ Переносим гостевые товары через CartContext — он знает актуальный токен и стейт
      await mergeGuestCart(guestItems);

      // ✅ Только теперь говорим CartContext перезагрузить корзину —
      // все товары уже на сервере, получим актуальное состояние
      window.dispatchEvent(new Event('auth-change-done'));

      if (resp.is_new || flow === 'register') {
        openSuccess();
      } else {
        closeAll();
        if (redirectAfterAuth.current) { router.push(redirectAfterAuth.current); redirectAfterAuth.current = null; }
      }
    } catch (e) {
      const msg = e.message || 'Ошибка подтверждения.';
      console.error('❌ phoneVerify error:', e);

      if (flow === 'login') {
        if (e.status === 401) {
          setErrorText('Неверный или просроченный код. Попробуйте ещё раз.');
        } else if (e.status === 422 || /не зарегистрирован/i.test(msg)) {
          setShowNotRegistered(true);
          setActive('login');
        } else {
          setErrorText(msg);
        }
      } else {
        if (e.status === 401) {
          setErrorText('Неверный или просроченный код. Попробуйте ещё раз.');
        } else if (e.status === 422 || /уже используется|already/i.test(msg)) {
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
    await requestCall();
  }

  const ctxValue = { openLogin, openRegister, closeAll };

  return (
    <AuthModalsContext.Provider value={ctxValue}>
      {children}

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
        displayMessage={
          sendMessage ||
          'Введите последние 4 цифры номера, с которого мы позвонили вам'
        }
        codeDigits={codeDigits}
        setCodeDigits={handleCodeDigitsChange}
        onSubmit={() => submitCode(codeDigits.join(''))}
        onResend={resendCall}
        loading={loading}
        errorText={errorText}
        countdownText="00:30"
      />

      <SuccessModal
        isOpen={active === 'success'}
        onClose={() => { closeAll(); if (redirectAfterAuth.current) { router.push(redirectAfterAuth.current); redirectAfterAuth.current = null; } }}
        username={username?.trim() || 'Имя'}
        email={email?.trim() || ''}
      />
    </AuthModalsContext.Provider>
  );
}

export function useAuthModals() {
  const ctx = useContext(AuthModalsContext);
  if (!ctx) throw new Error('useAuthModals must be used inside <AuthModalsProvider>');
  return ctx;
}