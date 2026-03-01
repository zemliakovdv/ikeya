// components/product/GoodsAdded.js
'use client';

import Link from 'next/link';

export default function GoodsAdded({ quantity = 1, onMinus, onPlus }) {
  return (
    <div className="goods-added">
      <div className="goods-added__counter">
        <button
          className="counter-button counter-button__minus"
          type="button"
          onClick={onMinus}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path
              d="M21.3 12.7H2.7C2.31 12.7 2 12.39 2 12C2 11.61 2.31 11.3 2.7 11.3H21.3C21.69 11.3 22 11.61 22 12C22 12.39 21.69 12.7 21.3 12.7Z"
              fill="#BDBDBD"
            />
          </svg>
        </button>

        {/* Оставляю как в верстке (counter-vlaue), чтобы стили не сломались */}
        <span className="counter-vlaue">{quantity}</span>

        <button
          className="counter-button counter-button__plus"
          type="button"
          onClick={onPlus}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path
              d="M21.3 11.3H12.7V2.7C12.7 2.31 12.39 2 12 2C11.61 2 11.3 2.31 11.3 2.7V11.3H2.7C2.31 11.3 2 11.61 2 12C2 12.39 2.31 12.7 2.7 12.7H11.3V21.3C11.3 21.69 11.61 22 12 22C12.39 22 12.7 21.69 12.7 21.3V12.7H21.3C21.69 12.7 22 12.39 22 12C22 11.61 21.69 11.3 21.3 11.3Z"
              fill="#757575"
            />
          </svg>
        </button>
      </div>

      <Link href="/cart" className="good-added__link">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none"
          xmlns="http://www.w3.org/2000/svg">
          <path
            d="M7.74997 15.8166C7.59997 15.8166 7.44997 15.7583 7.34163 15.65L1.8333 10.15C1.6083 9.92498 1.6083 9.55831 1.8333 9.32498C2.0583 9.09165 2.42497 9.09998 2.6583 9.32498L7.74163 14.4083L17.3333 4.35831C17.5583 4.12498 17.925 4.11665 18.1583 4.34165C18.3916 4.56665 18.4 4.93331 18.175 5.16665L8.17497 15.6416C8.06663 15.7583 7.91663 15.8166 7.7583 15.825L7.74997 15.8166Z"
            fill="white"
          />
        </svg>
        <p>Перейти в корзину</p>
      </Link>
    </div>
  );
}