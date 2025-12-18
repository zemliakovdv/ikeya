export default function Header() {
    return (
        <header className="header">
            <div className="header-top">
                <div className="container">
                    <div className="row">
                        <div className="col-12">
                            <div className="header-top-inner">
                                <div className="header-top-menu">
                                    <ul>
                                        <li><a href="#">О компании</a></li>
                                        <li><a href="#">Доставка</a></li>
                                        <li><a href="#">Оплата</a></li>
                                        <li><a href="#">Пункты выдачи</a></li>
                                        <li><a href="#">Сотрудничество</a></li>
                                    </ul>
                                </div>
                                <div className="header-top-phone">
                                    <a href="tel:2626">
                                        <img src="assets/img/icons/header-short-phone.svg" alt="Телефон"/>
                                        2626
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="header-middle">
                <div className="container">
                    <div className="row">
                        <div className="col-12">
                            <div className="header-middle-inner">
                                <div className="header-middle-start">
                                    <a href="index.html" className="logo">
                                        <img src="assets/img/logo.svg" alt="Логотип"/>
                                    </a>
                                    <button id="catalogButton" className="catalog-btn">
                                        <img src="assets/img/icons/catalog-button.svg" alt="Каталог"/>
                                        <p>Каталог</p>
                                    </button>
                                    <a href="#">Услуги</a>
                                </div>
                                <div className="header-middle-search">
                                    <div className="middle-searh-inner">
                                        <input type="search" placeholder="Поиск по названию, артикулу" id="search-form"/>
                                        <button type="submit" className="search-but"><img
                                                src="assets/img/icons/header-search.svg" alt="Поиск"/></button>
                                    </div>
                                </div>
                                <div className="header-middle-panel">
                                    <div className="header-panel-item">
                                        <a href="panel-item-button">
                                            <img src="assets/img/icons/header-favorite.svg" alt="Избранное"/>
                                            <p>Избранное</p>
                                            <span>0</span>
                                        </a>
                                    </div>
                                    <div className="header-panel-item">
                                        <a href="panel-item-button" data-bs-toggle="modal" data-bs-target="#loginModal">
                                            <img src="assets/img/icons/header-profile.svg" alt="Профиль"/>
                                            <p>Войти</p>
                                            <span>0</span>
                                        </a>
                                    </div>
                                    <div className="header-panel-item">
                                        <a href="panel-item-button">
                                            <img src="assets/img/icons/header-card.svg" alt="Корзина"/>
                                            <p>Корзина</p>
                                            <span>14</span>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="header-bottom">
                <div className="container">
                    <div className="row">
                        <div className="col-12">
                            <div className="header-bottom-inner">
                                <a href="catalog.html">Диваны</a>
                                <a href="catalog.html">Кресла</a>
                                <a href="catalog.html">Кровати</a>
                                <a href="catalog.html">Матрасы</a>
                                <a href="catalog.html">Текстиль</a>
                                <a href="catalog.html">Освещение</a>
                                <a href="catalog.html">Посуда</a>
                                <a href="catalog.html">Кухонная утварь</a>
                                <a href="catalog.html">Украшения</a>
                                <a href="catalog.html">Системы хранения</a>
                                <a href="catalog.html">Комоды и тумбочки</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
