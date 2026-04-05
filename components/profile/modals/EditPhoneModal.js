// components/profile/modals/EditPhoneModal.js
'use client';

import { useState } from 'react';
import { requestPhoneChange, verifyPhoneChange } from '@/lib/api/account';
import SmsVerifyModal from '@/components/profile/modals/SmsVerifyModal';

const STEPS = { PHONE: 'phone', CODE: 'code', SUCCESS: 'success' };

export default function EditPhoneModal({ profile, onClose, onSave }) {
  const [step,         setStep]         = useState(STEPS.PHONE);
  const [phone,        setPhone]        = useState('');
  const [callerMasked, setCallerMasked] = useState('');
  const [loading,      setLoading]      = useState(false);
  const [error,        setError]        = useState('');

  // Шаг 1 — запрашиваем звонок
  const handleRequestCall = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const resp = await requestPhoneChange(phone);
      setCallerMasked(resp?.caller_number_masked || '');
      setStep(STEPS.CODE);
    } catch (err) {
      setError(err.message || 'Ошибка отправки запроса');
    } finally {
      setLoading(false);
    }
  };

  // Повторный запрос
  const handleResend = async () => {
    setError('');
    try {
      const resp = await requestPhoneChange(phone);
      setCallerMasked(resp?.caller_number_masked || '');
    } catch (err) {
      setError(err.message || 'Ошибка повторного запроса');
    }
  };

  // Шаг 2 — подтверждаем код
  const handleVerify = async (code) => {
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

  // Шаг CODE — рендерим SmsVerifyModal
  if (step === STEPS.CODE) {
    return (
      <SmsVerifyModal
        userPhone={phone}
        callerNumber={callerMasked}
        onVerify={handleVerify}
        onResend={handleResend}
        onClose={onClose}
        loading={loading}
        error={error}
      />
    );
  }

  return (
    <div className="modal fade show d-block" onClick={onClose} id="editPhoneModal">
      <div className="modal-dialog modal-dialog-centered" onClick={e => e.stopPropagation()}>
        <div className="modal-content">

          {/* Шаг 1 — ввод нового номера */}
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
                    <button type="button" className="btn btn-outline" onClick={onClose} disabled={loading}>
                      Отмена
                    </button>
                    <button type="submit" className="btn btn-primary" disabled={loading || !phone}>
                      {loading ? 'Отправляем…' : 'Получить звонок'}
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
                <h5 className="modal-title">Телефон изменён</h5>
                <button type="button" className="btn-close" onClick={onClose} aria-label="Закрыть" />
              </div>
              <div className="modal-body">
                <p className="confirmation-text">
                  Ваш номер телефона успешно изменён на <strong>{phone}</strong>
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