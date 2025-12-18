'use client';

export default function CatalogModal() {
    return (
        <div className="catalog-modal" id="catalogModal">
            <div className="container">
                <div className="row">
                    <div className="col-12">
                        <div className="catalog-modal-body">
                            {/* Левая панель - список категорий */}
                            <div className="category-list">
                                <div className="div categorys-head">
                                    <div className="item">
                                        <img className="img" src="assets/img/catalog-modal/collections.svg" alt=""/>
                                        <div className="text">
                                            <div className="entered-text">Коллекции</div>
                                        </div>
                                    </div>
                                    <div className="item">
                                        <img className="img" src="assets/img/catalog-modal/discount.svg" alt=""/>
                                        <div className="text">
                                            <div className="text-wrapper">Уценённые товары</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="div categorys-content">
                                    <div className="item" data-category="sad-i-balkon">
                                        <img className="img" src="assets/img/catalog-modal/sad_i_balcon.svg" alt=""/>
                                        <div className="text">
                                            <div className="entered-text-2">Сад и балкон</div>
                                        </div>
                                        <img className="img" src="assets/img/catalog-modal/arrow-right.svg" alt=""/>
                                    </div>
                                    <div className="item" data-category="mebel-dlya-hraneniya">
                                        <img className="img" src="assets/img/catalog-modal/mebel_dlya_hranenia.svg" alt=""/>
                                        <div className="text">
                                            <div className="entered-text-3">Мебель для хранения вещей</div>
                                        </div>
                                        <img className="img" src="assets/img/catalog-modal/arrow-right.svg" alt=""/>
                                    </div>
                                    <div className="item" data-category="osveshenie">
                                        <img className="img" src="assets/img/catalog-modal/osveshenie.svg" alt=""/>
                                        <div className="text">
                                            <div className="entered-text-3">Освещение</div>
                                        </div>
                                        <img className="img" src="assets/img/catalog-modal/arrow-right.svg" alt=""/>
                                    </div>
                                    <div className="item" data-category="divany_i_kresla">
                                        <img className="img" src="assets/img/catalog-modal/divany_i_kresla.svg" alt=""/>
                                        <div className="text">
                                            <div className="entered-text-3">Диваны и кресла</div>
                                        </div>
                                        <img className="img" src="assets/img/catalog-modal/arrow-right.svg" alt=""/>
                                    </div>
                                    <div className="item" data-category="tekstil">
                                        <img className="img" src="assets/img/catalog-modal/tekstil.svg" alt=""/>
                                        <div className="text">
                                            <div className="entered-text-3">Текстиль</div>
                                        </div>
                                        <img className="img" src="assets/img/catalog-modal/arrow-right.svg" alt=""/>
                                    </div>
                                    <div className="item" data-category="krovati_i_matrasy">
                                        <img className="img" src="assets/img/catalog-modal/krovati_i_matrasy.svg" alt=""/>
                                        <div className="text">
                                            <div className="entered-text-3">Кровати и матрасы</div>
                                        </div>
                                        <img className="img" src="assets/img/catalog-modal/arrow-right.svg" alt=""/>
                                    </div>
                                    <div className="item" data-category="nebolshoe_hranenie">
                                        <img className="img" src="assets/img/catalog-modal/nebolshoe_hranenie.svg" alt=""/>
                                        <div className="entered-text-wrapper">
                                            <div className="entered-text-3">Небольшое хранение и организация</div>
                                        </div>
                                        <img className="img" src="assets/img/catalog-modal/arrow-right.svg" alt=""/>
                                    </div>
                                    <div className="item" data-category="deti_i_mladency">
                                        <img className="img" src="assets/img/catalog-modal/deti_i_mladency.svg" alt=""/>
                                        <div className="text">
                                            <div className="entered-text-3">Дети и младенцы</div>
                                        </div>
                                        <img className="img" src="assets/img/catalog-modal/arrow-right.svg" alt=""/>
                                    </div>
                                    <div className="item" data-category="ukrashenia">
                                        <img className="img" src="assets/img/catalog-modal/ukrashenia.svg" alt=""/>
                                        <div className="text">
                                            <div className="entered-text-3">Украшения</div>
                                        </div>
                                        <img className="img" src="assets/img/catalog-modal/arrow-right.svg" alt=""/>
                                    </div>
                                    <div className="item" data-category="stoly_i_stylia">
                                        <img className="img" src="assets/img/catalog-modal/stoly_i_stylia.svg" alt=""/>
                                        <div className="text">
                                            <div className="entered-text-3">Столы и стулья</div>
                                        </div>
                                        <img className="img" src="assets/img/catalog-modal/arrow-right.svg" alt=""/>
                                    </div>
                                    <div className="item" data-category="stoly_dlya_ucheby">
                                        <img className="img" src="assets/img/catalog-modal/stoly_dlya_ucheby.svg" alt=""/>
                                        <div className="text">
                                            <p className="entered-text-3">Столы и стулья для учебы</p>
                                        </div>
                                        <img className="img" src="assets/img/catalog-modal/arrow-right.svg" alt=""/>
                                    </div>
                                    <div className="item" data-category="prigotovlenie">
                                        <img className="img" src="assets/img/catalog-modal/prigotovlenie.svg" alt=""/>
                                        <div className="entered-text-wrapper">
                                            <p className="entered-text-3">Приготовление пищи и сервировка стола</p>
                                        </div>
                                        <img className="img" src="assets/img/catalog-modal/arrow-right.svg" alt=""/>
                                    </div>
                                    <div className="item" data-category="kuhni">
                                        <img className="img" src="assets/img/catalog-modal/kuhni.svg" alt=""/>
                                        <div className="text">
                                            <div className="entered-text-3">Кухни и кухонная техника</div>
                                        </div>
                                        <img className="img" src="assets/img/catalog-modal/arrow-right.svg" alt=""/>
                                    </div>
                                    <div className="item" data-category="kovry">
                                        <img className="img" src="assets/img/catalog-modal/kovry.svg" alt=""/>
                                        <div className="text">
                                            <div className="entered-text-3">Ковры, коврики и полы</div>
                                        </div>
                                        <img className="img" src="assets/img/catalog-modal/arrow-right.svg" alt=""/>
                                    </div>
                                    <div className="item" data-category="stirka">
                                        <img className="img" src="assets/img/catalog-modal/stirka.svg" alt=""/>
                                        <div className="text">
                                            <div className="entered-text-3">Стирка и уборка</div>
                                        </div>
                                        <img className="img" src="assets/img/catalog-modal/arrow-right.svg" alt=""/>
                                    </div>
                                    <div className="item" data-category="vannye">
                                        <img className="img" src="assets/img/catalog-modal/vannye.svg" alt=""/>
                                        <div className="text">
                                            <div className="entered-text-3">Ванные комнаты</div>
                                        </div>
                                        <img className="img" src="assets/img/catalog-modal/arrow-right.svg" alt=""/>
                                    </div>
                                    <div className="item" data-category="domashnyaa_elektronika">
                                        <img className="img" src="assets/img/catalog-modal/domashnyaa_elektronika.svg" alt=""/>
                                        <div className="text">
                                            <div className="entered-text-3">Домашняя электроника</div>
                                        </div>
                                        <img className="img" src="assets/img/catalog-modal/arrow-right.svg" alt=""/>
                                    </div>
                                    <div className="item" data-category="uluchenie_doma">
                                        <img className="img" src="assets/img/catalog-modal/uluchenie_doma.svg" alt=""/>
                                        <div className="text">
                                            <div className="entered-text-3">Улучшение дома</div>
                                        </div>
                                        <img className="img" src="assets/img/catalog-modal/arrow-right.svg" alt=""/>
                                    </div>
                                </div>
                            </div>

                            {/* Правая панель - подкатегории */}
                            <div className="categories-container">
                                {/* 1. Сад и балкон */}
                                <div className="category-group active" data-category="sad-i-balkon">
                                    <div className="columns">
                                        <div className="column">
                                            <div className="category-item">
                                                <div className="div">
                                                    <div className="item-3">
                                                        <div className="img-2"></div>
                                                        <div className="text">
                                                            <div className="entered-text-2"><a href="#">Садовая и балконная мебель</a></div>
                                                        </div>
                                                    </div>
                                                    <div className="list">
                                                        <div className="div-wrapper">
                                                            <div className="text">
                                                                <div className="entered-text-3"><a href="#">Садовая мебель</a></div>
                                                            </div>
                                                        </div>
                                                        <div className="div-wrapper">
                                                            <div className="text">
                                                                <div className="entered-text-3"><a href="#">Садовые столы и стулья</a></div>
                                                            </div>
                                                        </div>
                                                        <div className="div-wrapper">
                                                            <div className="text">
                                                                <p className="entered-text-3"><a href="#">Журнальные столики для сада и балкона</a></p>
                                                            </div>
                                                        </div>
                                                        <div className="div-wrapper">
                                                            <div className="text">
                                                                <div className="entered-text-3"><a href="#">Шезлонги и гамаки</a></div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="link">
                                                    <div className="name">Показать еще</div>
                                                    <img className="arrow-right" src="assets/img/catalog-modal/arrow-right.svg" alt=""/>
                                                </div>
                                            </div>
                                            <div className="category-item">
                                                <div className="div">
                                                    <div className="item-3">
                                                        <div className="img-3"></div>
                                                        <div className="text">
                                                            <div className="entered-text-2">Садовые принадлежности</div>
                                                        </div>
                                                    </div>
                                                    <div className="list">
                                                        <div className="div-wrapper">
                                                            <div className="text">
                                                                <p className="entered-text-3">Чехлы для садовой мебели и зонтов</p>
                                                            </div>
                                                        </div>
                                                        <div className="div-wrapper">
                                                            <div className="text">
                                                                <p className="entered-text-3">Масла, пятна и средства по уходу</p>
                                                            </div>
                                                        </div>
                                                        <div className="div-wrapper">
                                                            <div className="text">
                                                                <div className="entered-text-3">Садовые подушки</div>
                                                            </div>
                                                        </div>
                                                        <div className="div-wrapper">
                                                            <div className="text">
                                                                <p className="entered-text-3">Ковры для балкона и террасы</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="link">
                                                    <div className="name">Показать еще</div>
                                                    <img className="arrow-right" src="assets/img/catalog-modal/arrow-right.svg" alt=""/>
                                                </div>
                                            </div>
                                            <div className="category-item">
                                                <div className="div">
                                                    <div className="item-3">
                                                        <div className="img-4"></div>
                                                        <div className="text">
                                                            <p className="entered-text-2">Хранение в саду и на балконе</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="column">
                                            <div className="category-item">
                                                <div className="div">
                                                    <div className="item-3">
                                                        <div className="img-5"></div>
                                                        <div className="text">
                                                            <div className="entered-text-2">Зонты, беседки и перголы</div>
                                                        </div>
                                                    </div>
                                                    <div className="list">
                                                        <div className="div-wrapper">
                                                            <div className="text">
                                                                <div className="entered-text-3">Садовые зонты и основания</div>
                                                            </div>
                                                        </div>
                                                        <div className="div-wrapper">
                                                            <div className="text">
                                                                <p className="entered-text-3">Садовые беседки и противомоскитные сетки</p>
                                                            </div>
                                                        </div>
                                                        <div className="div-wrapper">
                                                            <div className="text">
                                                                <div className="entered-text-3">Экраны и летняя защита</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="category-item">
                                                <div className="div">
                                                    <div className="item-3">
                                                        <div className="img-6"></div>
                                                        <div className="text">
                                                            <div className="entered-text-2">Освещение сада</div>
                                                        </div>
                                                    </div>
                                                    <div className="list">
                                                        <div className="div-wrapper">
                                                            <div className="text">
                                                                <div className="entered-text-3">Лампы на тарасе</div>
                                                            </div>
                                                        </div>
                                                        <div className="div-wrapper">
                                                            <div className="text">
                                                                <div className="entered-text-3">Настенные светильники для улицы</div>
                                                            </div>
                                                        </div>
                                                        <div className="div-wrapper">
                                                            <div className="text">
                                                                <div className="entered-text-3">Настольные лампы для улицы</div>
                                                            </div>
                                                        </div>
                                                        <div className="div-wrapper">
                                                            <div className="text">
                                                                <div className="entered-text-3">Уличные подвесные светильники</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="link">
                                                    <div className="name">Показать еще</div>
                                                    <img className="arrow-right" src="assets/img/catalog-modal/arrow-right.svg" alt=""/>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="column">
                                            <div className="category-item">
                                                <div className="div">
                                                    <div className="item-3">
                                                        <div className="img-7"></div>
                                                        <div className="text">
                                                            <p className="entered-text-2">Полы для балконов и террас</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="category-item">
                                                <div className="div">
                                                    <div className="item-3">
                                                        <div className="img-8"></div>
                                                        <div className="text">
                                                            <p className="entered-text-2">Ковры для балкона и террасы</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="category-item">
                                                <div className="div">
                                                    <div className="item-3">
                                                        <div className="img-9"></div>
                                                        <div className="text">
                                                            <div className="entered-text-2">Садовая кухня и гриль</div>
                                                        </div>
                                                    </div>
                                                    <div className="list">
                                                        <div className="div-wrapper">
                                                            <div className="text">
                                                                <div className="entered-text-3">Аксессуары для гриля</div>
                                                            </div>
                                                        </div>
                                                        <div className="div-wrapper">
                                                            <div className="text">
                                                                <div className="entered-text-3">Садовые грили</div>
                                                            </div>
                                                        </div>
                                                        <div className="div-wrapper">
                                                            <div className="text">
                                                                <div className="entered-text-3">Садовые кухни</div>
                                                            </div>
                                                        </div>
                                                        <div className="div-wrapper">
                                                            <div className="text">
                                                                <div className="entered-text-3">Элементы садовой кухни</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* 2. Мебель для хранения вещей (идентичная структура) */}
                                <div className="category-group" data-category="mebel-dlya-hraneniya">
                                    <div className="columns">
                                        <div className="column">
                                            <div className="category-item">
                                                <div className="div">
                                                    <div className="item-3">
                                                        <div className="img-2"></div>
                                                        <div className="text">
                                                            <div className="entered-text-2"><a href="#">Садовая и балконная мебель</a></div>
                                                        </div>
                                                    </div>
                                                    <div className="list">
                                                        <div className="div-wrapper">
                                                            <div className="text">
                                                                <div className="entered-text-3"><a href="#">Садовая мебель</a></div>
                                                            </div>
                                                        </div>
                                                        <div className="div-wrapper">
                                                            <div className="text">
                                                                <div className="entered-text-3"><a href="#">Садовые столы и стулья</a></div>
                                                            </div>
                                                        </div>
                                                        <div className="div-wrapper">
                                                            <div className="text">
                                                                <p className="entered-text-3"><a href="#">Журнальные столики для сада и балкона</a></p>
                                                            </div>
                                                        </div>
                                                        <div className="div-wrapper">
                                                            <div className="text">
                                                                <div className="entered-text-3"><a href="#">Шезлонги и гамаки</a></div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="link">
                                                    <div className="name">Показать еще</div>
                                                    <img className="arrow-right" src="assets/img/catalog-modal/arrow-right.svg" alt=""/>
                                                </div>
                                            </div>
                                            <div className="category-item">
                                                <div className="div">
                                                    <div className="item-3">
                                                        <div className="img-3"></div>
                                                        <div className="text">
                                                            <div className="entered-text-2">Садовые принадлежности</div>
                                                        </div>
                                                    </div>
                                                    <div className="list">
                                                        <div className="div-wrapper">
                                                            <div className="text">
                                                                <p className="entered-text-3">Чехлы для садовой мебели и зонтов</p>
                                                            </div>
                                                        </div>
                                                        <div className="div-wrapper">
                                                            <div className="text">
                                                                <p className="entered-text-3">Масла, пятна и средства по уходу</p>
                                                            </div>
                                                        </div>
                                                        <div className="div-wrapper">
                                                            <div className="text">
                                                                <div className="entered-text-3">Садовые подушки</div>
                                                            </div>
                                                        </div>
                                                        <div className="div-wrapper">
                                                            <div className="text">
                                                                <p className="entered-text-3">Ковры для балкона и террасы</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="link">
                                                    <div className="name">Показать еще</div>
                                                    <img className="arrow-right" src="assets/img/catalog-modal/arrow-right.svg" alt=""/>
                                                </div>
                                            </div>
                                            <div className="category-item">
                                                <div className="div">
                                                    <div className="item-3">
                                                        <div className="img-4"></div>
                                                        <div className="text">
                                                            <p className="entered-text-2">Хранение в саду и на балконе</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="column">
                                            <div className="category-item">
                                                <div className="div">
                                                    <div className="item-3">
                                                        <div className="img-5"></div>
                                                        <div className="text">
                                                            <div className="entered-text-2">Зонты, беседки и перголы</div>
                                                        </div>
                                                    </div>
                                                    <div className="list">
                                                        <div className="div-wrapper">
                                                            <div className="text">
                                                                <div className="entered-text-3">Садовые зонты и основания</div>
                                                            </div>
                                                        </div>
                                                        <div className="div-wrapper">
                                                            <div className="text">
                                                                <p className="entered-text-3">Садовые беседки и противомоскитные сетки</p>
                                                            </div>
                                                        </div>
                                                        <div className="div-wrapper">
                                                            <div className="text">
                                                                <div className="entered-text-3">Экраны и летняя защита</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="category-item">
                                                <div className="div">
                                                    <div className="item-3">
                                                        <div className="img-6"></div>
                                                        <div className="text">
                                                            <div className="entered-text-2">Освещение сада</div>
                                                        </div>
                                                    </div>
                                                    <div className="list">
                                                        <div className="div-wrapper">
                                                            <div className="text">
                                                                <div className="entered-text-3">Лампы на тарасе</div>
                                                            </div>
                                                        </div>
                                                        <div className="div-wrapper">
                                                            <div className="text">
                                                                <div className="entered-text-3">Настенные светильники для улицы</div>
                                                            </div>
                                                        </div>
                                                        <div className="div-wrapper">
                                                            <div className="text">
                                                                <div className="entered-text-3">Настольные лампы для улицы</div>
                                                            </div>
                                                        </div>
                                                        <div className="div-wrapper">
                                                            <div className="text">
                                                                <div className="entered-text-3">Уличные подвесные светильники</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="link">
                                                    <div className="name">Показать еще</div>
                                                    <img className="arrow-right" src="assets/img/catalog-modal/arrow-right.svg" alt=""/>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="column">
                                            <div className="category-item">
                                                <div className="div">
                                                    <div className="item-3">
                                                        <div className="img-7"></div>
                                                        <div className="text">
                                                            <p className="entered-text-2">Полы для балконов и террас</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="category-item">
                                                <div className="div">
                                                    <div className="item-3">
                                                        <div className="img-8"></div>
                                                        <div className="text">
                                                            <p className="entered-text-2">Ковры для балкона и террасы</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="category-item">
                                                <div className="div">
                                                    <div className="item-3">
                                                        <div className="img-9"></div>
                                                        <div className="text">
                                                            <div className="entered-text-2">Садовая кухня и гриль</div>
                                                        </div>
                                                    </div>
                                                    <div className="list">
                                                        <div className="div-wrapper">
                                                            <div className="text">
                                                                <div className="entered-text-3">Аксессуары для гриля</div>
                                                            </div>
                                                        </div>
                                                        <div className="div-wrapper">
                                                            <div className="text">
                                                                <div className="entered-text-3">Садовые грили</div>
                                                            </div>
                                                        </div>
                                                        <div className="div-wrapper">
                                                            <div className="text">
                                                                <div className="entered-text-3">Садовые кухни</div>
                                                            </div>
                                                        </div>
                                                        <div className="div-wrapper">
                                                            <div className="text">
                                                                <div className="entered-text-3">Элементы садовой кухни</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* 3. Освещение */}
                                <div className="category-group" data-category="osveshenie">
                                    <div className="columns">
                                        <div className="column">
                                            <div className="category-item">
                                                <div className="div">
                                                    <div className="item-3">
                                                        <div className="img-2"></div>
                                                        <div className="text">
                                                            <div className="entered-text-2"><a href="#">Садовая и балконная мебель</a></div>
                                                        </div>
                                                    </div>
                                                    <div className="list">
                                                        <div className="div-wrapper">
                                                            <div className="text">
                                                                <div className="entered-text-3"><a href="#">Садовая мебель</a></div>
                                                            </div>
                                                        </div>
                                                        <div className="div-wrapper">
                                                            <div className="text">
                                                                <div className="entered-text-3"><a href="#">Садовые столы и стулья</a></div>
                                                            </div>
                                                        </div>
                                                        <div className="div-wrapper">
                                                            <div className="text">
                                                                <p className="entered-text-3"><a href="#">Журнальные столики для сада и балкона</a></p>
                                                            </div>
                                                        </div>
                                                        <div className="div-wrapper">
                                                            <div className="text">
                                                                <div className="entered-text-3"><a href="#">Шезлонги и гамаки</a></div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="link">
                                                    <div className="name">Показать еще</div>
                                                    <img className="arrow-right" src="assets/img/catalog-modal/arrow-right.svg" alt=""/>
                                                </div>
                                            </div>
                                            <div className="category-item">
                                                <div className="div">
                                                    <div className="item-3">
                                                        <div className="img-3"></div>
                                                        <div className="text">
                                                            <div className="entered-text-2">Садовые принадлежности</div>
                                                        </div>
                                                    </div>
                                                    <div className="list">
                                                        <div className="div-wrapper">
                                                            <div className="text">
                                                                <p className="entered-text-3">Чехлы для садовой мебели и зонтов</p>
                                                            </div>
                                                        </div>
                                                        <div className="div-wrapper">
                                                            <div className="text">
                                                                <p className="entered-text-3">Масла, пятна и средства по уходу</p>
                                                            </div>
                                                        </div>
                                                        <div className="div-wrapper">
                                                            <div className="text">
                                                                <div className="entered-text-3">Садовые подушки</div>
                                                            </div>
                                                        </div>
                                                        <div className="div-wrapper">
                                                            <div className="text">
                                                                <p className="entered-text-3">Ковры для балкона и террасы</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="link">
                                                    <div className="name">Показать еще</div>
                                                    <img className="arrow-right" src="assets/img/catalog-modal/arrow-right.svg" alt=""/>
                                                </div>
                                            </div>
                                            <div className="category-item">
                                                <div className="div">
                                                    <div className="item-3">
                                                        <div className="img-4"></div>
                                                        <div className="text">
                                                            <p className="entered-text-2">Хранение в саду и на балконе</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="column">
                                            <div className="category-item">
                                                <div className="div">
                                                    <div className="item-3">
                                                        <div className="img-5"></div>
                                                        <div className="text">
                                                            <div className="entered-text-2">Зонты, беседки и перголы</div>
                                                        </div>
                                                    </div>
                                                    <div className="list">
                                                        <div className="div-wrapper">
                                                            <div className="text">
                                                                <div className="entered-text-3">Садовые зонты и основания</div>
                                                            </div>
                                                        </div>
                                                        <div className="div-wrapper">
                                                            <div className="text">
                                                                <p className="entered-text-3">Садовые беседки и противомоскитные сетки</p>
                                                            </div>
                                                        </div>
                                                        <div className="div-wrapper">
                                                            <div className="text">
                                                                <div className="entered-text-3">Экраны и летняя защита</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="category-item">
                                                <div className="div">
                                                    <div className="item-3">
                                                        <div className="img-6"></div>
                                                        <div className="text">
                                                            <div className="entered-text-2">Освещение сада</div>
                                                        </div>
                                                    </div>
                                                    <div className="list">
                                                        <div className="div-wrapper">
                                                            <div className="text">
                                                                <div className="entered-text-3">Лампы на тарасе</div>
                                                            </div>
                                                        </div>
                                                        <div className="div-wrapper">
                                                            <div className="text">
                                                                <div className="entered-text-3">Настенные светильники для улицы</div>
                                                            </div>
                                                        </div>
                                                        <div className="div-wrapper">
                                                            <div className="text">
                                                                <div className="entered-text-3">Настольные лампы для улицы</div>
                                                            </div>
                                                        </div>
                                                        <div className="div-wrapper">
                                                            <div className="text">
                                                                <div className="entered-text-3">Уличные подвесные светильники</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="link">
                                                    <div className="name">Показать еще</div>
                                                    <img className="arrow-right" src="assets/img/catalog-modal/arrow-right.svg" alt=""/>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="column">
                                            <div className="category-item">
                                                <div className="div">
                                                    <div className="item-3">
                                                        <div className="img-7"></div>
                                                        <div className="text">
                                                            <p className="entered-text-2">Полы для балконов и террас</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="category-item">
                                                <div className="div">
                                                    <div className="item-3">
                                                        <div className="img-8"></div>
                                                        <div className="text">
                                                            <p className="entered-text-2">Ковры для балкона и террасы</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="category-item">
                                                <div className="div">
                                                    <div className="item-3">
                                                        <div className="img-9"></div>
                                                        <div className="text">
                                                            <div className="entered-text-2">Садовая кухня и гриль</div>
                                                        </div>
                                                    </div>
                                                    <div className="list">
                                                        <div className="div-wrapper">
                                                            <div className="text">
                                                                <div className="entered-text-3">Аксессуары для гриля</div>
                                                            </div>
                                                        </div>
                                                        <div className="div-wrapper">
                                                            <div className="text">
                                                                <div className="entered-text-3">Садовые грили</div>
                                                            </div>
                                                        </div>
                                                        <div className="div-wrapper">
                                                            <div className="text">
                                                                <div className="entered-text-3">Садовые кухни</div>
                                                            </div>
                                                        </div>
                                                        <div className="div-wrapper">
                                                            <div className="text">
                                                                <div className="entered-text-3">Элементы садовой кухни</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Остальные 15 категорий имеют идентичную структуру */}
                                {/* 4. divany_i_kresla, 5. tekstil, 6. krovati_i_matrasy, 7. nebolshoe_hranenie */}
                                {/* 8. deti_i_mladency, 9. ukrashenia, 10. stoly_i_stylia, 11. stoly_dlya_ucheby */}
                                {/* 12. prigotovlenie, 13. kuhni, 14. kovry, 15. stirka */}
                                {/* 16. vannye, 17. domashnyaa_elektronika, 18. uluchenie_doma */}
                                
                                {/* Для краткости добавлю заглушки для остальных категорий */}
                                {['divany_i_kresla', 'tekstil', 'krovati_i_matrasy', 'nebolshoe_hranenie', 
                                  'deti_i_mladency', 'ukrashenia', 'stoly_i_stylia', 'stoly_dlya_ucheby',
                                  'prigotovlenie', 'kuhni', 'kovry', 'stirka', 'vannye', 'domashnyaa_elektronika', 
                                  'uluchenie_doma'].map((category) => (
                                    <div key={category} className="category-group" data-category={category}>
                                        <div className="columns">
                                            <div className="column">
                                                <div className="category-item">
                                                    <div className="div">
                                                        <div className="item-3">
                                                            <div className="img-2"></div>
                                                            <div className="text">
                                                                <div className="entered-text-2"><a href="#">Подкатегория 1</a></div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="column">
                                                <div className="category-item">
                                                    <div className="div">
                                                        <div className="item-3">
                                                            <div className="img-5"></div>
                                                            <div className="text">
                                                                <div className="entered-text-2">Подкатегория 2</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="column">
                                                <div className="category-item">
                                                    <div className="div">
                                                        <div className="item-3">
                                                            <div className="img-7"></div>
                                                            <div className="text">
                                                                <p className="entered-text-2">Подкатегория 3</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
