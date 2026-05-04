'use client';

// components/delivery/modal/DeliveryModal.js

import { useEffect, useState } from 'react';
import Script from 'next/script';
import PickupTab from './PickupTab';
import DeliveryTab from './DeliveryTab';

const YMAPS_API_KEY = 'ee57964a-5010-4536-9733-41c78d29d531';
const YMAPS_SRC = `https://api-maps.yandex.ru/2.1/?apikey=${YMAPS_API_KEY}&lang=ru_RU`;

/**
 * DeliveryModal
 *
 * Props:
 *  - initialTab   {'pickup'|'delivery'}  — активная вкладка при открытии
 *  - cartToken    {string}               — токен корзины для calculate
 *  - cartItems    {Array}                — [{sku, quantity}]
 *  - onClose      {fn}
 *  - onSelectPvz  {fn(pvz, calcResult)}  — выбран ПВЗ самовывоза
 *  - onSelectAddr {fn(addr, calcResult)} — выбран адрес доставки
 */
export default function DeliveryModal({
  initialTab = 'pickup',
  cartToken,
  cartItems = [],
  onClose,
  onSelectPvz,
  onSelectAddr,
}) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [ymapsReady, setYmapsReady] = useState(
    typeof window !== 'undefined' && !!window.ymaps
  );

  const needScript = typeof window !== 'undefined' && !window.ymaps;

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  useEffect(() => {
    if (typeof document === 'undefined') return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose?.();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  const handlePvzSelect = (pvz, calcResult) => {
    onSelectPvz?.(pvz, calcResult);
    onClose?.();
  };

  const handleAddrSelect = (addr, calcResult) => {
    onSelectAddr?.(addr, calcResult);
    onClose?.();
  };

  return (
    <>
      {needScript && (
        <Script
          src={YMAPS_SRC}
          strategy="afterInteractive"
          onLoad={() => setYmapsReady(true)}
        />
      )}

      <div
        className="modal fade show d-block"
        style={{ zIndex: 1055 }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="delivery-modal-title"
      >
        <div className="modal-dialog modal-fullscreen">
          <div className="modal-content pvz-modal">
            <div className="pvz-modal__header">
              <h5 id="delivery-modal-title" className="pvz-modal__title">
                Адреса доставки
              </h5>

              <button
                type="button"
                className="btn-close"
                onClick={onClose}
                aria-label="Закрыть"
              />
            </div>

            <div className="pvz-modal__body">
              {activeTab === 'pickup' && (
                <PickupTab
                  ymapsReady={ymapsReady}
                  cartToken={cartToken}
                  cartItems={cartItems}
                  onSelect={handlePvzSelect}
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
                />
              )}

              {activeTab === 'delivery' && (
                <DeliveryTab
                  ymapsReady={ymapsReady}
                  cartToken={cartToken}
                  cartItems={cartItems}
                  onSelect={handleAddrSelect}
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      <div
        className="modal-backdrop fade show"
        onClick={onClose}
        style={{ zIndex: 1054 }}
      />
    </>
  );
}