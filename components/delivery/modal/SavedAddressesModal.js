'use client';

// components/delivery/modal/SavedAddressesModal.js

import { useEffect, useMemo, useState } from 'react';

/**
 * SavedAddressesModal
 *
 * Props:
 *  - initialMode       {'pickup'|'delivery'}
 *  - pvzAddresses      {Array} — сохранённые ПВЗ [{id, label, ...}]
 *  - deliveryAddresses {Array} — сохранённые адреса доставки
 *  - activePvzId       {string}
 *  - activeDeliveryId  {string}
 *  - onSelectPvz       {fn(id)}
 *  - onSelectDelivery  {fn(id)}
 *  - onDeletePvz       {fn(id)}
 *  - onDeleteDelivery  {fn(id)}
 *  - onAddPvz          {fn()}   — открыть карту на вкладке самовывоза
 *  - onAddDelivery     {fn()}   — открыть карту на вкладке доставки
 *  - onClose           {fn()}
 */
export default function SavedAddressesModal({
  initialMode = 'pickup',
  pvzAddresses = [],
  deliveryAddresses = [],
  activePvzId,
  activeDeliveryId,
  onSelectPvz,
  onSelectDelivery,
  onDeletePvz,
  onDeleteDelivery,
  onAddPvz,
  onAddDelivery,
  onClose,
}) {
  const [mode, setMode] = useState(initialMode);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [selectedPvzId, setSelectedPvzId] = useState(activePvzId || pvzAddresses[0]?.id || null);
  const [selectedDeliveryId, setSelectedDeliveryId] = useState(activeDeliveryId || deliveryAddresses[0]?.id || null);

  const isPvz = mode === 'pickup';

  const addresses = useMemo(() => {
    return isPvz ? pvzAddresses : deliveryAddresses;
  }, [isPvz, pvzAddresses, deliveryAddresses]);

  const selectedId = isPvz ? selectedPvzId : selectedDeliveryId;

  useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);

  useEffect(() => {
    setSelectedPvzId(activePvzId || pvzAddresses[0]?.id || null);
  }, [activePvzId, pvzAddresses]);

  useEffect(() => {
    setSelectedDeliveryId(activeDeliveryId || deliveryAddresses[0]?.id || null);
  }, [activeDeliveryId, deliveryAddresses]);

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

  const handleModeChange = (nextMode) => {
    setMode(nextMode);
    setOpenMenuId(null);
  };

  const handleSelect = (id) => {
    if (isPvz) {
      setSelectedPvzId(id);
    } else {
      setSelectedDeliveryId(id);
    }

    setOpenMenuId(null);
  };

  const handleDelete = (id) => {
    if (isPvz) {
      onDeletePvz?.(id);

      if (selectedPvzId === id) {
        const remaining = pvzAddresses.filter((address) => address.id !== id);
        setSelectedPvzId(remaining[0]?.id || null);
      }
    } else {
      onDeleteDelivery?.(id);

      if (selectedDeliveryId === id) {
        const remaining = deliveryAddresses.filter((address) => address.id !== id);
        setSelectedDeliveryId(remaining[0]?.id || null);
      }
    }

    setOpenMenuId(null);
  };

  const handleSave = () => {
    if (!selectedId) return;

    if (isPvz) {
      onSelectPvz?.(selectedId);
    } else {
      onSelectDelivery?.(selectedId);
    }

    onClose?.();
  };

  const handleAdd = () => {
    if (isPvz) {
      onAddPvz?.();
    } else {
      onAddDelivery?.();
    }
  };

  const renderAddressRows = (radioName) => (
    <div className="saved-addresses-list">
      {addresses.length === 0 && (
        <div className="pvz-list__empty">
          {isPvz ? 'Нет сохранённых пунктов выдачи' : 'Нет сохранённых адресов доставки'}
        </div>
      )}

      {addresses.map((addr) => (
        <div key={addr.id} className="saved-address-item">
          <label className="saved-address-label">
            <input
              type="radio"
              name={radioName}
              checked={selectedId === addr.id}
              onChange={() => handleSelect(addr.id)}
            />

            <span className="saved-address-text">
              {addr.label || addr.address || 'Адрес без названия'}
            </span>
          </label>

          <div className="saved-address-menu">
            <button
              type="button"
              className="saved-address-menu-btn"
              onClick={() => setOpenMenuId(openMenuId === addr.id ? null : addr.id)}
              aria-label="Действия с адресом"
            >
              <svg width="4" height="16" viewBox="0 0 4 16" fill="none">
                <circle cx="2" cy="2" r="2" fill="#757575" />
                <circle cx="2" cy="8" r="2" fill="#757575" />
                <circle cx="2" cy="14" r="2" fill="#757575" />
              </svg>
            </button>

            {openMenuId === addr.id && (
              <div className="saved-address-dropdown">
                <button
                  type="button"
                  className="saved-address-dropdown-item"
                  onClick={() => handleDelete(addr.id)}
                >
                  Удалить
                </button>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <>
      <div
        className="modal fade show d-block"
        style={{ zIndex: 1056 }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="saved-addresses-modal-title"
      >
        <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: 560 }}>
          <div className="modal-content saved-addresses-modal saved-addresses-modal--desktop">
            <div className="pvz-modal__header">
              <h5 id="saved-addresses-modal-title" className="pvz-modal__title">
                Адреса доставки
              </h5>

              <button
                type="button"
                className="btn-close"
                onClick={onClose}
                aria-label="Закрыть"
              />
            </div>

            <div className="pvz-modal__tabs">
              <button
                type="button"
                className={`pvz-modal__tab${mode === 'pickup' ? ' pvz-modal__tab--active' : ''}`}
                onClick={() => handleModeChange('pickup')}
              >
                Самовывоз
              </button>

              <button
                type="button"
                className={`pvz-modal__tab${mode === 'delivery' ? ' pvz-modal__tab--active' : ''}`}
                onClick={() => handleModeChange('delivery')}
              >
                Доставка
              </button>
            </div>

            {renderAddressRows('saved-address-desktop')}

            <div className="saved-addresses-footer">
              <button
                type="button"
                className="saved-addresses-add-btn"
                onClick={handleAdd}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M8 3.33334V12.6667M3.33334 8H12.6667"
                    stroke="#0058A3"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>

                {isPvz ? 'Добавить новый ПВЗ' : 'Добавить новый адрес'}
              </button>

              <button
                type="button"
                className="pvz-select-btn"
                onClick={handleSave}
                disabled={!selectedId}
              >
                Сохранить
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="saved-addresses-modal--mobile" role="dialog" aria-modal="true" aria-labelledby="saved-addresses-mobile-title">
        <div className="saved-addresses-mobile-header">
          <h5 id="saved-addresses-mobile-title" className="saved-addresses-mobile-title">
            Адреса доставки
          </h5>

          <button
            type="button"
            className="btn-close"
            onClick={onClose}
            aria-label="Закрыть"
          />
        </div>

        <div className="saved-addresses-mobile-tabs">
          <div className="pvz-modal__tabs">
            <button
              type="button"
              className={`pvz-modal__tab${mode === 'pickup' ? ' pvz-modal__tab--active' : ''}`}
              onClick={() => handleModeChange('pickup')}
            >
              Самовывоз
            </button>

            <button
              type="button"
              className={`pvz-modal__tab${mode === 'delivery' ? ' pvz-modal__tab--active' : ''}`}
              onClick={() => handleModeChange('delivery')}
            >
              Доставка
            </button>
          </div>
        </div>

        <div className="saved-addresses-mobile-content">
          {renderAddressRows('saved-address-mobile')}
        </div>

        <div className="saved-addresses-mobile-footer">
          <button
            type="button"
            className="saved-addresses-add-btn"
            onClick={handleAdd}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M8 3.33334V12.6667M3.33334 8H12.6667"
                stroke="#0058A3"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>

            {isPvz ? 'Добавить новый ПВЗ' : 'Добавить новый адрес'}
          </button>

          <button
            type="button"
            className="pvz-select-btn"
            onClick={handleSave}
            disabled={!selectedId}
          >
            Сохранить
          </button>
        </div>
      </div>

      <div
        className="modal-backdrop fade show"
        onClick={onClose}
        style={{ zIndex: 1055 }}
      />
    </>
  );
}
