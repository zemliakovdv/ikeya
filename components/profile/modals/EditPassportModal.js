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

  // Повторный запрос звонка
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

  // Шаг 2 — подтвердить код (вызывается из SmsVerifyModal)
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

  // Шаг CODE — рендерим SmsVerifyModal
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
          onClick={onClose}
          style={{ zIndex: 1054, background: 'rgba(24, 24, 24, 0.36)' }}
        />
      </>
    );
  }

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

            {/* ШАГ 3 — успех */}
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
        onClick={onClose}
        style={{ zIndex: 1054, background: 'rgba(24, 24, 24, 0.36)' }}
      />
    </>
  );
}