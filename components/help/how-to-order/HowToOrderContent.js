// components/help/how-to-order/HowToOrderContent.js

export default function HowToOrderContent() {
  return (
    <div className="help-content__inner help-article">

      <h1>Как сделать заказ</h1>
      <p className="help-article__lead">
        <a href="https://ikeya.by">ikeya.by</a> — это сервис заказа оригинальной продукции IKEA с доставкой из Европы в Республику Беларусь.
      </p>

      {/* Шаг 1 */}
      <div className="help-step">
        <p className="help-step__num">1. Выберите товары на сайте <a href="https://ikeya.by">ikeya.by</a> и добавьте их в корзину.</p>
        <div className="help-step__img">
          {/* TODO: скриншот карточек товаров с кнопкой "В корзину" */}
          <img src="/assets/img/help/how-to-order/step-1.jpg" alt="Выберите товары и добавьте в корзину" />
        </div>
      </div>

      {/* Шаг 2 */}
      <div className="help-step">
        <p className="help-step__num">2. Добавьте способ получения.</p>
        <div className="help-step__img">
          {/* TODO: скриншот блока выбора способа получения */}
          <img src="/assets/img/help/how-to-order/step-2.jpg" alt="Добавьте способ получения" />
        </div>
        <p className="help-step__note">
          При выборе пунктов выдачи будут доступны: склад Икеа в г. Минске, а также партнёрские ПВЗ в вашем городе.
        </p>
        <div className="help-step__img">
          {/* TODO: скриншот карты с пунктами выдачи */}
          <img src="/assets/img/help/how-to-order/step-2-map.png" alt="Карта пунктов выдачи" />
        </div>
      </div>

      {/* Шаг 3 */}
      <div className="help-step">
        <p className="help-step__num">3. Добавьте получателя.</p>
        <div className="help-step__img">
          {/* TODO: скриншот блока получателя */}
          <img src="/assets/img/help/how-to-order/step-3.png" alt="Добавьте получателя" />
        </div>
      </div>

      {/* Шаг 4 */}
      <div className="help-step">
        <p className="help-step__num">4. Укажите ФИО.</p>
        <div className="help-step__img">
          {/* TODO: скриншот формы личных данных */}
          <img src="/assets/img/help/how-to-order/step-4.png" alt="Укажите ФИО" />
        </div>
      </div>

      {/* Шаг 5 */}
      <div className="help-step">
        <p className="help-step__num">5. Далее перейдите к заполнению паспортных данных, которые требуются для таможенного оформления посылок.</p>
        <div className="help-step__img">
          {/* TODO: скриншот формы паспортных данных */}
          <img src="/assets/img/help/how-to-order/step-5.png" alt="Заполните паспортные данные" />
          <img src="/assets/img/help/how-to-order/step-5-1.png" alt="Заполните паспортные данные" />
        </div>
      </div>

      {/* Шаг 6 */}
      <div className="help-step">
        <p className="help-step__num">6. Нажмите оформить заказ для проверки заказа менеджером. В течение 30 минут с вами свяжется менеджер для подтверждения заказа. Отслеживайте статус заказа в <a href="/profile/orders">личном кабинете</a>, <strong>емейлах</strong> и <strong>мессенджерах</strong>.</p>
        <div className="help-step__img">
          {/* TODO: скриншот страницы успешного оформления заказа */}
          <img src="/assets/img/help/how-to-order/step-6.png" alt="Оформите заказ" />
        </div>
      </div>

      {/* Шаг 7 */}
      <div className="help-step">
        <p className="help-step__num">7. По факту успешного подтверждения заказа перейдите к оплате. На этапе Эквайринга выберите способ оплаты.</p>
        <div className="help-step__img">
          {/* TODO: скриншот способов оплаты */}
          <img src="/assets/img/help/how-to-order/step-7.png" alt="Выберите способ оплаты" />
        </div>
      </div>

      {/* Шаг 8 */}
      <div className="help-step">
        <p className="help-step__num">8. Сразу после оплаты Вы получите электронную квитанцию и ссылки на оферту ikeya.by и оферту таможенного представителя.</p>
      </div>

      {/* Шаг 9 */}
      <div className="help-step">
        <p className="help-step__num">9. Отслеживайте статус приобретённых заказов Вы можете в <a href="/profile/orders">личном кабинете</a> и в сообщениях на <strong>e-mail</strong>, <strong>мессенджерах</strong>.</p>
        <div className="help-step__img">
          {/* TODO: скриншот личного кабинета с заказами */}
          <img src="/assets/img/help/how-to-order/step-9.png" alt="Отслеживайте статус заказа" />
        </div>
      </div>

    </div>
  );
}