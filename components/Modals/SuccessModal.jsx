'use client';

export default function SuccessModal() {
    return (
        <div className="modal fade succssec-reg" id="succsModal" tabIndex="-1" aria-labelledby="succsModalLabel"
            aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h1 className="modal-title" id="succsModalLabel">Добро пожаловать, Имя!</h1>
                    </div>
                    <div className="modal-body">
                        <div className="succssec-reg-inner">
                            <p className="congrats">На ваш адрес <a href="index_log.html">example@mail.ru</a> отправлено письмо
                                для подтверждения. Пожалуйста, проверьте почту и подтвердите.</p>
                            <button type="button" className="succssec-reg-close" data-bs-dismiss="modal"
                                aria-label="Close" onClick={() => window.location.href='index_log.html'}>Закрыть</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
