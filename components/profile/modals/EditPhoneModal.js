'use client';

import { useState } from 'react';

export default function EditPhoneModal({ profile, onClose, onRequestSms, loading, error }) {
  const [phone, setPhone] = useState(profile?.phone || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    onRequestSms(phone, 'phone_update');
  };

  return (
    <div className="modal fade show d-block" onClick={onClose} id="editEmailModal">
      <div className="modal-dialog modal-dialog-centered" onClick={e => e.stopPropagation()}>
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Телефон</h5>
            <button type="button" className="btn-close" onClick={onClose} aria-label="Close" />
          </div>
          <div className="modal-body">
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="newPhone" className="form-label visually-hidden">Телефон</label>
                <input type="tel" className="form-control" id="newPhone" placeholder="Телефон"
                  value={phone} onChange={e => setPhone(e.target.value)} required />
              </div>
              <div className="form-info">
                <p className="info-text">
                  Подробнее об <a href="#" className="info-link">условиях обработки и правах, связанных с обработкой</a>
                </p>
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
