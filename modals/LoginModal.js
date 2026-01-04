'use client';

import { useState } from 'react';

export default function LoginModal() {
  const [phone, setPhone] = useState('');
  const [showError, setShowError] = useState(false);

  const handlePhoneChange = (e) => {
    // Только цифры, максимум 9 символов
    const value = e.target.value.replace(/\D/g, '').slice(0, 9);
    setPhone(value);
    setShowError(false);
  };

  const handleGetCode = () => {
    if (phone.length < 9) {
      setShowError(true);
      return;
    }
    // Здесь логика отправки кода
    console.log('Отправка кода на +375' + phone);
  };

  return (
    <div 
      className="modal fade login-modal" 
      id="loginModal" 
      tabIndex="-1" 
      aria-labelledby="loginModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h1 className="modal-title up-the-hide" id="loginModalLabel">
              Вход в систему
            </h1>
            <button 
              type="button" 
              className="btn-close" 
              data-bs-dismiss="modal" 
              aria-label="Close"
            ></button>
          </div>
          
          <div className="modal-body">
            <div className="login-modal-inner">
              <div className="login-container">
                <div className="login-card">
                  
                  {/* Поле ввода телефона */}
                  <div className="phone-input-group">
                    
                    {/* Уведомление об ошибке */}
                    <div className={`login-notice ${!showError ? 'the-hide' : ''}`}>
                      <img src="/assets/img/icons/alert-fill.svg" alt="" />
                      <p>
                        Данный номер не зарегистрирован. Проверьте правильность ввода или зарегистрируйтесь.
                      </p>
                    </div>
                    
                    {/* Контейнер инпута */}
                    <div className="phone-input-container" id="phoneContainer">
                      <div className="country-code">
                        <span className="flag-icon">
                          <img src="/assets/img/icons/rb.svg" alt="BY" />
                        </span>
                        <span>+375</span>
                      </div>
                      <input 
                        type="tel" 
                        className="phone-input" 
                        id="phoneInput" 
                        placeholder="25 895 26 84"
                        inputMode="numeric" 
                        maxLength="9"
                        value={phone}
                        onChange={handlePhoneChange}
                      />
                    </div>
                  </div>

                  {/* Кнопка получения кода */}
                  <button 
                    className="get-code-btn" 
                    id="getCodeBtn"
                    onClick={handleGetCode}
                    data-bs-toggle="modal"
                    data-bs-target="#codeModal"
                  >
                    Получить код
                  </button>

                  {/* Ссылка на регистрацию */}
                  <div className="register-link">
                    <a 
                      href="#" 
                      data-bs-toggle="modal" 
                      data-bs-target="#regModal"
                    >
                      Зарегистрироваться
                    </a>
                  </div>
                  
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
