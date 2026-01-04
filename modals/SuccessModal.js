'use client';

import { useRouter } from 'next/navigation';

export default function SuccessModal({ userName = 'Имя', userEmail = 'example@mail.ru' }) {
  const router = useRouter();

  const handleClose = () => {
    // Закрываем модалку и перенаправляем на главную (или личный кабинет)
    router.push('/'); // Или '/profile' если есть
  };

  return (
    <div 
      className="modal fade succssec-reg" 
      id="succsModal" 
      tabIndex="-1" 
      aria-labelledby="succsModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h1 className="modal-title" id="succsModalLabel">
              Добро пожаловать, {userName}!
            </h1>
          </div>
          
          <div className="modal-body">
            <div className="succssec-reg-inner">
              <p className="congrats">
                На ваш адрес <a href={`mailto:${userEmail}`}>{userEmail}</a> отправлено письмо для подтверждения. Пожалуйста, проверьте почту и подтвердите.
              </p>
              
              <button 
                type="button" 
                className="succssec-reg-close" 
                data-bs-dismiss="modal" 
                aria-label="Close"
                onClick={handleClose}
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
