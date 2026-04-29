'use client';

// components/delivery/modal/DeliveryTab.js

import { useEffect, useRef, useState, useCallback } from 'react';
import DeliveryMap from '@/components/delivery/map/DeliveryMap';
import DeliveryResult from '@/components/delivery/cards/DeliveryResult';
import { calculateDelivery } from '@/lib/api/delivery';

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
    fullAddress: '',   // строка для отображения и геокодирования
    city:        '',
    street:      '',
    house:       '',
    building:    '',
    apartment:   '',
    entrance:    '',
    floor:       '',
    intercom:    '',
    has_elevator: false,
    isPrivateHouse: false,
  });

  const [step, setStep]             = useState('form'); // 'form' | 'result'
  const [calcResult, setCalcResult] = useState(null);
  const [calcLoading, setCalcLoading] = useState(false);
  const [calcError, setCalcError]   = useState(null);
  const [coords, setCoords]         = useState(null);
  const [geoError, setGeoError]     = useState(null);
  const [pinCoords, setPinCoords]   = useState(null);

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
            setForm(prev => ({ ...prev, fullAddress: addressLine }));
            parseGeoAddress(position);
          }
        })
        .catch(() => setGeoError('Не удалось определить местоположение'));
    });
  }, [ymapsReady]);

  // Разбираем объект геообъекта на поля
  function parseGeoAddress(geoObj) {
    try {
      const locality   = geoObj.properties.get('metaDataProperty.GeocoderMetaData.Address.Components')
        ?.find(c => c.kind === 'locality')?.name || '';
      const street     = geoObj.properties.get('metaDataProperty.GeocoderMetaData.Address.Components')
        ?.find(c => c.kind === 'street')?.name || '';
      const house      = geoObj.properties.get('metaDataProperty.GeocoderMetaData.Address.Components')
        ?.find(c => c.kind === 'house')?.name || '';
      setForm(prev => ({
        ...prev,
        city:   locality,
        street: street,
        house:  house,
      }));
    } catch {}
  }

  // Геокодирование при вводе адреса
  const geocodeAddress = useCallback((address) => {
    if (!ymapsReady || !address.trim()) return;
    window.ymaps.geocode(address, { results: 1 }).then((res) => {
      const obj = res.geoObjects.get(0);
      if (obj) {
        const pos = obj.geometry.getCoordinates();
        setCoords(pos);
        setPinCoords(pos);
        parseGeoAddress(obj);
      }
    });
  }, [ymapsReady]);

  const handleAddressChange = (e) => {
    const val = e.target.value;
    setForm(prev => ({ ...prev, fullAddress: val }));
    clearTimeout(addressDebounce.current);
    addressDebounce.current = setTimeout(() => geocodeAddress(val), 700);
  };

  // Клик по карте
  const handleMapClick = useCallback((pos) => {
    setCoords(pos);
    setPinCoords(pos);
    if (!ymapsReady) return;
    window.ymaps.geocode(pos, { results: 1 }).then((res) => {
      const obj = res.geoObjects.get(0);
      if (obj) {
        setForm(prev => ({ ...prev, fullAddress: obj.getAddressLine() }));
        parseGeoAddress(obj);
      }
    });
  }, [ymapsReady]);

  // Расчёт доставки: сначала courier, при 422 — ikeya_delivery
  const handleSubmit = async () => {
    if (!form.fullAddress.trim()) return;
    setCalcLoading(true);
    setCalcResult(null);
    setCalcError(null);

    const payload = {
      cart_token:    cartToken,
      delivery_type: 'courier',
      items:         cartItems,
    };

    try {
      const result = await calculateDelivery(payload);
      setCalcResult(result);
    } catch (err) {
      if (err.status === 422) {
        const available = err.payload?.available_methods || [];
        if (available.some(m => m.code === 'ikeya_delivery' && m.available)) {
          try {
            const fallback = await calculateDelivery({
              ...payload,
              delivery_type: 'ikeya_delivery',
            });
            setCalcResult(fallback);
          } catch (e2) {
            setCalcError('Не удалось рассчитать доставку');
          }
        } else {
          setCalcError(err.payload?.error || 'Доставка по этому адресу недоступна');
        }
      } else {
        setCalcError('Ошибка расчёта доставки');
      }
    } finally {
      setCalcLoading(false);
      setStep('result');
    }
  };

  const handleBack = () => {
    setStep('form');
    setCalcResult(null);
    setCalcError(null);
  };

  const handleSelect = () => {
    const addr = {
      // Поля для API /account/delivery_addresses и /checkout
      city:            form.city,
      street:          form.street,
      house:           form.house,
      building:        form.building,
      apartment:       form.apartment,
      entrance:        form.entrance,
      floor:           form.floor,
      has_elevator:    form.has_elevator,
      intercom:        form.intercom,
      is_private_house: form.isPrivateHouse,
      // Для отображения
      address:         form.fullAddress,
      label:           form.apartment
        ? `${form.fullAddress}, кв.${form.apartment}`
        : form.fullAddress,
      coords,
    };
    onSelect?.(addr, calcResult);
  };

  const displayAddress = form.apartment
    ? `${form.fullAddress}, кв.${form.apartment}`
    : form.fullAddress;

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
                value={form.fullAddress}
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

                <label className="delivery-checkbox" style={{ marginTop: 8 }}>
                  <input
                    type="checkbox"
                    checked={form.has_elevator}
                    onChange={e => setForm(prev => ({ ...prev, has_elevator: e.target.checked }))}
                  />
                  <span>Есть лифт</span>
                </label>
              </>
            )}

            <div className="pvz-detail__footer">
              <button
                type="button"
                className="pvz-select-btn"
                onClick={handleSubmit}
                disabled={!form.fullAddress.trim() || calcLoading}
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

              {calcError && (
                <div className="delivery-geo-error">{calcError}</div>
              )}

              {!calcError && (
                <DeliveryResult
                  calcResult={calcResult}
                  onSelect={handleSelect}
                />
              )}
            </div>

            {!calcError && (
              <div className="pvz-detail__footer">
                <button
                  type="button"
                  className="pvz-select-btn"
                  onClick={handleSelect}
                >
                  Выбрать
                </button>
              </div>
            )}

            {calcError && (
              <div className="pvz-detail__footer">
                <button
                  type="button"
                  className="pvz-select-btn"
                  onClick={handleBack}
                >
                  Изменить адрес
                </button>
              </div>
            )}
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