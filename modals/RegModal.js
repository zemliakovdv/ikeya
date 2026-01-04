'use client';

import { useState } from 'react';

export default function RegModal({ onRegister }) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    agreePersonalData: true,
    agreeMarketing: true
  });
  const [showError, setShowError] = useState(false);
  const [errors, setErrors] = useState({});

  // Обработка изменения полей
  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setShowError(false);
    // Очистка ошибки для конкретного поля
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Обработка ввода телефона
  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 9);
    handleChange('phone', value);
  };

  // Валидация формы
  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Введите имя';
    }

    if (formData.phone.length !== 9) {
      newErrors.phone = 'Введите корректный номер телефона';
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Введите корректный email';
    }

    if (!formData.agreePersonalData) {
      newErrors.agreePersonalData = 'Необходимо согласие на обработку данных';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Отправка формы
  const handleSubmit = () => {
    if (!validate()) {
      setShowError(true);
      return;
    }

    // Проверка на существующий номер (имитация)
    const phoneExists = false; // Замени на реальную проверку

    if (phoneExists) {
      setShowError(true);
      return;
    }

    // Успешная регистрация
    const fullPhone = `+375 ${formData.phone.slice(0, 2)} ${formData.phone.slice(2, 5)} ${formData.phone.slice(5, 7)} ${formData.phone.slice(7, 9)}`;
    
    onRegister?.({
      ...formData,
      fullPhone
    });

    console.log('Регистрация:', formData);
  };

  return (
    <div 
      className="modal fade reg-start" 
      id="regModal" 
      tabIndex="-1" 
      aria-labelledby="regModalLabel" 
      aria-hidden="true"
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h1 className="modal-title" id="regModalLabel">
              Регистрация
            </h1>
            <button 
              type="button" 
              className="btn-close" 
              data-bs-dismiss="modal" 
              aria-label="Close"
            ></button>
          </div>
          
          <div className="modal-body">
            
            {/* Уведомление об ошибке */}
            <div className={`login-notice ${!showError ? 'the-hide' : ''}`}>
              <img src="/assets/img/icons/alert-fill.svg" alt="" />
              <p>
                Такой номер телефона уже используется. Укажите другой или воспользуйтесь формой входа.
              </p>
            </div>

            {/* Поле "Имя" */}
            <div className="form-floating the-name">
              <input 
                type="text" 
                className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                id="floatingName" 
                placeholder="Имя" 
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                required
              />
              <label htmlFor="floatingName">
                Имя <span>*</span>
              </label>
              {errors.name && <div className="invalid-feedback">{errors.name}</div>}
            </div>

            {/* Поле "Телефон" */}
            <div className="phone-input-container" id="phoneContainer">
              <div className="country-code">
                <span className="flag-icon">
                  <img src="/assets/img/icons/rb.svg" alt="BY" />
                </span>
                <span>+375</span>
              </div>
              <input 
                type="tel" 
                className={`phone-input ${errors.phone ? 'is-invalid' : ''}`}
                id="phoneInputReg" 
                placeholder="25 895 26 84"
                inputMode="numeric" 
                maxLength="9"
                value={formData.phone}
                onChange={handlePhoneChange}
                required
              />
            </div>
            {errors.phone && <small className="text-danger">{errors.phone}</small>}

            {/* Поле "Email" */}
            <div className="form-floating the-mail">
              <input 
                type="email" 
                className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                id="floatingEmail" 
                placeholder="Электронная почта"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
              />
              <label htmlFor="floatingEmail">Электронная почта</label>
              {errors.email && <div className="invalid-feedback">{errors.email}</div>}
            </div>

            {/* Чекбоксы и кнопки */}
            <div className="policy-inner">
              
              {/* Согласие на обработку персональных данных */}
              <div className="form-check">
                <input 
                  className="form-check-input" 
                  type="checkbox" 
                  id="agreePersonalData"
                  checked={formData.agreePersonalData}
                  onChange={(e) => handleChange('agreePersonalData', e.target.checked)}
                />
                <label className="form-check-label" htmlFor="agreePersonalData">
                  Даю согласие на обработку персональных данных в соответствии с{' '}
                  <a href="/privacy-policy">Политикой обработки персональных данных</a> и{' '}
                  <a href="/terms">Договором-офертой</a>
                </label>
              </div>

              {/* Согласие на рассылку */}
              <div className="form-check">
                <input 
                  className="form-check-input" 
                  type="checkbox" 
                  id="agreeMarketing"
                  checked={formData.agreeMarketing}
                  onChange={(e) => handleChange('agreeMarketing', e.target.checked)}
                />
                <label className="form-check-label" htmlFor="agreeMarketing">
                  Даю согласие на получение рекламно-информационных рассылок по Email/Telegram
                </label>
              </div>

              {/* Кнопка "Получить код" */}
              <button 
                className="get-code-btn" 
                onClick={handleSubmit}
                data-bs-toggle="modal"
                data-bs-target="#codeModal"
              >
                Получить код
              </button>

              {/* Ссылка на вход */}
              <div className="register-link">
                <a 
                  href="#" 
                  data-bs-toggle="modal" 
                  data-bs-target="#loginModal"
                >
                  Уже есть аккаунт
                </a>
              </div>
              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
