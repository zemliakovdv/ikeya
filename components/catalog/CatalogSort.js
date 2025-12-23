'use client';
import { useState } from 'react';

export default function CatalogSort() {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState('Популярные');

  const options = [
    { value: 'popular', label: 'Популярные' },
    { value: 'price-asc', label: 'Новинки' },
    { value: 'price-desc', label: 'Дешевле' },
    { value: 'name-asc', label: 'Дороже' },
  ];

  const handleSelect = (option) => {
    setSelected(option.label);
    setIsOpen(false);
  };

  return (
    <div className="all-catalog-sort">
      <div className={`catalog-sort ${isOpen ? 'open' : ''}`}>
        <div 
          className="catalog-sort__selected"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="catalog-sort__current">{selected}</span>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7.99999 10.2201C7.25333 10.2201 5.46666 8.19343 4.09999 6.5001C3.94666 6.30677 3.97333 6.02677 4.16666 5.87343C4.35999 5.7201 4.63999 5.74677 4.79333 5.9401C5.99333 7.42677 7.52666 9.1001 7.99999 9.3201C8.47333 9.1001 10.0067 7.42677 11.2067 5.9401C11.36 5.74677 11.64 5.7201 11.8333 5.87343C12.0267 6.02677 12.0533 6.30677 11.9 6.5001C10.5333 8.2001 8.74 10.2201 7.99999 10.2201Z" fill="#757575"/>
          </svg>
        </div>

        <ul className="catalog-sort__dropdown">
          {options.map((option) => (
            <li
              key={option.value}
              className={`catalog-sort__option ${selected === option.label ? 'active' : ''}`}
              data-sort={option.value}
              onClick={() => handleSelect(option)}
            >
              {option.label}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
