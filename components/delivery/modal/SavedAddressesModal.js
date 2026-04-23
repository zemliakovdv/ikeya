'use client';

// components/delivery/modal/SavedAddressesModal.js

import { useState } from 'react';

/**
 * SavedAddressesModal
 *
 * Props:
 *  - initialMode       {'pickup'|'delivery'}
 *  - pvzAddresses      {Array}  — сохранённые ПВЗ [{id, label, ...}]
 *  - deliveryAddresses {Array}  — сохранённые адреса доставки
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
  const [selectedPvzId, setSelectedPvzId] = useState(
    activePvzId || pvzAddresses[0]?.id || null
  );
  const [selectedDeliveryId, setSelectedDeliveryId] = useState(
    activeDeliveryId || deliveryAddresses[0]?.id || null
  );

  const isPvz = mode === 'pickup';
  const addresses = isPvz ? pvzAddresses : deliveryAddresses;
  const selectedId = isPvz ? selectedPvzId : selectedDeliveryId;

  const handleSelect = (id) => {
    if (isPvz) setSelectedPvzId(id);
    else setSelectedDeliveryId(id);
    setOpenMenuId(null);
  };

  const handleDelete = (id) => {
    if (isPvz) {
      onDeletePvz?.(id);
      if (selectedPvzId === id) {
        const remaining = pvzAddresses.filter(a => a.id !== id);
        setSelectedPvzId(remaining[0]?.id || null);
      }
    } else {
      onDeleteDelivery?.(id);
      if (selectedDeliveryId === id) {
        const remaining = deliveryAddresses.filter(a => a.id !== id);
        setSelectedDeliveryId(remaining[0]?.id || null);
      }
    }
    setOpenMenuId(null);
  };

  const handleSave = () => {
    if (isPvz) onSelectPvz?.(selectedPvzId);
    else onSelectDelivery?.(selectedDeliveryId);
    onClose?.();
  };

  return (
    <>
      <div className="modal fade show d-block" style={{ zIndex: 1056 }}>
        <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: 560 }}>
          <div className="modal-content saved-addresses-modal">

            <div className="pvz-modal__header">
              <h5 className="pvz-modal__title">Адреса доставки</h5>
              <button type="button" className="btn-close" onClick={onClose} aria-label="Закрыть" />
            </div>

            <div className="pvz-modal__tabs">
              <button
                type="button"
                className={`pvz-modal__tab${mode === 'pickup' ? ' pvz-modal__tab--active' : ''}`}
                onClick={() => { setMode('pickup'); setOpenMenuId(null); }}
              >
                Самовывоз
              </button>
              <button
                type="button"
                className={`pvz-modal__tab${mode === 'delivery' ? ' pvz-modal__tab--active' : ''}`}
                onClick={() => { setMode('delivery'); setOpenMenuId(null); }}
              >
                Доставка
              </button>
            </div>

            <div className="saved-addresses-list">
              {addresses.length === 0 && (
                <div className="pvz-list__empty">Нет сохранённых адресов</div>
              )}
              {addresses.map((addr) => (
                <div key={addr.id} className="saved-address-item">
                  <label className="saved-address-label">
                    <input
                      type="radio"
                      name="saved-address"
                      checked={selectedId === addr.id}
                      onChange={() => handleSelect(addr.id)}
                    />
                    <span className="saved-address-text">{addr.label}</span>
                  </label>

                  <div className="saved-address-menu">
                    <button
                      type="button"
                      className="saved-address-menu-btn"
                      onClick={() => setOpenMenuId(openMenuId === addr.id ? null : addr.id)}
                    >
                      <svg width="4" height="16" viewBox="0 0 4 16" fill="none">
                        <circle cx="2" cy="2"  r="2" fill="#757575" />
                        <circle cx="2" cy="8"  r="2" fill="#757575" />
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

            <div className="saved-addresses-footer">
              <button
                type="button"
                className="saved-addresses-add-btn"
                onClick={isPvz ? onAddPvz : onAddDelivery}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M8 3.33334V12.6667M3.33334 8H12.6667" stroke="#0058A3" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                {isPvz ? 'Добавить новый адрес' : 'Добавить новый адрес'}
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

      <div
        className="modal-backdrop fade show"
        onClick={onClose}
        style={{ zIndex: 1055 }}
      />
    </>
  );
}