// app/profile/returns/page.js
'use client';

import { useState } from 'react';
import ProfileLayout from '@/components/profile/ProfileLayout';
import ReturnOffcanvas from '@/components/profile/ReturnOffcanvas';

const breadcrumbs = [
  { label: 'Профиль', href: '/profile' },
  { label: 'Возвраты', href: null },
];

export default function ReturnsPage() {
  const [isOffcanvasOpen, setIsOffcanvasOpen] = useState(false);

  return (
    <ProfileLayout breadcrumbs={breadcrumbs} mainClassName="vozvrat returns-profile">
      <div className="profile-mobile-topbar">
        <a className="profile-mobile-topbar__back" href="/profile" aria-label="Назад в профиль">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M12.5 15L7.5 10L12.5 5" stroke="#181818" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
        <span className="profile-mobile-topbar__title">Возвраты</span>
      </div>

      <div className="content">

        <button
          className="return-order"
          type="button"
          onClick={() => setIsOffcanvasOpen(true)}
        >
          Заявка на возврат
        </button>

        <div className="accordion" id="accordionReturn">

          <div className="accordion-item">
            <h2 className="accordion-header">
              <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="false" aria-controls="collapseOne">
                Причины возврата товара
              </button>
            </h2>
            <div id="collapseOne" className="accordion-collapse collapse">
              <div className="accordion-body">
                <div className="return-reasons">
                  <div className="return-reasons__head" aria-hidden="true">
                    <div className="return-reasons__cell return-reasons__cell--reason">Причина</div>
                    <div className="return-reasons__cell return-reasons__cell--description">Описание</div>
                    <div className="return-reasons__cell return-reasons__cell--deadline">Срок для оформления заявки</div>
                  </div>

                  <div className="return-reasons__row">
                    <div className="return-reasons__cell return-reasons__cell--reason">
                      <span className="return-reasons__label">Причина</span>
                      <div className="return-reasons__value">Товар повреждён при доставке</div>
                    </div>
                    <div className="return-reasons__cell return-reasons__cell--description">
                      <span className="return-reasons__label">Описание</span>
                      <div className="return-reasons__value">Вы обнаружили повреждение или деформацию товара при вскрытии посылки.</div>
                    </div>
                    <div className="return-reasons__cell return-reasons__cell--deadline">
                      <span className="return-reasons__label">Срок для оформления заявки</span>
                      <div className="return-reasons__value">1–3 дня.</div>
                    </div>
                  </div>

                  <div className="return-reasons__row">
                    <div className="return-reasons__cell return-reasons__cell--reason">
                      <span className="return-reasons__label">Причина</span>
                      <div className="return-reasons__value">Привезли не тот товар</div>
                    </div>
                    <div className="return-reasons__cell return-reasons__cell--description">
                      <span className="return-reasons__label">Описание</span>
                      <div className="return-reasons__value">Привезли не тот товар, модель или цвет.</div>
                    </div>
                    <div className="return-reasons__cell return-reasons__cell--deadline">
                      <span className="return-reasons__label">Срок для оформления заявки</span>
                      <div className="return-reasons__value">1–3 дня.</div>
                    </div>
                  </div>

                  <div className="return-reasons__row">
                    <div className="return-reasons__cell return-reasons__cell--reason">
                      <span className="return-reasons__label">Причина</span>
                      <div className="return-reasons__value">Проблемы с качеством товара</div>
                    </div>
                    <div className="return-reasons__cell return-reasons__cell--description">
                      <span className="return-reasons__label">Описание</span>
                      <div className="return-reasons__value">
                        <p>Есть претензии к качеству товара:</p>
                        <ul>
                          <li>видимые повреждения;</li>
                          <li>нет части товара или комплекта;</li>
                          <li>товар не работает или работает плохо;</li>
                        </ul>
                      </div>
                    </div>
                    <div className="return-reasons__cell return-reasons__cell--deadline">
                      <span className="return-reasons__label">Срок для оформления заявки</span>
                      <div className="return-reasons__value">От 7 до 21 дня.</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="accordion-item">
            <h2 className="accordion-header">
              <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                Как подать заявку на возврат
              </button>
            </h2>
            <div id="collapseTwo" className="accordion-collapse collapse">
              <div className="accordion-body">
                <div className="returns-text">
                  <p>Заполните заявку любым удобным способом:</p>
                  <ul>
                    <li>На сайте в <a href="/profile/returns/">личном кабинете.</a></li>
                    <li>Приложите фото, подтверждающее наличие дефекта.</li>
                    <li>Напишите в <a href="#" onClick={(e) => { e.preventDefault(); window.jivo_api?.open(); }}>чат</a></li>
                    <li>Позвоните по телефону горячей линии <a href="tel:+375 44 579-44-44">+375 44 579-44-44.</a></li>
                  </ul>
                  <p>После рассмотрения заявки в течение 1–2 рабочих дней вы получите подтверждение возврата и:</p>
                  <ul>
                    <li>Трек-номер возвратной накладной для оформления отправки;</li>
                    <li>Адрес для возврата (ПВЗ или склад в РБ);</li>
                    <li>Инструкцию по сдаче отправления в отделение Европочты;</li>
                    <li>Контакт поддержки на случай вопросов.</li>
                  </ul>
                  <p>Возвратная накладная формируется Продавцом. Вам будет сообщён только трек-номер, а сам ярлык распечатают сотрудники отделения Европочты при сдаче посылки.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="accordion-item">
            <h2 className="accordion-header">
              <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
                Подготовка товара
              </button>
            </h2>
            <div id="collapseThree" className="accordion-collapse collapse">
              <div className="accordion-body">
                <div className="returns-text">
                  <ul>
                    <li>Упакуйте товар в оригинальную упаковку (если сохранилась).</li>
                    <li>Приложите копию <a href="/profile/electronic-receipts">чека</a> или подтверждения заказа.</li>
                    <li>Убедитесь, что товар не был в употреблении и сохранён товарный вид.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="accordion-item">
            <h2 className="accordion-header">
              <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseFour" aria-expanded="false" aria-controls="collapseFour">
                Отправка возврата
              </button>
            </h2>
            <div id="collapseFour" className="accordion-collapse collapse">
              <div className="accordion-body">
                <div className="returns-text">
                  <p>Отнесите посылку в ближайшее отделение:</p>
                  <ul>
                    <li>Европочты;</li>
                    <li>Или сдайте на наш склад (по согласованию) по адресу г.Минск, 2-й переулок Кольцова, д.60.</li>
                  </ul>
                  <p>Назовите сотруднику трек-номер, который вы получили от Продавца. Сотрудник распечатает ярлык и оформит отправку. Сохраните чек об отправке с трек-номером.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="accordion-item">
            <h2 className="accordion-header">
              <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseFive" aria-expanded="false" aria-controls="collapseFive">
                Проверка и возврат средств
              </button>
            </h2>
            <div id="collapseFive" className="accordion-collapse collapse">
              <div className="accordion-body">
                <div className="returns-text">
                  <p>После получения и проверки возврата (в течение 5 рабочих дней) мы уведомим вас по email.</p>
                  <p>Денежные средства будут возвращены в течение 3–7 рабочих дней на карту, с которой была произведена оплата, либо другим способом по договоренности.</p>
                  <p>Важно:</p>
                  <ul>
                    <li>Возврат товара надлежащего качества осуществляется за счёт покупателя.</li>
                    <li>В случае брака или ошибки в комплекте – пересылка за счёт Продавца.</li>
                    <li>Без трек-номера возврат не рассматривается.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      <ReturnOffcanvas
        isOpen={isOffcanvasOpen}
        onClose={() => setIsOffcanvasOpen(false)}
      />

    </ProfileLayout>
  );
}
