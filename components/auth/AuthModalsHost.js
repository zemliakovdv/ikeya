// components/auth/AuthModalsHost.js
'use client';

import { createContext, useContext, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { phoneSend, phoneVerify, phoneCheck } from '@/lib/api/auth';
import { useAuth } from '@/contexts/AuthContext';
import { getCartToken, getCart, setCartToken } from '@/lib/api/cart';

import LoginModal from '@/components/auth/LoginModal';
import CodeModal from '@/components/auth/CodeModal';
import RegisterModal from '@/components/auth/RegisterModal';
import SuccessModal from '@/components/auth/SuccessModal';
import { isBelarusPhoneComplete, toBelarusPhoneApiValue } from '@/lib/utils/phone';

const AuthModalsContext = createContext(null);
const PROFILE_PERSONAL_DATA_PATH = '/profile/personal-data';

export function AuthModalsProvider({ children }) {
  const { setAuth } = useAuth();
  const router = useRouter();
  const redirectAfterAuth = useRef(null);
  const [active, setActive] = useState(null); // null|'login'|'register'|'code'|'success'
  const [authMode, setAuthMode] = useState('login'); // 'login'|'register'
  const [userExists, setUserExists] = useState(null); // null|boolean

  // форма
  const [phoneDigits, setPhoneDigits] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [consentPersonal, setConsentPersonal] = useState(true);
  const [consentMarketing, setConsentMarketing] = useState(true);

  // code modal
  const [codeDigits, setCodeDigits] = useState(['', '', '', '']);
  const [sendMessage, setSendMessage] = useState(''); // { message } из phoneSend

  // UI
  const [loading, setLoading] = useState(false);
  const [errorText, setErrorText] = useState('');
  const [needsConsentRetry, setNeedsConsentRetry] = useState(false);

  // ===== helpers =====

  function resetUi() {
    setErrorText('');
  }

  function resetFlowState({ keepPhone = false } = {}) {
    resetUi();
    setUserExists(null);
    setAuthMode('login');
    setUsername('');
    setEmail('');
    setConsentPersonal(true);
    setConsentMarketing(true);
    setCodeDigits(['', '', '', '']);
    setSendMessage('');
    setNeedsConsentRetry(false);
    if (!keepPhone) setPhoneDigits('');
  }

  function closeAll(reason = 'user') {
    setActive(null);
    resetUi();

    if (reason === 'user' && typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('auth-modal-closed', {
        detail: { reason },
      }));
    }
  }

  function openLogin(redirectTo = null) {
    resetFlowState();
    redirectAfterAuth.current = redirectTo;
    setAuthMode('login');
    setActive('login');
  }

  function openRegister() {
    resetFlowState();
    setAuthMode('register');
    setActive('register');
  }

  function switchToRegister() {
    resetUi();
    setUserExists(null);
    setCodeDigits(['', '', '', '']);
    setSendMessage('');
    setNeedsConsentRetry(false);
    setAuthMode('register');
    setActive('register');
  }

  function switchToLogin() {
    resetUi();
    setUserExists(null);
    setCodeDigits(['', '', '', '']);
    setSendMessage('');
    setNeedsConsentRetry(false);
    setAuthMode('login');
    setActive('login');
  }

  function openCode() { resetUi(); setActive('code'); }
  function openSuccess() { resetUi(); setActive('success'); }

  function resetCodeWithError(message) {
    setCodeDigits(['', '', '', '']);
    setActive('code');
    setErrorText(message);
  }

  function fullPhone() {
    return toBelarusPhoneApiValue(phoneDigits);
  }

  function handlePhoneDigitsChange(value) {
    setPhoneDigits(value);
    if (errorText) setErrorText('');
  }

  const isNewUser = authMode === 'register' && userExists === false;

  async function sendCode(phone) {
    const resp = await phoneSend({ phone });
    setSendMessage(resp.message || '');
    setCodeDigits(['', '', '', '']);
    setNeedsConsentRetry(false);
    openCode();
  }

  // ===== Шаг 1: проверка телефона =====

  async function submitPhone() {
    resetUi();
    setNeedsConsentRetry(false);

    const phone = fullPhone();
    if (!isBelarusPhoneComplete(phoneDigits) || !phone) {
      setErrorText('Введите корректный номер (9 цифр после +375).');
      return;
    }

    setLoading(true);
    try {
      const checkResp = await phoneCheck({ phone });

      setUserExists(Boolean(checkResp.exists));

      if (checkResp.exists) {
        await sendCode(phone);
        return;
      }

      setErrorText('Пользователь с таким номером не найден. Зарегистрируйтесь.');
    } catch (e) {
      setErrorText(e.message || 'Не удалось запросить звонок.');
    } finally {
      setLoading(false);
    }
  }

  async function requestRegistrationCode() {
    resetUi();

    const phone = fullPhone();
    if (!isBelarusPhoneComplete(phoneDigits) || !phone) {
      setErrorText('Введите корректный номер (9 цифр после +375).');
      return;
    }
    if (!username.trim()) {
      setErrorText('Введите имя.');
      return;
    }
    if (!consentPersonal) {
      setErrorText('Нужно согласие на обработку персональных данных.');
      return;
    }

    const existingCode = codeDigits.join('');
    if (needsConsentRetry && /^\d{4}$/.test(existingCode)) {
      await submitCode(existingCode);
      return;
    }

    setLoading(true);
    try {
      const checkResp = await phoneCheck({ phone });

      setUserExists(Boolean(checkResp.exists));

      if (checkResp.exists) {
        setErrorText('Пользователь с таким номером уже зарегистрирован. Войдите.');
        return;
      }

      await sendCode(phone);
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
      // Читаем гостевую корзину до логина только чтобы сохранить текущий порядок flow.
      // Повторно переносить эти товары после phoneVerify нельзя: бэк уже мержит корзину по cart_token.
      await getCart();

      const normalizedUsername = username.trim();
      const normalizedEmail = email.trim();
      const resp = await phoneVerify({
        phone,
        code,
        cart_token: getCartToken(),
        ...(isNewUser && {
          username: normalizedUsername || undefined,
          first_name: normalizedUsername || undefined,
          email: normalizedEmail || undefined,
          personal_data_consent: true,
        }),
      });

      // ✅ Пишем auth_token в localStorage — addToCart уже уйдёт авторизованным
      const hasToken = Boolean(resp?.token);
      if (!hasToken) {
        throw new Error('Не удалось завершить авторизацию. Попробуйте запросить код ещё раз.');
      }

      const authUser = isNewUser
        ? {
            ...(resp.user || {}),
            username: resp.user?.username || normalizedUsername || undefined,
            first_name: resp.user?.first_name || normalizedUsername || undefined,
            email: resp.user?.email || normalizedEmail || undefined,
            phone: resp.user?.phone || phone || undefined,
          }
        : resp.user || null;
      setAuth({ token: resp.token, user: authUser });

      if (resp.cart_token) {
        setCartToken(resp.cart_token);
      }

      // Бэк сливает корзины через cart_token в phoneVerify — просто перезагружаем
      window.dispatchEvent(new Event('auth-change-done'));
      setTimeout(() => {
        window.dispatchEvent(new Event('guest-cart-merge-done'));
      }, 1000);

      const hasPendingCheckout = sessionStorage.getItem('pendingCheckout') === '1';

      if (hasPendingCheckout) {
        closeAll('checkout-success');
        return;
      }

      const registeredNewUser =
        isNewUser ||
        resp?.is_new === true ||
        resp?.is_new === 'true' ||
        resp?.new_user === true ||
        resp?.user?.is_new === true;

      closeAll('success');

      if (registeredNewUser) {
        router.push(PROFILE_PERSONAL_DATA_PATH);
        return;
      }

      if (redirectAfterAuth.current) {
        router.push(redirectAfterAuth.current);
        redirectAfterAuth.current = null;
      }
    } catch (e) {
      const msg = e.message || 'Ошибка подтверждения.';

      if (e.status === 401 && e.payload?.code === 'personal_data_consent_required') {
        setNeedsConsentRetry(true);
        setUserExists(false);
        setConsentPersonal(false);
        setAuthMode('register');
        setActive('register');
        setErrorText('Для завершения регистрации нужно согласие на обработку персональных данных.');
      } else if (e.status === 401) {
        resetCodeWithError('Неверный или просроченный код. Попробуйте ещё раз.');
      } else if (!isNewUser) {
        if (e.status === 422 || /не зарегистрирован/i.test(msg)) {
          setActive('login');
          setErrorText('Данный номер не зарегистрирован. Проверьте номер или продолжите регистрацию.');
        } else {
          resetCodeWithError(msg);
        }
      } else {
        if (/уже используется|already/i.test(msg)) {
          setActive('register');
          setErrorText('Этот номер уже используется. Проверьте номер и попробуйте войти.');
        } else {
          resetCodeWithError(msg);
        }
      }
    } finally {
      setLoading(false);
    }
  }

  async function resendCall() {
    resetUi();
    setLoading(true);
    try {
      await sendCode(fullPhone());
    } catch (e) {
      setErrorText(e.message || 'Не удалось запросить звонок.');
    } finally {
      setLoading(false);
    }
  }

  const ctxValue = { openLogin, openRegister, closeAll };

  return (
    <AuthModalsContext.Provider value={ctxValue}>
      {children}

      {active && <div className="modal-backdrop fade show" onClick={closeAll} />}

      {active === 'login' && (
        <LoginModal
          isOpen={true}
          onClose={closeAll}
          onOpenCode={submitPhone}
          onOpenRegister={switchToRegister}
          phoneDigits={phoneDigits}
          setPhoneDigits={handlePhoneDigitsChange}
          loading={loading}
          errorText={errorText}
        />
      )}

      {active === 'register' && (
        <RegisterModal
          isOpen={true}
          onClose={closeAll}
          onOpenCode={requestRegistrationCode}
          onOpenLogin={switchToLogin}
          username={username}
          setUsername={setUsername}
          phoneDigits={phoneDigits}
          setPhoneDigits={handlePhoneDigitsChange}
          email={email}
          setEmail={setEmail}
          consentPersonal={consentPersonal}
          setConsentPersonal={setConsentPersonal}
          consentMarketing={consentMarketing}
          setConsentMarketing={setConsentMarketing}
          loading={loading}
          errorText={errorText}
          isPhoneLocked={needsConsentRetry}
          submitLabel={needsConsentRetry ? 'Подтвердить согласие' : 'Получить код'}
        />
      )}

      {active === 'code' && (
        <CodeModal
          isOpen={true}
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
      )}

      {active === 'success' && (
        <SuccessModal
          isOpen={true}
          onClose={() => { closeAll(); if (redirectAfterAuth.current) { router.push(redirectAfterAuth.current); redirectAfterAuth.current = null; } }}
          username={username?.trim() || 'Имя'}
          email={email?.trim() || ''}
        />
      )}
    </AuthModalsContext.Provider>
  );
}

export function useAuthModals() {
  const ctx = useContext(AuthModalsContext);
  if (!ctx) throw new Error('useAuthModals must be used inside <AuthModalsProvider>');
  return ctx;
}
