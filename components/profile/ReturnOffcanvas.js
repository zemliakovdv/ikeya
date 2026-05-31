// components/profile/ReturnOffcanvas.js
'use client';

import { useState, useRef, useEffect } from 'react';
import { createReturn, getProfile } from '@/lib/api/account';
import { useAuth } from '@/contexts/AuthContext';

const RETURN_REASONS = [
  { value: 'damaged', label: 'Товар повреждён при доставке' },
  { value: 'wrong', label: 'Привезли не тот товар' },
  { value: 'quality', label: 'Проблемы с качеством товара' },
  { value: 'description', label: 'Не соответствует описанию' },
  { value: 'other', label: 'Другое' },
];

const MAX_FILES = 5;
const ALLOWED_TYPES = [
  'image/avif',
  'image/heic',
  'image/heif',
  'image/webp',
  'image/jpeg',
  'image/png',
];

const EMPTY_FORM = {
  lastName: '',
  firstName: '',
  middleName: '',
  orderNumber: '',
  phone: '',
  email: '',
  reason: '',
  comment: '',
  compensation: 'refund',
};

const EMPTY_ERRORS = {
  lastName: '',
  firstName: '',
  middleName: '',
  orderNumber: '',
  phone: '',
  email: '',
  reason: '',
  general: '',
};

const LETTERS_RE = /^[a-zA-Zа-яА-ЯёЁ\s-]+$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function normalizePhone(phone) {
  const digits = phone.replace(/\D/g, '');
  if (digits.startsWith('375') && digits.length === 12) return `+${digits}`;
  if (digits.length === 9) return `+375${digits}`;
  return phone.trim();
}

function validateForm(form) {
  const errors = { ...EMPTY_ERRORS };
  let valid = true;

  if (!form.lastName.trim()) {
    errors.lastName = 'Обязательное поле'; valid = false;
  } else if (!LETTERS_RE.test(form.lastName.trim())) {
    errors.lastName = 'Только буквы'; valid = false;
  }

  if (!form.firstName.trim()) {
    errors.firstName = 'Обязательное поле'; valid = false;
  } else if (!LETTERS_RE.test(form.firstName.trim())) {
    errors.firstName = 'Только буквы'; valid = false;
  }

  if (form.middleName.trim() && !LETTERS_RE.test(form.middleName.trim())) {
    errors.middleName = 'Только буквы'; valid = false;
  }

  if (!form.orderNumber.trim()) {
    errors.orderNumber = 'Обязательное поле'; valid = false;
  } else if (!/^\d{6,10}$/.test(form.orderNumber.trim())) {
    errors.orderNumber = 'Некорректный номер заказа'; valid = false;
  }

  if (!form.phone.trim()) {
    errors.phone = 'Обязательное поле'; valid = false;
  } else if (!/^\d{9}$/.test(form.phone.trim())) {
    errors.phone = 'Введите 9 цифр'; valid = false;
  }

  if (!form.email.trim()) {
    errors.email = 'Обязательное поле'; valid = false;
  } else if (!EMAIL_RE.test(form.email.trim())) {
    errors.email = 'Некорректный email'; valid = false;
  }

  if (!form.reason) {
    errors.reason = 'Выберите причину возврата'; valid = false;
  }

  return { errors, valid };
}

export default function ReturnOffcanvas({ isOpen, onClose }) {
  const { isAuth } = useAuth();
  const fileInputRef = useRef(null);

  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState(EMPTY_ERRORS);
  const [files, setFiles] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!isOpen || !isAuth) return;

    getProfile()
      .then(profile => {
        if (!profile) return;
        const rawPhone = profile.phone ? profile.phone.replace(/^\+?375/, '') : '';

        setForm(prev => ({
          ...prev,
          lastName: profile.last_name || prev.lastName,
          firstName: profile.first_name || prev.firstName,
          middleName: profile.middle_name || prev.middleName,
          phone: rawPhone || prev.phone,
          email: profile.email || prev.email,
        }));
      })
      .catch(() => {});
  }, [isOpen, isAuth]);

  function handleChange(e) {
    const { name, value } = e.target;

    if (name === 'phone' && value && !/^\d*$/.test(value)) return;
    if (name === 'orderNumber' && value && !/^\d*$/.test(value)) return;

    setForm(prev => ({ ...prev, [name]: value }));

    if (name in errors) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  }

  function handleFileChange(e) {
    const selected = Array.from(e.target.files || []);
    const valid = selected.filter(f => ALLOWED_TYPES.includes(f.type));
    setFiles(prev => [...prev, ...valid].slice(0, MAX_FILES));
    e.target.value = '';
  }

  function handleDrop(e) {
    e.preventDefault();
    const dropped = Array.from(e.dataTransfer.files || []);
    const valid = dropped.filter(f => ALLOWED_TYPES.includes(f.type));
    setFiles(prev => [...prev, ...valid].slice(0, MAX_FILES));
  }

  function removeFile(idx) {
    setFiles(prev => prev.filter((_, i) => i !== idx));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const { errors: validationErrors, valid } = validateForm(form);
    if (!valid) {
      setErrors(validationErrors);
      return;
    }

    setSubmitting(true);
    setErrors(EMPTY_ERRORS);

    try {
      const fd = new FormData();

      fd.append('order_id', form.orderNumber.trim());
      fd.append('last_name', form.lastName.trim());
      fd.append('first_name', form.firstName.trim());
      fd.append('patronymic', form.middleName.trim());
      fd.append('phone', normalizePhone(form.phone));
      fd.append('email', form.email.trim());
      fd.append('reason', form.reason);
      fd.append('compensation_type', form.compensation);

      if (form.comment.trim()) {
        fd.append('comment', form.comment.trim());
      }

      files.forEach(file => fd.append('attachments[]', file));

      await createReturn(fd);
      setSuccess(true);
    } catch (err) {
      const status = err.status;
      const payload = err.payload || {};

      if (status === 422) {
        const message = payload.error || payload.message || 'Ошибка валидации. Проверьте данные.';
        setErrors(prev => ({ ...prev, general: message }));
      } else if (status === 404) {
        setErrors(prev => ({ ...prev, orderNumber: 'Заказ не найден или не принадлежит вашему аккаунту' }));
      } else if (status === 401) {
        setErrors(prev => ({ ...prev, general: 'Необходима авторизация. Пожалуйста, войдите в аккаунт.' }));
      } else {
        setErrors(prev => ({ ...prev, general: err.message || 'Ошибка при отправке заявки. Попробуйте позже.' }));
      }
    } finally {
      setSubmitting(false);
    }
  }

  function handleClose() {
    setForm(EMPTY_FORM);
    setFiles([]);
    setErrors(EMPTY_ERRORS);
    setSuccess(false);
    onClose();
  }

  return (
    <>
      {isOpen && (
        <div className="offcanvas-backdrop fade show" onClick={handleClose} />
      )}

      <div
        className={`offcanvas offcanvas-end ${isOpen ? 'show' : ''}`}
        style={{ visibility: isOpen ? 'visible' : 'hidden' }}
        tabIndex="-1"
        id="offcanvasVozvrat"
      >
        <div className="offcanvas-header">
          <h5 className="offcanvas-title">Заявка на возврат товара</h5>
          <button
            type="button"
            className="btn-close"
            onClick={handleClose}
            aria-label="Закрыть"
          />
        </div>

        <div className="offcanvas-body">
          {success ? (
            <div className="return-success">
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                <path d="M24 4C12.95 4 4 12.95 4 24C4 35.05 12.95 44 24 44C35.05 44 44 35.05 44 24C44 12.95 35.05 4 24 4ZM33.7 19.7L22.3 31.1C22 31.4 21.6 31.55 21.2 31.55C20.8 31.55 20.4 31.4 20.1 31.1L14.3 25.3C13.7 24.7 13.7 23.7 14.3 23.1C14.9 22.5 15.9 22.5 16.5 23.1L21.2 27.8L31.5 17.5C32.1 16.9 33.1 16.9 33.7 17.5C34.3 18.1 34.3 19.1 33.7 19.7Z" fill="#04A31A" />
              </svg>
              <h6>Заявка отправлена!</h6>
              <p>Мы рассмотрим её в течение 1–2 рабочих дней и свяжемся с вами.</p>
              <button className="btn btn-submit" onClick={handleClose}>Закрыть</button>
            </div>
          ) : (
            <form className="returns-order_form" onSubmit={handleSubmit} noValidate>

              <div className="form-floating mb-3">
                <input
                  type="text"
                  className={`form-control ${errors.lastName ? 'is-invalid' : ''}`}
                  id="lastName"
                  name="lastName"
                  placeholder="Фамилия"
                  value={form.lastName}
                  onChange={handleChange}
                />
                <label htmlFor="lastName">Фамилия *</label>
                {errors.lastName && <div className="invalid-feedback">{errors.lastName}</div>}
              </div>

              <div className="form-floating mb-3">
                <input
                  type="text"
                  className={`form-control ${errors.firstName ? 'is-invalid' : ''}`}
                  id="firstName"
                  name="firstName"
                  placeholder="Имя"
                  value={form.firstName}
                  onChange={handleChange}
                />
                <label htmlFor="firstName">Имя *</label>
                {errors.firstName && <div className="invalid-feedback">{errors.firstName}</div>}
              </div>

              <div className="form-floating mb-3">
                <input
                  type="text"
                  className={`form-control ${errors.middleName ? 'is-invalid' : ''}`}
                  id="middleName"
                  name="middleName"
                  placeholder="Отчество"
                  value={form.middleName}
                  onChange={handleChange}
                />
                <label htmlFor="middleName">Отчество</label>
                {errors.middleName && <div className="invalid-feedback">{errors.middleName}</div>}
              </div>

              <div className="form-floating mb-3">
                <input
                  type="text"
                  className={`form-control ${errors.orderNumber ? 'is-invalid' : ''}`}
                  id="orderNumber"
                  name="orderNumber"
                  placeholder="Номер заказа"
                  value={form.orderNumber}
                  onChange={handleChange}
                  inputMode="numeric"
                  maxLength={10}
                />
                <label htmlFor="orderNumber">Номер заказа *</label>
                {errors.orderNumber && <div className="invalid-feedback">{errors.orderNumber}</div>}
              </div>

              <div className={`phone-input-container mb-1 ${errors.phone ? 'is-invalid-container' : ''}`}>
                <div className="country-code">
                  <span className="flag-icon">
                    <img src="/assets/img/icons/rb.svg" alt="BY" />
                  </span>
                  <span>+375</span>
                </div>
                <input
                  type="tel"
                  className={`phone-input ${errors.phone ? 'is-invalid' : ''}`}
                  name="phone"
                  placeholder="00 000 00 00"
                  inputMode="numeric"
                  maxLength={9}
                  value={form.phone}
                  onChange={handleChange}
                />
              </div>
              {errors.phone && (
                <div className="invalid-feedback d-block mb-3">{errors.phone}</div>
              )}
              {!errors.phone && <div className="mb-3" />}

              <div className="form-floating mb-3">
                <input
                  type="email"
                  className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                  id="email"
                  name="email"
                  placeholder="Электронная почта"
                  value={form.email}
                  onChange={handleChange}
                />
                <label htmlFor="email">Электронная почта *</label>
                {errors.email && <div className="invalid-feedback">{errors.email}</div>}
              </div>

              <div className="mb-3">
                <select
                  className={`form-select ${errors.reason ? 'is-invalid' : ''}`}
                  name="reason"
                  value={form.reason}
                  onChange={handleChange}
                >
                  <option value="" disabled>Причина возврата *</option>
                  {RETURN_REASONS.map(r => (
                    <option key={r.value} value={r.value}>{r.label}</option>
                  ))}
                </select>
                {errors.reason && <div className="invalid-feedback">{errors.reason}</div>}
              </div>

              <div className="mb-3">
                <textarea
                  className="form-control"
                  name="comment"
                  placeholder="Комментарий к возврату"
                  rows={3}
                  value={form.comment}
                  onChange={handleChange}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Загрузите до {MAX_FILES} фото</label>
                <div
                  className="file-upload-area"
                  onDragOver={e => e.preventDefault()}
                  onDrop={handleDrop}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".avif,.heic,.heif,.webp,.jpeg,.jpg,.png"
                    multiple
                    hidden
                    onChange={handleFileChange}
                  />
                  <p className="file-upload-text">
                    Файл должен быть в формате .avif, .heic, .heif, .webp, .jpeg или .png (до 5 мб)
                  </p>
                  <div className="files-inners">
                    <button
                      type="button"
                      className="upload-btn"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={files.length >= MAX_FILES}
                    >
                      Загрузите файл
                    </button>
                    <p className="file-upload-text-grey mb-0">или перетащите сюда</p>
                  </div>
                </div>

                {files.length > 0 && (
                  <div style={{ marginTop: '8px' }}>
                    {files.map((file, idx) => (
                      <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <span style={{ fontSize: '13px', color: '#424242' }}>{file.name}</span>
                        <button
                          type="button"
                          onClick={() => removeFile(idx)}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#B71C1C', fontSize: '16px' }}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="mb-4">
                <p className="compensation-label">Предпочтительный способ компенсации</p>
                <div className="compensation-tips">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="compensation"
                      id="compensationReturn"
                      value="refund"
                      checked={form.compensation === 'refund'}
                      onChange={handleChange}
                    />
                    <label className="form-check-label" htmlFor="compensationReturn">возврат</label>
                  </div>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="compensation"
                      id="compensationExchange"
                      value="exchange"
                      checked={form.compensation === 'exchange'}
                      onChange={handleChange}
                    />
                    <label className="form-check-label" htmlFor="compensationExchange">обмен</label>
                  </div>
                </div>
              </div>

              {errors.general && (
                <p style={{ color: '#B71C1C', marginBottom: '12px', fontSize: '14px' }}>
                  {errors.general}
                </p>
              )}

              <button
                type="submit"
                className="btn btn-submit"
                disabled={submitting}
              >
                {submitting ? 'Отправляем…' : 'Отправить'}
              </button>

            </form>
          )}
        </div>
      </div>
    </>
  );
}