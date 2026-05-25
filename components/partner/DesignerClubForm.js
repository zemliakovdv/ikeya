// components/partner/DesignerClubForm.js
'use client';

import { useState, useRef, useEffect } from 'react';

import { buildApiUrl } from '@/lib/config/api';

const CITIES = ['Минск', 'Брест', 'Витебск', 'Гомель', 'Гродно', 'Могилёв'];
const DESIGNER_TYPES = ['Частный дизайнер', 'Юридическое лицо', 'Индивидуальный предприниматель'];

function CustomSelect({ options, value, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function onDocClick(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('click', onDocClick);
    return () => document.removeEventListener('click', onDocClick);
  }, []);

  return (
    <div className={`custom-select${isOpen ? ' custom-select--open' : ''}`} ref={ref}>
      <button
        type="button"
        className="custom-select__trigger"
        onClick={() => setIsOpen(v => !v)}
      >
        <span>{value}</span>
        <svg width="24" height="24" viewBox="0 0 16 16" fill="none">
          <path d="M8 10.22C7.25 10.22 5.47 8.19 4.1 6.5C3.95 6.31 3.97 6.03 4.17 5.87C4.36 5.72 4.64 5.75 4.79 5.94C5.99 7.43 7.53 9.1 8 9.32C8.47 9.1 10.01 7.43 11.21 5.94C11.36 5.75 11.64 5.72 11.83 5.87C12.03 6.03 12.05 6.31 11.9 6.5C10.53 8.2 8.74 10.22 8 10.22Z" fill="#757575" />
        </svg>
      </button>
      {isOpen && (
        <ul className="custom-select__dropdown">
          {options.map(option => (
            <li
              key={option}
              className={`custom-select__option${option === value ? ' custom-select__option--active' : ''}`}
              onClick={() => { onChange(option); setIsOpen(false); }}
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function validate(form) {
  const errors = {};
  if (!form.firstName.trim()) errors.firstName = 'Введите имя';
  if (!form.lastName.trim()) errors.lastName = 'Введите фамилию';
  if (!form.comment.trim()) errors.comment = 'Введите комментарий';
  if (!form.consentPersonal) errors.consentPersonal = 'Необходимо согласие';

  const cyrillicPattern = /[а-яёА-ЯЁ]/;
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!form.email.trim()) {
    errors.email = 'Введите email';
  } else if (cyrillicPattern.test(form.email)) {
    errors.email = 'Email не должен содержать кириллицу';
  } else if (!emailPattern.test(form.email)) {
    errors.email = 'Введите корректный email';
  }

  if (!form.phone.trim()) {
    errors.phone = 'Введите телефон';
  } else if (form.phone.length !== 9) {
    errors.phone = 'Введите 9 цифр';
  }

  return errors;
}

export default function DesignerClubForm() {
  const [form, setForm] = useState({
    city: CITIES[0],
    designerType: DESIGNER_TYPES[0],
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    comment: '',
    consentPersonal: true,
    consentEmail: true,
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');

  const set = (key, val) => {
    setForm(p => ({ ...p, [key]: val }));
    setErrors(p => ({ ...p, [key]: undefined }));
  };

  const show = (type, msg) => {
    setToastType(type);
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(buildApiUrl('/cooperation_requests'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          first_name: form.firstName.trim(),
          last_name: form.lastName.trim(),
          email: form.email.trim(),
          phone: '+375' + form.phone,
          city: form.city,
          cooperation_type: form.designerType,
          comment: form.comment.trim(),
          personal_data_consent: form.consentPersonal,
          marketing_email_consent: form.consentEmail,
        }),
      });

      if (res.status === 201) {
        show('success', 'Заявка успешно отправлена');
        setForm({
          city: CITIES[0],
          designerType: DESIGNER_TYPES[0],
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          comment: '',
          consentPersonal: true,
          consentEmail: true,
        });
        setErrors({});
      } else {
        show('error', 'Ошибка при отправке заявки. Попробуйте позже');
      }
    } catch {
      show('error', 'Ошибка соединения. Попробуйте позже');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="designer-club-form" onSubmit={handleSubmit} noValidate>

      {/* Toast */}
      <div
        className={`toast promokod-toast ${showToast ? 'show' : ''}`}
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
      >
        <div className="d-flex">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d={toastType === 'success'
                ? 'M12 2C6.49 2 2 6.49 2 12C2 17.51 6.49 22 12 22C17.51 22 22 17.51 22 12C22 6.49 17.51 2 12 2ZM10.5 16.5L6.5 12.5L7.91 11.09L10.5 13.67L16.09 8.08L17.5 9.5L10.5 16.5Z'
                : 'M12 2C6.49 2 2 6.49 2 12C2 17.51 6.49 22 12 22C17.51 22 22 17.51 22 12C22 6.49 17.51 2 12 2ZM11.3 8.28C11.3 7.89 11.61 7.58 12 7.58C12.39 7.58 12.7 7.89 12.7 8.28V12.47C12.7 12.86 12.39 13.17 12 13.17C11.61 13.17 11.3 12.86 11.3 12.47V8.28ZM12.83 15.72C12.83 16.18 12.46 16.56 11.99 16.56C11.52 16.56 11.15 16.18 11.15 15.72C11.15 15.26 11.52 14.88 11.99 14.88C12.46 14.88 12.83 15.25 12.83 15.71V15.72Z'
              }
              fill={toastType === 'success' ? '#0058A3' : '#B71C1C'}
            />
          </svg>
          <div className="toast-body">{toastMessage}</div>
          <button type="button" className="btn-close" onClick={() => setShowToast(false)} aria-label="Закрыть" />
        </div>
      </div>

      {/* Город / Тип дизайнера */}
      <div className="designer-form__row">
        <div className="designer-form__group">
          <CustomSelect options={CITIES} value={form.city} onChange={val => set('city', val)} />
        </div>
        <div className="designer-form__group">
          <CustomSelect options={DESIGNER_TYPES} value={form.designerType} onChange={val => set('designerType', val)} />
        </div>
      </div>

      {/* Имя / Фамилия */}
      <div className="designer-form__row">
        <div className="designer-form__group">
          <input type="text" className={`form-control${errors.firstName ? ' is-invalid' : ''}`} placeholder="Имя"
            value={form.firstName} onChange={e => set('firstName', e.target.value)} />
          {errors.firstName && <div className="designer-form__error">{errors.firstName}</div>}
        </div>
        <div className="designer-form__group">
          <input type="text" className={`form-control${errors.lastName ? ' is-invalid' : ''}`} placeholder="Фамилия"
            value={form.lastName} onChange={e => set('lastName', e.target.value)} />
          {errors.lastName && <div className="designer-form__error">{errors.lastName}</div>}
        </div>
      </div>

      {/* Email / Телефон */}
      <div className="designer-form__row">
        <div className="designer-form__group">
          <input type="email" className={`form-control${errors.email ? ' is-invalid' : ''}`} placeholder="Email"
            value={form.email} onChange={e => set('email', e.target.value)} />
          {errors.email && <div className="designer-form__error">{errors.email}</div>}
        </div>
        <div className="designer-form__group designer-form__phone">
          <div className={`phone-prefix${errors.phone ? ' is-invalid' : ''}`}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20Z" fill="#EAEAEA" />
              <path d="M4.13004 9.28012L3.04004 7.31012L4.13004 5.37012L5.22004 7.31012L4.13004 9.28012Z" fill="#A2001D" />
              <path fillRule="evenodd" clipRule="evenodd" d="M0.869995 7.30035L1.96 9.27035L3.05 7.30035L1.96 5.36035L0.869995 7.30035ZM3.04 12.6604L4.13 14.6304L5.22 12.6604L4.13 10.7204L3.04 12.6604Z" fill="#A2001D" />
              <path fillRule="evenodd" clipRule="evenodd" d="M5.22 1.94014L4.91 1.39014C4.36 1.72014 3.84 2.09014 3.36 2.52014L4.13 3.91014L5.22 1.94014ZM1.96 14.6401L0.869995 12.6701L1.96 10.7301L3.05 12.6701L1.96 14.6401ZM3.36 17.4701L4.13 16.0901L5.22 18.0301L4.9 18.6001C4.35 18.2701 3.83 17.8901 3.35 17.4701H3.36Z" fill="#A2001D" />
              <path d="M6.08997 12.6099V19.2099C7.32997 19.7399 8.65997 20.0099 9.99997 19.9999C14.3 19.9999 17.96 17.2899 19.38 13.4799L6.08997 12.6099Z" fill="#6DA544" />
              <path d="M19.38 13.48C19.79 12.37 20 11.19 20 10C20 4.48 15.52 0 9.99997 0C8.60997 0 7.28997 0.28 6.08997 0.79V13.48H19.38Z" fill="#A2001D" />
            </svg>
            <span>+375</span>
          </div>
          <input type="tel" className={`form-control${errors.phone ? ' is-invalid' : ''}`} placeholder="00 000 00 00" maxLength={9}
            value={form.phone} onChange={e => set('phone', e.target.value.replace(/\D/g, ''))} />
          {errors.phone && <div className="designer-form__error">{errors.phone}</div>}
        </div>
      </div>

      {/* Комментарий */}
      <div className="designer-form__row designer-form__comment" style={{ gridTemplateColumns: '1fr' }}>
        <div className="designer-form__group">
          <textarea className={`form-control${errors.comment ? ' is-invalid' : ''}`} placeholder="Комментарий"
            value={form.comment} onChange={e => set('comment', e.target.value)} />
          {errors.comment && <div className="designer-form__error">{errors.comment}</div>}
        </div>
      </div>

      {/* Согласия */}
      <div className="designer-form__consents">
        <label className="consent-item">
          <input type="checkbox" checked={form.consentPersonal}
            onChange={e => set('consentPersonal', e.target.checked)} />
          <span>Я ознакомлен(а) и соглашаюсь с <a href="#">условиями политики обработки персональных данных</a></span>
        </label>
        {errors.consentPersonal && <div className="designer-form__error">{errors.consentPersonal}</div>}
        <label className="consent-item">
          <input type="checkbox" checked={form.consentEmail}
            onChange={e => set('consentEmail', e.target.checked)} />
          <span>Даю согласие на получение уведомлений по условиям сотрудничества на указанный E-mail</span>
        </label>
      </div>

      {/* Кнопка */}
      <button type="submit" className="designer-form__submit" disabled={loading}>
        {loading ? 'Отправка...' : 'Вступить в клуб'}
      </button>

    </form>
  );
}