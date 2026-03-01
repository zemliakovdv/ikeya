'use client';

import { useState } from 'react';

export default function EditPersonalDataModal({ profile, onClose, onSave }) {
  const [form, setForm] = useState({
    lastName: profile?.lastName || '',
    firstName: profile?.username || '',
    middleName: profile?.middleName || '',
    gender: profile?.gender || 'male',
    email: profile?.email || '',
  });

  const set = (key, val) => setForm(p => ({ ...p, [key]: val }));

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave?.(form);
    onClose();
  };

  return (
    <div className="modal fade show d-block" onClick={onClose}>
      <div className="modal-dialog modal-dialog-centered" onClick={e => e.stopPropagation()}>
        <div className="modal-content" id="editPersonalDataModal">
          <div className="modal-header">
            <h5 className="modal-title">Личные данные</h5>
          </div>
          <div className="modal-body">
            <form onSubmit={handleSubmit}>
              <div className="form-group form-floating">
                <input type="text" className="form-control" id="lastName" placeholder="Фамилия"
                  value={form.lastName} onChange={e => set('lastName', e.target.value)} required />
                <label htmlFor="lastName">Фамилия <span style={{ color: '#b71c1c' }}>*</span></label>
              </div>
              <div className="form-group form-floating">
                <input type="text" className="form-control" id="firstName" placeholder="Имя"
                  value={form.firstName} onChange={e => set('firstName', e.target.value)} required />
                <label htmlFor="firstName">Имя <span style={{ color: '#b71c1c' }}>*</span></label>
              </div>
              <div className="form-group form-floating">
                <input type="text" className="form-control" id="middleName" placeholder="Отчество"
                  value={form.middleName} onChange={e => set('middleName', e.target.value)} />
                <label htmlFor="middleName">Отчество</label>
              </div>
              <div className="form-group">
                <label className="form-label">Ваш пол</label>
                <div className="radio-group">
                  {[['male','Мужской'],['female','Женский']].map(([val, label]) => (
                    <label className="radio-item" key={val}>
                      <input type="radio" name="gender" value={val}
                        checked={form.gender === val} onChange={() => set('gender', val)} />
                      <span className="radio-custom"></span>
                      <span className="radio-label">{label}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="form-group form-floating">
                <input type="email" className="form-control" id="email" placeholder="Электронная почта"
                  value={form.email} onChange={e => set('email', e.target.value)} />
                <label htmlFor="email">Электронная почта</label>
              </div>
              <div className="modal-footer-buttons">
                <button type="button" className="datas-canceled" onClick={onClose}>Отмена</button>
                <button type="submit" className="datas-submit">Сохранить</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
