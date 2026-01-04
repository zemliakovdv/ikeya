'use client';

import { useState, useEffect, useRef } from 'react';

export default function CodeModal({ phoneNumber = '+375 29 570 67 31' }) {
  const [code, setCode] = useState(['', '', '', '']);
  const [timer, setTimer] = useState(30);
  const inputRefs = useRef([]);

  // Таймер обратного отсчёта
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  // Форматирование времени
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Обработка ввода цифр
  const handleInput = (index, value) => {
    // Только цифры
    const numericValue = value.replace(/\D/g, '');
    
    if (numericValue) {
      const newCode = [...code];
      newCode[index] = numericValue;
      setCode(newCode);

      // Автоматический переход на следующее поле
      if (index < 3) {
        inputRefs.current[index + 1]?.focus();
      }

      // Если все 4 цифры введены — автоматическая отправка
      if (newCode.every(digit => digit !== '')) {
        handleSubmit(newCode.join(''));
      }
    }
  };

  // Обработка удаления
  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace') {
      if (code[index] === '' && index > 0) {
        // Переход на предыдущее поле
        inputRefs.current[index - 1]?.focus();
      } else {
        // Удаление текущей цифры
        const newCode = [...code];
        newCode[index] = '';
        setCode(newCode);
      }
    }
  };

  // Вставка из буфера обмена
  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 4);
    const newCode = pastedData.split('');
    
    while (newCode.length < 4) {
      newCode.push('');
    }
    
    setCode(newCode);
    
    // Фокус на последнем заполненном поле
    const lastFilledIndex = pastedData.length - 1;
    if (lastFilledIndex >= 0 && lastFilledIndex < 4) {
      inputRefs.current[lastFilledIndex]?.focus();
    }
  };

  // Отправка кода
  const handleSubmit = (fullCode) => {
    console.log('Введённый код:', fullCode);
    // Здесь логика проверки кода
    // После успешной проверки открываем #succsModal
  };

  // Повторный запрос звонка
  const handleResend = () => {
    if (timer === 0) {
      setTimer(30);
      setCode(['', '', '', '']);
      inputRefs.current[0]?.focus();
      console.log('Повторный запрос звонка');
    }
  };

  return (
    <div 
      className="modal fade login-code" 
      id="codeModal" 
      tabIndex="-1" 
      aria-labelledby="codeModalLabel" 
      aria-hidden="true"
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h1 className="modal-title" id="codeModalLabel">
              Подтверждение входа
            </h1>
            <button 
              type="button" 
              className="btn-close" 
              data-bs-dismiss="modal" 
              aria-label="Close"
            ></button>
          </div>
          
          <div className="modal-body">
            <div className="code-modal-inner">
              <p className="note">
                Введите последние 4 цифры номера, с которого мы звоним на Ваш номер: {phoneNumber}
              </p>
              
              {/* Поля для ввода кода */}
              <div className="aply-code">
                {code.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    className="codes"
                    inputMode="numeric"
                    maxLength="1"
                    value={digit}
                    onChange={(e) => handleInput(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={index === 0 ? handlePaste : undefined}
                    autoFocus={index === 0}
                  />
                ))}
              </div>
              
              {/* Повторный запрос */}
              <a 
                href="#" 
                onClick={(e) => {
                  e.preventDefault();
                  handleResend();
                }}
                style={{ 
                  pointerEvents: timer > 0 ? 'none' : 'auto',
                  opacity: timer > 0 ? 0.5 : 1 
                }}
                data-bs-toggle={timer === 0 ? "modal" : ""}
                data-bs-target={timer === 0 ? "#succsModal" : ""}
              >
                Повторный запрос звонка через{' '}
                <span className="code-count">{formatTime(timer)}</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
