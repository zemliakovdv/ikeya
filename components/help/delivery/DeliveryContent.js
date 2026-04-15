// components/help/delivery/DeliveryContent.js
import Link from 'next/link';

const STEPS = [
  {
    image: '/assets/img/help/delivery/step-1.png',
    title: 'Шаг 1. Заказ и выкуп',
    desc: 'Мы выкупаем выбранные вами товары через нашу польскую компанию.',
  },
  {
    image: '/assets/img/help/delivery/step-2.png',
    title: 'Шаг 2. Таможенное оформление',
    desc: 'Все товары проходят оформление у официального таможенного брокера (по публичной оферте).',
  },
  {
    image: '/assets/img/help/delivery/step-3.png',
    title: 'Шаг 3. Доставка по Беларуси',
    desc: <>После таможни заказ передаётся нашим партнёрам: <strong>Автолайт (вес заказа до 50 кг)</strong> и <strong>Европочта (вес заказа до 31 кг)</strong>.</>,
  },
];

const TERMS = [
  {
    image: '/assets/img/help/delivery/terms-1.png',
    label: 'Наличия товара на складе',
  },
  {
    image: '/assets/img/help/delivery/terms-2.png',
    label: 'Времени оформления заказа',
  },
  {
    image: '/assets/img/help/delivery/terms-3.png',
    label: 'Ситуации на границе',
  },
];

export default function DeliveryContent() {
  return (
    <div className="help-content__inner help-article">

      <h1>Доставка</h1>
      <p className="help-article__lead">
        Мы знаем, как важно, чтобы заказ приехал вовремя и без хлопот. Поэтому мы организовали простую и прозрачную схему доставки: от покупки в Европе до получения в Беларуси.
      </p>

      {/* Этапы доставки */}
      <h2 className="help-section__title">Этапы доставки</h2>
      <div className="help-cards">
        {STEPS.map((step, index) => (
          <div key={index} className="help-card">
            <div className="help-card__img">
              {/* TODO: иконка этапа */}
              <img src={step.image} alt={step.title} />
            </div>
            <p className="help-card__title">{step.title}</p>
            <p className="help-card__desc">{step.desc}</p>
          </div>
        ))}
      </div>

      <p className="help-article__note">
        Забрать заказ можно в ПВЗ партнёров или со склада IKEYA в Минске.{' '}
        <Link href="/pvz">Перейти к ПВЗ</Link>
      </p>

      {/* Дополнительная опция */}
      <h2 className="help-section__title">Дополнительная опция</h2>
      <p>
        Хотите ещё удобнее? Закажите доставку <strong>до подъезда в радиусе 25 км от МКАД</strong>. Услуга оплачивается отдельно.{' '}
        <Link href="/services">Перейти к услугам</Link>
      </p>

      {/* Сроки доставки */}
      <h2 className="help-section__title">Сроки доставки</h2>
      <p>Мы делаем всё, чтобы заказы приходили как можно быстрее. Но сроки могут зависеть от:</p>
      <div className="help-cards">
        {TERMS.map((term, index) => (
          <div key={index} className="help-card help-card--simple">
            <div className="help-card__img">
              {/* TODO: иконка фактора */}
              <img src={term.image} alt={term.label} />
            </div>
            <p className="help-card__title">{term.label}</p>
          </div>
        ))}
      </div>

      <p>Мы отвечаем за каждый этап доставки, чтобы ваш заказ приехал безопасно и вовремя.</p>

      <Link href="/catalog" className="btn btn-primary help-return-btn">
        Перейти к покупкам
      </Link>

      {/* Блок поддержки */}
      <div className="help-support">
        <div className="help-support__icon">
          {/* TODO: иконка поддержки */}
          <img src="/assets/img/help/delivery/support.png" alt="Поддержка" />
        </div>
        <div className="help-support__text">
          <p><strong>Остались вопросы?</strong></p>
          <p>Пишите в Telegram или на email: <strong>support@ikeya.by</strong></p>
          <a href="#" className="help-support__link">Перейти в чат-бот</a>
        </div>
      </div>

    </div>
  );
}