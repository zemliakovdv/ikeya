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
const ALLOWED_TYPES = ['image/avif', 'image/heic', 'image/webp', 'image/jpeg', 'image/png'];

const EMPTY_FORM = {
  lastName: '',
  firstName: '',
  middleName: '',
  orderNumber: '',
  phone: '',
  email: '',
  reason: '',
  comment: '',
  compensation: 'return',
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

// Валидаторы
const LETTERS_RE = /^[a-zA-Zа-яА-ЯёЁ\s-]+$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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
  } else if (!/^\d{8}$/.test(form.orderNumber.trim())) {
    errors.orderNumber = 'Номер заказа — 8 цифр'; valid = false;
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

// Маппинг полей бэка → полей формы
const BACKEND_FIELD_MAP = {
  order_id: 'orderNumber',
  reason: 'reason',
  comment: 'comment',
};

export default function ReturnOffcanvas({ isOpen, onClose }) {
  const { isAuth } = useAuth();
  const fileInputRef = useRef(null);

  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState(EMPTY_ERRORS);
  const [files, setFiles] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  // Загрузка профиля при открытии
  useEffect(() => {
    if (!isOpen || !isAuth) return;

    getProfile()
      .then(profile => {
        if (!profile) return;
        // Телефон хранится как +375XXXXXXXXX — убираем +375
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
      .catch(() => {
        // Не критично — пользователь заполнит сам
      });
  }, [isOpen, isAuth]);

  function handleChange(e) {
    const { name, value } = e.target;

    // Только цифры для телефона и номера заказа
    if (name === 'phone' && value && !/^\d*$/.test(value)) return;
    if (name === 'orderNumber' && value && !/^\d*$/.test(value)) return;

    setForm(prev => ({ ...prev, [name]: value }));

    // Сбрасываем ошибку поля при изменении
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
      fd.append('order_id', parseInt(form.orderNumber.trim(), 10));
      fd.append('reason', form.reason);
      fd.append('comment', [
        [form.lastName, form.firstName, form.middleName].filter(Boolean).join(' '),
        form.phone ? `+375${form.phone}` : '',
        form.email,
        form.comment,
        `Компенсация: ${form.compensation === 'return' ? 'возврат' : 'обмен'}`,
      ].filter(Boolean).join('\n'));

      files.forEach(file => fd.append('attachments[]', file));

      await createReturn(fd);
      setSuccess(true);
    } catch (err) {
      const status = err.status;
      const payload = err.payload || {};

      if (status === 422 && payload && typeof payload === 'object') {
        // Ошибки валидации с бэка — раскладываем по полям
        const backendErrors = { ...EMPTY_ERRORS };
        let hasFieldError = false;

        Object.entries(payload).forEach(([backendField, messages]) => {
          const formField = BACKEND_FIELD_MAP[backendField];
          const message = Array.isArray(messages) ? messages[0] : String(messages);
          if (formField) {
            backendErrors[formField] = message;
            hasFieldError = true;
          }
        });

        if (!hasFieldError) {
          backendErrors.general = 'Ошибка валидации. Проверьте данные и попробуйте снова.';
        }

        setErrors(backendErrors);
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

              {/* Фамилия */}
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

              {/* Имя */}
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

              {/* Отчество */}
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

              {/* Номер заказа */}
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
                  maxLength={8}
                />
                <label htmlFor="orderNumber">Номер заказа *</label>
                {errors.orderNumber && <div className="invalid-feedback">{errors.orderNumber}</div>}
              </div>

              {/* Телефон */}
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

              {/* Email */}
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

              {/* Причина возврата */}
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

              {/* Комментарий */}
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

              {/* Загрузка файлов */}
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
                    accept=".avif,.heic,.webp,.jpeg,.jpg,.png"
                    multiple
                    hidden
                    onChange={handleFileChange}
                  />
                  <p className="file-upload-text">
                    Файл должен быть в формате .avif, .heic, .webp, .jpeg или .png (до 5 мб)
                  </p>
                  <div className="files-inners">
                    <button
                      type="button"
                      className="upload-btn"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={files.length >= MAX_FILES}
                    >
                      Загрузите файл
                      <svg xmlns="http://www.w3.org/2000/svg" width="17" height="16" viewBox="0 0 17 16" fill="none">
                        <path d="M16.5167 4.93333C16.1584 3.75833 15.2417 2.83333 14.0584 2.475C13.5751 2.325 12.9917 2.31667 12.1417 2.31667L11.6834 1.63333C11.4667 1.30833 11.2751 1.025 11.1001 0.808333C10.9167 0.583333 10.7167 0.391667 10.4501 0.25C10.1834 0.108333 9.91674 0.05 9.62507 0.025C9.35007 -2.32831e-08 9.0084 0 8.61673 0H8.0584C7.66673 0 7.32507 -2.32831e-08 7.05007 0.025C6.7584 0.05 6.49174 0.108333 6.22507 0.25C5.9584 0.391667 5.76674 0.583333 5.57507 0.808333C5.40007 1.025 5.21674 1.30833 4.99174 1.63333L4.5334 2.31667C3.6834 2.31667 3.10007 2.325 2.61674 2.475C1.44174 2.83333 0.516736 3.75 0.158402 4.93333C-0.00826442 5.475 6.88695e-05 6.125 6.88695e-05 7.16667V8.71667C6.88695e-05 9.975 6.87813e-05 10.975 0.0917354 11.7583C0.183402 12.5583 0.383402 13.2167 0.833402 13.7667C0.983402 13.95 1.1584 14.125 1.34174 14.275C1.89174 14.725 2.55007 14.925 3.35007 15.0167C4.1334 15.1083 5.1334 15.1083 6.39174 15.1083H10.2667C11.5251 15.1083 12.5251 15.1083 13.3084 15.0167C14.1084 14.925 14.7667 14.725 15.3167 14.275C15.5001 14.125 15.6751 13.95 15.8251 13.7667C16.2751 13.2167 16.4751 12.5583 16.5667 11.7583C16.6584 10.975 16.6584 9.975 16.6584 8.71667V7.16667C16.6584 6.125 16.6584 5.475 16.5001 4.93333H16.5167ZM15.4251 11.625C15.3417 12.3167 15.1917 12.725 14.9334 13.0333C14.8251 13.1583 14.7084 13.275 14.5834 13.3833C14.2751 13.6333 13.8667 13.7917 13.1751 13.875C12.4751 13.9583 11.5584 13.9583 10.2667 13.9583H6.39174C5.10007 13.9583 4.19174 13.9583 3.4834 13.875C2.79174 13.7917 2.3834 13.6417 2.07507 13.3833C1.95007 13.275 1.8334 13.1583 1.72507 13.0333C1.47507 12.725 1.31674 12.3167 1.2334 11.625C1.15007 10.925 1.15007 10.0083 1.15007 8.71667V7.16667C1.15007 6.04167 1.15007 5.60833 1.2584 5.275C1.50007 4.46667 2.1334 3.84167 2.94174 3.59167C3.27507 3.49167 3.7084 3.48333 4.8334 3.48333C5.02507 3.48333 5.2084 3.38333 5.31674 3.225L5.95007 2.28333C6.1834 1.93333 6.3334 1.70833 6.46674 1.54167C6.59174 1.38333 6.67507 1.31667 6.7584 1.275C6.84174 1.23333 6.94174 1.2 7.14174 1.18333C7.3584 1.16667 7.62507 1.16667 8.04174 1.16667H8.60007C9.01674 1.16667 9.29174 1.16667 9.50007 1.18333C9.70007 1.2 9.8084 1.23333 9.8834 1.275C9.9584 1.31667 10.0501 1.38333 10.1751 1.54167C10.3084 1.70833 10.4584 1.93333 10.6917 2.28333L11.3251 3.225C11.4334 3.38333 11.6167 3.48333 11.8084 3.48333C12.9334 3.48333 13.3667 3.48333 13.7001 3.59167C14.5084 3.83333 15.1334 4.46667 15.3834 5.275C15.4834 5.60833 15.4917 6.04167 15.4917 7.16667V8.71667C15.4917 10.0083 15.4917 10.9167 15.4084 11.625H15.4251Z" fill="white" />
                        <path d="M11.4417 7.74167H8.92507V5.225C8.92507 4.9 8.66673 4.64167 8.34173 4.64167C8.01674 4.64167 7.7584 4.9 7.7584 5.225V7.74167H5.24174C4.91674 7.74167 4.6584 8 4.6584 8.325C4.6584 8.65 4.91674 8.90833 5.24174 8.90833H7.7584V11.425C7.7584 11.75 8.01674 12.0083 8.34173 12.0083C8.66673 12.0083 8.92507 11.75 8.92507 11.425V8.90833H11.4417C11.7667 8.90833 12.0251 8.65 12.0251 8.325C12.0251 8 11.7667 7.74167 11.4417 7.74167Z" fill="white" />
                      </svg>
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

              {/* Компенсация */}
              <div className="mb-4">
                <p className="compensation-label">Предпочтительный способ компенсации</p>
                <div className="compensation-tips">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="compensation"
                      id="compensationReturn"
                      value="return"
                      checked={form.compensation === 'return'}
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

              {/* Общая ошибка */}
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