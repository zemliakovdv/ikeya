// src/components/auth/CodeModal.js
'use client';

import { useEffect, useRef } from 'react';

export default function CodeModal({
  isOpen,
  onClose,

  // Данные для текста (из /a1/request)
  callerNumberMasked = '', // например "+375 29 965 10 23" (mask)
  displayMessage = '',     // если бэк отдает готовый текст — приоритетнее

  // Код (4 цифры)
  codeDigits,              // массив ['','','',''] или строка "1234" (лучше массив)
  setCodeDigits,           // (nextArr) => void

  // Действия
  onSubmit,                // подтвердить (a1/verify -> auth/phone/verify)
  onResend,                // повторный запрос звонка (a1/request)

  // UI state
  loading = false,
  errorText = '',
  // Таймер отображаем как строку "00:30" (если пока не реализован, можно передавать константу)
  countdownText = '00:30',
}) {
  const inputsRef = useRef([]);

  // фокус на первый инпут при открытии
  useEffect(() => {
    if (!isOpen) return;
    setTimeout(() => inputsRef.current?.[0]?.focus?.(), 0);
  }, [isOpen]);

  function setDigit(idx, raw) {
    const d = (raw || '').replace(/\D/g, '').slice(0, 1);

    const next = [...codeDigits];
    next[idx] = d;
    setCodeDigits(next);

    if (d && idx < 3) {
      inputsRef.current[idx + 1]?.focus?.();
    }
  }

  function onKeyDown(idx, e) {
    if (e.key !== 'Backspace') return;

    if (codeDigits[idx]) {
      setDigit(idx, '');
      return;
    }
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

  const noteText =
    displayMessage ||
    `Введите последние 4 цифры номера, с которого мы звоним на Ваш номер: ${callerNumberMasked}`;

  const fullCode = (codeDigits || []).join('');

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
                  />
                ))}
              </div>

              {!!errorText && (
                <p style={{ color: 'crimson', marginTop: 10 }}>{errorText}</p>
              )}

              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  onResend?.();
                }}
                style={{ display: 'inline-block', marginTop: 10 }}
              >
                Повторный запрос звонка через <span className="code-count">{countdownText}</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
