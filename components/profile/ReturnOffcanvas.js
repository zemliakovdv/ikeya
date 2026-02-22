// components/profile/ReturnOffcanvas.js
'use client';

import { useState, useRef } from 'react';
import { createReturn } from '@/lib/api/account';
import { useAuth } from '@/contexts/AuthContext';

const RETURN_REASONS = [
  { value: 'damaged',     label: 'Товар повреждён при доставке' },
  { value: 'wrong',       label: 'Привезли не тот товар' },
  { value: 'quality',     label: 'Проблемы с качеством товара' },
  { value: 'description', label: 'Не соответствует описанию' },
  { value: 'other',       label: 'Другое' },
];

const MAX_FILES = 5;
const ALLOWED_TYPES = ['image/avif', 'image/heic', 'image/webp', 'image/jpeg', 'image/png'];

export default function ReturnOffcanvas({ isOpen, onClose }) {
  const { user } = useAuth();
  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    lastName:     '',
    firstName:    user?.username || '',
    middleName:   '',
    orderNumber:  '',
    phone:        '',
    email:        '',
    reason:       '',
    comment:      '',
    compensation: 'return',
  });

  const [files,       setFiles]       = useState([]);
  const [submitting,  setSubmitting]  = useState(false);
  const [error,       setError]       = useState('');
  const [success,     setSuccess]     = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  function handleFileChange(e) {
    const selected = Array.from(e.target.files || []);
    const valid = selected.filter(f => ALLOWED_TYPES.includes(f.type));
    const merged = [...files, ...valid].slice(0, MAX_FILES);
    setFiles(merged);
    e.target.value = '';
  }

  function handleDrop(e) {
    e.preventDefault();
    const dropped = Array.from(e.dataTransfer.files || []);
    const valid = dropped.filter(f => ALLOWED_TYPES.includes(f.type));
    const merged = [...files, ...valid].slice(0, MAX_FILES);
    setFiles(merged);
  }

  function removeFile(idx) {
    setFiles(prev => prev.filter((_, i) => i !== idx));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (!form.orderNumber.trim()) {
      setError('Укажите номер заказа');
      return;
    }
    if (!form.reason) {
      setError('Выберите причину возврата');
      return;
    }

    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append('order_id', form.orderNumber.trim());
      fd.append('reason', form.reason);
      fd.append('comment', [
        form.lastName,
        form.firstName,
        form.middleName,
        form.phone ? `+375${form.phone}` : '',
        form.email,
        form.comment,
        `Компенсация: ${form.compensation === 'return' ? 'возврат' : 'обмен'}`,
      ].filter(Boolean).join('\n'));

      files.forEach(file => fd.append('attachments[]', file));

      await createReturn(fd);
      setSuccess(true);
    } catch (e) {
      setError(e.message || 'Ошибка при отправке заявки');
    } finally {
      setSubmitting(false);
    }
  }

  function handleClose() {
    setForm({
      lastName: '', firstName: user?.username || '', middleName: '',
      orderNumber: '', phone: '', email: '',
      reason: '', comment: '', compensation: 'return',
    });
    setFiles([]);
    setError('');
    setSuccess(false);
    onClose();
  }

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="offcanvas-backdrop fade show"
          onClick={handleClose}
        />
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
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M24 4C12.95 4 4 12.95 4 24C4 35.05 12.95 44 24 44C35.05 44 44 35.05 44 24C44 12.95 35.05 4 24 4ZM33.7 19.7L22.3 31.1C22 31.4 21.6 31.55 21.2 31.55C20.8 31.55 20.4 31.4 20.1 31.1L14.3 25.3C13.7 24.7 13.7 23.7 14.3 23.1C14.9 22.5 15.9 22.5 16.5 23.1L21.2 27.8L31.5 17.5C32.1 16.9 33.1 16.9 33.7 17.5C34.3 18.1 34.3 19.1 33.7 19.7Z" fill="#04A31A"/>
              </svg>
              <h6>Заявка отправлена!</h6>
              <p>Мы рассмотрим её в течение 1–2 рабочих дней и свяжемся с вами.</p>
              <button className="btn btn-submit" onClick={handleClose}>
                Закрыть
              </button>
            </div>
          ) : (
            <form className="returns-order_form" onSubmit={handleSubmit}>

              {/* Фамилия */}
              <div className="form-floating mb-3">
                <input
                  type="text"
                  className="form-control"
                  id="lastName"
                  name="lastName"
                  placeholder="Фамилия"
                  value={form.lastName}
                  onChange={handleChange}
                />
                <label htmlFor="lastName">Фамилия</label>
              </div>

              {/* Имя */}
              <div className="form-floating mb-3">
                <input
                  type="text"
                  className="form-control"
                  id="firstName"
                  name="firstName"
                  placeholder="Имя"
                  value={form.firstName}
                  onChange={handleChange}
                />
                <label htmlFor="firstName">Имя</label>
              </div>

              {/* Отчество */}
              <div className="form-floating mb-3">
                <input
                  type="text"
                  className="form-control"
                  id="middleName"
                  name="middleName"
                  placeholder="Отчество"
                  value={form.middleName}
                  onChange={handleChange}
                />
                <label htmlFor="middleName">Отчество</label>
              </div>

              {/* Номер заказа */}
              <div className="form-floating mb-3">
                <input
                  type="text"
                  className="form-control"
                  id="orderNumber"
                  name="orderNumber"
                  placeholder="Номер заказа"
                  value={form.orderNumber}
                  onChange={handleChange}
                  required
                />
                <label htmlFor="orderNumber">Номер заказа *</label>
              </div>

              {/* Телефон */}
              <div className="phone-input-container mb-3">
                <div className="country-code">
                  <span className="flag-icon">
                    <img src="/assets/img/icons/rb.svg" alt="BY" />
                  </span>
                  <span>+375</span>
                </div>
                <input
                  type="tel"
                  className="phone-input"
                  name="phone"
                  placeholder="00 000 00 00"
                  inputMode="numeric"
                  maxLength={9}
                  value={form.phone}
                  onChange={handleChange}
                />
              </div>

              {/* Email */}
              <div className="form-floating mb-3">
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  name="email"
                  placeholder="Электронная почта"
                  value={form.email}
                  onChange={handleChange}
                />
                <label htmlFor="email">Электронная почта</label>
              </div>

              {/* Причина возврата */}
              <div className="mb-3">
                <select
                  className="form-select"
                  name="reason"
                  value={form.reason}
                  onChange={handleChange}
                  required
                >
                  <option value="" disabled>Причина возврата *</option>
                  {RETURN_REASONS.map(r => (
                    <option key={r.value} value={r.value}>{r.label}</option>
                  ))}
                </select>
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
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M13.1 10.1919H10.5833V7.6752C10.5833 7.3502 10.325 7.09186 10 7.09186C9.675 7.09186 9.41667 7.3502 9.41667 7.6752V10.1919H6.9C6.575 10.1919 6.31667 10.4502 6.31667 10.7752C6.31667 11.1002 6.575 11.3585 6.9 11.3585H9.41667V13.8752C9.41667 14.2002 9.675 14.4585 10 14.4585C10.325 14.4585 10.5833 14.2002 10.5833 13.8752V11.3585H13.1C13.425 11.3585 13.6833 11.1002 13.6833 10.7752C13.6833 10.4502 13.425 10.1919 13.1 10.1919Z" fill="white"/>
                      </svg>
                    </button>
                    <p className="file-upload-text mb-0">или перетащите сюда</p>
                  </div>
                </div>

                {/* Список загруженных файлов */}
                {files.length > 0 && (
                  <div id="fileList" style={{ marginTop: '8px' }}>
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
                    <label className="form-check-label" htmlFor="compensationReturn">
                      возврат
                    </label>
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
                    <label className="form-check-label" htmlFor="compensationExchange">
                      обмен
                    </label>
                  </div>
                </div>
              </div>

              {error && (
                <p style={{ color: '#B71C1C', marginBottom: '12px', fontSize: '14px' }}>{error}</p>
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
