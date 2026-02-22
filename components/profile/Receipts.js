// components/profile/Receipts.js
'use client';

import { useRouter } from 'next/navigation';

// Группируем чеки по году
function groupByYear(receipts) {
  const groups = {};
  receipts.forEach((item) => {
    const year = new Date(item.purchased_at).getFullYear();
    if (!groups[year]) groups[year] = [];
    groups[year].push(item);
  });
  // Сортируем годы по убыванию
  return Object.entries(groups).sort(([a], [b]) => b - a);
}

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }) + ' в ' + d.toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function Receipts({ receipts = [] }) {
  const router = useRouter();

  if (receipts.length === 0) {
    return (
      <div className="content">
        <div className="empty">
          <div className="empty-illustration">
            <img src="/assets/img/profile/no-cheks.png" alt="" />
          </div>
          <div className="empty-title">У вас нет ни одного чека</div>
          <div className="empty-text">
            Когда появятся, будут отображаться здесь.
          </div>
          <button className="empty-btn" onClick={() => router.push('/')}>
            Перейти к покупкам
          </button>
        </div>
      </div>
    );
  }

  const grouped = groupByYear(receipts);

  return (
    <div className="content">
      {/* Датапикер — пока только UI, без фильтрации */}
      <div className="filter">
        <div className="date-picker-wrapper">
          <div className="date-picker-input">
            <input
              type="text"
              id="dateRangePicker"
              placeholder="Выберите период"
              readOnly
            />
            <svg className="calendar-icon" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15.8025 7.605C15.8025 7.605 15.795 7.575 15.795 7.56C15.765 5.7225 15.615 4.65 14.835 3.87C14.235 3.27 13.47 3.0375 12.315 2.955V2.025C12.315 1.7325 12.0825 1.5 11.79 1.5C11.4975 1.5 11.265 1.7325 11.265 2.025V2.91C10.7925 2.9025 10.2825 2.9025 9.69751 2.9025H8.30251C7.71751 2.9025 7.20751 2.9025 6.73501 2.91V2.025C6.73501 1.7325 6.50251 1.5 6.21001 1.5C5.91751 1.5 5.68501 1.7325 5.68501 2.025V2.955C4.53001 3.045 3.76501 3.27 3.16501 3.87C2.38501 4.65 2.23501 5.7225 2.20501 7.56C2.20501 7.575 2.19751 7.59 2.19751 7.605C2.19751 7.62 2.19751 7.6275 2.20501 7.6425C2.20501 8.055 2.19751 8.4975 2.19751 9V10.395C2.19751 13.17 2.19751 14.5575 3.16501 15.5325C4.13251 16.5 5.52751 16.5 8.30251 16.5H9.69751C12.4725 16.5 13.86 16.5 14.835 15.5325C15.8025 14.565 15.8025 13.17 15.8025 10.395V9C15.8025 8.4975 15.8025 8.0625 15.795 7.6425C15.795 7.6275 15.8025 7.62 15.8025 7.605Z" fill="#757575" />
            </svg>
          </div>
        </div>
      </div>

      <div className="receiprs-download">
        {grouped.map(([year, items]) => (
          <div key={year}>
            <div className="year">{year} г.</div>

            {items.map((item) =>
              // Один заказ может иметь несколько файлов чеков
              item.receipts.map((file, fileIdx) => (
                <div key={`${item.order_id}-${fileIdx}`} className="receipt">
                  <a href={`/profile/orders`}>Заказ № {item.order_id}</a>
                  <div className="receipt-date">{formatDate(item.purchased_at)}</div>
                  <button
                    className="receipt-btn"
                    onClick={() => window.open(file.url, '_blank')}
                  >
                    Скачать
                  </button>
                </div>
              ))
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
