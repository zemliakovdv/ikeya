'use client';

import { useEffect } from 'react';

export default function CustomsModal({ isOpen, onClose }) {
  // Закрытие по Escape
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      <div className="modal-backdrop fade show" onClick={onClose} />
      <div className="modal fade show" tabIndex="-1" aria-labelledby="customsModalLabel"  id="customsModal" aria-modal="true" role="dialog" style={{ display: 'block' }}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="customsModalLabel">Таможенная пошлина</h5>
            </div>
            <div className="modal-body">
              <div className="modal-description">
                <p>Стоимость таможенной пошлины не входит в стоимость заказа и оплачивается отдельно на этапе
                  прохождения таможни через ЕРИП на счёт таможенного комитета.</p>
                <p>
                  <span>Пошлина считается от стоимости заказа без НДС.</span> Стоимость приблизительная и может
                  отличаться от фактической из-за колебаний валютного курса.
                </p>
                <p><strong>*Цены на сайте указаны с НДС.</strong></p>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-primary" onClick={onClose}>Закрыть</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
