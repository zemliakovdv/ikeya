// src/components/auth/SuccessModal.js
'use client';

export default function SuccessModal({
  isOpen,
  onClose,

  // данные для текста
  username = 'Имя',
  email = '',
}) {
  return (
    <div
      className={`modal fade succssec-reg ${isOpen ? 'show' : ''}`}
      id="succsModal"
      tabIndex="-1"
      aria-labelledby="succsModalLabel"
      aria-hidden={!isOpen}
      style={{ display: isOpen ? 'block' : 'none' }}
      role="dialog"
      onMouseDown={(e) => {
        if (e.target?.classList?.contains('modal')) onClose?.();
      }}
    >
      <div className="modal-dialog" onMouseDown={(e) => e.stopPropagation()}>
        <div className="modal-content">
          <div className="modal-header">
            <h1 className="modal-title" id="succsModalLabel">
              Добро пожаловать, {username || 'Имя'}!
            </h1>
          </div>

          <div className="modal-body">
            <div className="succssec-reg-inner">
              {email && (
                <p className="congrats">
                  На ваш адрес{' '}
                  <a href="#" onClick={(e) => e.preventDefault()}>
                    {email}
                  </a>{' '}
                  отправлено письмо для подтверждения. Пожалуйста, проверьте почту и подтвердите.
                </p>
              )}

              <button
                type="button"
                className="succssec-reg-close"
                aria-label="Close"
                onClick={onClose}
              >
                Закрыть
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}