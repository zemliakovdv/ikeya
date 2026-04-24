'use client';

import { useEffect } from 'react';

export default function ReviewSuccessModal({ show, onClose }) {

  // Закрытие по Escape
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape') onClose();
    }
    if (show) document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [show, onClose]);

  // Блокируем скролл
  useEffect(() => {
    if (show) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [show]);

  if (!show) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="review-success-modal__backdrop" onClick={onClose} />

      {/* Модалка */}
      <div className="review-success-modal" role="dialog" aria-modal="true">
        <div className="review-success-modal__content">
          <h5 className="review-success-modal__title">
            Отзыв отправлен на проверку
          </h5>
          <p className="review-success-modal__text">
            Скоро проверим и опубликуем, если он не нарушает правила
          </p>
          <div className="review-success-modal__footer">
            <button
              className="review-success-modal__btn"
              onClick={onClose}
            >
              Закрыть
            </button>
          </div>
        </div>
      </div>
    </>
  );
}