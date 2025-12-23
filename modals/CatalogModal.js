'use client';

import { useEffect } from 'react';

export default function CatalogModal() {
  useEffect(() => {
    const catalogButton = document.getElementById('catalogButton');
    const catalogModal = document.getElementById('catalogModal');
    const catalogModalBody = catalogModal?.querySelector('.catalog-modal-body');
    const ANIMATION_DURATION = 350;

    if (!catalogButton || !catalogModal) {
      console.error('Не найдены необходимые элементы');
      return;
    }

    function isModalOpen() {
      return catalogModal.classList.contains('active');
    }

    function openModal() {
      catalogModal.style.display = 'block';
      document.body.style.overflow = 'hidden';
      catalogModal.offsetHeight; // reflow
      
      requestAnimationFrame(() => {
        catalogModal.classList.add('active');
        catalogButton.classList.add('active');
      });
      
      console.log('Модальное окно открыто');
    }

    function closeModal() {
      catalogModal.classList.remove('active');
      catalogButton.classList.remove('active');
      
      setTimeout(() => {
        catalogModal.style.display = 'none';
        document.body.style.overflow = '';
      }, ANIMATION_DURATION);
      
      console.log('Модальное окно закрыто');
    }

    function toggleCatalogModal() {
      isModalOpen() ? closeModal() : openModal();
    }

    // Клик по кнопке
    catalogButton.addEventListener('click', function (e) {
      e.stopPropagation();
      toggleCatalogModal();
    });

    // Закрытие при клике вне modal-body
    catalogModal.addEventListener('click', function (e) {
      if (e.target === catalogModal ||
          e.target.classList.contains('container') ||
          e.target.classList.contains('row') ||
          e.target.classList.contains('col-12')) {
        closeModal();
      }
    });

    // Предотвращаем закрытие при клике внутри
    if (catalogModalBody) {
      catalogModalBody.addEventListener('click', function (e) {
        e.stopPropagation();
      });
    }

    // Закрытие по Escape
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isModalOpen()) {
        closeModal();
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    catalogButton.classList.add('toggle-btn');

    // Cleanup
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  return (
    <div class="catalog-modal modal fade" id="collapseCatalogButton">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="catalog-modal-body">
              
              {/* Список главных категорий */}
              <div className="category-list">
                <div className="div categorys-head">
                  <div className="item">
                    <img className="img" src="assets/img/catalog-modal/collections.svg" alt="Коллекции" />
                    <div className="text">
                      <div className="entered-text">Коллекции</div>
                    </div>
                  </div>
                  <div className="item">
                    <img className="img" src="assets/img/catalog-modal/discount.svg" alt="Уценённые товары" />
                    <div className="text">
                      <div className="text-wrapper">Уценённые товары</div>
                    </div>
                  </div>
                </div>

                <div className="div categorys-content">
                  <div className="item active" data-category="sad-i-balkon">
                    <img className="img" src="assets/img/catalog-modal/sad_i_balcon.svg" alt="Сад и балкон" />
                    <div className="text">
                      <div className="entered-text-2">Сад и балкон</div>
                    </div>
                    <img className="img" src="assets/img/catalog-modal/arrow-right.svg" alt="arrow" />
                  </div>

                  <div className="item" data-category="mebel-dlya-hraneniya">
                    <img className="img" src="assets/img/catalog-modal/mebel_dlya_hranenia.svg" alt="Мебель для хранения" />
                    <div className="text">
                      <div className="entered-text-3">Мебель для хранения вещей</div>
                    </div>
                    <img className="img" src="assets/img/catalog-modal/arrow-right.svg" alt="arrow" />
                  </div>

                  <div className="item" data-category="osveshenie">
                    <img className="img" src="assets/img/catalog-modal/osveshenie.svg" alt="Освещение" />
                    <div className="text">
                      <div className="entered-text-3">Освещение</div>
                    </div>
                    <img className="img" src="assets/img/catalog-modal/arrow-right.svg" alt="arrow" />
                  </div>

                  <div className="item" data-category="divany_i_kresla">
                    <img className="img" src="assets/img/catalog-modal/divany_i_kresla.svg" alt="Диваны и кресла" />
                    <div className="text">
                      <div className="entered-text-3">Диваны и кресла</div>
                    </div>
                    <img className="img" src="assets/img/catalog-modal/arrow-right.svg" alt="arrow" />
                  </div>

                  <div className="item" data-category="tekstil">
                    <img className="img" src="assets/img/catalog-modal/tekstil.svg" alt="Текстиль" />
                    <div className="text">
                      <div className="entered-text-3">Текстиль</div>
                    </div>
                    <img className="img" src="assets/img/catalog-modal/arrow-right.svg" alt="arrow" />
                  </div>

                  <div className="item" data-category="krovati_i_matrasy">
                    <img className="img" src="assets/img/catalog-modal/krovati_i_matrasy.svg" alt="Кровати и матрасы" />
                    <div className="text">
                      <div className="entered-text-3">Кровати и матрасы</div>
                    </div>
                    <img className="img" src="assets/img/catalog-modal/arrow-right.svg" alt="arrow" />
                  </div>

                  <div className="item" data-category="nebolshoe_hranenie">
                    <img className="img" src="assets/img/catalog-modal/nebolshoe_hranenie.svg" alt="Небольшое хранение" />
                    <div className="entered-text-wrapper">
                      <div className="entered-text-3">Небольшое хранение и организация</div>
                    </div>
                    <img className="img" src="assets/img/catalog-modal/arrow-right.svg" alt="arrow" />
                  </div>

                  <div className="item" data-category="deti_i_mladency">
                    <img className="img" src="assets/img/catalog-modal/deti_i_mladency.svg" alt="Дети и младенцы" />
                    <div className="text">
                      <div className="entered-text-3">Дети и младенцы</div>
                    </div>
                    <img className="img" src="assets/img/catalog-modal/arrow-right.svg" alt="arrow" />
                  </div>

                  <div className="item" data-category="ukrashenia">
                    <img className="img" src="assets/img/catalog-modal/ukrashenia.svg" alt="Украшения" />
                    <div className="text">
                      <div className="entered-text-3">Украшения</div>
                    </div>
                    <img className="img" src="assets/img/catalog-modal/arrow-right.svg" alt="arrow" />
                  </div>

                  <div className="item" data-category="stoly_i_stylia">
                    <img className="img" src="assets/img/catalog-modal/stoly_i_stylia.svg" alt="Столы и стулья" />
                    <div className="text">
                      <div className="entered-text-3">Столы и стулья</div>
                    </div>
                    <img className="img" src="assets/img/catalog-modal/arrow-right.svg" alt="arrow" />
                  </div>

                  <div className="item" data-category="stoly_dlya_ucheby">
                    <img className="img" src="assets/img/catalog-modal/stoly_dlya_ucheby.svg" alt="Столы для учебы" />
                    <div className="text">
                      <p className="entered-text-3">Столы и стулья для учебы</p>
                    </div>
                    <img className="img" src="assets/img/catalog-modal/arrow-right.svg" alt="arrow" />
                  </div>

                  <div className="item" data-category="prigotovlenie">
                    <img className="img" src="assets/img/catalog-modal/prigotovlenie.svg" alt="Приготовление пищи" />
                    <div className="entered-text-wrapper">
                      <p className="entered-text-3">Приготовление пищи и сервировка стола</p>
                    </div>
                    <img className="img" src="assets/img/catalog-modal/arrow-right.svg" alt="arrow" />
                  </div>

                  <div className="item" data-category="kuhni">
                    <img className="img" src="assets/img/catalog-modal/kuhni.svg" alt="Кухни" />
                    <div className="text">
                      <div className="entered-text-3">Кухни и кухонная техника</div>
                    </div>
                    <img className="img" src="assets/img/catalog-modal/arrow-right.svg" alt="arrow" />
                  </div>

                  <div className="item" data-category="kovry">
                    <img className="img" src="assets/img/catalog-modal/kovry.svg" alt="Ковры" />
                    <div className="text">
                      <div className="entered-text-3">Ковры, коврики и полы</div>
                    </div>
                    <img className="img" src="assets/img/catalog-modal/arrow-right.svg" alt="arrow" />
                  </div>

                  <div className="item" data-category="stirka">
                    <img className="img" src="assets/img/catalog-modal/stirka.svg" alt="Стирка и уборка" />
                    <div className="text">
                      <div className="entered-text-3">Стирка и уборка</div>
                    </div>
                    <img className="img" src="assets/img/catalog-modal/arrow-right.svg" alt="arrow" />
                  </div>

                  <div className="item" data-category="vannye">
                    <img className="img" src="assets/img/catalog-modal/vannye.svg" alt="Ванные" />
                    <div className="text">
                      <div className="entered-text-3">Ванные комнаты</div>
                    </div>
                    <img className="img" src="assets/img/catalog-modal/arrow-right.svg" alt="arrow" />
                  </div>

                  <div className="item" data-category="domashnyaa_elektronika">
                    <img className="img" src="assets/img/catalog-modal/domashnyaa_elektronika.svg" alt="Электроника" />
                    <div className="text">
                      <div className="entered-text-3">Домашняя электроника</div>
                    </div>
                    <img className="img" src="assets/img/catalog-modal/arrow-right.svg" alt="arrow" />
                  </div>

                  <div className="item" data-category="uluchenie_doma">
                    <img className="img" src="assets/img/catalog-modal/uluchenie_doma.svg" alt="Улучшение дома" />
                    <div className="text">
                      <div className="entered-text-3">Улучшение дома</div>
                    </div>
                    <img className="img" src="assets/img/catalog-modal/arrow-right.svg" alt="arrow" />
                  </div>
                </div>
              </div>

              {/* Подкатегории для "Сад и балкон" */}
              <div className="categories-container">
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
                          <img className="arrow-right" src="assets/img/catalog-modal/arrow-right.svg" alt="arrow" />
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
                          <img className="arrow-right" src="assets/img/catalog-modal/arrow-right.svg" alt="arrow" />
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
                          <img className="arrow-right" src="assets/img/catalog-modal/arrow-right.svg" alt="arrow" />
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
              </div>

              {/* Остальные категории - добавь аналогично по необходимости */}
              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
