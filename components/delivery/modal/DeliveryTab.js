'use client';

// components/delivery/modal/DeliveryTab.js

import { useEffect, useRef, useState, useCallback } from 'react';
import DeliveryMap from '@/components/delivery/map/DeliveryMap';
import DeliveryResult from '@/components/delivery/cards/DeliveryResult';

const API_BASE_URL = 'https://test.ikeya.by/api/v1';

/**
 * DeliveryTab
 *
 * Props:
 *  - ymapsReady  {boolean}
 *  - cartToken   {string}
 *  - cartItems   {Array}  [{sku, quantity}]
 *  - onSelect    {fn(addr, calcResult)}
 */
export default function DeliveryTab({ ymapsReady, cartToken, cartItems, onSelect }) {
  const [form, setForm] = useState({
    address: '',
    apartment: '',
    entrance: '',
    floor: '',
    intercom: '',
    isPrivateHouse: false,
    lift: 'none', // 'none' | 'freight' | 'passenger'
  });

  const [step, setStep]           = useState('form'); // 'form' | 'result'
  const [calcResult, setCalcResult] = useState(null);
  const [calcLoading, setCalcLoading] = useState(false);
  const [coords, setCoords]       = useState(null);   // [lat, lon]
  const [geoError, setGeoError]   = useState(null);
  const [pinCoords, setPinCoords] = useState(null);   // передаём в карту

  const ymapRef = useRef(null); // ссылка на инстанс карты из DeliveryMap
  const addressDebounce = useRef(null);

  // Геолокация при открытии вкладки
  useEffect(() => {
    if (!ymapsReady) return;

    window.ymaps.ready(() => {
      window.ymaps.geolocation
        .get({ provider: 'browser', autoReverseGeocode: true })
        .then((geo) => {
          const position = geo.geoObjects.get(0);
          if (!position) return;

          const pos = position.geometry.getCoordinates();
          setCoords(pos);
          setPinCoords(pos);

          const addressLine = position.properties.get('text');
          if (addressLine) {
            setForm(prev => ({ ...prev, address: addressLine }));
          }
        })
        .catch(() => setGeoError('Не удалось определить местоположение'));
    });
  }, [ymapsReady]);

  // Геокодирование при ручном вводе адреса
  const geocodeAddress = useCallback((address) => {
    if (!ymapsReady || !address.trim()) return;
    window.ymaps.geocode(address, { results: 1 }).then((res) => {
      const obj = res.geoObjects.get(0);
      if (obj) {
        const pos = obj.geometry.getCoordinates();
        setCoords(pos);
        setPinCoords(pos);
      }
    });
  }, [ymapsReady]);

  const handleAddressChange = (e) => {
    const val = e.target.value;
    setForm(prev => ({ ...prev, address: val }));
    clearTimeout(addressDebounce.current);
    addressDebounce.current = setTimeout(() => geocodeAddress(val), 700);
  };

  // Клик по карте — обновляем пин и адрес через reverse geocode
  const handleMapClick = useCallback((pos) => {
    setCoords(pos);
    setPinCoords(pos);
    if (!ymapsReady) return;
    window.ymaps.geocode(pos, { results: 1 }).then((res) => {
      const obj = res.geoObjects.get(0);
      if (obj) {
        setForm(prev => ({ ...prev, address: obj.getAddressLine() }));
      }
    });
  }, [ymapsReady]);

  const handleSubmit = async () => {
    if (!form.address.trim()) return;

    setCalcLoading(true);
    setCalcResult(null);

    try {
      const res = await fetch(`${API_BASE_URL}/delivery/calculate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cart_token: cartToken,
          delivery_type: 'courier',
          items: cartItems,
        }),
      });
      if (res.ok) setCalcResult(await res.json());
    } catch (e) {
      console.error('Ошибка calculate courier:', e);
    } finally {
      setCalcLoading(false);
      setStep('result');
    }
  };

  const handleBack = () => {
    setStep('form');
    setCalcResult(null);
  };

  const handleSelect = () => {
    const addr = {
      address: form.address,
      apartment: form.apartment,
      entrance: form.entrance,
      floor: form.floor,
      intercom: form.intercom,
      isPrivateHouse: form.isPrivateHouse,
      lift: form.lift,
      coords,
      deliveryType: calcResult?.delivery?.type || 'ikeya',
    };
    onSelect?.(addr, calcResult);
  };

  const displayAddress = [
    form.address,
    form.apartment ? `кв.${form.apartment}` : '',
  ].filter(Boolean).join(', ');

  return (
    <div className="pvz-layout">

      {/* Сайдбар */}
      <aside className="pvz-sidebar">

        {step === 'form' && (
          <>
            <div className="delivery-form-header">
              <h5 className="delivery-form-title">Куда доставить заказ?</h5>
              <p className="delivery-form-hint">Укажите адрес на карте или используйте поиск</p>
            </div>

            {geoError && (
              <div className="delivery-geo-error">{geoError}</div>
            )}

            <div className="delivery-address-input">
              <input
                type="text"
                className="delivery-address-field"
                placeholder="Город, улица и дом"
                value={form.address}
                onChange={handleAddressChange}
              />
            </div>

            <label className="delivery-checkbox">
              <input
                type="checkbox"
                checked={form.isPrivateHouse}
                onChange={e => setForm(prev => ({ ...prev, isPrivateHouse: e.target.checked }))}
              />
              <span>Частный дом</span>
            </label>

            {!form.isPrivateHouse && (
              <>
                <div className="delivery-fields-row">
                  <input
                    type="text"
                    className="delivery-field"
                    placeholder="Квартира"
                    value={form.apartment}
                    onChange={e => setForm(prev => ({ ...prev, apartment: e.target.value }))}
                  />
                  <input
                    type="text"
                    className="delivery-field"
                    placeholder="Подъезд"
                    value={form.entrance}
                    onChange={e => setForm(prev => ({ ...prev, entrance: e.target.value }))}
                  />
                </div>
                <div className="delivery-fields-row">
                  <input
                    type="text"
                    className="delivery-field"
                    placeholder="Этаж"
                    value={form.floor}
                    onChange={e => setForm(prev => ({ ...prev, floor: e.target.value }))}
                  />
                  <input
                    type="text"
                    className="delivery-field"
                    placeholder="Домофон"
                    value={form.intercom}
                    onChange={e => setForm(prev => ({ ...prev, intercom: e.target.value }))}
                  />
                </div>

                <div className="delivery-lift">
                  <span className="delivery-lift-label">Лифт</span>
                  <div className="delivery-lift-options">
                    {[
                      { value: 'none',      label: 'Нет' },
                      { value: 'freight',   label: 'грузовой' },
                      { value: 'passenger', label: 'пассажирский' },
                    ].map(opt => (
                      <label key={opt.value} className="delivery-lift-option">
                        <input
                          type="radio"
                          name="lift"
                          value={opt.value}
                          checked={form.lift === opt.value}
                          onChange={() => setForm(prev => ({ ...prev, lift: opt.value }))}
                        />
                        <span>{opt.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </>
            )}

            <div className="pvz-detail__footer">
              <button
                type="button"
                className="pvz-select-btn"
                onClick={handleSubmit}
                disabled={!form.address.trim() || calcLoading}
              >
                {calcLoading ? 'Расчёт...' : 'Добавить'}
              </button>
            </div>
          </>
        )}

        {step === 'result' && (
          <>
            <div className="pvz-detail">
              <div className="pvz-detail__header">
                <h5 className="pvz-detail__title">{displayAddress}</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={handleBack}
                  aria-label="Назад"
                />
              </div>

              <DeliveryResult
                calcResult={calcResult}
                onSelect={handleSelect}
              />
            </div>

            <div className="pvz-detail__footer">
              <button
                type="button"
                className="pvz-select-btn"
                onClick={handleSelect}
              >
                Выбрать
              </button>
            </div>
          </>
        )}

      </aside>

      {/* Карта */}
      <DeliveryMap
        mapId="delivery-tab-map"
        ymapsReady={ymapsReady}
        pinType="delivery"
        pinCoords={pinCoords}
        onMapClick={handleMapClick}
      />

    </div>
  );
}