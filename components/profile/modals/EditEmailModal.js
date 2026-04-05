// components/profile/modals/EditEmailModal.js
'use client';

import { useState } from 'react';
import { updateProfile, verifyEmailChange } from '@/lib/api/account';

const STEPS = { EMAIL: 'email', CODE: 'code', SUCCESS: 'success' };

export default function EditEmailModal({ profile, onClose, onSave, verifyOnly = false }) {
  const [step,    setStep]    = useState(verifyOnly ? STEPS.CODE : STEPS.EMAIL);
  const [email,   setEmail]   = useState(verifyOnly ? (profile?.email || '') : '');
  const [code,    setCode]    = useState('');
  const [consent, setConsent] = useState(profile?.email_marketing || false);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');

  // Шаг 1 — сохраняем email, бэк шлёт письмо с кодом
  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await updateProfile({ email, email_marketing: consent });
      setStep(STEPS.CODE);
    } catch (err) {
      setError(err.message || 'Ошибка сохранения');
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

          {/* Шаг 1 — ввод email */}
          {step === STEPS.EMAIL && (
            <>
              <div className="modal-header">
                <h5 className="modal-title">Почта</h5>
                <button type="button" className="btn-close" onClick={onClose} aria-label="Закрыть" />
              </div>
              <div className="modal-body">
                <form onSubmit={handleSave}>
                  <div className="form-group form-floating">
                    <input
                      type="email" className="form-control" id="email"
                      placeholder="Электронная почта"
                      value={email} onChange={e => setEmail(e.target.value)}
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
                        onChange={e => setConsent(e.target.checked)}
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

          {/* Шаг 2 — ввод кода из письма */}
          {step === STEPS.CODE && (
            <>
              <div className="modal-header">
                <h5 className="modal-title">Подтверждение почты</h5>
                <button type="button" className="btn-close" onClick={onClose} aria-label="Закрыть" />
              </div>
              <div className="modal-body">
                <p className="confirmation-text" style={{ marginBottom: '16px' }}>
                  На <strong>{email}</strong> отправлен код подтверждения
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

                  {error && <p style={{ color: '#b71c1c', marginBottom: '12px' }}>{error}</p>}

                  <div className="modal-footer-buttons">
                    <button
                      type="button" className="btn btn-outline"
                      onClick={() => {
                        if (verifyOnly) { onClose(); }
                        else { setStep(STEPS.EMAIL); setError(''); }
                      }}
                      disabled={loading}
                    >
                      {verifyOnly ? 'Отмена' : 'Назад'}
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
                <h5 className="modal-title">
                  {verifyOnly ? 'Почта подтверждена' : 'Почта сохранена'}
                </h5>
                <button type="button" className="btn-close" onClick={onClose} aria-label="Закрыть" />
              </div>
              <div className="modal-body">
                <p className="confirmation-text">
                  {verifyOnly
                    ? `Почта ${email} успешно подтверждена`
                    : `Ваша почта ${email} сохранена и подтверждена`
                  }
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