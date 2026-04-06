// components/ui/RangeDatePicker.js
'use client';

import { useState, useRef, useEffect } from 'react';
import './DatePicker.css';
import './RangeDatePicker.css';

const MONTHS_RU = [
  'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
  'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
];
const DAYS_RU = ['ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ', 'ВС'];

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year, month) {
  const d = new Date(year, month, 1).getDay();
  return d === 0 ? 6 : d - 1;
}

function formatDisplay(date) {
  if (!date) return '';
  const d = String(date.getDate()).padStart(2, '0');
  const m = String(date.getMonth() + 1).padStart(2, '0');
  return `${d}.${m}.${date.getFullYear()}`;
}

function formatISO(date) {
  if (!date) return '';
  const d = String(date.getDate()).padStart(2, '0');
  const m = String(date.getMonth() + 1).padStart(2, '0');
  return `${date.getFullYear()}-${m}-${d}`;
}

function parseISO(str) {
  if (!str) return null;
  const [y, m, d] = str.split('-').map(Number);
  if (!y || !m || !d) return null;
  return new Date(y, m - 1, d);
}

function isSameDay(a, b) {
  if (!a || !b) return false;
  return a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();
}

/**
 * RangeDatePicker
 *
 * Props:
 *   from        {string}   — ISO 'YYYY-MM-DD'
 *   to          {string}   — ISO 'YYYY-MM-DD'
 *   onChange    {function} — ({ from, to }) => void
 *   placeholder {string}
 */
export default function RangeDatePicker({
  from,
  to,
  onChange,
  placeholder = 'Выберите период',
}) {
  const fromDate = parseISO(from);
  const toDate = parseISO(to);

  const today = new Date();
  const [viewYear, setViewYear] = useState(fromDate?.getFullYear() ?? today.getFullYear());
  const [viewMonth, setViewMonth] = useState(fromDate?.getMonth() ?? today.getMonth());
  const [open, setOpen] = useState(false);
  const [yearPickerOpen, setYearPickerOpen] = useState(false);
  const [hoverDate, setHoverDate] = useState(null);

  const wrapRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    function handleClick(e) {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setOpen(false);
        setYearPickerOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  function prevMonth() {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  }

  function nextMonth() {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  }

  function handleSelect(day) {
    const clicked = new Date(viewYear, viewMonth, day);

    // Запрещаем будущие даты
    if (clicked > today) return;

    // Если нет from — ставим from
    if (!fromDate) {
      onChange?.({ from: formatISO(clicked), to: '' });
      return;
    }

    // Если есть from но нет to — ставим to
    if (fromDate && !toDate) {
      if (clicked < fromDate) {
        onChange?.({ from: formatISO(clicked), to: formatISO(fromDate) });
      } else {
        onChange?.({ from, to: formatISO(clicked) });
      }
      setOpen(false);
      return;
    }

    // Если оба выбраны — сбрасываем и начинаем заново
    onChange?.({ from: formatISO(clicked), to: '' });
  }

  function handleClear(e) {
    e.stopPropagation();
    onChange?.({ from: '', to: '' });
  }

  function buildCalendarGrid() {
    const firstDay = getFirstDayOfMonth(viewYear, viewMonth);
    const daysInMonth = getDaysInMonth(viewYear, viewMonth);
    const prevMonthDays = getDaysInMonth(
      viewMonth === 0 ? viewYear - 1 : viewYear,
      viewMonth === 0 ? 11 : viewMonth - 1
    );

    const cells = [];
    for (let i = firstDay - 1; i >= 0; i--) {
      cells.push({ day: prevMonthDays - i, current: false });
    }
    for (let d = 1; d <= daysInMonth; d++) {
      cells.push({ day: d, current: true });
    }
    const remaining = 42 - cells.length;
    for (let d = 1; d <= remaining; d++) {
      cells.push({ day: d, current: false });
    }
    return cells;
  }

  const cells = buildCalendarGrid();

  function getCellDate(day) {
    return new Date(viewYear, viewMonth, day);
  }

  function isStart(day) {
    return fromDate && isSameDay(getCellDate(day), fromDate);
  }

  function isEnd(day) {
    return toDate && isSameDay(getCellDate(day), toDate);
  }

  function isInRange(day) {
    const d = getCellDate(day);
    const end = toDate || (fromDate && hoverDate && hoverDate > fromDate ? hoverDate : null);
    if (!fromDate || !end) return false;
    return d > fromDate && d < end;
  }

  function isToday(day) {
    return isSameDay(getCellDate(day), today);
  }

  // Строка для инпута
  let displayValue = '';
  if (fromDate && toDate) {
    displayValue = `${formatDisplay(fromDate)}  -  ${formatDisplay(toDate)}`;
  } else if (fromDate) {
    displayValue = `${formatDisplay(fromDate)}  -  ...`;
  }

  return (
    <div className="rdp-wrap" ref={wrapRef}>
      {/* Инпут */}
      <div
        className={`rdp-input ${open ? 'rdp-input--open' : ''}`}
        onClick={() => setOpen(o => !o)}
      >
        <span className="rdp-input__text">
          {displayValue || <span className="rdp-input__placeholder">{placeholder}</span>}
        </span>
        <span className="rdp-input__icon">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M21.0701 10.14C21.0701 10.14 21.0601 10.1 21.0601 10.08C21.0201 7.63 20.8201 6.2 19.7801 5.16C18.9801 4.36 17.9601 4.05 16.4201 3.94V2.7C16.4201 2.31 16.1101 2 15.7201 2C15.3301 2 15.0201 2.31 15.0201 2.7V3.88C14.3901 3.87 13.7101 3.87 12.9301 3.87H11.0701C10.2901 3.87 9.61005 3.87 8.98005 3.88V2.7C8.98005 2.31 8.67005 2 8.28005 2C7.89005 2 7.58005 2.31 7.58005 2.7V3.94C6.04005 4.06 5.02005 4.36 4.22005 5.16C3.18005 6.2 2.98005 7.63 2.94005 10.08C2.94005 10.1 2.93005 10.12 2.93005 10.14C2.93005 10.16 2.93005 10.17 2.94005 10.19C2.94005 10.74 2.93005 11.33 2.93005 12V13.86C2.93005 17.56 2.93005 19.41 4.22005 20.71C5.51005 22 7.37005 22 11.0701 22H12.9301C16.6301 22 18.4801 22 19.7801 20.71C21.0701 19.42 21.0701 17.56 21.0701 13.86V12C21.0701 11.33 21.0701 10.75 21.0601 10.19C21.0601 10.17 21.0701 10.16 21.0701 10.14ZM19.6701 13.86C19.6701 17.17 19.6701 18.83 18.7801 19.72C17.9001 20.61 16.2301 20.61 12.9201 20.61H11.0601C7.75005 20.61 6.09005 20.61 5.20005 19.72C4.31005 18.84 4.31005 17.17 4.31005 13.86V12C4.31005 11.59 4.31005 11.2 4.31005 10.84H19.6601C19.6601 11.2 19.6601 11.59 19.6601 12V13.86H19.6701Z" fill="#757575"/>
          </svg>
        </span>
      </div>

      {/* Дропдаун */}
      {open && (
        <div className="rdp-dropdown">

          {/* Шапка */}
          <div className="datepicker-header">
            <button
              type="button"
              className="datepicker-nav"
              onClick={e => { e.stopPropagation(); if (!yearPickerOpen) prevMonth(); }}
            >
              <svg width="8" height="14" viewBox="0 0 8 14" fill="none">
                <path d="M7 1L1 7L7 13" stroke="#181818" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>

            <button
              type="button"
              className="datepicker-title--btn"
              onClick={e => { e.stopPropagation(); setYearPickerOpen(v => !v); }}
            >
              {MONTHS_RU[viewMonth]} {viewYear}
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ marginLeft: 4 }}>
                <path d={yearPickerOpen ? "M2 8L6 4L10 8" : "M2 4L6 8L10 4"} stroke="#757575" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>

            <button
              type="button"
              className="datepicker-nav"
              onClick={e => { e.stopPropagation(); if (!yearPickerOpen) nextMonth(); }}
            >
              <svg width="8" height="14" viewBox="0 0 8 14" fill="none">
                <path d="M1 1L7 7L1 13" stroke="#181818" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>

          {/* Выбор года */}
          {yearPickerOpen && (
            <div className="datepicker-year-grid">
              {Array.from({ length: 100 }, (_, i) => today.getFullYear() - 99 + i).reverse().map(year => (
                <button
                  key={year}
                  type="button"
                  className={`datepicker-year ${year === viewYear ? 'datepicker-year--selected' : ''}`}
                  onClick={e => { e.stopPropagation(); setViewYear(year); setYearPickerOpen(false); }}
                >
                  {year}
                </button>
              ))}
            </div>
          )}

          {/* Дни недели */}
          {!yearPickerOpen && (
            <div className="datepicker-weekdays">
              {DAYS_RU.map(d => (
                <span key={d} className="datepicker-weekday">{d}</span>
              ))}
            </div>
          )}

          {/* Сетка дней */}
          {!yearPickerOpen && (
            <div className="datepicker-grid">
              {cells.map((cell, idx) => {
                if (!cell.current) {
                  return (
                    <div key={idx} className="datepicker-day datepicker-day--other">
                      {cell.day}
                    </div>
                  );
                }

                const isFuture = getCellDate(cell.day) > today;
                const start = isStart(cell.day);
                const end = isEnd(cell.day);
                const inRange = isInRange(cell.day);
                const tod = isToday(cell.day);

                return (
                  <div
                    key={idx}
                    className={[
                      'rdp-cell',
                      start ? 'rdp-cell--start' : '',
                      end ? 'rdp-cell--end' : '',
                      inRange ? 'rdp-cell--in-range' : '',
                    ].filter(Boolean).join(' ')}
                    onMouseEnter={() => !isFuture && fromDate && !toDate && setHoverDate(getCellDate(cell.day))}
                    onMouseLeave={() => setHoverDate(null)}
                  >
                    <button
                      type="button"
                      className={[
                        'datepicker-day',
                        isFuture ? 'datepicker-day--other' : '',
                        start || end ? 'datepicker-day--selected' : '',
                        tod && !start && !end ? 'datepicker-day--today' : '',
                        inRange ? 'rdp-day--in-range' : '',
                      ].filter(Boolean).join(' ')}
                      onClick={e => { e.stopPropagation(); handleSelect(cell.day); }}
                      disabled={isFuture}
                    >
                      {cell.day}
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {/* Футер */}
          {!yearPickerOpen && (
            <div className="datepicker-footer">
              <button type="button" className="datepicker-clear" onClick={handleClear}>
                Очистить
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}