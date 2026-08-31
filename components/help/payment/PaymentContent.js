// components/help/payment/PaymentContent.js
'use client';

import { useState } from 'react';

const CARD_LOGOS = [
  { src: '/assets/img/help/payment/visa.png', alt: 'Visa' },
  { src: '/assets/img/help/payment/mastercard.png', alt: 'Mastercard' },
  { src: '/assets/img/help/payment/belkart.png', alt: 'БЕЛКАРТ' },
];

const WEBPAY_LOGOS = [
  { src: '/assets/img/help/payment/webpay.png', alt: 'WebPay' },
  { src: '/assets/img/help/payment/visa-secure.png', alt: 'Visa Secure' },
  { src: '/assets/img/help/payment/mastercard-id-check.png', alt: 'Mastercard ID Check' },
  { src: '/assets/img/help/payment/belkart-internet-parol.png', alt: 'БЕЛКАРТ Интернет Пароль' },
];

function LogoRow({ logos }) {
  return (
    <div className="help-payment__logos">
      {logos.map((logo) => (
        <img key={logo.src} src={logo.src} alt={logo.alt} />
      ))}
    </div>
  );
}

const SECTIONS = [
  {
    id: 'card',
    title: 'Банковская карта',
    content: (
      <>
        <p>
          Оплата банковской картой — быстрый и безопасный способ оплаты товара (услуги)
          через систему{' '}
          <a href="https://www.webpay.by" target="_blank" rel="noopener noreferrer">
            WebPay
          </a>
          {' '}(<a href="https://www.webpay.by" target="_blank" rel="noopener noreferrer">www.webpay.by</a>).
          Мы принимаем карты Visa, Mastercard и БЕЛКАРТ. После успешной оплаты
          подтверждение придёт на указанный e-mail.
        </p>
        <p>Обратите внимание: карта должна быть подключена к системе 3-D Secure для подтверждения операций.</p>

        <LogoRow logos={CARD_LOGOS} />

        <h4>Оплата банковской картой VISA, MasterCard, БЕЛКАРТ через систему WebPay</h4>
        <ol>
          <li>Оплата производится через интернет в режиме реального времени непосредственно после оформления заказа.</li>
          <li>
            Для совершения финансовой операции подходят карточки международных платёжных систем VISA (всех видов),
            MasterCard (в том числе Maestro), эмитированные любым банком мира, а также карты платёжной системы БЕЛКАРТ.
          </li>
        </ol>

        <p>
          При выборе оплаты заказа с помощью банковской карты обработка платежа (включая ввод номера банковской карты)
          производится системой электронных платежей{' '}
          <a href="https://www.webpay.by" target="_blank" rel="noopener noreferrer">WebPay</a>.
          Интернет-магазин не получает и не хранит реквизиты вашей карты.
        </p>

        <LogoRow logos={WEBPAY_LOGOS} />

        <p>
          Безопасный сервер WEBPAY устанавливает шифрованное соединение по защищенному протоколу TLS
          и конфиденциально принимает от клиента данные его платёжной карты (номер карты, имя держателя,
          дату окончания действия, и контрольный номер банковской карточке CVC/CVC2).
        </p>
        <p>
          После совершения оплаты с использованием банковской карты необходимо сохранять полученные карт-чеки
          (подтверждения об оплате) для сверки с выпиской из карт-счёта (с целью подтверждения совершённых операций
          в случае возникновения спорных ситуаций).
        </p>
        <p>
          Образец документа, подтверждающего оплату товара (работ, услуг), в том числе в интернет-магазине
          (п. 11 ст. 7 Закона о защите прав потребителей):
        </p>
        <figure className="help-payment__receipt">
          <img
            src="/assets/img/help/payment/webpay-card-check-sample.png"
            alt="Образец карт-чека WebPay"
          />
          <figcaption>Образец карт-чека WebPay</figcaption>
        </figure>
        <p>
          В случае, если Вы не получили заказ (не оказана услуга), Вам необходимо обратиться в службу технической
          поддержки по телефону{' '}
          <a href="tel:+375445794444">+375 44 579 44 44</a>
          {' '}или e-mail{' '}
          <a href="mailto:info@ikeya.by">info@ikeya.by</a>.
          Менеджеры Вас проконсультируют.
        </p>
        <p>
          При оплате банковской платежной картой возврат денежных средств осуществляется на карточку,
          с которой была произведена оплата.
        </p>

        <p>Порядок оплаты:</p>
        <ol>
          <li>Выбрать способ оплаты картой онлайн.</li>
          <li>
            После подтверждения заказа система направит вас на защищённую платёжную страницу WebPay.
            Авторизационный сервер устанавливает с покупателем соединение по защищённому протоколу TLS
            и принимает параметры банковской карты. Операция оплаты банковской картой онлайн полностью
            конфиденциальна и безопасна.
          </li>
          <li>
            Ваши персональные данные и реквизиты карточки вводятся не на странице нашего сайта,
            а на авторизационной странице платёжной системы. Применяются технологии безопасных
            интернет-платежей Visa Secure, Mastercard ID Check и БЕЛКАРТ-ИнтернетПароль.
          </li>
        </ol>

        <p>
          К оплате принимаются карты платёжных систем Visa, MasterCard и БЕЛКАРТ.
          Мы рекомендуем заранее обратиться в свой банк, чтобы удостовериться в том,
          что ваша карта может быть использована для платежей в сети интернет.
        </p>

        <p><strong>Причины отказа в авторизации могут быть следующими:</strong></p>
        <ul>
          <li>на карте недостаточно средств для оплаты заказа;</li>
          <li>банк, выпустивший карточку покупателя, установил запрет на оплату в интернете;</li>
          <li>истекло время ожидания ввода данных банковской карты;</li>
          <li>введённые данные не были подтверждены вами на платёжной странице, ошибка формата данных и т.д.</li>
        </ul>

        <p><strong>В зависимости от причины отказа в авторизации для решения вопроса вы можете:</strong></p>
        <ul>
          <li>обратиться за разъяснениями в банк, выпустивший карточку покупателя;</li>
          <li>в случае невозможности решения проблемы банком — повторить попытку оплаты, воспользовавшись картой, выпущенной другим банком.</li>
        </ul>
      </>
    ),
  },
  {
    id: 'erip',
    title: 'ЕРИП',
    content: (
      <>
        <p>Оплата через систему ЕРИП — удобный способ для клиентов из Беларуси.</p>
        <p>
          Подключение приёма платежей через ЕРИП находится в процессе.
          Актуальный путь в дереве ЕРИП будет опубликован на этой странице после подключения услуги.
        </p>
        <p>
          Сейчас оплатить заказ можно банковской картой через систему{' '}
          <a href="https://www.webpay.by" target="_blank" rel="noopener noreferrer">WebPay</a>.
        </p>
      </>
    ),
  },
];

export default function PaymentContent() {
  const [openSections, setOpenSections] = useState(SECTIONS.map(() => true));

  const toggle = (index) => {
    setOpenSections(prev => prev.map((val, i) => i === index ? !val : val));
  };

  return (
    <div className="help-content__inner help-article">
      <h1>Способ оплаты</h1>
      <p className="help-article__lead">
        Мы предлагаем удобные способы оплаты заказов. Выберите подходящий вариант, чтобы ознакомиться с подробной информацией.
      </p>

      {SECTIONS.map((section, index) => (
        <div key={section.id} className="help-accordion__item">
          <button
            className="help-accordion__header"
            type="button"
            onClick={() => toggle(index)}
          >
            <strong>{section.title}</strong>
            <svg
              width="16" height="16" viewBox="0 0 16 16" fill="none"
              style={{
                transform: openSections[index] ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.2s',
                flexShrink: 0,
              }}
            >
              <path d="M8 10.22C7.25 10.22 5.47 8.19 4.1 6.5C3.95 6.31 3.97 6.03 4.17 5.87C4.36 5.72 4.64 5.75 4.79 5.94C5.99 7.43 7.53 9.1 8 9.32C8.47 9.1 10.01 7.43 11.21 5.94C11.36 5.75 11.64 5.72 11.83 5.87C12.03 6.03 12.05 6.31 11.9 6.5C10.53 8.2 8.74 10.22 8 10.22Z" fill="#181818" />
            </svg>
          </button>
          {openSections[index] && (
            <div className="help-accordion__body">
              {section.content}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
