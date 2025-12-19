// components/modals/SuccessModal.jsx
'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useState } from 'react';

export default function SuccessModal({ userName = 'Пользователь', userEmail = 'example@mail.ru' }) {
    const router = useRouter();
    const { login } = useAuth();
    const [isClosing, setIsClosing] = useState(false);

    const handleClose = () => {
        if (isClosing) return;
        setIsClosing(true);

        // Авторизуем пользователя
        login(
            { 
                name: userName, 
                email: userEmail,
                id: Date.now(),
                isVerified: false // Не подтверждён email
            }, 
            'fake-token-' + Date.now()
        );

        // Закрываем модалку
        const modalElement = document.getElementById('succsModal');
        if (modalElement && window.bootstrap) {
            const modalInstance = window.bootstrap.Modal.getInstance(modalElement);
            if (modalInstance) {
                modalInstance.hide();
            }
        }

        // Перенаправляем на главную после анимации закрытия
        setTimeout(() => {
            router.push('/');
        }, 400);
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
                                На ваш адрес <strong>{userEmail}</strong> отправлено письмо
                                для подтверждения. Пожалуйста, проверьте почту и подтвердите.
                            </p>
                            <button 
                                type="button" 
                                className="succssec-reg-close" 
                                onClick={handleClose}
                                disabled={isClosing}
                            >
                                {isClosing ? 'Загрузка...' : 'Закрыть'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
