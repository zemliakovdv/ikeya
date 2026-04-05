// components/profile/modals/EditPhoneModal.js
'use client';

import { useState, useRef, useEffect } from 'react';
import { requestPhoneChange, verifyPhoneChange } from '@/lib/api/account';

const STEPS = { PHONE: 'phone', CODE: 'code', SUCCESS: 'success' };
const RESEND_TIMEOUT = 30; // секунд

export default function EditPhoneModal({ profile, onClose, onSave }) {
  const [step,              setStep]              = useState(STEPS.PHONE);
  const [phone,             setPhone]             = useState('');
  const [digits,            setDigits]            = useState(['', '', '', '']);
  const [callerMasked,      setCallerMasked]      = useState('');
  const [loading,           setLoading]           = useState(false);
  const [error,             setError]             = useState('');
  const [countdown,         setCountdown]         = useState(0);

  const inputRefs = useRef([]);
  const timerRef  = useRef(null);

  // Запускаем таймер обратного отсчёта
  function startCountdown() {
    setCountdown(RESEND_TIMEOUT);
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) { clearInterval(timerRef.current); return 0; }
        return prev - 1;
      });
    }, 1000);
  }

  useEffect(() => () => clearInterval(timerRef.current), []);

  // Шаг 1 — запрашиваем звонок
  const handleRequestCall = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const resp = await requestPhoneChange(phone);
      setCallerMasked(resp?.caller_number_masked || '');
      startCountdown();
      setStep(STEPS.CODE);
    } catch (err) {
      setError(err.message || 'Ошибка отправки запроса');
    } finally {
      setLoading(false);
    }
  };

  // Повторный запрос звонка
  const handleResend = async () => {
    if (countdown > 0) return;
    setError('');
    try {
      const resp = await requestPhoneChange(phone);
      setCallerMasked(resp?.caller_number_masked || '');
      setDigits(['', '', '', '']);
      startCountdown();
      inputRefs.current[0]?.focus();
    } catch (err) {
      setError(err.message || 'Ошибка повторного запроса');
    }
  };

  // Ввод цифры в отдельное поле
  const handleDigitChange = (idx, value) => {
    const digit = value.replace(/\D/g, '').slice(-1);
    const next = [...digits];
    next[idx] = digit;
    setDigits(next);
    if (digit && idx < 3) {
      inputRefs.current[idx + 1]?.focus();
    }
  };

  const handleDigitKeyDown = (idx, e) => {
    if (e.key === 'Backspace' && !digits[idx] && idx > 0) {
      inputRefs.current[idx - 1]?.focus();
    }
  };

  // Шаг 2 — подтверждаем
  const handleVerifyCode = async () => {
    const code = digits.join('');
    if (code.length !== 4) return;
    setLoading(true);
    setError('');
    try {
      const updated = await verifyPhoneChange(phone, code);
      onSave?.(updated);
      setStep(STEPS.SUCCESS);
    } catch (err) {
      setError(err.message || 'Неверный код');
      setDigits(['', '', '', '']);
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const formatCountdown = (s) => {
    const mm = String(Math.floor(s / 60)).padStart(2, '0');
    const ss = String(s % 60).padStart(2, '0');
    return `${mm}:${ss}`;
  };

  return (
    <div className="modal fade show d-block" onClick={onClose} id="editPhoneModal">
      <div className="modal-dialog modal-dialog-centered" onClick={e => e.stopPropagation()}>
        <div className="modal-content">

          {/* Шаг 1 — ввод нового номера */}
          {step === STEPS.PHONE && (
            <>
              <div className="modal-header">
                <h5 className="modal-title">Смена телефона</h5>
                <button type="button" className="btn-close" onClick={onClose} aria-label="Закрыть" />
              </div>
              <div className="modal-body">
                <form onSubmit={handleRequestCall}>
                  <div className="form-group form-floating">
                    <input
                      type="tel" className="form-control" id="phone"
                      placeholder="375291112233"
                      value={phone}
                      onChange={e => setPhone(e.target.value.replace(/\D/g, ''))}
                      required
                    />
                    <label htmlFor="phone">Новый номер телефона</label>
                  </div>
                  <div className="form-info">
                    <p className="info-text">
                      Подробнее об <a href="#" className="info-link">условиях обработки</a> и <a href="#" className="info-link">правах, связанных с обработкой</a>
                    </p>
                  </div>
                  {error && <p style={{ color: '#b71c1c', fontSize: '14px', marginBottom: '12px' }}>{error}</p>}
                  <div className="modal-footer-buttons">
                    <button type="button" className="btn btn-outline" onClick={onClose} disabled={loading}>Отмена</button>
                    <button type="submit" className="btn btn-primary" disabled={loading || !phone}>
                      {loading ? 'Отправляем…' : 'Получить звонок'}
                    </button>
                  </div>
                </form>
              </div>
            </>
          )}

          {/* Шаг 2 — 4 отдельных поля для цифр */}
          {step === STEPS.CODE && (
            <>
              <div className="modal-header">
                <h5 className="modal-title">Идентификация пользователя</h5>
                <button type="button" className="btn-close" onClick={onClose} aria-label="Закрыть" />
              </div>
              <div className="modal-body">
                <p className="confirmation-text" style={{ marginBottom: '20px' }}>
                  Главное безопасность!<br />
                  Введите последние 4 цифры номера, с которого мы звоним на Ваш номер:
                  {callerMasked && <> <strong>{callerMasked}</strong></>}
                </p>

                {/* 4 отдельных поля */}
                <div className="code-inputs">
                  {digits.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={el => inputRefs.current[idx] = el}
                      type="text"
                      inputMode="numeric"
                      className="code-input"
                      maxLength={1}
                      value={digit}
                      onChange={e => handleDigitChange(idx, e.target.value)}
                      onKeyDown={e => handleDigitKeyDown(idx, e)}
                      autoFocus={idx === 0}
                    />
                  ))}
                </div>

                {error && <p style={{ color: '#b71c1c', fontSize: '14px', marginTop: '12px' }}>{error}</p>}

                {/* Таймер повторного запроса */}
                <div style={{ textAlign: 'center', marginTop: '16px' }}>
                  {countdown > 0 ? (
                    <span className="resend-timer">
                      Повторный запрос звонка через {formatCountdown(countdown)}
                    </span>
                  ) : (
                    <button
                      type="button"
                      className="resend-link"
                      onClick={handleResend}
                    >
                      Запросить звонок повторно
                    </button>
                  )}
                </div>

                <div className="modal-footer-buttons" style={{ marginTop: '20px' }}>
                  <button
                    type="button" className="btn btn-outline"
                    onClick={() => { setStep(STEPS.PHONE); setDigits(['', '', '', '']); setError(''); }}
                    disabled={loading}
                  >
                    Назад
                  </button>
                  <button
                    type="button" className="btn btn-primary"
                    onClick={handleVerifyCode}
                    disabled={loading || digits.join('').length !== 4}
                  >
                    {loading ? 'Проверяем…' : 'Подтвердить'}
                  </button>
                </div>
              </div>
            </>
          )}

          {/* Шаг 3 — успех */}
          {step === STEPS.SUCCESS && (
            <>
              <div className="modal-header">
                <h5 className="modal-title">Телефон изменён</h5>
                <button type="button" className="btn-close" onClick={onClose} aria-label="Закрыть" />
              </div>
              <div className="modal-body">
                <p className="confirmation-text">
                  Ваш номер телефона успешно изменён на <strong>{phone}</strong>
                </p>
                <div className="modal-footer-single">
                  <button type="button" className="btn btn-primary btn-full" onClick={onClose}>Закрыть</button>
                </div>
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  );
}