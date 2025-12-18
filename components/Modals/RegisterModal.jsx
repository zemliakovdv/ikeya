'use client';

export default function RegisterModal() {
    return (
        <div className="modal fade reg-start" id="regModal" tabIndex="-1" aria-labelledby="regModalLabel" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h1 className="modal-title" id="regModalLabel">Регистрация</h1>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <div className="login-notice the-hide">
                            <img src="assets/img/icons/alert-fill.svg" alt=""/>
                            <p>Такой номер телефона уже используется. Укажите другой или воспользоваться формой входа.</p>
                        </div>
                        <div className="form-floating the-name">
                            <input type="text" className="form-control" id="floatingPassword" placeholder="Имя" required/>
                            <label htmlFor="floatingPassword">Имя <span>*</span></label>
                        </div>
                        <div className="phone-input-container" id="phoneContainer">
                            <div className="country-code">
                                <span className="flag-icon"><img src="assets/img/icons/rb.svg" alt=""/></span>
                                <span>+375</span>
                            </div>
                            <input type="tel" className="phone-input" id="phoneInputreg" placeholder="25 895 26 84"
                                inputMode="numeric" maxLength="9" required/>
                        </div>
                        <div className="form-floating the-mail">
                            <input type="email" className="form-control" id="floatingInput" placeholder="Электронная почта"/>
                            <label htmlFor="floatingInput">Электронная почта</label>
                        </div>
                        <div className="policy-inner">
                            <div className="form-check">
                                <input className="form-check-input" type="checkbox" id="gridCheck" defaultChecked/>
                                <label className="form-check-label" htmlFor="gridCheck">
                                    Даю согласие на обработку персональных данных в соответствии с <a href="#">Политикой обработки
                                        персональных данных</a> и <a href="#">Договором-офертой</a>
                                </label>
                            </div>
                            <div className="form-check">
                                <input className="form-check-input" type="checkbox" id="gridCheck2" defaultChecked/>
                                <label className="form-check-label" htmlFor="gridCheck2">
                                    Даю согласие на получение рекламно-информационных рассылок по Email/Telegram
                                </label>
                            </div>

                            <button className="get-code-btn" id="getCodeBtn" data-bs-toggle="modal" data-bs-target="#codeModal">
                                Получить код
                            </button>

                            <div className="register-link">
                                <a href="#" data-bs-toggle="modal" data-bs-target="#loginModal">Уже есть аккаунт</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
