// components/profile/modals/EditPassportModal.js
'use client';

import { useState } from 'react';
import { updateProfile, getProfile } from '@/lib/api/account';
import DatePicker from '@/components/ui/DatePicker';

const API_BASE_URL = 'http://45.135.234.22/api/v1';

const REGIONS = [
  'Брестская',
  'Витебская',
  'Гомельская',
  'Гродненская',
  'Минская',
  'Могилевская',
];

const STEPS = { FORM: 'form', CODE: 'code', SUCCESS: 'success' };

async function fetchWithAuth(endpoint, options = {}) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `Ошибка ${res.status}`);
  }
  return res.json();
}

export default function EditPassportModal({ profile, onClose, onSave }) {
  const passport = profile?.passport_data || {};

  const [step, setStep] = useState(STEPS.FORM);

  const [form, setForm] = useState({
    first_name:            passport.first_name            || '',
    last_name:             passport.last_name             || '',
    middle_name:           passport.middle_name           || '',
    series:                passport.series                || '',
    number:                passport.number                || '',
    issue_date:            passport.issue_date            || '',
    issued_by:             passport.issued_by             || '',
    identification_number: passport.identification_number || '',
    dob:                   passport.dob                   || '',
    region:                passport.region                || '',
    city:                  passport.city                  || '',
    postcode:              passport.postcode              || '',
    street:                passport.street                || '',
    house:                 passport.house                 || '',
    building:              passport.building              || '',
    apartment:             passport.apartment             || '',
  });

  const [verificationId,     setVerificationId]     = useState(null);
  const [callerNumberMasked, setCallerNumberMasked] = useState('');
  const [digits,             setDigits]             = useState(['', '', '', '']);
  const [loading,            setLoading]            = useState(false);
  const [error,              setError]              = useState('');

  const set = (key, val) => setForm(p => ({ ...p, [key]: val }));

  // Шаг 1 — сохранить паспорт и запросить звонок
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await updateProfile({ passport: form });

      const phone = profile?.phone;
      if (!phone) throw new Error('Телефон не указан в профиле');

      const resp = await fetchWithAuth('/a1/request', {
        method: 'POST',
        body: JSON.stringify({ phone, context: 'passport_update' }),
      });

      setVerificationId(resp.verification_id);
      setCallerNumberMasked(resp.caller_number_masked || '');
      setStep(STEPS.CODE);
    } catch (err) {
      setError(err.message || 'Ошибка сохранения');
    } finally {
      setLoading(false);
    }
  };

  // Ввод цифры
  const inputRefs = [];
  const handleDigitChange = (idx, value) => {
    const digit = value.replace(/\D/g, '').slice(-1);
    const next = [...digits];
    next[idx] = digit;
    setDigits(next);
    if (digit && idx < 3) inputRefs[idx + 1]?.focus();
  };
  const handleDigitKeyDown = (idx, e) => {
    if (e.key === 'Backspace' && !digits[idx] && idx > 0) inputRefs[idx - 1]?.focus();
  };

  // Шаг 2 — подтвердить код
  const handleVerify = async () => {
    const code = digits.join('');
    if (code.length !== 4) return;
    setLoading(true);
    setError('');
    try {
      await fetchWithAuth('/a1/verify', {
        method: 'POST',
        body: JSON.stringify({ verification_id: verificationId, last4: code }),
      });
      const updated = await getProfile();
      onSave?.(updated);
      setStep(STEPS.SUCCESS);
    } catch (err) {
      setError(err.message || 'Неверный код');
      setDigits(['', '', '', '']);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div id="editPassportModal" className="modal fade show d-block" onClick={onClose} style={{ zIndex: 1055 }}>
        <div
          className="modal-dialog modal-dialog-centered modal-lg"
          onClick={e => e.stopPropagation()}
        >
          <div className="modal-content">

            {/* ШАГ 1 — форма */}
            {step === STEPS.FORM && (
              <>
                <div className="modal-header">
                  <h5 className="modal-title">Паспортные данные</h5>
                  <button type="button" className="btn-close" onClick={onClose} aria-label="Закрыть" />
                </div>

                <div className="modal-body">
                  <form onSubmit={handleSubmit}>

                    {/* Выбор страны — пока только Беларусь */}
                    <div className="passport-country">
                      <label className="radio-item">
                        <input type="radio" name="country" defaultChecked readOnly />
                        <span className="radio-custom" />
                        <span className="radio-label">Беларусь</span>
                      </label>
                    </div>

                    {/* Имя / Фамилия / Отчество */}
                    <div className="form-row passport-row fio-row">
                      <div className="form-group form-floating">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Имя"
                          value={form.first_name}
                          onChange={e => set('first_name', e.target.value)}
                          required
                        />
                        <label>Имя <span className="req">*</span></label>
                      </div>
                      <div className="form-group form-floating">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Фамилия"
                          value={form.last_name}
                          onChange={e => set('last_name', e.target.value)}
                          required
                        />
                        <label>Фамилия <span className="req">*</span></label>
                      </div>
                      <div className="form-group form-floating">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Отчество"
                          value={form.middle_name}
                          onChange={e => set('middle_name', e.target.value)}
                          required
                        />
                        <label>Отчество <span className="req">*</span></label>
                      </div>
                    </div>

                    {/* Серия / Номер / Дата выдачи */}
                    <div className="form-row passport-row passport-row--series">
                      <div className="form-group form-floating">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Серия паспорта"
                          maxLength={2}
                          value={form.series}
                          onChange={e => set('series', e.target.value)}
                          required
                        />
                        <label>Серия паспорта <span className="req">*</span></label>
                      </div>
                      <div className="form-group form-floating">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Номер паспорта"
                          maxLength={7}
                          value={form.number}
                          onChange={e => set('number', e.target.value)}
                          required
                        />
                        <label>Номер паспорта <span className="req">*</span></label>
                      </div>
                      <DatePicker
                        value={form.issue_date}
                        onChange={val => set('issue_date', val)}
                        label="Дата выдачи"
                        required
                      />
                    </div>

                    {/* Кем выдан */}
                    <div className="form-group who-group">
                      <textarea
                        className="form-control passport-textarea"
                        placeholder="Кем выдан *"
                        rows={4}
                        value={form.issued_by}
                        onChange={e => set('issued_by', e.target.value)}
                        required
                      />
                    </div>

                    {/* Идентификационный номер / Дата рождения */}
                    <div className="form-row passport-row passport-row--id">
                      <div className="form-group form-floating">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Идентификационный номер"
                          maxLength={14}
                          value={form.identification_number}
                          onChange={e => set('identification_number', e.target.value)}
                          required
                        />
                        <label>Идентификационный номер <span className="req">*</span></label>
                      </div>
                      <DatePicker
                        value={form.dob}
                        onChange={val => set('dob', val)}
                        label="Дата рождения"
                        required
                      />
                    </div>

                    {/* Адрес прописки */}
                    <p className="passport-address-title">Адрес прописки</p>

                    {/* Область / Город / Индекс */}
                    <div className="form-row passport-row passport-row--address1">
                      <div className="form-group form-floating">
                        <select
                          className="form-control form-select"
                          value={form.region}
                          onChange={e => set('region', e.target.value)}
                          required
                        >
                          <option value="" disabled>Область</option>
                          {REGIONS.map(r => (
                            <option key={r} value={r.toLowerCase()}>{r}</option>
                          ))}
                        </select>
                        <label>Область <span className="req">*</span></label>
                      </div>
                      <div className="form-group form-floating">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Город"
                          value={form.city}
                          onChange={e => set('city', e.target.value)}
                          required
                        />
                        <label>Город <span className="req">*</span></label>
                      </div>
                      <div className="form-group form-floating">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Индекс"
                          maxLength={6}
                          value={form.postcode}
                          onChange={e => set('postcode', e.target.value)}
                          required
                        />
                        <label>Индекс <span className="req">*</span></label>
                      </div>
                    </div>

                    {/* Улица / Дом / Корпус / Квартира */}
                    <div className="form-row passport-row passport-row--address2">
                      <div className="form-group form-floating">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Улица"
                          value={form.street}
                          onChange={e => set('street', e.target.value)}
                          required
                        />
                        <label>Улица <span className="req">*</span></label>
                      </div>
                      <div className="form-group form-floating">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Дом"
                          value={form.house}
                          onChange={e => set('house', e.target.value)}
                          required
                        />
                        <label>Дом <span className="req">*</span></label>
                      </div>
                      <div className="form-group form-floating">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Корпус"
                          value={form.building}
                          onChange={e => set('building', e.target.value)}
                          required
                        />
                        <label>Корпус <span className="req">*</span></label>
                      </div>
                      <div className="form-group form-floating">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Квартира"
                          value={form.apartment}
                          onChange={e => set('apartment', e.target.value)}
                          required
                        />
                        <label>Квартира <span className="req">*</span></label>
                      </div>
                    </div>

                    {error && (
                      <p style={{ color: '#b71c1c', fontSize: '14px', marginBottom: '12px' }}>{error}</p>
                    )}

                    <div className="modal-footer-buttons">
                      <button type="button" className="btn btn-outline" onClick={onClose} disabled={loading}>
                        Отмена
                      </button>
                      <button type="submit" className="btn btn-primary" disabled={loading}>
                        {loading ? 'Сохраняем…' : 'Сохранить'}
                      </button>
                    </div>

                  </form>
                </div>
              </>
            )}

            {/* ШАГ 2 — верификация по звонку */}
            {step === STEPS.CODE && (
              <>
                <div className="modal-header">
                  <h5 className="modal-title">Идентификация пользователя</h5>
                  <button type="button" className="btn-close" onClick={onClose} aria-label="Закрыть" />
                </div>
                <div className="modal-body">
                  <p className="confirmation-text" style={{ marginBottom: '20px' }}>
                    Главное безопасность!<br />
                    Введите последние 4 цифры номера, с которого мы звоним на Ваш номер:
                    {callerNumberMasked && <> <strong>{callerNumberMasked}</strong></>}
                  </p>

                  <div className="code-inputs">
                    {digits.map((digit, idx) => (
                      <input
                        key={idx}
                        ref={el => inputRefs[idx] = el}
                        type="text"
                        inputMode="numeric"
                        className="code-input"
                        maxLength={1}
                        value={digit}
                        onChange={e => handleDigitChange(idx, e.target.value)}
                        onKeyDown={e => handleDigitKeyDown(idx, e)}
                        autoFocus={idx === 0}
                      />
                    ))}
                  </div>

                  {error && (
                    <p style={{ color: '#b71c1c', fontSize: '14px', marginTop: '12px' }}>{error}</p>
                  )}

                  <div className="modal-footer-buttons" style={{ marginTop: '20px' }}>
                    <button
                      type="button"
                      className="btn btn-outline"
                      onClick={() => { setStep(STEPS.FORM); setDigits(['', '', '', '']); setError(''); }}
                      disabled={loading}
                    >
                      Назад
                    </button>
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={handleVerify}
                      disabled={loading || digits.join('').length !== 4}
                    >
                      {loading ? 'Проверяем…' : 'Подтвердить'}
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* ШАГ 3 — успех */}
            {step === STEPS.SUCCESS && (
              <>
                <div className="modal-header">
                  <h5 className="modal-title">Данные подтверждены</h5>
                  <button type="button" className="btn-close" onClick={onClose} aria-label="Закрыть" />
                </div>
                <div className="modal-body">
                  <p className="confirmation-text">
                    Паспортные данные сохранены и верифицированы.
                  </p>
                  <div className="modal-footer-single">
                    <button type="button" className="btn btn-primary btn-full" onClick={onClose}>
                      Закрыть
                    </button>
                  </div>
                </div>
              </>
            )}

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