// components/help/returns/ReturnsContent.js
'use client';

import { useState } from 'react';
import Link from 'next/link';
import ReturnOffcanvas from '@/components/profile/ReturnOffcanvas';

const SECTIONS = [
  {
    id: 'reasons',
    title: 'Причины возврата товара',
    content: (
      <div style={{ overflowX: 'auto' }}>
      <table className="help-table">
        <thead>
          <tr>
            <th>Причина</th>
            <th>Описание</th>
            <th>Срок для оформления заявки</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Товар повреждён при доставке</strong></td>
            <td>Вы обнаружили повреждение или деформацию товара при вскрытии посылки.</td>
            <td>1–3 дня.</td>
          </tr>
          <tr>
            <td><strong>Привезли не тот товар</strong></td>
            <td>Привезли не тот товар, модель или цвет.</td>
            <td>1–3 дня.</td>
          </tr>
          <tr>
            <td><strong>Проблемы с качеством товара</strong></td>
            <td>
              Есть претензии к качеству товара:
              <ul>
                <li>видимые повреждения;</li>
                <li>нет части товара или комплекта;</li>
                <li>товар не работает или работает плохо;</li>
              </ul>
            </td>
            <td>От 7 до 21 дня.</td>
          </tr>
        </tbody>
      </table>
      </div>
    ),
  },
  {
    id: 'how',
    title: 'Как подать заявку на возврат',
    content: (
      <>
        <p>Заполните заявку любым удобным способом:</p>
        <ul>
          <li>На сайте в <Link href="/profile/orders">личном кабинете</Link>.</li>
          <li>Приложите фото, подтверждающее наличие дефекта.</li>
          <li>Напишите в <a href="#">чат</a></li>
          <li>Позвоните по телефону горячей линии <a href="tel:2626">2626</a>.</li>
        </ul>
        <p>После рассмотрения заявки в течение 1–2 рабочих дней вы получите подтверждение возврата и:</p>
        <ul>
          <li>Трек-номер возвратной накладной для оформления отправки;</li>
          <li>Адрес для возврата (ПВЗ или склад в РБ);</li>
          <li>Инструкцию по сдаче отправления в отделение Европочты / Белпочты;</li>
          <li>Контакт поддержки на случай вопросов.</li>
        </ul>
        <p>Возвратная накладная формируется Продавцом. Вам будет сообщён только трек-номер, а сам ярлык распечатают сотрудники отделения Европочты, Autolight или Белпочты при сдаче посылки.</p>
      </>
    ),
  },
  {
    id: 'prepare',
    title: 'Подготовка товара',
    content: (
      <ul>
        <li>Упакуйте товар в оригинальную упаковку (если сохранилась).</li>
        <li>Приложите копию <a href="#">чека</a> или подтверждения заказа.</li>
        <li>Убедитесь, что товар не был в употреблении и сохранён товарный вид.</li>
      </ul>
    ),
  },
  {
    id: 'send',
    title: 'Отправка возврата',
    content: (
      <>
        <p>Отнесите посылку в ближайшее отделение:</p>
        <ul>
          <li>Европочты;</li>
          <li>Или сдайте на наш склад (по согласованию).</li>
        </ul>
        <p>Назовите сотруднику трек-номер, который вы получили от Продавца. Сотрудник распечатает ярлык и оформит отправку. Сохраните чек об отправке с трек-номером.</p>
      </>
    ),
  },
  {
    id: 'refund',
    title: 'Проверка и возврат средств',
    content: (
      <>
        <p>После получения и проверки возврата (в течение 5 рабочих дней) мы уведомим вас по email.</p>
        <p>Денежные средства будут возвращены в течение 3–7 рабочих дней на карту, с которой была произведена оплата, либо другим способом по договорённости.</p>
        <p>Важно:</p>
        <ul>
          <li>Возврат товара надлежащего качества осуществляется за счёт покупателя.</li>
          <li>В случае брака или ошибки в комплекте – пересылка за счёт Продавца.</li>
          <li>Без трек-номера возврат не рассматривается.</li>
        </ul>
      </>
    ),
  },
];

export default function ReturnsContent() {
  const [openSections, setOpenSections] = useState(SECTIONS.map(() => true));
  const [returnOpen, setReturnOpen] = useState(false);

  const toggle = (index) => {
    setOpenSections(prev => prev.map((val, i) => i === index ? !val : val));
  };

  return (
    <div className="help-content__inner">

      {/* Кнопка заявки на возврат */}
      <button
        className="btn btn-primary help-return-btn"
        type="button"
        onClick={() => setReturnOpen(true)}
      >
        Заявка на возврат
      </button>

      {/* Аккордеон */}
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

      {/* Offcanvas заявки на возврат */}
      <ReturnOffcanvas isOpen={returnOpen} onClose={() => setReturnOpen(false)} />
    </div>
  );
}