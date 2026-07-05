// components/profile/modals/EditEmailModal.js
'use client';

import { useState } from 'react';
import { updateProfile } from '@/lib/api/account';
import { isEmailFormatValid } from '@/lib/utils/email';

const STEPS = { EMAIL: 'email', SENT: 'sent' };

export default function EditEmailModal({ profile, onClose, onSave, verifyOnly = false }) {
  const [step, setStep] = useState(verifyOnly ? STEPS.SENT : STEPS.EMAIL);
  const [email, setEmail] = useState(profile?.email || '');
  const [consent, setConsent] = useState(profile?.email_marketing || false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const emailText = email || profile?.email || '';
  const sentMessage = emailText
    ? <>На <strong>{emailText}</strong> отправлено письмо для подтверждения</>
    : <>На вашу почту отправлено письмо для подтверждения</>;

  const handleSave = async (e) => {
    e.preventDefault();
    const normalizedEmail = email.trim();
    if (!isEmailFormatValid(normalizedEmail)) {
      setError('Введите корректный email');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const updated = await updateProfile({ email: normalizedEmail, email_marketing: consent });
      onSave?.(updated);
      setStep(STEPS.SENT);
    } catch (err) {
      setError(err.message || 'Ошибка сохранения');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal fade show d-block" onClick={onClose} id="editEmailModal">
      <div className="modal-dialog modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
        <div className="modal-content">

          {step === STEPS.EMAIL && (
            <>
              <div className="modal-header">
                <h5 className="modal-title">Изменить почту</h5>
                <button type="button" className="btn-close" onClick={onClose} aria-label="Закрыть" />
              </div>
              <div className="modal-body">
                <form onSubmit={handleSave}>
                  <div className="form-group form-floating">
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      placeholder="Электронная почта"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      inputMode="email"
                      autoComplete="email"
                      spellCheck={false}
                      required
                    />
                    <label htmlFor="email">Электронная почта</label>
                  </div>

                  <div className="form-info">
                    <p className="info-text">
                      Подробнее об <a href="#" className="info-link">условиях обработки</a> и <a href="#" className="info-link">правах, связанных с обработкой</a>
                    </p>
                  </div>

                  <div className="form-checkbox">
                    <label className="checkbox-item">
                      <input
                        type="checkbox"
                        checked={consent}
                        onChange={(e) => setConsent(e.target.checked)}
                      />
                      <span className="checkbox-label">
                        Получение рекламно-информационных рассылок через email
                      </span>
                    </label>
                  </div>

                  {error && <p style={{ color: '#b71c1c', marginBottom: '12px' }}>{error}</p>}

                  <div className="modal-footer-buttons">
                    <button type="button" className="btn btn-outline" onClick={onClose} disabled={loading}>
                      Отмена
                    </button>
                    <button type="submit" className="btn btn-primary" disabled={loading || !email}>
                      {loading ? 'Сохраняем…' : 'Сохранить'}
                    </button>
                  </div>
                </form>
              </div>
            </>
          )}

          {step === STEPS.SENT && (
            <>
              <div className="modal-header">
                <h5 className="modal-title">Изменить почту</h5>
                <button type="button" className="btn-close" onClick={onClose} aria-label="Закрыть" />
              </div>
              <div className="modal-body">
                <p className="confirmation-text">{sentMessage}</p>
                <div className="modal-footer-single">
                  <button type="button" className="btn btn-primary btn-full" onClick={onClose}>
                    Хорошо
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
