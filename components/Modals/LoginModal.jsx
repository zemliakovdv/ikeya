'use client';

export default function LoginModal() {
    return (
        <div className="modal fade login-modal" id="loginModal" tabIndex="-1" aria-labelledby="loginModalLabel"
            aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h1 className="modal-title up-the-hide" id="loginModalLabel">Вход в систему</h1>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <div className="login-modal-inner">
                            <div className="login-container">
                                <div className="login-card">
                                    <div className="phone-input-group">
                                        <div className="login-notice the-hide">
                                            <img src="assets/img/icons/alert-fill.svg" alt=""/>
                                            <p>Данный номер не зарегистрирован. Проверьте правильность ввода или
                                                зарегистрируйтесь.</p>
                                        </div>
                                        <div className="phone-input-container" id="phoneContainer">
                                            <div className="country-code">
                                                <span className="flag-icon"><img src="assets/img/icons/rb.svg" alt=""/></span>
                                                <span>+375</span>
                                            </div>
                                            <input type="tel" className="phone-input" id="phoneInput" placeholder="25 895 26 84"
                                                inputMode="numeric" maxLength="9"/>
                                        </div>
                                    </div>

                                    <button className="get-code-btn" id="getCodeBtn" data-bs-toggle="modal"
                                        data-bs-target="#codeModal">
                                        Получить код
                                    </button>

                                    <div className="register-link">
                                        <a href="#" data-bs-toggle="modal" data-bs-target="#regModal">Зарегистрироваться</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
