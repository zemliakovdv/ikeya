'use client';

// components/delivery/modal/DeliveryTab.js

import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import DeliveryMap from '@/components/delivery/map/DeliveryMap';
import DeliveryResult from '@/components/delivery/cards/DeliveryResult';
import { calculateDelivery } from '@/lib/api/delivery';

/**
 * DeliveryTab
 *
 * Props:
 *  - ymapsReady  {boolean}
 *  - orderId     {string|number}
 *  - cartToken   {string}
 *  - cartItems   {Array}  [{sku, quantity}]
 *  - onSelect    {fn(addr, calcResult)}
 */

function getAvailableMethodsFromError(error) {
  const payload = error?.payload || {};

  const candidates = [
    payload.available_methods,
    payload.delivery?.available_methods,
    payload.cart?.delivery?.available_methods,
    payload.data?.available_methods,
    payload.data?.delivery?.available_methods,
  ];

  const found = candidates.find((item) => Array.isArray(item));

  return found || [];
}

export default function DeliveryTab({
  ymapsReady,
  orderId,
  cartToken,
  cartItems = [],
  onSelect,
  activeTab,
  setActiveTab,
  hideTabs = false,
}) {
  const [form, setForm] = useState({
    fullAddress: '',
    city: '',
    street: '',
    house: '',
    building: '',
    apartment: '',
    entrance: '',
    floor: '',
    intercom: '',
    lift: 'none', // 'none' | 'freight' | 'passenger'
    isPrivateHouse: false,
  });

  const [step, setStep] = useState('form'); // 'form' | 'result'
  const [calcResult, setCalcResult] = useState(null);
  const [calcLoading, setCalcLoading] = useState(false);
  const [calcError, setCalcError] = useState(null);
  const [coords, setCoords] = useState(null);
  const [geoError, setGeoError] = useState(null);
  const [pinCoords, setPinCoords] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

  const addressDebounce = useRef(null);

  const deliveryContext = useMemo(() => {
    if (orderId) {
      return { order_id: orderId };
    }

    if (cartToken) {
      return { cart_token: cartToken };
    }

    return null;
  }, [orderId, cartToken]);

  useEffect(() => {
    if (!ymapsReady) return;

    window.ymaps.ready(() => {
      window.ymaps.geolocation
        .get({
          provider: 'browser',
          autoReverseGeocode: true,
        })
        .then((geo) => {
          const position = geo.geoObjects.get(0);

          if (!position) return;

          const pos = position.geometry.getCoordinates();

          setCoords(pos);
          setPinCoords(pos);

          const addressLine = position.properties.get('text');

          if (addressLine) {
            setForm((prev) => ({
              ...prev,
              fullAddress: addressLine,
            }));
            parseGeoAddress(position);
          }
        })
        .catch(() => setGeoError('Не удалось определить местоположение'));
    });
  }, [ymapsReady]);

  useEffect(() => {
    return () => {
      if (addressDebounce.current) {
        clearTimeout(addressDebounce.current);
      }
    };
  }, []);

  function parseGeoAddress(geoObj) {
    try {
      const components = geoObj.properties.get('metaDataProperty.GeocoderMetaData.Address.Components') || [];
      const locality = components.find((component) => component.kind === 'locality')?.name || '';
      const street = components.find((component) => component.kind === 'street')?.name || '';
      const house = components.find((component) => component.kind === 'house')?.name || '';

      setForm((prev) => ({
        ...prev,
        city: locality,
        street,
        house,
      }));
    } catch {}
  }

  function validateAddressForm() {
    const nextErrors = {};

    if (!String(form.fullAddress || '').trim()) {
      nextErrors.fullAddress = 'Укажите адрес доставки';
    } else if (
      !String(form.city || '').trim() ||
      !String(form.street || '').trim() ||
      !String(form.house || '').trim()
    ) {
      nextErrors.fullAddress = 'Не удалось определить адрес. Уточните город, улицу и дом';
    }

    setFieldErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  const geocodeAddress = useCallback((address) => {
    if (!ymapsReady || !address.trim()) return;

    window.ymaps.ready(() => {
      window.ymaps.geocode(address, { results: 1 }).then((res) => {
        const obj = res.geoObjects.get(0);

        if (!obj) return;

        const pos = obj.geometry.getCoordinates();

        setCoords(pos);
        setPinCoords(pos);
        parseGeoAddress(obj);
      });
    });
  }, [ymapsReady]);

  const handleAddressChange = (event) => {
    const value = event.target.value;

    setForm((prev) => ({
      ...prev,
      fullAddress: value,
    }));
    setFieldErrors((prev) => ({
      ...prev,
      fullAddress: undefined,
    }));

    clearTimeout(addressDebounce.current);

    addressDebounce.current = setTimeout(() => {
      geocodeAddress(value);
    }, 700);
  };

  const handleMapClick = useCallback((pos) => {
    setCoords(pos);
    setPinCoords(pos);

    if (!ymapsReady) return;

    window.ymaps.geocode(pos, { results: 1 }).then((res) => {
      const obj = res.geoObjects.get(0);

      if (!obj) return;

      setForm((prev) => ({
        ...prev,
        fullAddress: obj.getAddressLine(),
      }));

      parseGeoAddress(obj);
    });
  }, [ymapsReady]);

  function buildAddressPayload() {
    return {
      city: form.city || '',
      street: form.street || '',
      house: form.house || '',
      building: form.building || '',
      apartment: form.apartment || '',
      entrance: form.entrance || '',
      floor: form.floor || '',
      has_elevator: form.lift !== 'none',
      intercom: form.intercom || '',
      is_private_house: form.isPrivateHouse,
      lat: coords?.[0] ?? null,
      lng: coords?.[1] ?? null,
      full_address: form.fullAddress || '',
    };
  }

  const handleSubmit = async () => {
    if (!form.fullAddress.trim()) return;
    if (!validateAddressForm()) {
      setCalcError('Заполните обязательные поля адреса');
      return;
    }

    setCalcLoading(true);
    setCalcResult(null);
    setCalcError(null);

    if (!deliveryContext || !cartItems?.length) {
      setCalcError('Не удалось рассчитать доставку: нет данных заказа');
      setCalcLoading(false);
      setStep('result');
      return;
    }

    const addressPayload = buildAddressPayload();

    const payload = {
      ...deliveryContext,
      delivery_type: 'courier',
      items: cartItems,
      address: addressPayload,
    };

    try {
      const result = await calculateDelivery(payload);
      setCalcResult(result);
    } catch (err) {
      if (err.status === 422) {
        const available = getAvailableMethodsFromError(err);
        const hasIkeyaDelivery = available.some(
          (method) => method?.code === 'ikeya_delivery' && method?.available
        );

        if (hasIkeyaDelivery) {
          try {
            const fallback = await calculateDelivery({
              ...payload,
              delivery_type: 'ikeya_delivery',
            });

            setCalcResult(fallback);
          } catch (fallbackError) {
            setCalcError(
              fallbackError?.message ||
              fallbackError?.payload?.error ||
              fallbackError?.payload?.message ||
              'Не удалось рассчитать доставку IKEYA'
            );
          }
        } else {
          setCalcError(
            err.payload?.error ||
            err.payload?.message ||
            'Доставка по этому адресу недоступна'
          );
        }
      } else {
        setCalcError(err?.message || 'Ошибка расчёта доставки');
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
    if (!calcResult) return;
    if (!validateAddressForm()) {
      setCalcError('Заполните обязательные поля адреса');
      return;
    }

    const parts = [form.fullAddress];

    if (form.apartment) parts.push(`кв.${form.apartment}`);
    if (form.entrance) parts.push(`подъезд ${form.entrance}`);
    if (form.floor) parts.push(`этаж ${form.floor}`);
    if (form.intercom) parts.push(`домофон ${form.intercom}`);

    const label = parts.join(', ');

    const addr = {
      city: form.city,
      street: form.street,
      house: form.house,
      building: form.building,
      apartment: form.apartment,
      entrance: form.entrance,
      floor: form.floor,
      has_elevator: form.lift !== 'none',
      intercom: form.intercom,
      is_private_house: form.isPrivateHouse,
      address: form.fullAddress,
      label,
      coords,
      lat: coords?.[0] ?? null,
      lng: coords?.[1] ?? null,
    };

    onSelect?.(addr, calcResult);
  };

  const displayAddress = (() => {
    const parts = [form.fullAddress];

    if (form.apartment) parts.push(`кв.${form.apartment}`);
    if (form.entrance) parts.push(`подъезд ${form.entrance}`);
    if (form.floor) parts.push(`этаж ${form.floor}`);

    return parts.join(', ');
  })();

  const resultDisplayAddress = (() => {
    const parts = [];
    if (form.city) parts.push(form.city);
    if (form.street) parts.push(form.street);
    if (form.house) parts.push(form.house);
    if (form.apartment) parts.push(`кв.${form.apartment}`);
    if (parts.length > 0) return parts.join(', ');
    return form.fullAddress;
  })();

  return (
    <div className={`pvz-layout pvz-layout--delivery-${step}`}>
      <aside className="pvz-sidebar">
        {!hideTabs && (
          <div className="pvz-modal__tabs">
            <button
              type="button"
              className={`pvz-modal__tab${activeTab === 'pickup' ? ' pvz-modal__tab--active' : ''}`}
              onClick={() => setActiveTab?.('pickup')}
            >
              Самовывоз
            </button>

            <button
              type="button"
              className={`pvz-modal__tab${activeTab === 'delivery' ? ' pvz-modal__tab--active' : ''}`}
              onClick={() => setActiveTab?.('delivery')}
            >
              Доставка
            </button>
          </div>
        )}

        {step === 'form' && (
          <>
            <div className="delivery-form-header">
              <h5 className="delivery-form-title">Куда доставить заказ?</h5>
              <p className="delivery-form-hint">Укажите адрес на карте или используйте поиск</p>
            </div>

            {geoError && <div className="delivery-geo-error">{geoError}</div>}

            <div className="delivery-address-input">
              <input
                type="text"
                className={`delivery-address-field${fieldErrors.fullAddress ? ' is-invalid' : ''}`}
                placeholder="Город, улица и дом"
                value={form.fullAddress}
                onChange={handleAddressChange}
              />
            </div>
            {fieldErrors.fullAddress && <div className="delivery-geo-error">{fieldErrors.fullAddress}</div>}
            <label className="delivery-checkbox">
              <input
                type="checkbox"
                checked={form.isPrivateHouse}
                onChange={(event) => {
                  setForm((prev) => ({
                    ...prev,
                    isPrivateHouse: event.target.checked,
                  }));
                }}
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
                    onChange={(event) => {
                      setForm((prev) => ({
                        ...prev,
                        apartment: event.target.value,
                      }));
                    }}
                  />

                  <input
                    type="text"
                    className="delivery-field"
                    placeholder="Подъезд"
                    value={form.entrance}
                    onChange={(event) => {
                      setForm((prev) => ({
                        ...prev,
                        entrance: event.target.value,
                      }));
                    }}
                  />
                </div>

                <div className="delivery-fields-row">
                  <input
                    type="text"
                    className="delivery-field"
                    placeholder="Этаж"
                    value={form.floor}
                    onChange={(event) => {
                      setForm((prev) => ({
                        ...prev,
                        floor: event.target.value,
                      }));
                    }}
                  />

                  <input
                    type="text"
                    className="delivery-field"
                    placeholder="Домофон"
                    value={form.intercom}
                    onChange={(event) => {
                      setForm((prev) => ({
                        ...prev,
                        intercom: event.target.value,
                      }));
                    }}
                  />
                </div>

                <div className="delivery-lift">
                  <span className="delivery-lift-label">Лифт</span>

                  <div className="delivery-lift-options">
                    {[
                      { value: 'none', label: 'Нет' },
                      { value: 'freight', label: 'грузовой' },
                      { value: 'passenger', label: 'пассажирский' },
                    ].map((option) => (
                      <label key={option.value} className="delivery-lift-option">
                        <input
                          type="radio"
                          name="lift"
                          value={option.value}
                          checked={form.lift === option.value}
                          onChange={() => {
                            setForm((prev) => ({
                              ...prev,
                              lift: option.value,
                            }));
                          }}
                        />
                        <span>{option.label}</span>
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
                <h5 className="pvz-detail__title">{resultDisplayAddress}</h5>

                <button
                  type="button"
                  className="btn-close"
                  onClick={handleBack}
                  aria-label="Назад"
                />
              </div>

              {calcError && <div className="delivery-geo-error">{calcError}</div>}

              {!calcError && (
                <DeliveryResult
                  calcResult={calcResult}
                  onSelect={handleSelect}
                />
              )}
            </div>

            {!calcError && calcResult && (
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

            {!calcError && !calcResult && (
              <div className="delivery-geo-error" style={{ margin: '12px 16px' }}>
                Расчёт доставки недоступен
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

      <div className="pvz-desktop-map">
        <DeliveryMap
          mapId="delivery-tab-map"
          ymapsReady={ymapsReady}
          pinType="delivery"
          pinCoords={pinCoords}
          onMapClick={handleMapClick}
        />
      </div>
    </div>
  );
}
