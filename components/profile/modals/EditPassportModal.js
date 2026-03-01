'use client';

import { useState } from 'react';

const REGIONS = ['Минская','Брестская','Витебская','Гомельская','Гродненская','Могилевская'];
const COUNTRIES = [['belarus','Беларусь']];

export default function EditPassportModal({ profile, onClose, onRequestSms, loading, error }) {
  const [form, setForm] = useState({
    country: 'belarus', firstName: '', lastName: '', middleName: '',
    series: '', number: '', issueDate: '', issuedBy: '',
    identificationNumber: '', birthDate: '',
    region: '', city: '', postalCode: '',
    street: '', house: '', building: '', apartment: ''
  });

  const set = (key, val) => setForm(p => ({ ...p, [key]: val }));

  const handleSubmit = (e) => {
    e.preventDefault();
    const phone = profile?.phone || '';
    onRequestSms(phone, 'passport_update');
  };

  return (
    <div className="modal fade show d-block" onClick={onClose} id="editPassportModal">
      <div className="modal-dialog modal-dialog-centered modal-lg" onClick={e => e.stopPropagation()}>
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Паспортные данные</h5>
          </div>
          <div className="modal-body">
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <div className="country-selector">
                  {COUNTRIES.map(([val, label]) => (
                    <label className="country-item" key={val}>
                      <input type="radio" name="country" value={val}
                        checked={form.country === val} onChange={() => set('country', val)} />
                      <span className="radio-custom"></span>
                      <span className="radio-label">{label}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="form-row">
                {[['firstName','Имя'],['lastName','Фамилия'],['middleName','Отчество']].map(([key, label]) => (
                  <div className="form-group col-md-4 form-floating" key={key}>
                    <input type="text" className="form-control" placeholder={label}
                      value={form[key]} onChange={e => set(key, e.target.value)} required />
                    <label>{label} <span style={{ color: '#b71c1c' }}>*</span></label>
                  </div>
                ))}
              </div>
              <div className="form-row">
                <div className="form-group col-md-4 form-floating">
                  <input type="text" className="form-control" placeholder="Серия" maxLength={2}
                    value={form.series} onChange={e => set('series', e.target.value)} required />
                  <label>Серия паспорта <span style={{ color: '#b71c1c' }}>*</span></label>
                </div>
                <div className="form-group col-md-4 form-floating">
                  <input type="text" className="form-control" placeholder="Номер паспорта" maxLength={7}
                    value={form.number} onChange={e => set('number', e.target.value)} required />
                  <label>Номер паспорта <span style={{ color: '#b71c1c' }}>*</span></label>
                </div>
                <div className="form-group col-md-4">
                  <input type="text" className="form-control" placeholder="Дата выдачи"
                    value={form.issueDate} onChange={e => set('issueDate', e.target.value)} required />
                </div>
              </div>
              <div className="form-group">
                <textarea className="form-control form-textarea" placeholder="Кем выдан" rows={3}
                  value={form.issuedBy} onChange={e => set('issuedBy', e.target.value)} required />
              </div>
              <div className="form-row">
                <div className="form-group col-md-6 form-floating">
                  <input type="text" className="form-control" placeholder="Идентификационный номер" maxLength={14}
                    value={form.identificationNumber} onChange={e => set('identificationNumber', e.target.value)} required />
                  <label>Идентификационный номер <span style={{ color: '#b71c1c' }}>*</span></label>
                </div>
                <div className="form-group col-md-6">
                  <input type="text" className="form-control" placeholder="Дата рождения"
                    value={form.birthDate} onChange={e => set('birthDate', e.target.value)} required />
                </div>
              </div>
              <h6 className="form-section-title">Адрес прописки</h6>
              <div className="form-row">
                <div className="form-group col-md-4">
                  <div className="select-wrapper">
                    <select className="form-control form-select"
                      value={form.region} onChange={e => set('region', e.target.value)} required>
                      <option value="">Область</option>
                      {REGIONS.map(r => <option key={r} value={r.toLowerCase()}>{r}</option>)}
                    </select>
                  </div>
                </div>
                <div className="form-group col-md-4">
                  <input type="text" className="form-control" placeholder="Город"
                    value={form.city} onChange={e => set('city', e.target.value)} required />
                </div>
                <div className="form-group col-md-4">
                  <input type="text" className="form-control" placeholder="Индекс" maxLength={6}
                    value={form.postalCode} onChange={e => set('postalCode', e.target.value)} />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group col-md-6">
                  <input type="text" className="form-control" placeholder="Улица"
                    value={form.street} onChange={e => set('street', e.target.value)} required />
                </div>
                <div className="form-group col-md-2">
                  <input type="text" className="form-control" placeholder="Дом"
                    value={form.house} onChange={e => set('house', e.target.value)} required />
                </div>
                <div className="form-group col-md-2">
                  <input type="text" className="form-control" placeholder="Корпус"
                    value={form.building} onChange={e => set('building', e.target.value)} />
                </div>
                <div className="form-group col-md-2">
                  <input type="text" className="form-control" placeholder="Квартира"
                    value={form.apartment} onChange={e => set('apartment', e.target.value)} />
                </div>
              </div>
              {error && <p style={{ color: '#B71C1C', fontSize: '14px' }}>{error}</p>}
              <div className="modal-footer-buttons">
                <button type="button" className="btn btn-outline" onClick={onClose}>Отмена</button>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Отправка...' : 'Сохранить'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
