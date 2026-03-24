// src/components/auth/CodeModal.js
'use client';

import { useEffect, useRef, useState } from 'react';

export default function CodeModal({
  isOpen,
  onClose,
  callerNumberMasked = '',
  displayMessage = '',
  codeDigits,
  setCodeDigits,
  onSubmit,
  onResend,
  loading = false,
  errorText = '',
}) {
  const inputsRef = useRef([]);
  const [countdown, setCountdown] = useState(30);
  const timerRef = useRef(null);

  // Фокус на первый инпут при открытии + запуск таймера
  useEffect(() => {
    if (!isOpen) return;
    setTimeout(() => inputsRef.current?.[0]?.focus?.(), 0);
    setCountdown(30);
    startTimer();
    return () => clearInterval(timerRef.current);
  }, [isOpen]);

  function startTimer() {
    clearInterval(timerRef.current);
    setCountdown(30);
    timerRef.current = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }

  async function handleResend() {
    if (countdown > 0) return;
    await onResend?.();
    startTimer();
  }

  function setDigit(idx, raw) {
    const d = (raw || '').replace(/\D/g, '').slice(0, 1);
    const next = [...codeDigits];
    next[idx] = d;
    setCodeDigits(next);
    if (d && idx < 3) inputsRef.current[idx + 1]?.focus?.();
  }

  function onKeyDown(idx, e) {
    if (e.key !== 'Backspace') return;
    if (codeDigits[idx]) { setDigit(idx, ''); return; }
    if (idx > 0) inputsRef.current[idx - 1]?.focus?.();
  }

  function handlePaste(e) {
    const text = (e.clipboardData?.getData('text') || '').replace(/\D/g, '').slice(0, 4);
    if (!text) return;
    e.preventDefault();
    const next = [text[0] || '', text[1] || '', text[2] || '', text[3] || ''];
    setCodeDigits(next);
    const lastIdx = Math.min(text.length, 4) - 1;
    if (lastIdx >= 0) inputsRef.current[lastIdx]?.focus?.();
  }

  const noteText = displayMessage ||
    `Введите последние 4 цифры номера, с которого мы звоним на Ваш номер: ${callerNumberMasked}`;

  const countdownFormatted = `00:${String(countdown).padStart(2, '0')}`;
  const canResend = countdown === 0;

  return (
    <div
      className={`modal fade login-code ${isOpen ? 'show' : ''}`}
      id="codeModal"
      tabIndex="-1"
      aria-labelledby="codeModalLabel"
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
            <h1 className="modal-title" id="codeModalLabel">
              Подтверждение входа
            </h1>
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={onClose}
            />
          </div>

          <div className="modal-body">
            <div className="code-modal-inner">
              <p className="note">{noteText}</p>

              <div className="aply-code" onPaste={handlePaste}>
                {[0, 1, 2, 3].map((i) => (
                  <input
                    key={i}
                    ref={(el) => (inputsRef.current[i] = el)}
                    type="text"
                    className="codes"
                    inputMode="numeric"
                    maxLength={1}
                    value={codeDigits?.[i] || ''}
                    onChange={(e) => setDigit(i, e.target.value)}
                    onKeyDown={(e) => onKeyDown(i, e)}
                    style={{ borderColor: errorText ? '#B71C1C' : undefined }}
                  />
                ))}
              </div>

              {!!errorText && (
                <p style={{ color: '#B71C1C', marginTop: 10, fontSize: 14 }}>{errorText}</p>
              )}

              <a
                href="#"
                onClick={(e) => { e.preventDefault(); handleResend(); }}
                style={{
                  display: 'block',
                  marginTop: 10,
                  color: canResend ? '#0058A3' : '#9e9e9e',
                  pointerEvents: canResend ? 'auto' : 'none',
                  cursor: canResend ? 'pointer' : 'default',
                }}
              >
                {canResend
                  ? 'Запросить звонок повторно'
                  : <>Повторный запрос звонка через <span className="code-count">{countdownFormatted}</span></>
                }
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}