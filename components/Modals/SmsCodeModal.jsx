'use client';

export default function SmsCodeModal() {
    return (
        <div className="modal fade login-code" id="codeModal" tabIndex="-1" aria-labelledby="codeModalLabel" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h1 className="modal-title" id="codeModalLabel">Подтверждение входа</h1>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <div className="code-modal-inner">
                            <p className="note">Введите последние 4 цифры номера, с которого мы звоним на Ваш номер: +375 29 965
                                10 23</p>
                            <div className="aply-code">
                                <input type="text" className="codes" inputMode="numeric" maxLength="1"/>
                                <input type="text" className="codes" inputMode="numeric" maxLength="1"/>
                                <input type="text" className="codes" inputMode="numeric" maxLength="1"/>
                                <input type="text" className="codes" inputMode="numeric" maxLength="1"/>
                            </div>
                            <a href="#" data-bs-toggle="modal" data-bs-target="#succsModal">Повторный запрос звонка через
                                <span className="code-count">00:30</span></a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
