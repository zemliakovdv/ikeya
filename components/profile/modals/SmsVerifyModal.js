'use client';

export default function SmsVerifyModal({ callerMasked, smsCode, onChange, onConfirm, onClose, loading, error }) {
  return (
    <div className="modal fade show d-block">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Подтверждение по звонку</h5>
          </div>
          <div className="modal-body">
            <p className="confirmation-text">
              Вам поступит звонок с номера <strong>{callerMasked || '...'}</strong>.<br />
              Введите последние 4 цифры входящего номера.
            </p>
            <div className="form-group" style={{ marginTop: '16px' }}>
              <input
                type="text"
                className="form-control"
                placeholder="4 цифры"
                maxLength={4}
                value={smsCode}
                onChange={e => onChange(e.target.value.replace(/\D/g, ''))}
              />
            </div>
            {error && <p style={{ color: '#B71C1C', fontSize: '14px', marginTop: '8px' }}>{error}</p>}
            <div className="modal-footer-buttons" style={{ marginTop: '16px' }}>
              <button type="button" className="btn btn-outline" onClick={onClose}>Отмена</button>
              <button type="button" className="btn btn-primary" onClick={onConfirm} disabled={loading}>
                {loading ? 'Проверка...' : 'Подтвердить'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
