// components/help/customs/CustomsContent.js

const ERRORS = [
  {
    image: '/assets/img/help/customs/passport.png',
    title: 'Ввод номера паспорта',
    desc: <>В поле «Идентификационный номер» Вам нужен именно <strong>личный (идентификационный) номер</strong> из 14 символов (формат XXXXXXXXYXXXYYX, где X - цифры, Y – буквы)</>,
  },
  {
    image: '/assets/img/help/customs/language.png',
    title: 'Язык ввода',
    desc: <>При вводе букв личного номера используйте <strong>ТОЛЬКО ЗАГЛАВНЫЕ ЛАТИНСКИЕ</strong> (АНГЛИЙСКИЕ) БУКВЫ 4. Из-за ошибки в написании таможня просто не увидит ваш платёж</>,
  },
  {
    image: '/assets/img/help/customs/cheks.png',
    title: 'Требования к чеку',
    desc: <>В чеке, который вы отправляете менеджеру, <strong>обязательно</strong> должна быть видна <strong>дата оплаты</strong> и <strong>номер операции в ЕРИП</strong>. Без этой информации таможня чек <strong>НЕ ПРИМЕТ</strong></>,
  },
];

export default function CustomsContent() {
  return (
    <div className="help-content__inner help-article">

      <h1>Как быстро оплатить таможенную пошлину</h1>
      <p>
        Когда ваш заказ сформирован в Польше и готов к отправке в Беларусь, наша служба поддержки напишет вам в{' '}
        <strong>Telegram</strong> или <strong>WhatsApp</strong>
      </p>
      <ul>
        <li><strong>Что мы сообщим:</strong> «Ваш заказ выезжает. Ориентировочная пошлина составит _____Сумма». (Точная сумма формируется в день прибытия на таможню РБ).</li>
        <li><strong>Что нужно от вас:</strong> Быть на связи в день прибытия машины на таможню. Ваш заказ едет в одной большой партии, и <strong>неоплаченная пошлина задержит всю машину</strong> и заказы других клиентов</li>
      </ul>

      {/* Оплата на таможне */}
      <h2 className="help-section__title">Оплата на таможне</h2>
      <div className="help-cards help-cards--2col">
        <div className="help-card help-card--horizontal">
          <div className="help-card__img">
            {/* TODO: иконка квитанции */}
            <img src="/assets/img/help/customs/kvitancia.png" alt="Квитанция" />
          </div>
          <p className="help-card__desc">Как только машина въезжает в зону таможенного контроля, менеджер пришлёт вам в мессенджер <strong>персональную квитанцию-файл</strong> с итоговой суммой и вашими данными</p>
        </div>
        <div className="help-card help-card--horizontal">
          <div className="help-card__img">
            {/* TODO: иконка таймера */}
            <img src="/assets/img/help/customs/times.png" alt="Таймер" />
          </div>
          <p className="help-card__desc">У вас будет <strong>ровно 30 минут</strong>, чтобы совершить оплату и отправить чек (PDF или скриншот) менеджеру в ответном сообщении</p>
        </div>
      </div>

      {/* ЕРИП */}
      <h2 className="help-section__title">Как оплатить через систему ЕРИП (Инструкция)</h2>
      <p>Вам необходимо будет совершить <strong>две операции</strong> в дереве ЕРИП, так как в квитанции указаны два кода платежа.</p>

      <p><strong>Путь в дереве ЕРИП:</strong></p>
      <div className="help-erip-tree">
        <p>↳ Система «Расчет» (ЕРИП)</p>
        <p className="indent-1">↳ Таможенные платежи</p>
        <p className="indent-2">↳ Товары для личного пользования (физ. лица)</p>
        <p className="indent-3">↳ Задолженность, уплата без документа начисления</p>
        <p className="indent-4">↳ Лица с паспортом РБ (видом на жительство)</p>
      </div>

      <ul className="payment-instr">
        <li><strong>Платёж №1 Авансовый платёж:</strong> Выберите код <strong style={{ color: '#0058A3' }}>03135</strong> (сумма пошлины)</li>
        <li><strong>Платёж №2 (Таможенный сбор):</strong> Выберите код <strong style={{ color: '#0058A3' }}>02204</strong> (Таможенный сбор — 10.00 BYN)</li>
      </ul>

      {/* Частые ошибки */}
      <h2 className="help-section__title">Частые ошибки, которых нужно избежать!</h2>
      <div className="help-cards">
        {ERRORS.map((error, index) => (
          <div key={index} className="help-card">
            <div className="help-card__img">
              <img src={error.image} alt={error.title} />
            </div>
            <p className="help-card__title">{error.title}</p>
            <p className="help-card__desc">{error.desc}</p>
          </div>
        ))}
      </div>

      {/* Справочная информация */}
      <h2 className="help-section__title">Справочная информация: Реквизиты для оплаты через банк (если оплата не через ЕРИП)</h2>
      <ul className="help-lists__requisits">
        <li><strong>Бенефициар:</strong> Министерство финансов Республики Беларусь (УНП 100691903)</li>
        <li><strong>Фактический бенефициар:</strong> Минская центральная таможня (УНП 100420574)</li>
        <li><strong>Банк-получатель:</strong> Национальный банк Республики Беларусь, г. Минск (код NBRBBY2X)</li>
        <li><strong>Номер счета:</strong> BY12NBRB36009200000080000000 (белорусские рубли)</li>
        <li><strong>Код платежа:</strong> 02204 (таможенные сборы за товары для личного пользования)</li>
      </ul>

      {/* Нормы беспошлинного ввоза */}
      <h2 className="help-section__title">Нормы беспошлинного ввоза</h2>
      <table className="help-table">
        <thead>
          <tr>
            <th>Показатель</th>
            <th>Беспошлинный лимит</th>
            <th>Ставка при превышении</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Стоимость</td>
            <td>до 200 евро</td>
            <td>15% от суммы превышения</td>
          </tr>
          <tr>
            <td>Вес</td>
            <td>до 31 кг</td>
            <td>не менее 2 евро за 1 кг превышения</td>
          </tr>
        </tbody>
      </table>

      <p className="help-section__rules"><strong>Важное правило:</strong> Если превышены оба лимита (и вес, и стоимость), таможенная пошлина рассчитывается по обоим параметрам, но к оплате выбирается <strong>наибольшая</strong> из полученных сумм. Дополнительно всегда оплачивается таможенный сбор <strong>в размере 10 BYN</strong>.</p>

      {/* Законодательство */}
      <h2 className="help-section__title">Как быстро оплатить таможенную пошлину</h2>
      <p>Мы работаем в строгом соответствии с законодательством Республики Беларусь и Евразийского экономического союза.</p>
      <p><strong>Порядок перемещения товаров регулируется:</strong></p>
      <ul>
        <li><strong>Указом Президента Республики Беларусь № 360</strong> «О перемещении товаров для личного пользования».</li>
        <li><strong>Решением Совета Евразийской экономической комиссии № 107</strong> «О некоторых вопросах, связанных с товарами для личного пользования».</li>
        <li><strong>Указ № 297 и Постановление № 970:</strong> Обязывают проводить 100% рентген-досмотр всех входящих посылок для обеспечения безопасности (контроль ввоза беспилотных аппаратов и авиамоделей).</li>
        <li><strong>Государственный учет:</strong> Все данные о перемещении товаров IKEYA.BY интегрированы в информационную систему учета, за разработку которой отвечает национальный оператор РУП «БЕЛПОЧТА».</li>
      </ul>

    </div>
  );
}