'use client';

// components/delivery/modal/PickupTab.js

import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { normalizePoint } from '@/hooks/usePvzData';
import PvzCard from '@/components/delivery/cards/PvzCard';
import PvzDetail from '@/components/delivery/cards/PvzDetail';
import DeliveryMap from '@/components/delivery/map/DeliveryMap';
import { getEuropostOffices, calculateDelivery } from '@/lib/api/delivery';

function getDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLon / 2) *
    Math.sin(dLon / 2);

  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function normalizePvzSearch(value) {
  return String(value || '')
    .toLowerCase()
    .replaceAll('ё', 'е')
    .replace(/[.,;:()"'«»]+/g, ' ')
    .replace(/\b(г|город|д|деревня|п|поселок|посёлок|аг|агрогородок)\b/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function filterPvzOffices(offices, search) {
  const query = normalizePvzSearch(search);
  if (!query) return offices;

  const exactCityMatches = offices.filter(
    (office) => normalizePvzSearch(office.city) === query
  );
  if (exactCityMatches.length > 0) return exactCityMatches;

  return offices.filter((office) => {
    const city = normalizePvzSearch(office.city);
    const address = normalizePvzSearch(office.address);
    const name = normalizePvzSearch(office.name);
    return city.includes(query) || address.includes(query) || name.includes(query);
  });
}

export default function PickupTab({
  ymapsReady,
  orderId,
  cartToken,
  cartItems = [],
  onSelect,
  activeTab,
  setActiveTab,
  hideTabs = false,
}) {
  const [allPoints, setAllPoints] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [search, setSearch] = useState('');
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [calcLoading, setCalcLoading] = useState(false);
  const [calcError, setCalcError] = useState(null);
  const [mapCenter, setMapCenter] = useState(null);
  const [userCoords, setUserCoords] = useState(null);
  const [mobileView, setMobileView] = useState('list');

  const searchTimer = useRef(null);

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
        .get({ provider: 'browser', autoReverseGeocode: false })
        .then((geo) => {
          const position = geo.geoObjects.get(0);
          if (!position) return;

          const coords = position.geometry.getCoordinates();
          setUserCoords(coords);
          setMapCenter({ coords, zoom: 12 });
        })
        .catch(() => { });
    });
  }, [ymapsReady]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setLoadError(null);

      try {
        const data = await getEuropostOffices({
          orderId,
          cartToken,
        });

        if (cancelled) return;

        const points = (data.offices || []).map((office) => normalizePoint(office, 'europost'));

        setAllPoints(points);
        setFiltered(points);
      } catch {
        if (cancelled) return;

        setLoadError('Не удалось загрузить пункты выдачи');
        setAllPoints([]);
        setFiltered([]);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [orderId, cartToken]);

  useEffect(() => {
    if (!userCoords || !allPoints.length) return;

    const sorted = [...allPoints].sort((a, b) => {
      if (!a.lat || !a.lon) return 1;
      if (!b.lat || !b.lon) return -1;

      const dA = getDistanceKm(userCoords[0], userCoords[1], a.lat, a.lon);
      const dB = getDistanceKm(userCoords[0], userCoords[1], b.lat, b.lon);

      return dA - dB;
    });

    setAllPoints(sorted);

    if (!search.trim()) {
      setFiltered(sorted);
    }
  }, [userCoords]);

  useEffect(() => {
    if (!search.trim()) {
      setFiltered(allPoints);
      return;
    }

  const result = filterPvzOffices(allPoints, search);

    setFiltered(result);

    const withCoords = result.filter((point) => point.lat && point.lon);

    if (withCoords.length > 0) {
      const avgLat = withCoords.reduce((sum, p) => sum + p.lat, 0) / withCoords.length;
      const avgLon = withCoords.reduce((sum, p) => sum + p.lon, 0) / withCoords.length;
      setMapCenter({ coords: [avgLat, avgLon], zoom: 11 });
    }
  }, [search, allPoints]);

  useEffect(() => {
    return () => {
      if (searchTimer.current) {
        clearTimeout(searchTimer.current);
      }
    };
  }, []);

  const handleSearch = (event) => {
    clearTimeout(searchTimer.current);

    const value = event.target.value;

    searchTimer.current = setTimeout(() => setSearch(value), 300);
  };

  const handleCardClick = (point) => {
    if (point.lat && point.lon) {
      setMapCenter({ coords: [point.lat, point.lon], zoom: 17 });
    }
  };

  const handleDetailOpen = useCallback((point) => {
    setSelectedPoint(point);
    setCalcError(null);

    if (point.lat && point.lon) {
      setMapCenter({ coords: [point.lat, point.lon], zoom: 17 });
    }
  }, []);

  const handleBack = () => {
    setSelectedPoint(null);
    setCalcError(null);
  };

  const handleSelect = useCallback(async () => {
    if (!selectedPoint) return;

    if (!deliveryContext) {
      setCalcError('Не удалось рассчитать доставку: нет данных заказа');
      return;
    }

    if (!cartItems?.length) {
      setCalcError('Не удалось рассчитать доставку: нет товаров для расчёта');
      return;
    }

    setCalcLoading(true);
    setCalcError(null);

    try {
      const result = await calculateDelivery({
        ...deliveryContext,
        delivery_type: 'europost_pickup',
        pickup_point_id: selectedPoint.id,
        items: cartItems,
      });

      onSelect?.(selectedPoint, result);
    } catch (error) {
      if (error?.status === 422) {
        setCalcError('Самовывоз Европочтой недоступен для выбранных товаров. Выберите доставку.');
      } else {
        setCalcError(error?.message || 'Не удалось рассчитать доставку в выбранный ПВЗ');
      }
    } finally {
      setCalcLoading(false);
    }
  }, [selectedPoint, deliveryContext, cartItems, onSelect]);

  return (
    <>
      <div className={`pvz-layout pvz-layout--${mobileView} ${selectedPoint ? 'pvz-layout--pickup-detail' : 'pvz-layout--pickup-list'}`}>
        <aside className={`pvz-sidebar ${mobileView === 'list' ? 'is-active' : ''}`}>
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

          <div className="pvz-sidebar__list-content">
              <div className="pvz-search">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path
                    d="M17.5 17.5L13.875 13.875M15.8333 9.16667C15.8333 12.8486 12.8486 15.8333 9.16667 15.8333C5.48477 15.8333 2.5 12.8486 2.5 9.16667C2.5 5.48477 5.48477 2.5 9.16667 2.5C12.8486 2.5 15.8333 5.48477 15.8333 9.16667Z"
                    stroke="#9E9E9E"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>

                <input
                  className="pvz-search__input"
                  type="text"
                  placeholder="Введите название населённого пункта"
                  onChange={handleSearch}
                />
              </div>

              <div className="pvz-list">
                {loading && (
                  <div className="pvz-list__empty">Загрузка пунктов выдачи...</div>
                )}

                {!loading && loadError && (
                  <div className="pvz-list__empty">{loadError}</div>
                )}

                {!loading && !loadError && filtered.length === 0 && (
                  <div className="pvz-list__empty">Пункты выдачи не найдены</div>
                )}

                {!loading && !loadError && filtered.map((point) => (
                  <PvzCard
                    key={point.id}
                    point={point}
                    onClick={() => handleCardClick(point)}
                    onDetailClick={() => handleDetailOpen(point)}
                  />
                ))}
              </div>
          </div>

          {selectedPoint && (
            <div className="pvz-sidebar__detail">
              <PvzDetail
                point={selectedPoint}
                calcLoading={calcLoading}
                onBack={handleBack}
                onSelect={handleSelect}
              />

              {calcError && (
                <div className="delivery-geo-error" style={{ margin: '12px 16px' }}>
                  {calcError}
                </div>
              )}
            </div>
          )}
        </aside>

        <div className={`pvz-mobile-map ${mobileView === 'map' ? 'is-active' : ''}`}>
          <DeliveryMap
            mapId="pickup-tab-mobile-map"
            ymapsReady={ymapsReady}
            points={filtered}
            pinType="europost"
            centerOverride={mapCenter}
            onPinClick={handleDetailOpen}
          />
        </div>

        <div className="pvz-desktop-map">
          <DeliveryMap
            mapId="pickup-tab-map"
            ymapsReady={ymapsReady}
            points={filtered}
            pinType="europost"
            centerOverride={mapCenter}
            onPinClick={handleDetailOpen}
          />
        </div>
      </div>

      {selectedPoint && (
        <>
          <div className="pvz-detail-backdrop" />
          <div className="pvz-detail-sheet">
            <PvzDetail
              point={selectedPoint}
              calcLoading={calcLoading}
              onBack={handleBack}
              onSelect={handleSelect}
            />

            {calcError && (
              <div className="delivery-geo-error" style={{ margin: '12px 16px' }}>
                {calcError}
              </div>
            )}
          </div>
        </>
      )}

<div className="pvz-modal__footer">
  <button
    type="button"
    className="pvz-modal__map-button"
    onClick={() => setMobileView((view) => (view === 'list' ? 'map' : 'list'))}
  >
    {mobileView === 'list' ? (
      <>
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <path
            d="M3.333 4.167L7.5 2.5L12.5 4.167L16.667 2.5V15.833L12.5 17.5L7.5 15.833L3.333 17.5V4.167Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <path
            d="M7.5 2.5V15.833M12.5 4.167V17.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
        <span>Карта</span>
      </>
    ) : (
      <>
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <path
            d="M4.167 5H15.833M4.167 10H15.833M4.167 15H11.667"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
        <span>Список</span>
      </>
    )}
  </button>
</div>
    </>
  );
}
