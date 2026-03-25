// components/profile/GuestFavoriteSidebar.js
'use client';

import { useAuthModals } from '@/components/auth/AuthModalsHost';

export default function GuestFavoriteSidebar() {
    const { openLogin, openRegister } = useAuthModals();

    return (
        <aside className="sidebar quest-bar">
            <div className="guest-sidebar">
                <h3 className="guest-sidebar__title">Войдите или зарегистрируйтесь</h3>
                <p className="guest-sidebar__text">
                    Вы сможете делать покупки, отслеживать заказы, оставлять отзывы.
                </p>
                <button
                    className="guest-sidebar__btn guest-sidebar__btn--primary"
                    onClick={openLogin}
                    type="button"
                >
                    Войти
                </button>
                <button
                    className="guest-sidebar__btn guest-sidebar__btn--outline"
                    onClick={openRegister}
                    type="button"
                >
                    Зарегистрироваться
                </button>
            </div>
            <div className="guest-sidebar__favorites-link">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10.0001 17.1752C9.45008 17.1752 8.89175 17.0002 8.41675 16.6419C6.38341 15.1252 1.66675 11.1919 1.66675 7.43353C1.66675 4.8502 3.62508 2.8252 6.12508 2.8252C7.50841 2.8252 8.69175 3.34186 10.0001 4.54186C11.3084 3.34186 12.4917 2.8252 13.8751 2.8252C16.3751 2.8252 18.3334 4.8502 18.3334 7.43353C18.3334 11.1835 13.6084 15.1169 11.5834 16.6419C11.1084 16.9919 10.5584 17.1752 10.0001 17.1752ZM6.12508 3.99186C4.25008 3.99186 2.83341 5.4752 2.83341 7.43353C2.83341 10.7502 7.64175 14.6002 9.11675 15.7085C9.64175 16.1002 10.3584 16.1002 10.8834 15.7085C12.3584 14.6085 17.1667 10.7502 17.1667 7.43353C17.1667 5.46686 15.7501 3.99186 13.8751 3.99186C12.9917 3.99186 11.9667 4.20853 10.4084 5.75853C10.1834 5.98353 9.81675 5.98353 9.58341 5.75853C8.03341 4.20853 7.00008 3.99186 6.11675 3.99186H6.12508Z" fill="#0058A3" />
                </svg>
                Избранное
            </div>
        </aside>
    );
}