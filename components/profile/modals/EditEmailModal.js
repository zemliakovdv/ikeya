'use client';

import { useState } from 'react';
import { updateProfile, verifyEmailChange } from '@/lib/api/account';

const STEPS = { EMAIL: 'email', CODE: 'code', SUCCESS: 'success' };

export default function EditEmailModal({ profile, onClose, onSave }) {
  const [step,    setStep]    = useState(STEPS.EMAIL);
  const [email,   setEmail]   = useState('');
  const [code,    setCode]    = useState('');
  const [consent, setConsent] = useState(profile?.email_marketing || false);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');

  // Шаг 1 — вводим новый email, бэк шлёт письмо
  const handleSendCode = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Обновляем email в профиле — бэк отправляет письмо с кодом
      await updateProfile({ email, email_marketing: consent });
      setStep(STEPS.CODE);
    } catch (err) {
      setError(err.message || 'Ошибка отправки письма');
    } finally {
      setLoading(false);
    }
  };

  // Шаг 2 — вводим код из письма
  const handleVerifyCode = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const updated = await verifyEmailChange(email, code);
      onSave?.(updated);
      setStep(STEPS.SUCCESS);
    } catch (err) {
      setError(err.message || 'Неверный код');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal fade show d-block" onClick={onClose} id="editEmailModal">
      <div className="modal-dialog modal-dialog-centered" onClick={e => e.stopPropagation()}>
        <div className="modal-content">

          {/* Шаг 1 — ввод нового email */}
          {step === STEPS.EMAIL && (
            <>
              <div className="modal-header">
                <h5 className="modal-title">Смена почты</h5>
                <button type="button" className="btn-close" onClick={onClose} aria-label="Закрыть" />
              </div>
              <div className="modal-body">
                <form onSubmit={handleSendCode}>
                  <div className="form-group form-floating">
                    <input
                      type="email" className="form-control" id="email"
                      placeholder="Новый email"
                      value={email} onChange={e => setEmail(e.target.value)}
                      required
                    />
                    <label htmlFor="email">Новый email</label>
                  </div>

                  <div className="form-info">
                    <p className="info-text">
                      Подробнее об <a href="#" className="info-link">условиях обработки и правах, связанных с обработкой</a>
                    </p>
                  </div>

                  <div className="form-checkbox">
                    <label className="checkbox-item">
                      <input
                        type="checkbox"
                        checked={consent}
                        onChange={e => setConsent(e.target.checked)}
                      />
                      <span className="checkbox-label">
                        Получение рекламно-информационных рассылок через email
                      </span>
                    </label>
                  </div>

                  {error && (
                    <p style={{ color: '#b71c1c', marginBottom: '12px' }}>{error}</p>
                  )}

                  <div className="modal-footer-buttons">
                    <button type="button" className="btn btn-outline" onClick={onClose} disabled={loading}>
                      Отмена
                    </button>
                    <button type="submit" className="btn btn-primary" disabled={loading}>
                      {loading ? 'Отправляем…' : 'Отправить код'}
                    </button>
                  </div>
                </form>
              </div>
            </>
          )}

          {/* Шаг 2 — ввод кода из письма */}
          {step === STEPS.CODE && (
            <>
              <div className="modal-header">
                <h5 className="modal-title">Подтверждение почты</h5>
                <button type="button" className="btn-close" onClick={onClose} aria-label="Закрыть" />
              </div>
              <div className="modal-body">
                <p className="confirmation-text" style={{ marginBottom: '16px' }}>
                  На <a href={`mailto:${email}`} className="email-link">{email}</a> отправлен код подтверждения
                </p>
                <form onSubmit={handleVerifyCode}>
                  <div className="form-group form-floating">
                    <input
                      type="text" className="form-control" id="code"
                      placeholder="Код из письма"
                      value={code} onChange={e => setCode(e.target.value)}
                      maxLength={6} required autoFocus
                    />
                    <label htmlFor="code">Код из письма</label>
                  </div>

                  {error && (
                    <p style={{ color: '#b71c1c', marginBottom: '12px' }}>{error}</p>
                  )}

                  <div className="modal-footer-buttons">
                    <button
                      type="button" className="btn btn-outline"
                      onClick={() => { setStep(STEPS.EMAIL); setError(''); }}
                      disabled={loading}
                    >
                      Назад
                    </button>
                    <button type="submit" className="btn btn-primary" disabled={loading || !code}>
                      {loading ? 'Проверяем…' : 'Подтвердить'}
                    </button>
                  </div>
                </form>
              </div>
            </>
          )}

          {/* Шаг 3 — успех */}
          {step === STEPS.SUCCESS && (
            <>
              <div className="modal-header">
                <h5 className="modal-title">Почта изменена</h5>
                <button type="button" className="btn-close" onClick={onClose} aria-label="Закрыть" />
              </div>
              <div className="modal-body">
                <p className="confirmation-text">
                  Ваша почта успешно изменена на <strong>{email}</strong>
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
