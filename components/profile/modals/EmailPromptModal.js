'use client';

import { useEffect, useState } from 'react';
import { resendEmailVerification, updateProfile } from '@/lib/api/account';
import { isEmailFormatValid } from '@/lib/utils/email';

const STEPS = { EMAIL: 'email', SENT: 'sent' };

async function savePromptEmail(normalizedEmail, profile) {
  const currentEmail = (profile?.email || '').trim().toLowerCase();
  if (normalizedEmail.toLowerCase() !== currentEmail) {
    return updateProfile({ email: normalizedEmail });
  }
  await resendEmailVerification();
  return profile;
}

export default function EmailPromptModal({ profile, onSnooze, onSaved, onDismiss }) {
  const [step, setStep] = useState(STEPS.EMAIL);
  const [email, setEmail] = useState(profile?.email || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  const emailText = email.trim() || profile?.email || '';
  const sentMessage = emailText
    ? <>На <strong>{emailText}</strong> отправлено письмо для подтверждения</>
    : <>На вашу почту отправлено письмо для подтверждения</>;

  const handleSave = async (event) => {
    event.preventDefault();
    const normalizedEmail = email.trim();
    if (!isEmailFormatValid(normalizedEmail)) {
      setError('Введите корректный email');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const updated = await savePromptEmail(normalizedEmail, profile);
      await onSaved?.(updated);
      setStep(STEPS.SENT);
    } catch (err) {
      setError(err.message || 'Ошибка сохранения');
    } finally {
      setLoading(false);
    }
  };

  const closeEmailStep = () => {
    if (loading) return;
    onSnooze?.();
  };

  return (
    <>
      <div className="modal-backdrop fade show email-prompt-backdrop" onClick={step === STEPS.EMAIL ? closeEmailStep : onDismiss} />
      <div
        className="modal fade show d-block email-prompt-modal"
        id="emailPromptModal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="emailPromptTitle"
        onClick={step === STEPS.EMAIL ? closeEmailStep : onDismiss}
      >
        <div className="modal-dialog modal-dialog-centered" onClick={(event) => event.stopPropagation()}>
          <div className="modal-content">
            {step === STEPS.EMAIL && (
              <>
                <div className="modal-header">
                  <h5 className="modal-title" id="emailPromptTitle">Не пропустите важное по заказу</h5>
                  <button type="button" className="btn-close" onClick={closeEmailStep} aria-label="Закрыть" disabled={loading} />
                </div>
                <div className="modal-body">
                  <form onSubmit={handleSave}>
                    <p className="email-prompt-text">
                      Добавьте email — пришлём уведомления о доставке и ссылку, чтобы оценить покупку.
                    </p>
                    <div className="form-group">
                      <label htmlFor="emailPromptInput">Электронная почта</label>
                      <input
                        type="email"
                        className="form-control"
                        id="emailPromptInput"
                        placeholder="name@example.com"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        inputMode="email"
                        autoComplete="email"
                        spellCheck={false}
                        autoFocus
                        required
                      />
                    </div>
                    {error && <p className="email-prompt-error">{error}</p>}
                    <button type="submit" className="btn btn-primary email-prompt-submit" disabled={loading || !email.trim()}>
                      {loading ? 'Сохраняем…' : 'Добавить email'}
                    </button>
                    <button type="button" className="email-prompt-later" onClick={closeEmailStep} disabled={loading}>
                      Напомнить через неделю
                    </button>
                  </form>
                </div>
              </>
            )}

            {step === STEPS.SENT && (
              <>
                <div className="modal-header">
                  <h5 className="modal-title" id="emailPromptTitle">Изменить почту</h5>
                  <button type="button" className="btn-close" onClick={onDismiss} aria-label="Закрыть" />
                </div>
                <div className="modal-body">
                  <p className="confirmation-text">{sentMessage}</p>
                  <div className="modal-footer-single">
                    <button type="button" className="btn btn-primary btn-full" onClick={onDismiss}>
                      Хорошо
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
