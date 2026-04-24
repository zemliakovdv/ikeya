'use client';

// components/delivery/modal/PickupTab.js

import { useEffect, useRef, useState, useCallback } from 'react';
import { normalizePoint, getCardTitle, PIN_EUROPOST } from '@/hooks/usePvzData';
import PvzCard from '@/components/delivery/cards/PvzCard';
import PvzDetail from '@/components/delivery/cards/PvzDetail';
import DeliveryMap from '@/components/delivery/map/DeliveryMap';

const API_BASE_URL = 'https://test.ikeya.by/api/v1';

/**
 * PickupTab
 *
 * Props:
 *  - ymapsReady  {boolean}
 *  - cartToken   {string}
 *  - cartItems   {Array}  [{sku, quantity}]
 *  - onSelect    {fn(pvz, calcResult)}
 *  - activeTab   {'pickup'|'delivery'}
 *  - setActiveTab {fn}
 */
export default function PickupTab({ ymapsReady, cartToken, cartItems, onSelect, activeTab, setActiveTab }) {
  const [allPoints, setAllPoints]         = useState([]);
  const [filtered, setFiltered]           = useState([]);
  const [loading, setLoading]             = useState(true);
  const [search, setSearch]               = useState('');
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [calcLoading, setCalcLoading]     = useState(false);
  const [calcResult, setCalcResult]       = useState(null);
  const [mapCenter, setMapCenter]         = useState(null);

  const searchTimer = useRef(null);

  // Загружаем ПВЗ Европочты
  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE_URL}/delivery/europost_offices`);
        if (!res.ok) throw new Error('Failed');
        const data = await res.json();
        const points = (data.offices || []).map(o => normalizePoint(o, 'europost'));
        setAllPoints(points);
        setFiltered(points);
      } catch (e) {
        console.error('Ошибка загрузки ПВЗ:', e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // Фильтрация по поиску
  useEffect(() => {
    if (!search.trim()) { setFiltered(allPoints); return; }
    const q = search.toLowerCase();
    setFiltered(allPoints.filter(p =>
      p.city?.toLowerCase().includes(q) ||
      p.address?.toLowerCase().includes(q) ||
      p.name?.toLowerCase().includes(q)
    ));
  }, [search, allPoints]);

  const handleSearch = (e) => {
    clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => setSearch(e.target.value), 300);
  };

  // Клик на карточку — только центрируем карту
  const handleCardClick = (point) => {
    if (point.lat && point.lon) {
      setMapCenter({ coords: [point.lat, point.lon], zoom: 15 });
    }
  };

  // «Подробнее» или клик на пин — открываем детали + calculate
  const handleDetailOpen = useCallback(async (point) => {
    setSelectedPoint(point);
    setCalcResult(null);

    if (!cartToken || !cartItems?.length) return;

    setCalcLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/delivery/calculate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cart_token: cartToken,
          delivery_type: 'pickup',
          pickup_point_id: point.id,
          items: cartItems,
        }),
      });
      if (res.ok) setCalcResult(await res.json());
    } catch (e) {
      console.error('Ошибка calculate:', e);
    } finally {
      setCalcLoading(false);
    }
  }, [cartToken, cartItems]);

  const handleBack = () => {
    setSelectedPoint(null);
    setCalcResult(null);
  };

  const handleSelect = () => {
    onSelect?.(selectedPoint, calcResult);
  };

  return (
    <div className="pvz-layout">

      {/* Сайдбар */}
      <aside className="pvz-sidebar">

        {/* Табы */}
        <div className="pvz-modal__tabs">
          <button
            type="button"
            className={`pvz-modal__tab${activeTab === 'pickup' ? ' pvz-modal__tab--active' : ''}`}
            onClick={() => setActiveTab('pickup')}
          >
            Самовывоз
          </button>
          <button
            type="button"
            className={`pvz-modal__tab${activeTab === 'delivery' ? ' pvz-modal__tab--active' : ''}`}
            onClick={() => setActiveTab('delivery')}
          >
            Доставка
          </button>
        </div>

        {!selectedPoint ? (
          <>
            <div className="pvz-search">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M17.5 17.5L13.875 13.875M15.8333 9.16667C15.8333 12.8486 12.8486 15.8333 9.16667 15.8333C5.48477 15.8333 2.5 12.8486 2.5 9.16667C2.5 5.48477 5.48477 2.5 9.16667 2.5C12.8486 2.5 15.8333 5.48477 15.8333 9.16667Z" stroke="#9E9E9E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
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
              {!loading && filtered.length === 0 && (
                <div className="pvz-list__empty">Пункты выдачи не найдены</div>
              )}
              {!loading && filtered.map((point) => (
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
          <PvzDetail
            point={selectedPoint}
            calcResult={calcResult}
            calcLoading={calcLoading}
            onBack={handleBack}
            onSelect={handleSelect}
          />
        )}
      </aside>

      {/* Карта */}
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