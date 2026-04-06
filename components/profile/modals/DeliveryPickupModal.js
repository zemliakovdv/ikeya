'use client';

// components/profile/modals/DeliveryPickupModal.js

import { useState, useEffect } from 'react';
import Script from 'next/script';
import PvzMapContent from '@/components/pvz/PvzMapContent';

const YMAPS_API_KEY = 'ee57964a-5010-4536-9733-41c78d29d531';
const YMAPS_SRC = `https://api-maps.yandex.ru/2.1/?apikey=${YMAPS_API_KEY}&lang=ru_RU`;

export default function DeliveryPickupModal({ onClose, onSelect }) {
  const [ymapsReady, setYmapsReady] = useState(false);
  const [needScript, setNeedScript] = useState(false);

  useEffect(() => {
    if (window.ymaps) {
      setYmapsReady(true);
      return;
    }
    const existing = document.querySelector('script[src*="api-maps.yandex.ru"]');
    if (existing) {
      const timer = setInterval(() => {
        if (window.ymaps) {
          setYmapsReady(true);
          clearInterval(timer);
        }
      }, 100);
      return () => clearInterval(timer);
    }
    setNeedScript(true);
  }, []);

  const handleSelect = (point) => {
    onSelect?.(point);
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

      <div className="modal fade show d-block" style={{ zIndex: 1055 }}>
        <div className="modal-dialog modal-fullscreen">
          <div className="modal-content pvz-modal">
            <div className="pvz-modal__header">
              <h5 className="pvz-modal__title">Адреса доставки</h5>
              <button
                type="button"
                className="btn-close"
                onClick={onClose}
                aria-label="Закрыть"
              />
            </div>
            <div className="pvz-modal__body">
              <PvzMapContent
                mapId="pvz-modal-map"
                ymapsReady={ymapsReady}
                onSelect={handleSelect}
              />
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