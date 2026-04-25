// components/profile/modals/EditPassportModal.js
'use client';

import { useState } from 'react';
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
const RE_CYRILLIC     = /^[а-яёА-ЯЁ]+$/;
const RE_CYRILLIC_CITY = /^[а-яёА-ЯЁ][а-яёА-ЯЁ\- ]*$/;
const RE_LATIN_ONLY   = /^[A-Za-z]+$/;
const RE_DIGITS_ONLY  = /^\d+$/;
const RE_ALPHANUMERIC_LATIN = /^[A-Za-z0-9]+$/;
const RE_HOUSE        = /^[0-9]+([/А-ЯЁа-яёA-Za-z])?$/;

// ─── Валидаторы ──────────────────────────────────────────────────────────────
function validateForm(form) {
  const errors = {};

  if (!form.first_name.trim())
    errors.first_name = 'Введите имя';
  else if (!RE_CYRILLIC.test(form.first_name.trim()))
    errors.first_name = 'Только кириллица, без цифр и символов';

  if (!form.last_name.trim())
    errors.last_name = 'Введите фамилию';
  else if (!RE_CYRILLIC.test(form.last_name.trim()))
    errors.last_name = 'Только кириллица, без цифр и символов';

  if (!form.middle_name.trim())
    errors.middle_name = 'Введите отчество';
  else if (!RE_CYRILLIC.test(form.middle_name.trim()))
    errors.middle_name = 'Только кириллица, без цифр и символов';

  if (!form.series.trim())
    errors.series = 'Введите серию паспорта';
  else if (!RE_LATIN_ONLY.test(form.series.trim()) || form.series.trim().length !== 2)
    errors.series = 'Ровно 2 латинские буквы (например MC)';

  if (!form.number.trim())
    errors.number = 'Введите номер паспорта';
  else if (!RE_DIGITS_ONLY.test(form.number.trim()) || form.number.trim().length !== 7)
    errors.number = 'Ровно 7 цифр';

  if (!form.identification_number.trim())
    errors.identification_number = 'Введите идентификационный номер';
  else if (
    !RE_ALPHANUMERIC_LATIN.test(form.identification_number.trim()) ||
    form.identification_number.trim().length !== 14
  )
    errors.identification_number = 'Ровно 14 символов: цифры и латинские буквы';

  if (!form.dob)
    errors.dob = 'Введите дату рождения';
  else {
    const dob = new Date(form.dob);
    const now = new Date();
    const age = now.getFullYear() - dob.getFullYear() -
      (now < new Date(now.getFullYear(), dob.getMonth(), dob.getDate()) ? 1 : 0);
    if (age < 14)
      errors.dob = 'Возраст должен быть не менее 14 лет';
    else if (age > 100)
      errors.dob = 'Возраст не может превышать 100 лет';
  }

  if (!form.city.trim())
    errors.city = 'Введите город';
  else if (!RE_CYRILLIC_CITY.test(form.city.trim()))
    errors.city = 'Только кириллица и дефис';

  if (!form.postcode.trim())
    errors.postcode = 'Введите индекс';
  else if (!RE_DIGITS_ONLY.test(form.postcode.trim()))
    errors.postcode = 'Только цифры';

  if (!form.house.trim())
    errors.house = 'Введите номер дома';
  else if (!RE_HOUSE.test(form.house.trim()))
    errors.house = 'Например: 12, 12А или 3/5';

  return errors;
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

  const [fieldErrors,        setFieldErrors]        = useState({});
  const [verificationId,     setVerificationId]     = useState(null);
  const [callerNumberMasked, setCallerNumberMasked] = useState('');
  const [loading,            setLoading]            = useState(false);
  const [error,              setError]              = useState('');

  const set = (key, val) => {
    setForm(p => ({ ...p, [key]: val }));
    if (fieldErrors[key]) setFieldErrors(p => ({ ...p, [key]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const errors = validateForm(form);
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
      setStep(STEPS.CODE);
    } catch (err) {
      setError(err.message || 'Ошибка сохранения');
    } finally {
      setLoading(false);
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
          style={{ zIndex: 1054, background: 'rgba(24, 24, 24, 0.36)' }}
        />
      </>
    );
  }

  const FieldError = ({ name }) =>
    fieldErrors[name]
      ? <p style={{ color: '#b71c1c', fontSize: '12px', marginTop: '4px' }}>{fieldErrors[name]}</p>
      : null;

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
                        />
                        <label>Имя <span className="req">*</span></label>
                        <FieldError name="first_name" />
                      </div>
                      <div className="form-group form-floating">
                        <input
                          type="text"
                          className={`form-control${fieldErrors.last_name ? ' is-invalid' : ''}`}
                          placeholder=" "
                          value={form.last_name}
                          onChange={e => set('last_name', e.target.value)}
                        />
                        <label>Фамилия <span className="req">*</span></label>
                        <FieldError name="last_name" />
                      </div>
                      <div className="form-group form-floating">
                        <input
                          type="text"
                          className={`form-control${fieldErrors.middle_name ? ' is-invalid' : ''}`}
                          placeholder=" "
                          value={form.middle_name}
                          onChange={e => set('middle_name', e.target.value)}
                        />
                        <label>Отчество <span className="req">*</span></label>
                        <FieldError name="middle_name" />
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
                          onChange={e => set('series', e.target.value.toUpperCase())}
                        />
                        <label>Серия паспорта <span className="req">*</span></label>
                        <FieldError name="series" />
                      </div>
                      <div className="form-group form-floating">
                        <input
                          type="text"
                          className={`form-control${fieldErrors.number ? ' is-invalid' : ''}`}
                          placeholder=" "
                          maxLength={7}
                          value={form.number}
                          onChange={e => set('number', e.target.value.replace(/\D/g, ''))}
                        />
                        <label>Номер паспорта <span className="req">*</span></label>
                        <FieldError name="number" />
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
                          className={`form-control${fieldErrors.identification_number ? ' is-invalid' : ''}`}
                          placeholder=" "
                          maxLength={14}
                          value={form.identification_number}
                          onChange={e => set('identification_number', e.target.value.toUpperCase())}
                        />
                        <label>Идентификационный номер <span className="req">*</span></label>
                        <FieldError name="identification_number" />
                      </div>
                      <div className="datepicker-wrap">
                        <DatePicker
                          value={form.dob}
                          onChange={val => set('dob', val)}
                          label="Дата рождения"
                          required
                        />
                        <FieldError name="dob" />
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
                        />
                        <label>Город <span className="req">*</span></label>
                        <FieldError name="city" />
                      </div>
                      <div className="form-group form-floating">
                        <input
                          type="text"
                          className={`form-control${fieldErrors.postcode ? ' is-invalid' : ''}`}
                          placeholder=" "
                          maxLength={6}
                          value={form.postcode}
                          onChange={e => set('postcode', e.target.value.replace(/\D/g, ''))}
                        />
                        <label>Индекс <span className="req">*</span></label>
                        <FieldError name="postcode" />
                      </div>
                    </div>

                    {/* Улица / Дом / Корпус / Квартира */}
                    <div className="form-row passport-row passport-row--address2">
                      <div className="form-group form-floating">
                        <input
                          type="text"
                          className="form-control"
                          placeholder=" "
                          value={form.street}
                          onChange={e => set('street', e.target.value)}
                          required
                        />
                        <label>Улица <span className="req">*</span></label>
                      </div>
                      <div className="form-group form-floating">
                        <input
                          type="text"
                          className={`form-control${fieldErrors.house ? ' is-invalid' : ''}`}
                          placeholder=" "
                          value={form.house}
                          onChange={e => set('house', e.target.value)}
                        />
                        <label>Дом <span className="req">*</span></label>
                        <FieldError name="house" />
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