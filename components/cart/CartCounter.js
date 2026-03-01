// components/cart/CartCounter.js
'use client';

import { useMemo, useCallback } from 'react';
import { useCart } from '@/contexts/CartContext';

export default function CartCounter({ sku, className = '' }) {
  const { items, updateQuantity } = useCart();

  const quantity = useMemo(() => {
    if (!sku) return 0;
    const found = (items || []).find((it) => it?.sku === sku);
    return Number(found?.quantity || 0);
  }, [items, sku]);

  const handleMinus = useCallback(() => {
    if (!sku || quantity <= 0) return;
    updateQuantity(sku, Math.max(0, quantity - 1));
  }, [quantity, sku, updateQuantity]);

  const handlePlus = useCallback(() => {
    if (!sku) return;
    updateQuantity(sku, quantity + 1);
  }, [quantity, sku, updateQuantity]);

  return (
    <div className={`goods-added ${className}`}>
      <div className="goods-added__counter">
        <button
          className="counter-button counter-button__minus"
          type="button"
          onClick={handleMinus}
          aria-label="Уменьшить количество"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path
              d="M21.3 12.7H2.7C2.31 12.7 2 12.39 2 12C2 11.61 2.31 11.3 2.7 11.3H21.3C21.69 11.3 22 11.61 22 12C22 12.39 21.69 12.7 21.3 12.7Z"
              fill="#BDBDBD"
            />
          </svg>
        </button>

        <span className="counter-vlaue">{quantity}</span>

        <button
          className="counter-button counter-button__plus"
          type="button"
          onClick={handlePlus}
          aria-label="Увеличить количество"
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
    </div>
  );
}