// components/profile/modals/EditPassportModal.js
'use client';

import { useState, useRef } from 'react';
import { updateProfile, getProfile, requestA1Verification, verifyA1Code } from '@/lib/api/account';
import DatePicker from '@/components/ui/DatePicker';
import SmsVerifyModal from '@/components/profile/modals/SmsVerifyModal';

const REGIONS = [
  'Брестская',
  'Витебская',
  'Гомельская',
  'Гродненская',
  'Минская',
  'Могилевская',
];

const STEPS = { FORM: 'form', CODE: 'code', SUCCESS: 'success' };

// ─── Регулярки ───────────────────────────────────────────────────────────────
const RE_CYRILLIC       = /^[а-яёА-ЯЁ]+$/;
const RE_CYRILLIC_CITY  = /^[а-яёА-ЯЁ][а-яёА-ЯЁ\- ]*$/;
const RE_LATIN_ONLY     = /^[A-Za-z]+$/;
const RE_DIGITS_ONLY    = /^\d+$/;
const RE_ALPHANUMERIC_LATIN = /^[A-Za-z0-9]+$/;
const RE_HOUSE          = /^[0-9]+([/А-ЯЁа-яёA-Za-z])?$/;

// Фильтры для блокировки ввода
const LATIN_CHARS        = /^[A-Za-z]$/;
const LATIN_DIGIT_CHARS  = /^[A-Za-z0-9]$/;
const CYRILLIC_CHARS     = /^[а-яёА-ЯЁ]$/;
const LATIN_IN_STRING    = /[A-Za-z]/;
const DIGIT_CHARS        = /^[0-9]$/;
const HOUSE_CHARS        = /^[0-9/А-ЯЁа-яёA-Za-z]$/;

// ─── Валидатор одного поля ───────────────────────────────────────────────────
function validateField(name, value) {
  switch (name) {
    case 'first_name':
      if (!value.trim()) return 'Введите имя';
      if (!RE_CYRILLIC.test(value.trim())) return 'Только кириллица, без цифр и символов';
      return '';
    case 'last_name':
      if (!value.trim()) return 'Введите фамилию';
      if (!RE_CYRILLIC.test(value.trim())) return 'Только кириллица, без цифр и символов';
      return '';
    case 'middle_name':
      if (!value.trim()) return 'Введите отчество';
      if (!RE_CYRILLIC.test(value.trim())) return 'Только кириллица, без цифр и символов';
      return '';
    case 'series':
      if (!value.trim()) return 'Введите серию паспорта';
      if (!RE_LATIN_ONLY.test(value.trim()) || value.trim().length !== 2) return 'Только латиница, 2 буквы';
      return '';
    case 'number':
      if (!value.trim()) return 'Введите номер паспорта';
      if (!RE_DIGITS_ONLY.test(value.trim()) || value.trim().length !== 7) return 'Номер - 7 цифр';
      return '';
    case 'identification_number':
      if (!value.trim()) return 'Введите идентификационный номер';
      if (!RE_ALPHANUMERIC_LATIN.test(value.trim()) || value.trim().length !== 14) return '14 символов латиница и цифры';
      return '';
    case 'dob': {
      if (!value) return 'Введите дату рождения';
      const dob = new Date(value);
      const now = new Date();
      const age = now.getFullYear() - dob.getFullYear() -
        (now < new Date(now.getFullYear(), dob.getMonth(), dob.getDate()) ? 1 : 0);
      if (age < 14) return 'Возраст должен быть не менее 14 лет';
      if (age > 100) return 'Возраст не может превышать 100 лет';
      return '';
    }
    case 'city':
      if (!value.trim()) return 'Введите город';
      if (!RE_CYRILLIC_CITY.test(value.trim())) return 'Только кириллица и дефис';
      return '';
    case 'postcode':
      if (!value.trim()) return 'Введите индекс';
      if (!RE_DIGITS_ONLY.test(value.trim())) return 'Только цифры';
      return '';
    case 'house':
      if (!value.trim()) return 'Введите номер дома';
      if (!RE_HOUSE.test(value.trim())) return 'Например: 12, 12А или 3/5';
      return '';
    case 'street':
      if (!value.trim()) return 'Введите улицу';
      return '';
    case 'issued_by':
      if (!value.trim()) return 'Введите кем выдан';
      if (LATIN_IN_STRING.test(value)) return 'Только кириллица';
      return '';
    default:
      return '';
  }
}

function validateAll(form) {
  const fields = [
    'first_name', 'last_name', 'middle_name',
    'series', 'number', 'identification_number',
    'dob', 'city', 'postcode', 'house', 'street', 'issued_by',
  ];
  const errors = {};
  fields.forEach(f => {
    const err = validateField(f, form[f] || '');
    if (err) errors[f] = err;
  });
  return errors;
}

// ─── Компонент ошибки под полем ──────────────────────────────────────────────
function FieldError({ error }) {
  if (!error) return null;
  return (
    <p style={{ color: '#b71c1c', fontSize: '12px', marginTop: '4px', marginBottom: 0 }}>
      {error}
    </p>
  );
}

// ─── Нотификейшн под полем ───────────────────────────────────────────────────
function FieldWarning({ warning }) {
  if (!warning) return null;
  return (
    <p style={{ color: '#e65100', fontSize: '12px', marginTop: '4px', marginBottom: 0 }}>
      {warning}
    </p>
  );
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

  const [touched,        setTouched]        = useState({});
  const [fieldErrors,    setFieldErrors]    = useState({});
  const [inputWarnings,  setInputWarnings]  = useState({});
  const [verificationId,     setVerificationId]     = useState(null);
  const [callerNumberMasked, setCallerNumberMasked] = useState('');
  const [loading,        setLoading]        = useState(false);
  const [error,          setError]          = useState('');

  const warningTimers = useRef({});

  function showWarning(key, message) {
    setInputWarnings(prev => ({ ...prev, [key]: message }));
    if (warningTimers.current[key]) clearTimeout(warningTimers.current[key]);
    warningTimers.current[key] = setTimeout(() => {
      setInputWarnings(prev => ({ ...prev, [key]: '' }));
    }, 2000);
  }

  function set(key, rawValue) {
    let value = rawValue;
    let warned = false;

    if (key === 'series') {
      // Проверяем есть ли кириллица в новых символах
      const hasCyrillic = rawValue.split('').some(c => CYRILLIC_CHARS.test(c));
      if (hasCyrillic) {
        showWarning('series', 'Только латиница');
        warned = true;
      }
      value = rawValue.split('').filter(c => LATIN_CHARS.test(c)).join('').toUpperCase();
    } else if (key === 'identification_number') {
      const hasCyrillic = rawValue.split('').some(c => CYRILLIC_CHARS.test(c));
      if (hasCyrillic) {
        showWarning('identification_number', 'Только латиница');
        warned = true;
      }
      value = rawValue.split('').filter(c => LATIN_DIGIT_CHARS.test(c)).join('').toUpperCase();
    } else if (key === 'issued_by') {
      const hasLatin = LATIN_IN_STRING.test(rawValue);
      if (hasLatin) {
        showWarning('issued_by', 'Только кириллица');
        warned = true;
      }
      value = rawValue.split('').filter(c => !LATIN_CHARS.test(c)).join('');
    } else if (key === 'number' || key === 'postcode') {
      value = rawValue.split('').filter(c => DIGIT_CHARS.test(c)).join('');
    } else if (key === 'house') {
      value = rawValue.split('').filter(c => HOUSE_CHARS.test(c)).join('');
    }

    if (!warned && inputWarnings[key]) {
      setInputWarnings(prev => ({ ...prev, [key]: '' }));
    }

    setForm(prev => ({ ...prev, [key]: value }));

    if (touched[key]) {
      setFieldErrors(prev => ({ ...prev, [key]: validateField(key, value) }));
    }
  }

  function handleBlur(key) {
    setTouched(prev => ({ ...prev, [key]: true }));
    setFieldErrors(prev => ({ ...prev, [key]: validateField(key, form[key] || '') }));
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const allFields = [
      'first_name', 'last_name', 'middle_name',
      'series', 'number', 'identification_number',
      'dob', 'city', 'postcode', 'house', 'street', 'issued_by',
    ];
    const allTouched = Object.fromEntries(allFields.map(f => [f, true]));
    setTouched(allTouched);

    const errors = validateAll(form);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    setFieldErrors({});

    setLoading(true);
    try {
      await updateProfile({ passport: form });

      const phone = profile?.phone;
      if (!phone) throw new Error('Телефон не указан в профиле');

      const resp = await requestA1Verification(phone, 'passport_update');
      setVerificationId(resp.verification_id);
      setCallerNumberMasked(resp.caller_number_masked || '');
      setLoading(false);
      setStep(STEPS.CODE);
    } catch (err) {
      if (err?.payload?.code === 'passport_verification_required') {
        const phone = profile?.phone;
        if (!phone) { setLoading(false); setError('Телефон не указан в профиле'); return; }
        try {
          const resp = await requestA1Verification(phone, 'passport_update');
          setVerificationId(resp.verification_id);
          setCallerNumberMasked(resp.caller_number_masked || '');
          setLoading(false);
          setStep(STEPS.CODE);
        } catch (a1Err) {
          setLoading(false);
          setError(a1Err.message || 'Ошибка запроса верификации');
        }
        return;
      }
      setLoading(false);
      setError(err.message || 'Ошибка сохранения');
    }
  };

  const handleResend = async () => {
    setError('');
    try {
      const phone = profile?.phone;
      const resp = await requestA1Verification(phone, 'passport_update');
      setVerificationId(resp.verification_id);
      setCallerNumberMasked(resp.caller_number_masked || '');
    } catch (err) {
      setError(err.message || 'Ошибка повторного запроса');
    }
  };

  const handleVerify = async (code) => {
    setLoading(true);
    setError('');
    try {
      await verifyA1Code(verificationId, code);
      const updated = await getProfile();
      onSave?.({ ...updated, passport_verified: true });
      setStep(STEPS.SUCCESS);
    } catch (err) {
      setError(err.message || 'Неверный код');
    } finally {
      setLoading(false);
    }
  };

  if (step === STEPS.CODE) {
    return (
      <>
        <SmsVerifyModal
          userPhone={profile?.phone}
          callerNumber={callerNumberMasked}
          onVerify={handleVerify}
          onResend={handleResend}
          onClose={onClose}
          loading={loading}
          error={error}
        />
        <div
          className="modal-backdrop fade show"
          style={{ zIndex: 1056, background: 'rgba(24, 24, 24, 0.36)' }}
        />
      </>
    );
  }

  return (
    <>
      <div id="editPassportModal" className="modal fade show d-block" style={{ zIndex: 1055 }}>
        <div
          className="modal-dialog modal-dialog-centered modal-lg"
          onClick={e => e.stopPropagation()}
        >
          <div className="modal-content">

            {step === STEPS.FORM && (
              <>
                <div className="modal-header">
                  <h5 className="modal-title">Паспортные данные</h5>
                  <button type="button" className="btn-close" onClick={onClose} aria-label="Закрыть" />
                </div>

                <div className="modal-body">
                  <form onSubmit={handleSubmit} noValidate>

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
                          className={`form-control${fieldErrors.first_name ? ' is-invalid' : ''}`}
                          placeholder=" "
                          value={form.first_name}
                          onChange={e => set('first_name', e.target.value)}
                          onBlur={() => handleBlur('first_name')}
                        />
                        <label>Имя <span className="req">*</span></label>
                        <FieldError error={fieldErrors.first_name} />
                      </div>
                      <div className="form-group form-floating">
                        <input
                          type="text"
                          className={`form-control${fieldErrors.last_name ? ' is-invalid' : ''}`}
                          placeholder=" "
                          value={form.last_name}
                          onChange={e => set('last_name', e.target.value)}
                          onBlur={() => handleBlur('last_name')}
                        />
                        <label>Фамилия <span className="req">*</span></label>
                        <FieldError error={fieldErrors.last_name} />
                      </div>
                      <div className="form-group form-floating">
                        <input
                          type="text"
                          className={`form-control${fieldErrors.middle_name ? ' is-invalid' : ''}`}
                          placeholder=" "
                          value={form.middle_name}
                          onChange={e => set('middle_name', e.target.value)}
                          onBlur={() => handleBlur('middle_name')}
                        />
                        <label>Отчество <span className="req">*</span></label>
                        <FieldError error={fieldErrors.middle_name} />
                      </div>
                    </div>

                    {/* Серия / Номер / Дата выдачи */}
                    <div className="form-row passport-row passport-row--series">
                      <div className="form-group form-floating">
                        <input
                          type="text"
                          className={`form-control${fieldErrors.series ? ' is-invalid' : ''}`}
                          placeholder=" "
                          maxLength={2}
                          value={form.series}
                          onChange={e => set('series', e.target.value)}
                          onBlur={() => handleBlur('series')}
                        />
                        <label>Серия паспорта <span className="req">*</span></label>
                        <FieldWarning warning={inputWarnings.series} />
                        <FieldError error={fieldErrors.series} />
                      </div>
                      <div className="form-group form-floating">
                        <input
                          type="text"
                          className={`form-control${fieldErrors.number ? ' is-invalid' : ''}`}
                          placeholder=" "
                          maxLength={7}
                          value={form.number}
                          onChange={e => set('number', e.target.value)}
                          onBlur={() => handleBlur('number')}
                        />
                        <label>Номер паспорта <span className="req">*</span></label>
                        <FieldError error={fieldErrors.number} />
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
                        className={`form-control passport-textarea${fieldErrors.issued_by ? ' is-invalid' : ''}`}
                        placeholder="Кем выдан *"
                        rows={4}
                        value={form.issued_by}
                        onChange={e => set('issued_by', e.target.value)}
                        onBlur={() => handleBlur('issued_by')}
                      />
                      <FieldWarning warning={inputWarnings.issued_by} />
                      <FieldError error={fieldErrors.issued_by} />
                    </div>

                    {/* Идентификационный номер / Дата рождения */}
                    <div className="form-row passport-row passport-row--id">
                      <div className="form-group form-floating">
                        <input
                          type="text"
                          className={`form-control${fieldErrors.identification_number ? ' is-invalid' : ''}`}
                          placeholder=" "
                          maxLength={14}
                          value={form.identification_number}
                          onChange={e => set('identification_number', e.target.value)}
                          onBlur={() => handleBlur('identification_number')}
                        />
                        <label>Идентификационный номер <span className="req">*</span></label>
                        <FieldWarning warning={inputWarnings.identification_number} />
                        <FieldError error={fieldErrors.identification_number} />
                      </div>
                      <div className="datepicker-wrap">
                        <DatePicker
                          value={form.dob}
                          onChange={val => {
                            set('dob', val);
                            if (touched.dob) {
                              setFieldErrors(prev => ({ ...prev, dob: validateField('dob', val) }));
                            }
                          }}
                          onBlur={() => handleBlur('dob')}
                          label="Дата рождения"
                          required
                        />
                        <FieldError error={fieldErrors.dob} />
                      </div>
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
                          className={`form-control${fieldErrors.city ? ' is-invalid' : ''}`}
                          placeholder=" "
                          value={form.city}
                          onChange={e => set('city', e.target.value)}
                          onBlur={() => handleBlur('city')}
                        />
                        <label>Город <span className="req">*</span></label>
                        <FieldError error={fieldErrors.city} />
                      </div>
                      <div className="form-group form-floating">
                        <input
                          type="text"
                          className={`form-control${fieldErrors.postcode ? ' is-invalid' : ''}`}
                          placeholder=" "
                          maxLength={6}
                          value={form.postcode}
                          onChange={e => set('postcode', e.target.value)}
                          onBlur={() => handleBlur('postcode')}
                        />
                        <label>Индекс <span className="req">*</span></label>
                        <FieldError error={fieldErrors.postcode} />
                      </div>
                    </div>

                    {/* Улица / Дом / Корпус / Квартира */}
                    <div className="form-row passport-row passport-row--address2">
                      <div className="form-group form-floating">
                        <input
                          type="text"
                          className={`form-control${fieldErrors.street ? ' is-invalid' : ''}`}
                          placeholder=" "
                          value={form.street}
                          onChange={e => set('street', e.target.value)}
                          onBlur={() => handleBlur('street')}
                        />
                        <label>Улица <span className="req">*</span></label>
                        <FieldError error={fieldErrors.street} />
                      </div>
                      <div className="form-group form-floating">
                        <input
                          type="text"
                          className={`form-control${fieldErrors.house ? ' is-invalid' : ''}`}
                          placeholder=" "
                          value={form.house}
                          onChange={e => set('house', e.target.value)}
                          onBlur={() => handleBlur('house')}
                        />
                        <label>Дом <span className="req">*</span></label>
                        <FieldError error={fieldErrors.house} />
                      </div>
                      <div className="form-group form-floating">
                        <input
                          type="text"
                          className="form-control"
                          placeholder=" "
                          value={form.building}
                          onChange={e => set('building', e.target.value)}
                        />
                        <label>Корпус</label>
                      </div>
                      <div className="form-group form-floating">
                        <input
                          type="text"
                          className="form-control"
                          placeholder=" "
                          value={form.apartment}
                          onChange={e => set('apartment', e.target.value)}
                        />
                        <label>Квартира</label>
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

            {step === STEPS.SUCCESS && (
              <>
                <div className="modal-header">
                  <h5 className="modal-title">Данные подтверждены</h5>
                  <button type="button" className="btn-close" onClick={onClose} aria-label="Закрыть" />
                </div>
                <div className="modal-body">
                  <p className="confirmation-text">
                    Паспортные данные сохранены и подтверждены.
                  </p>
                  <div className="modal-footer-single passport-succes-info">
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
        style={{ zIndex: 1054, background: 'rgba(24, 24, 24, 0.36)' }}
      />
    </>
  );
}