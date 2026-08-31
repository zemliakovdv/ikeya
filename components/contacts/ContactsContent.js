'use client';

import { openJivoChat } from '@/components/FloatingChatButton';

export default function ContactsContent() {
  return (
    <div className="help-content__inner help-article contacts">
      <h1>Контакты</h1>
      <p className="help-article__lead">
        Служба поддержки IKEYA на связи ежедневно с 8:00 до 22:00. Интернет-магазин работает круглосуточно.
      </p>

      <div className="contacts__grid">
        <a href="tel:+375445794444" className="contacts__card">
          <span className="contacts__label">Телефон</span>
          <span className="contacts__value">+375 44 579 44 44</span>
          <span className="contacts__hint">Ежедневно с 8:00 до 22:00</span>
        </a>

        <a href="mailto:info@ikeya.by" className="contacts__card">
          <span className="contacts__label">Email</span>
          <span className="contacts__value">info@ikeya.by</span>
          <span className="contacts__hint">Ответим в рабочие часы поддержки</span>
        </a>

        <a
          href="https://t.me/ikeyaby"
          target="_blank"
          rel="noopener noreferrer"
          className="contacts__card"
        >
          <span className="contacts__label">Telegram</span>
          <span className="contacts__value">Чат-бот IKEYA</span>
          <span className="contacts__hint">t.me/ikeyaby</span>
        </a>

        <button type="button" className="contacts__card" onClick={openJivoChat}>
          <span className="contacts__label">Онлайн-чат</span>
          <span className="contacts__value">Написать в чат</span>
          <span className="contacts__hint">Откроется окно поддержки на сайте</span>
        </button>
      </div>

      <h2 className="help-section__title">Реквизиты</h2>
      <ul className="help-lists__requisits">
        <li>
          <strong>Организация:</strong> ООО «БелкаБокс»
        </li>
        <li>
          <strong>Юридический адрес:</strong> 220070, г. Минск, ул. Ваупшасова, д. 10, пом. 93, Республика Беларусь
        </li>
        <li>
          <strong>УНП:</strong> 193748031
        </li>
        <li>
          <strong>Режим работы интернет-магазина:</strong> круглосуточно, без выходных
        </li>
        <li>
          <strong>Служба поддержки:</strong> ежедневно с 8:00 до 22:00
        </li>
      </ul>

      <p className="help-article__note">
        Пункты выдачи заказов — на странице <a href="/pvz">ПВЗ</a>.
      </p>
    </div>
  );
}
