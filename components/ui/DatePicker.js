// components/ui/DatePicker.js
'use client';

import { useState, useRef, useEffect } from 'react';
import './DatePicker.css';

const MONTHS_RU = [
    'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
    'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
];
const DAYS_RU = ['ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ', 'ВС'];

function getDaysInMonth(year, month) {
    return new Date(year, month + 1, 0).getDate();
}

// Возвращает день недели (0=ПН ... 6=ВС)
function getFirstDayOfMonth(year, month) {
    const d = new Date(year, month, 1).getDay();
    return d === 0 ? 6 : d - 1;
}

// Форматирует Date → 'DD.MM.YYYY'
function formatDisplay(date) {
    if (!date) return '';
    const d = String(date.getDate()).padStart(2, '0');
    const m = String(date.getMonth() + 1).padStart(2, '0');
    return `${d}.${m}.${date.getFullYear()}`;
}

// Форматирует Date → 'YYYY-MM-DD' (для API)
function formatISO(date) {
    if (!date) return '';
    const d = String(date.getDate()).padStart(2, '0');
    const m = String(date.getMonth() + 1).padStart(2, '0');
    return `${date.getFullYear()}-${m}-${d}`;
}

// Парсит 'YYYY-MM-DD' → Date
function parseISO(str) {
    if (!str) return null;
    const [y, m, d] = str.split('-').map(Number);
    if (!y || !m || !d) return null;
    return new Date(y, m - 1, d);
}

/**
 * DatePicker
 *
 * Props:
 *   value       {string}   — ISO дата 'YYYY-MM-DD'
 *   onChange    {function} — (isoString) => void
 *   placeholder {string}
 *   required    {boolean}
 *   disabled    {boolean}
 *   label       {string}   — floating label текст
 */
export default function DatePicker({
    value,
    onChange,
    placeholder = 'Выберите дату',
    required = false,
    disabled = false,
    label,
}) {
    const selected = parseISO(value);

    const today = new Date();
    const [viewYear, setViewYear] = useState(selected?.getFullYear() ?? today.getFullYear());
    const [viewMonth, setViewMonth] = useState(selected?.getMonth() ?? today.getMonth());
    const [open, setOpen] = useState(false);

    const wrapRef = useRef(null);

    // Закрываем по клику снаружи
    useEffect(() => {
        if (!open) return;
        function handleClick(e) {
            if (wrapRef.current && !wrapRef.current.contains(e.target)) {
                setOpen(false);
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

    function handleSelect(day, isCurrentMonth) {
        if (!isCurrentMonth) return;
        const date = new Date(viewYear, viewMonth, day);
        onChange?.(formatISO(date));
        setOpen(false);
    }

    function handleClear(e) {
        e.stopPropagation();
        onChange?.('');
    }

    // Строим сетку дней
    function buildCalendarGrid() {
        const firstDay = getFirstDayOfMonth(viewYear, viewMonth);
        const daysInMonth = getDaysInMonth(viewYear, viewMonth);

        // Дни предыдущего месяца
        const prevMonthDays = getDaysInMonth(
            viewMonth === 0 ? viewYear - 1 : viewYear,
            viewMonth === 0 ? 11 : viewMonth - 1
        );

        const cells = [];

        // Заполняем начало сетки днями пред. месяца
        for (let i = firstDay - 1; i >= 0; i--) {
            cells.push({ day: prevMonthDays - i, current: false, next: false });
        }

        // Дни текущего месяца
        for (let d = 1; d <= daysInMonth; d++) {
            cells.push({ day: d, current: true, next: false });
        }

        // Заполняем конец сетки днями след. месяца
        const remaining = 42 - cells.length; // 6 строк × 7 дней
        for (let d = 1; d <= remaining; d++) {
            cells.push({ day: d, current: false, next: true });
        }

        return cells;
    }

    const cells = buildCalendarGrid();

    const isSelected = (day) => {
        if (!selected) return false;
        return (
            selected.getDate() === day &&
            selected.getMonth() === viewMonth &&
            selected.getFullYear() === viewYear
        );
    };

    const isToday = (day) => {
        return (
            today.getDate() === day &&
            today.getMonth() === viewMonth &&
            today.getFullYear() === viewYear
        );
    };

    const displayValue = selected ? formatDisplay(selected) : '';

    return (
        <div className="datepicker-wrap" ref={wrapRef}>
            {/* Инпут */}
            <div
                className={`datepicker-input form-floating ${open ? 'datepicker-input--open' : ''}`}
                onClick={() => !disabled && setOpen(o => !o)}
            >
                <input
                    type="text"
                    className="form-control"
                    placeholder={placeholder}
                    value={displayValue}
                    readOnly
                    required={required}
                    disabled={disabled}
                    style={{ cursor: disabled ? 'default' : 'pointer' }}
                />
                {label && <label>{label}{required && <span className="req"> *</span>}</label>}
                <span className="datepicker-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M21.0701 10.14C21.0701 10.14 21.0601 10.1 21.0601 10.08C21.0201 7.63 20.8201 6.2 19.7801 5.16C18.9801 4.36 17.9601 4.05 16.4201 3.94V2.7C16.4201 2.31 16.1101 2 15.7201 2C15.3301 2 15.0201 2.31 15.0201 2.7V3.88C14.3901 3.87 13.7101 3.87 12.9301 3.87H11.0701C10.2901 3.87 9.61005 3.87 8.98005 3.88V2.7C8.98005 2.31 8.67005 2 8.28005 2C7.89005 2 7.58005 2.31 7.58005 2.7V3.94C6.04005 4.06 5.02005 4.36 4.22005 5.16C3.18005 6.2 2.98005 7.63 2.94005 10.08C2.94005 10.1 2.93005 10.12 2.93005 10.14C2.93005 10.16 2.93005 10.17 2.94005 10.19C2.94005 10.74 2.93005 11.33 2.93005 12V13.86C2.93005 17.56 2.93005 19.41 4.22005 20.71C5.51005 22 7.37005 22 11.0701 22H12.9301C16.6301 22 18.4801 22 19.7801 20.71C21.0701 19.42 21.0701 17.56 21.0701 13.86V12C21.0701 11.33 21.0701 10.75 21.0601 10.19C21.0601 10.17 21.0701 10.16 21.0701 10.14ZM19.6701 13.86C19.6701 17.17 19.6701 18.83 18.7801 19.72C17.9001 20.61 16.2301 20.61 12.9201 20.61H11.0601C7.75005 20.61 6.09005 20.61 5.20005 19.72C4.31005 18.84 4.31005 17.17 4.31005 13.86V12C4.31005 11.59 4.31005 11.2 4.31005 10.84H19.6601C19.6601 11.2 19.6601 11.59 19.6601 12V13.86H19.6701Z" fill="#757575" />
                        <path d="M8.28999 16.6499C7.77999 16.6499 7.35999 17.0699 7.35999 17.5799C7.35999 18.0899 7.77999 18.5099 8.28999 18.5099C8.79999 18.5099 9.21999 18.0899 9.21999 17.5799C9.21999 17.0699 8.79999 16.6499 8.28999 16.6499Z" fill="#757575" />
                        <path d="M8.28999 12.9302C7.77999 12.9302 7.35999 13.3502 7.35999 13.8602C7.35999 14.3702 7.77999 14.7902 8.28999 14.7902C8.79999 14.7902 9.21999 14.3702 9.21999 13.8602C9.21999 13.3502 8.79999 12.9302 8.28999 12.9302Z" fill="#757575" />
                        <path d="M11.9999 16.6499C11.4899 16.6499 11.0699 17.0699 11.0699 17.5799C11.0699 18.0899 11.4899 18.5099 11.9999 18.5099C12.5099 18.5099 12.9299 18.0899 12.9299 17.5799C12.9299 17.0699 12.5099 16.6499 11.9999 16.6499Z" fill="#757575" />
                        <path d="M15.72 12.9302C15.21 12.9302 14.79 13.3502 14.79 13.8602C14.79 14.3702 15.21 14.7902 15.72 14.7902C16.23 14.7902 16.65 14.3702 16.65 13.8602C16.65 13.3502 16.23 12.9302 15.72 12.9302Z" fill="#757575" />
                        <path d="M11.9999 12.9302C11.4899 12.9302 11.0699 13.3502 11.0699 13.8602C11.0699 14.3702 11.4899 14.7902 11.9999 14.7902C12.5099 14.7902 12.9299 14.3702 12.9299 13.8602C12.9299 13.3502 12.5099 12.9302 11.9999 12.9302Z" fill="#757575" />
                    </svg>
                </span>
            </div>

            {/* Дропдаун-календарь */}
            {open && (
                <div className="datepicker-dropdown">

                    {/* Шапка: стрелки + месяц/год */}
                    <div className="datepicker-header">
                        <button
                            type="button"
                            className="datepicker-nav"
                            onClick={e => { e.stopPropagation(); prevMonth(); }}
                        >
                            <svg width="8" height="14" viewBox="0 0 8 14" fill="none">
                                <path d="M7 1L1 7L7 13" stroke="#181818" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>

                        <span className="datepicker-title">
                            {MONTHS_RU[viewMonth]} {viewYear}
                        </span>

                        <button
                            type="button"
                            className="datepicker-nav"
                            onClick={e => { e.stopPropagation(); nextMonth(); }}
                        >
                            <svg width="8" height="14" viewBox="0 0 8 14" fill="none">
                                <path d="M1 1L7 7L1 13" stroke="#181818" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                    </div>

                    {/* Дни недели */}
                    <div className="datepicker-weekdays">
                        {DAYS_RU.map(d => (
                            <span key={d} className="datepicker-weekday">{d}</span>
                        ))}
                    </div>

                    {/* Сетка дней */}
                    <div className="datepicker-grid">
                        {cells.map((cell, idx) => {
                            const sel = cell.current && isSelected(cell.day);
                            const tod = cell.current && isToday(cell.day);
                            return (
                                <button
                                    key={idx}
                                    type="button"
                                    className={[
                                        'datepicker-day',
                                        !cell.current ? 'datepicker-day--other' : '',
                                        sel ? 'datepicker-day--selected' : '',
                                        tod && !sel ? 'datepicker-day--today' : '',
                                    ].filter(Boolean).join(' ')}
                                    onClick={e => { e.stopPropagation(); handleSelect(cell.day, cell.current); }}
                                >
                                    {cell.day}
                                </button>
                            );
                        })}
                    </div>

                    {/* Очистить */}
                    <div className="datepicker-footer">
                        <button
                            type="button"
                            className="datepicker-clear"
                            onClick={handleClear}
                        >
                            Очистить
                        </button>
                    </div>

                </div>
            )}
        </div>
    );
}