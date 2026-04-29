'use client';

// components/delivery/cards/PvzDetail.js

import { getCardTitle } from '@/hooks/usePvzData';

const PhoneIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M11.3332 14.6667C11.1065 14.6667 10.8798 14.6467 10.6532 14.6C9.64652 14.4 8.77318 14.06 7.79985 13.5067C5.65985 12.28 3.72652 10.3467 2.49318 8.2C1.93985 7.23333 1.59985 6.35333 1.39985 5.34667C1.12652 4.00667 1.68652 2.58 2.84652 1.63333C3.14652 1.38667 3.49318 1.29333 3.83318 1.35333C4.17318 1.42 4.46652 1.64 4.65318 1.98L5.19318 2.95333C5.65318 3.78 5.90652 4.24 5.85318 4.79333C5.79318 5.34667 5.45318 5.74 4.83318 6.45333L3.46652 8.02C4.55985 9.82 6.17985 11.4333 7.97985 12.5333L9.54652 11.1667C10.2598 10.5467 10.6532 10.2 11.2065 10.1467C11.7598 10.0867 12.2132 10.34 13.0465 10.8067L14.0199 11.3467C14.3599 11.5333 14.5799 11.8267 14.6465 12.1667C14.7132 12.5067 14.6132 12.86 14.3665 13.1533C13.5799 14.12 12.4598 14.6667 11.3332 14.6667Z" fill="#181818" />
  </svg>
);

const ClockIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M8.00016 14.6667C4.32683 14.6667 1.3335 11.6733 1.3335 8.00001C1.3335 4.32668 4.32683 1.33334 8.00016 1.33334C11.6735 1.33334 14.6668 4.32668 14.6668 8.00001C14.6668 11.6733 11.6735 14.6667 8.00016 14.6667ZM8.00016 2.26668C4.84016 2.26668 2.26683 4.84001 2.26683 8.00001C2.26683 11.16 4.84016 13.7333 8.00016 13.7333C11.1602 13.7333 13.7335 11.16 13.7335 8.00001C13.7335 4.84001 11.1602 2.26668 8.00016 2.26668Z" fill="#181818" />
    <path d="M9.24004 9.70666C9.12004 9.70666 9.00004 9.66 8.91337 9.57333L7.67337 8.33333C7.58671 8.24666 7.54004 8.12666 7.54004 8.00666V5.52666C7.54004 5.26666 7.74671 5.06 8.00671 5.06C8.26671 5.06 8.47337 5.26666 8.47337 5.52666V7.81333L9.58004 8.92C9.76004 9.1 9.76004 9.39333 9.58004 9.58C9.48671 9.67333 9.37337 9.71333 9.25337 9.71333L9.24004 9.70666Z" fill="#181818" />
  </svg>
);

function formatDate(dateStr) {
  if (!dateStr) return null;
  const date = new Date(dateStr);
  const day = date.getDate();
  const months = ['января','февраля','марта','апреля','мая','июня','июля','августа','сентября','октября','ноября','декабря'];
  return `${day} ${months[date.getMonth()]}`;
}

/**
 * PvzDetail — детальная карточка ПВЗ (после «Подробнее»)
 *
 * Props:
 *  - point       {object}   — данные ПВЗ
 *  - calcResult  {object}   — результат calculate
 *  - calcLoading {boolean}
 *  - onBack      {fn}
 *  - onSelect    {fn}
 */
export default function PvzDetail({ point, calcResult, calcLoading, onBack, onSelect }) {
  const delivery     = calcResult?.delivery;
  const isFree       = delivery?.free_delivery_eligible;
  const cost         = delivery?.total_delivery_price_byn || delivery?.delivery_price_byn;
  const deliveryDate = delivery?.delivery_date;
  const storageUntil = delivery?.storage_until;

  return (
    <>
      <div className="pvz-detail">
        <div className="pvz-detail__header">
          <h5 className="pvz-detail__title">{getCardTitle(point)}</h5>
          <button
            type="button"
            className="btn-close"
            onClick={onBack}
            aria-label="Назад"
          />
        </div>

        <div className="pvz-detail__info">
          {point.phone && (
            <div className="pvz-detail__row">
              <PhoneIcon />
              <span>{point.phone}</span>
            </div>
          )}
          {point.working_hours && (
            <div className="pvz-detail__row">
              <ClockIcon />
              <span>{point.working_hours}</span>
            </div>
          )}
        </div>

        {calcLoading && (
          <div className="pvz-detail__loading">Расчёт стоимости доставки...</div>
        )}

        {!calcLoading && calcResult && (
          <div className="pvz-detail__calc">
            <div className="pvz-detail__calc-row">
              <span className="pvz-detail__calc-label">Стоимость доставки</span>
              <span className="pvz-detail__calc-value">
                {isFree
                  ? <span className="text-success">бесплатно</span>
                  : cost ? `${cost} р.` : '—'
                }
              </span>
            </div>

            {deliveryDate && (
              <div className="pvz-detail__calc-row">
                <span className="pvz-detail__calc-label">Дата доставки</span>
                <span className="pvz-detail__calc-value">{formatDate(deliveryDate)}</span>
              </div>
            )}

            {storageUntil && (
              <div className="pvz-detail__calc-row">
                <span className="pvz-detail__calc-label">Хранение до</span>
                <span className="pvz-detail__calc-value">{formatDate(storageUntil)}</span>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="pvz-detail__footer">
        <button
          type="button"
          className="pvz-select-btn"
          onClick={onSelect}
          disabled={calcLoading}
        >
          Выбрать
        </button>
      </div>
    </>
  );
}