// components/profile/modals/EditPersonalDataModal.js
'use client';

import { useState } from 'react';
import { updateProfile } from '@/lib/api/account';
import { isEmailFormatValid } from '@/lib/utils/email';
import { isValidPersonName, normalizePersonName } from '@/lib/utils/personName';

export default function EditPersonalDataModal({ profile, onClose, onSave }) {
  const [form, setForm] = useState({
    last_name:   profile?.last_name   || '',
    first_name:  profile?.first_name  || '',
    middle_name: profile?.middle_name || '',
    gender:      (profile?.gender || 'male').toLowerCase(),
    email:       profile?.email       || '',
  });

  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');
  const [fieldErrors, setFieldErrors] = useState({
    last_name: '',
    first_name: '',
    middle_name: '',
  });

  const set = (key, val) => {
    setForm((p) => ({ ...p, [key]: val }));
    if (fieldErrors[key]) {
      setFieldErrors((prev) => ({ ...prev, [key]: '' }));
    }
  };

  const validateNameField = (value) => {
    if (isValidPersonName(value)) return '';
    return 'Только кириллица, пробел и дефис';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const normalizedNames = {
      last_name: normalizePersonName(form.last_name),
      first_name: normalizePersonName(form.first_name),
      middle_name: normalizePersonName(form.middle_name),
    };
    const nextFieldErrors = {
      last_name: validateNameField(normalizedNames.last_name),
      first_name: validateNameField(normalizedNames.first_name),
      middle_name: validateNameField(normalizedNames.middle_name),
    };
    const hasNameErrors = Object.values(nextFieldErrors).some(Boolean);
    if (hasNameErrors) {
      setFieldErrors(nextFieldErrors);
      setForm((prev) => ({ ...prev, ...normalizedNames }));
      return;
    }

    const normalizedEmail = form.email.trim();
    if (normalizedEmail && !isEmailFormatValid(normalizedEmail)) {
      setError('Введите корректный email');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const updated = await updateProfile({
        first_name:  normalizedNames.first_name,
        last_name:   normalizedNames.last_name,
        middle_name: normalizedNames.middle_name,
        gender:      form.gender,
        email:       normalizedEmail || undefined,
      });
      // Передаём first_name отдельно — нужно для обновления имени в хедере и сайдбаре
      onSave?.(updated, normalizedNames.first_name);
      onClose();
    } catch (err) {
      setError(err.message || 'Ошибка сохранения');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div id="editPersonalDataModalRoot" className="modal fade show d-block" style={{ zIndex: 1055 }}>
        <div className="modal-dialog modal-dialog-centered" onClick={e => e.stopPropagation()}>
          <div className="modal-content" id="editPersonalDataModal">
            <div className="modal-header">
              <h5 className="modal-title">Личные данные</h5>
              <button type="button" className="btn-close" onClick={onClose} aria-label="Закрыть" />
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmit}>

                <div className="form-group form-floating">
                  <input
                    type="text" className={`form-control${fieldErrors.last_name ? ' is-invalid' : ''}`} id="last_name" placeholder="Фамилия"
                    value={form.last_name} onChange={e => set('last_name', e.target.value)} required
                    onBlur={e => {
                      const normalized = normalizePersonName(e.target.value);
                      set('last_name', normalized);
                      setFieldErrors((prev) => ({ ...prev, last_name: validateNameField(normalized) }));
                    }}
                  />
                  <label htmlFor="last_name">Фамилия <span style={{ color: '#b71c1c' }}>*</span></label>
                  {fieldErrors.last_name && <div className="invalid-feedback">{fieldErrors.last_name}</div>}
                </div>

                <div className="form-group form-floating">
                  <input
                    type="text" className={`form-control${fieldErrors.first_name ? ' is-invalid' : ''}`} id="first_name" placeholder="Имя"
                    value={form.first_name} onChange={e => set('first_name', e.target.value)} required
                    onBlur={e => {
                      const normalized = normalizePersonName(e.target.value);
                      set('first_name', normalized);
                      setFieldErrors((prev) => ({ ...prev, first_name: validateNameField(normalized) }));
                    }}
                  />
                  <label htmlFor="first_name">Имя <span style={{ color: '#b71c1c' }}>*</span></label>
                  {fieldErrors.first_name && <div className="invalid-feedback">{fieldErrors.first_name}</div>}
                </div>

                <div className="form-group form-floating">
                  <input
                    type="text" className={`form-control${fieldErrors.middle_name ? ' is-invalid' : ''}`} id="middle_name" placeholder="Отчество"
                    value={form.middle_name} onChange={e => set('middle_name', e.target.value)} required
                    onBlur={e => {
                      const normalized = normalizePersonName(e.target.value);
                      set('middle_name', normalized);
                      setFieldErrors((prev) => ({ ...prev, middle_name: validateNameField(normalized) }));
                    }}
                  />
                  <label htmlFor="middle_name">Отчество <span style={{ color: '#b71c1c' }}>*</span></label>
                  {fieldErrors.middle_name && <div className="invalid-feedback">{fieldErrors.middle_name}</div>}
                </div>

                <div className="form-group">
                  <label className="form-label">Ваш пол</label>
                  <div className="radio-group">
                    {[['male', 'Мужской'], ['female', 'Женский']].map(([val, label]) => (
                      <label className="radio-item" key={val}>
                        <input
                          type="radio" name="gender" value={val}
                          checked={form.gender === val} onChange={() => set('gender', val)}
                        />
                        <span className="radio-custom"></span>
                        <span className="radio-label">{label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="form-group form-floating">
                  <input
                    type="email" className="form-control" id="email" placeholder="Электронная почта"
                    value={form.email} onChange={e => set('email', e.target.value)}
                    inputMode="email"
                    autoComplete="email"
                    spellCheck={false}
                  />
                  <label htmlFor="email">Электронная почта</label>
                </div>

                {error && (
                  <div className="form-error" style={{ color: '#b71c1c', marginBottom: '12px' }}>
                    {error}
                  </div>
                )}

                <div className="modal-footer-buttons">
                  <button type="button" className="datas-canceled" onClick={onClose} disabled={loading}>
                    Отмена
                  </button>
                  <button type="submit" className="datas-submit" disabled={loading}>
                    {loading ? 'Сохраняем…' : 'Сохранить'}
                  </button>
                </div>

              </form>
            </div>
          </div>
        </div>
      </div>

      <div
        className="modal-backdrop fade show"
        onClick={onClose}
        style={{ zIndex: 1054, background: 'rgba(24, 24, 24, 0.36)' }}
      />
    </>
  );
}
