'use client';

// components/delivery/modal/PickupTab.js

import { useEffect, useRef, useState, useCallback } from 'react';
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

export default function PickupTab({
  ymapsReady,
  cartToken,
  cartItems = [],
  onSelect,
  activeTab,
  setActiveTab,
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

  const searchTimer = useRef(null);

  // Геолокация при маунте
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
        .catch(() => {});
    });
  }, [ymapsReady]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setLoadError(null);

      try {
        const data = await getEuropostOffices(cartToken || null);

        if (cancelled) return;

        const points = (data.offices || []).map((office) => normalizePoint(office, 'europost'));

        setAllPoints(points);
        setFiltered(points);
      } catch (error) {
        if (cancelled) return;

        console.error('Ошибка загрузки ПВЗ:', error);
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
  }, [cartToken]);

  // Сортировка по близости когда есть геолокация и точки
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
    if (!search.trim()) setFiltered(sorted);
  }, [userCoords]);

  useEffect(() => {
    if (!search.trim()) {
      setFiltered(allPoints);
      return;
    }

    const q = search.toLowerCase();

    const result = allPoints.filter((point) =>
      point.city?.toLowerCase().includes(q) ||
      point.address?.toLowerCase().includes(q) ||
      point.name?.toLowerCase().includes(q)
    );

    setFiltered(result);

    const firstWithCoords = result.find(p => p.lat && p.lon);
    if (firstWithCoords) {
      setMapCenter({
        coords: [firstWithCoords.lat, firstWithCoords.lon],
        zoom: 12,
      });
    }
  }, [search, allPoints]);

  useEffect(() => {
    return () => {
      if (searchTimer.current) clearTimeout(searchTimer.current);
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

    if (!cartToken) {
      setCalcError('Не удалось рассчитать доставку: нет токена корзины');
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
        cart_token: cartToken,
        delivery_type: 'europost_pickup',
        pickup_point_id: selectedPoint.id,
        items: cartItems,
      });
      onSelect?.(selectedPoint, result);
    } catch (error) {
      console.error('Ошибка calculate europost_pickup:', error);
      setCalcError(error?.message || 'Не удалось рассчитать доставку в выбранный ПВЗ');
    } finally {
      setCalcLoading(false);
    }
  }, [selectedPoint, cartToken, cartItems, onSelect]);

  return (
    <div className="pvz-layout">
      <aside className="pvz-sidebar">
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

        {!selectedPoint ? (
          <>
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
          </>
        ) : (
          <>
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
          </>
        )}
      </aside>

      <DeliveryMap
        mapId="pickup-tab-map"
        ymapsReady={ymapsReady}
        points={filtered}
        pinType="europost"
        centerOverride={mapCenter}
        onPinClick={handleDetailOpen}
      />
    </div>
  );
}