'use client';

import { useState } from 'react';
import { updateProfile } from '@/lib/api/account';

const REGIONS = ['Минская','Брестская','Витебская','Гомельская','Гродненская','Могилевская'];

export default function EditPassportModal({ profile, onClose, onSave }) {
  const passport = profile?.passport_data || {};

  const [form, setForm] = useState({
    first_name:             passport.first_name             || '',
    last_name:              passport.last_name              || '',
    middle_name:            passport.middle_name            || '',
    series:                 passport.series                 || '',
    number:                 passport.number                 || '',
    issue_date:             passport.issue_date             || '',
    issued_by:              passport.issued_by              || '',
    identification_number:  passport.identification_number  || '',
    dob:                    passport.dob                    || '',
    region:                 passport.region                 || '',
    city:                   passport.city                   || '',
    postcode:               passport.postcode               || '',
    street:                 passport.street                 || '',
    house:                  passport.house                  || '',
    building:               passport.building               || '',
    apartment:              passport.apartment              || '',
  });

  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');
  const [success, setSuccess] = useState(false);

  const set = (key, val) => setForm(p => ({ ...p, [key]: val }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const updated = await updateProfile({ passport: form });
      onSave?.(updated);
      setSuccess(true);
    } catch (err) {
      setError(err.message || 'Ошибка сохранения');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal fade show d-block" onClick={onClose} id="editPassportModal">
      <div className="modal-dialog modal-dialog-centered modal-lg" onClick={e => e.stopPropagation()}>
        <div className="modal-content">

          {!success ? (
            <>
              <div className="modal-header">
                <h5 className="modal-title">Паспортные данные</h5>
                <button type="button" className="btn-close" onClick={onClose} aria-label="Закрыть" />
              </div>
              <div className="modal-body">
                <p className="form-info-text" style={{ marginBottom: '16px', color: '#757575', fontSize: '13px' }}>
                  После сохранения данные будут отправлены на проверку менеджеру.
                </p>
                <form onSubmit={handleSubmit}>

                  {/* ФИО */}
                  <div className="form-row">
                    {[
                      ['last_name',   'Фамилия',  true],
                      ['first_name',  'Имя',      true],
                      ['middle_name', 'Отчество', false],
                    ].map(([key, label, required]) => (
                      <div className="form-group col-md-4 form-floating" key={key}>
                        <input
                          type="text" className="form-control" placeholder={label}
                          value={form[key]} onChange={e => set(key, e.target.value)}
                          required={required}
                        />
                        <label>
                          {label} {required && <span style={{ color: '#b71c1c' }}>*</span>}
                        </label>
                      </div>
                    ))}
                  </div>

                  {/* Серия, номер, дата выдачи */}
                  <div className="form-row">
                    <div className="form-group col-md-2 form-floating">
                      <input
                        type="text" className="form-control" placeholder="Серия" maxLength={2}
                        value={form.series} onChange={e => set('series', e.target.value)} required
                      />
                      <label>Серия <span style={{ color: '#b71c1c' }}>*</span></label>
                    </div>
                    <div className="form-group col-md-4 form-floating">
                      <input
                        type="text" className="form-control" placeholder="Номер" maxLength={7}
                        value={form.number} onChange={e => set('number', e.target.value)} required
                      />
                      <label>Номер <span style={{ color: '#b71c1c' }}>*</span></label>
                    </div>
                    <div className="form-group col-md-3 form-floating">
                      <input
                        type="date" className="form-control" placeholder="Дата выдачи"
                        value={form.issue_date} onChange={e => set('issue_date', e.target.value)} required
                      />
                      <label>Дата выдачи <span style={{ color: '#b71c1c' }}>*</span></label>
                    </div>
                    <div className="form-group col-md-3 form-floating">
                      <input
                        type="date" className="form-control" placeholder="Дата рождения"
                        value={form.dob} onChange={e => set('dob', e.target.value)} required
                      />
                      <label>Дата рождения <span style={{ color: '#b71c1c' }}>*</span></label>
                    </div>
                  </div>

                  {/* Кем выдан */}
                  <div className="form-group">
                    <textarea
                      className="form-control form-textarea" placeholder="Кем выдан" rows={2}
                      value={form.issued_by} onChange={e => set('issued_by', e.target.value)} required
                    />
                  </div>

                  {/* Идентификационный номер */}
                  <div className="form-group form-floating">
                    <input
                      type="text" className="form-control"
                      placeholder="Идентификационный номер" maxLength={14}
                      value={form.identification_number}
                      onChange={e => set('identification_number', e.target.value)} required
                    />
                    <label>Идентификационный номер <span style={{ color: '#b71c1c' }}>*</span></label>
                  </div>

                  {/* Адрес прописки */}
                  <h6 className="form-section-title">Адрес прописки</h6>
                  <div className="form-row">
                    <div className="form-group col-md-4">
                      <div className="select-wrapper">
                        <select
                          className="form-control form-select"
                          value={form.region} onChange={e => set('region', e.target.value)} required
                        >
                          <option value="">Область</option>
                          {REGIONS.map(r => (
                            <option key={r} value={r.toLowerCase()}>{r}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="form-group col-md-4">
                      <input
                        type="text" className="form-control" placeholder="Город"
                        value={form.city} onChange={e => set('city', e.target.value)} required
                      />
                    </div>
                    <div className="form-group col-md-4">
                      <input
                        type="text" className="form-control" placeholder="Индекс" maxLength={6}
                        value={form.postcode} onChange={e => set('postcode', e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group col-md-6">
                      <input
                        type="text" className="form-control" placeholder="Улица"
                        value={form.street} onChange={e => set('street', e.target.value)} required
                      />
                    </div>
                    <div className="form-group col-md-2">
                      <input
                        type="text" className="form-control" placeholder="Дом"
                        value={form.house} onChange={e => set('house', e.target.value)} required
                      />
                    </div>
                    <div className="form-group col-md-2">
                      <input
                        type="text" className="form-control" placeholder="Корпус"
                        value={form.building} onChange={e => set('building', e.target.value)}
                      />
                    </div>
                    <div className="form-group col-md-2">
                      <input
                        type="text" className="form-control" placeholder="Квартира"
                        value={form.apartment} onChange={e => set('apartment', e.target.value)}
                      />
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
          ) : (
            <>
              <div className="modal-header">
                <h5 className="modal-title">Данные отправлены</h5>
                <button type="button" className="btn-close" onClick={onClose} aria-label="Закрыть" />
              </div>
              <div className="modal-body">
                <p className="confirmation-text">
                  Паспортные данные сохранены и отправлены на проверку менеджеру.<br />
                  После проверки статус верификации будет обновлён.
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
  );
}
