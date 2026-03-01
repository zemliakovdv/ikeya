'use client';

import { useState } from 'react';

export default function EditEmailModal({ profile, onClose }) {
  const [email, setEmail] = useState(profile?.email || '');
  const [consent, setConsent] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
    // TODO: вызов API отправки письма
  };

  return (
    <div className="modal fade show d-block" onClick={onClose} id="editEmailModal">
      <div className="modal-dialog modal-dialog-centered" onClick={e => e.stopPropagation()}>
        <div className="modal-content">
          {!sent ? (
            <>
              <div className="modal-header">
                <h5 className="modal-title">Почта</h5>
                <button type="button" className="btn-close" onClick={onClose} aria-label="Close" />
              </div>
              <div className="modal-body">
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <input type="email" className="form-control" placeholder="Электронная почта"
                      value={email} onChange={e => setEmail(e.target.value)} required />
                  </div>
                  <div className="form-info">
                    <p className="info-text">
                      Подробнее об <a href="#" className="info-link">условиях обработки и правах, связанных с обработкой</a>
                    </p>
                  </div>
                  <div className="form-checkbox">
                    <label className="checkbox-item">
                      <input type="checkbox" checked={consent} onChange={e => setConsent(e.target.checked)} />
                      <span className="checkbox-label">Получение рекламно-информационных рассылок через email</span>
                    </label>
                  </div>
                  <div className="modal-footer-buttons">
                    <button type="button" className="btn btn-outline" onClick={onClose}>Отмена</button>
                    <button type="submit" className="btn btn-primary">Сохранить</button>
                  </div>
                </form>
              </div>
            </>
          ) : (
            <>
              <div className="modal-header">
                <h5 className="modal-title">Подтверждение электронной почты</h5>
                <button type="button" className="btn-close" onClick={onClose} aria-label="Close" />
              </div>
              <div className="modal-body">
                <div className="confirmation-message">
                  <p className="confirmation-text">
                    На <a href={`mailto:${email}`} className="email-link">{email}</a> отправлено письмо для подтверждения
                  </p>
                </div>
                <div className="modal-footer-single">
                  <button type="button" className="btn btn-primary btn-full" onClick={onClose}>Закрыть</button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
