// components/profile/modals/SmsVerifyModal.js
'use client';

import { useState, useRef, useEffect } from 'react';

const RESEND_TIMEOUT = 30;

/**
 * Универсальная модалка верификации по звонку.
 *
 * Props:
 *   userPhone     {string}   — номер пользователя (показываем в тексте "звоним на Ваш номер")
 *   callerNumber  {string}   — маскированный номер звонящего (не показываем пользователю)
 *   onVerify      {function} — (digits: string) => Promise<void>
 *   onResend      {function} — () => Promise<void>
 *   onClose       {function}
 *   loading       {boolean}
 *   error         {string}
 */
export default function SmsVerifyModal({
  userPhone = '',
  callerNumber = '',
  onVerify,
  onResend,
  onClose,
  loading = false,
  error = '',
}) {
  const [digits,    setDigits]    = useState(['', '', '', '']);
  const [countdown, setCountdown] = useState(RESEND_TIMEOUT);

  const inputRefs = useRef([]);
  const timerRef  = useRef(null);

  // Запускаем таймер при монтировании
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) { clearInterval(timerRef.current); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, []);

  function formatCountdown(s) {
    const mm = String(Math.floor(s / 60)).padStart(2, '0');
    const ss = String(s % 60).padStart(2, '0');
    return `${mm}:${ss}`;
  }

  function handleDigitChange(idx, value) {
    const digit = value.replace(/\D/g, '').slice(-1);
    const next = [...digits];
    next[idx] = digit;
    setDigits(next);
    if (digit && idx < 3) {
      inputRefs.current[idx + 1]?.focus();
    }
    // Автосабмит когда введена последняя цифра
    if (digit && idx === 3) {
      const code = [...next].join('');
      if (code.length === 4) onVerify?.(code);
    }
  }

  function handleKeyDown(idx, e) {
    if (e.key === 'Backspace' && !digits[idx] && idx > 0) {
      inputRefs.current[idx - 1]?.focus();
    }
  }

  async function handleResend() {
    if (countdown > 0) return;
    await onResend?.();
    setDigits(['', '', '', '']);
    setCountdown(RESEND_TIMEOUT);
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) { clearInterval(timerRef.current); return 0; }
        return prev - 1;
      });
    }, 1000);
    inputRefs.current[0]?.focus();
  }

  function handleSubmit() {
    const code = digits.join('');
    if (code.length !== 4) return;
    onVerify?.(code);
  }

  const isFilled = digits.join('').length === 4;

  return (
   <div className="modal fade show d-block" style={{ zIndex: 1057 }} onClick={onClose}>
      <div className="modal-dialog modal-dialog-centered" onClick={e => e.stopPropagation()}>
        <div className="modal-content">

          <div className="modal-header">
            <h5 className="modal-title">Идентификация пользователя</h5>
            <button type="button" className="btn-close" onClick={onClose} aria-label="Закрыть" />
          </div>

          <div className="modal-body">
            <p className="sms-verify__text">
              Главное безопасность!<br />
              Введите последние 4 цифры номера, с которого мы звоним на Ваш номер:
              {userPhone && <> <strong>{userPhone}</strong></>}
            </p>

            {/* 4 отдельных поля */}
            <div className="sms-verify__inputs">
              {digits.map((digit, idx) => (
                <input
                  key={idx}
                  ref={el => inputRefs.current[idx] = el}
                  type="text"
                  inputMode="numeric"
                  className="sms-verify__input"
                  maxLength={1}
                  value={digit}
                  onChange={e => handleDigitChange(idx, e.target.value)}
                  onKeyDown={e => handleKeyDown(idx, e)}
                  autoFocus={idx === 0}
                  disabled={loading}
                />
              ))}
            </div>

            {error && (
              <p className="sms-verify__error">{error}</p>
            )}

            {/* Таймер / повторный запрос */}
            <div className="sms-verify__resend">
              {countdown > 0 ? (
                <span className="sms-verify__resend-timer">
                  Повторный запрос звонка через {formatCountdown(countdown)}
                </span>
              ) : (
                <button
                  type="button"
                  className="sms-verify__resend-btn"
                  onClick={handleResend}
                  disabled={loading}
                >
                  Запросить звонок повторно
                </button>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}