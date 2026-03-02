'use client';

import { useState } from 'react';
import { updateProfile } from '@/lib/api/account';

export default function EditPersonalDataModal({ profile, onClose, onSave }) {
  const [form, setForm] = useState({
    last_name:   profile?.last_name   || '',
    first_name:  profile?.first_name  || '',
    middle_name: profile?.middle_name || '',
    gender:      profile?.gender      || 'male',
    dob:         profile?.dob         || '',
  });

  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');

  const set = (key, val) => setForm(p => ({ ...p, [key]: val }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const updated = await updateProfile({
        first_name:  form.first_name,
        last_name:   form.last_name,
        middle_name: form.middle_name,
        gender:      form.gender,
        dob:         form.dob || undefined,
      });
      onSave?.(updated);
      onClose();
    } catch (err) {
      setError(err.message || 'Ошибка сохранения');
    } finally {
      setLoading(false);
    }
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
                <input
                  type="text" className="form-control" id="last_name" placeholder="Фамилия"
                  value={form.last_name} onChange={e => set('last_name', e.target.value)} required
                />
                <label htmlFor="last_name">Фамилия <span style={{ color: '#b71c1c' }}>*</span></label>
              </div>

              <div className="form-group form-floating">
                <input
                  type="text" className="form-control" id="first_name" placeholder="Имя"
                  value={form.first_name} onChange={e => set('first_name', e.target.value)} required
                />
                <label htmlFor="first_name">Имя <span style={{ color: '#b71c1c' }}>*</span></label>
              </div>

              <div className="form-group form-floating">
                <input
                  type="text" className="form-control" id="middle_name" placeholder="Отчество"
                  value={form.middle_name} onChange={e => set('middle_name', e.target.value)}
                />
                <label htmlFor="middle_name">Отчество</label>
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
                  type="date" className="form-control" id="dob" placeholder="Дата рождения"
                  value={form.dob} onChange={e => set('dob', e.target.value)}
                />
                <label htmlFor="dob">Дата рождения</label>
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
  );
}
