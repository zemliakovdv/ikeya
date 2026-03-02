'use client';

import { useState } from 'react';
import { requestPhoneChange, verifyPhoneChange } from '@/lib/api/account';

const STEPS = { PHONE: 'phone', CODE: 'code', SUCCESS: 'success' };

export default function EditPhoneModal({ profile, onClose, onSave }) {
  const [step,    setStep]    = useState(STEPS.PHONE);
  const [phone,   setPhone]   = useState('');
  const [code,    setCode]    = useState('');
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');

  const handleRequestCall = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await requestPhoneChange(phone);
      setStep(STEPS.CODE);
    } catch (err) {
      setError(err.message || 'Ошибка отправки запроса');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (code.length !== 4) return;
    setLoading(true);
    setError('');
    try {
      const updated = await verifyPhoneChange(phone, code);
      onSave?.(updated);
      setStep(STEPS.SUCCESS);
    } catch (err) {
      setError(err.message || 'Неверный код');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal fade show d-block" onClick={onClose} id="editPhoneModal">
      <div className="modal-dialog modal-dialog-centered" onClick={e => e.stopPropagation()}>
        <div className="modal-content">

          {step === STEPS.PHONE && (
            <>
              <div className="modal-header">
                <h5 className="modal-title">Смена телефона</h5>
                <button type="button" className="btn-close" onClick={onClose} aria-label="Закрыть" />
              </div>
              <div className="modal-body">
                <form onSubmit={handleRequestCall}>
                  <div className="form-group form-floating">
                    <input
                      type="tel" className="form-control" id="phone"
                      placeholder="375291112233"
                      value={phone}
                      onChange={e => setPhone(e.target.value.replace(/\D/g, ''))}
                      required
                    />
                    <label htmlFor="phone">Новый номер телефона</label>
                  </div>
                  <div className="form-info">
                    <p className="info-text">
                      Подробнее об <a href="#" className="info-link">условиях обработки и правах, связанных с обработкой</a>
                    </p>
                  </div>
                  {error && <p style={{ color: '#b71c1c', fontSize: '14px', marginBottom: '12px' }}>{error}</p>}
                  <div className="modal-footer-buttons">
                    <button type="button" className="btn btn-outline" onClick={onClose} disabled={loading}>Отмена</button>
                    <button type="submit" className="btn btn-primary" disabled={loading || !phone}>
                      {loading ? 'Отправляем…' : 'Получить звонок'}
                    </button>
                  </div>
                </form>
              </div>
            </>
          )}

          {step === STEPS.CODE && (
            <>
              <div className="modal-header">
                <h5 className="modal-title">Подтверждение по звонку</h5>
                <button type="button" className="btn-close" onClick={onClose} aria-label="Закрыть" />
              </div>
              <div className="modal-body">
                <p className="confirmation-text" style={{ marginBottom: '16px' }}>
                  На номер <strong>{phone}</strong> поступит входящий звонок.<br />
                  Введите последние <strong>4 цифры</strong> номера звонящего.
                </p>
                <div className="form-group form-floating">
                  <input
                    type="text" className="form-control" id="code"
                    placeholder="4 цифры"
                    value={code}
                    onChange={e => setCode(e.target.value.replace(/\D/g, ''))}
                    maxLength={4} autoFocus
                  />
                  <label htmlFor="code">4 цифры входящего номера</label>
                </div>
                {error && <p style={{ color: '#b71c1c', fontSize: '14px', marginTop: '8px' }}>{error}</p>}
                <div className="modal-footer-buttons" style={{ marginTop: '16px' }}>
                  <button
                    type="button" className="btn btn-outline"
                    onClick={() => { setStep(STEPS.PHONE); setCode(''); setError(''); }}
                    disabled={loading}
                  >
                    Назад
                  </button>
                  <button
                    type="button" className="btn btn-primary"
                    onClick={handleVerifyCode}
                    disabled={loading || code.length !== 4}
                  >
                    {loading ? 'Проверяем…' : 'Подтвердить'}
                  </button>
                </div>
              </div>
            </>
          )}

          {step === STEPS.SUCCESS && (
            <>
              <div className="modal-header">
                <h5 className="modal-title">Телефон изменён</h5>
                <button type="button" className="btn-close" onClick={onClose} aria-label="Закрыть" />
              </div>
              <div className="modal-body">
                <p className="confirmation-text">
                  Ваш номер телефона успешно изменён на <strong>{phone}</strong>
                </p>
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
