'use client';

// components/delivery/map/DeliveryMap.js

import { useEffect, useRef } from 'react';
import { PIN_EUROPOST } from '@/hooks/usePvzData';

/**
 * DeliveryMap
 *
 * Универсальная карта для вкладок самовывоза и доставки.
 *
 * Props:
 *  - mapId         {string}   — уникальный id div-а карты
 *  - ymapsReady    {boolean}
 *  - points        {Array}    — список ПВЗ для отображения маркеров (режим pickup)
 *  - pinType       {'europost'|'delivery'} — тип пина
 *  - pinCoords     {[lat,lon]} — координаты одиночного пина (режим delivery)
 *  - centerOverride {object}  — {coords, zoom} — принудительно центрировать карту
 *  - onPinClick    {fn(point)} — клик на пин ПВЗ
 *  - onMapClick    {fn([lat,lon])} — клик по карте (режим delivery)
 */
export default function DeliveryMap({
  mapId = 'delivery-map',
  ymapsReady,
  points = [],
  pinType = 'europost',
  pinCoords = null,
  centerOverride = null,
  onPinClick,
  onMapClick,
}) {
  const mapRef       = useRef(null);
  const ymapInstance = useRef(null);
  const clusterer    = useRef(null);
  const deliveryPin  = useRef(null);

  // Инициализация карты
  useEffect(() => {
    if (!ymapsReady || !mapRef.current) return;
    let destroyed = false;

    window.ymaps.ready(() => {
      if (destroyed || ymapInstance.current) return;

      ymapInstance.current = new window.ymaps.Map(mapRef.current, {
        center: [53.9045, 27.5615],
        zoom: 10,
        controls: ['zoomControl'],
      });

      if (pinType === 'europost') {
        // Кластер для ПВЗ
        clusterer.current = new window.ymaps.Clusterer({
          preset: 'islands#invertedRedClusterIcons',
          groupByCoordinates: false,
        });
        ymapInstance.current.geoObjects.add(clusterer.current);
      }

      if (pinType === 'delivery') {
        // Одиночный жёлтый пин для адреса доставки
        deliveryPin.current = new window.ymaps.Placemark(
          pinCoords || [53.9045, 27.5615],
          {},
          { preset: 'islands#yellowDotIcon' }
        );
        ymapInstance.current.geoObjects.add(deliveryPin.current);

        // Клик по карте
        ymapInstance.current.events.add('click', (e) => {
          const pos = e.get('coords');
          deliveryPin.current.geometry.setCoordinates(pos);
          onMapClick?.(pos);
        });
      }
    });

    return () => {
      destroyed = true;
      if (ymapInstance.current) {
        ymapInstance.current.destroy();
        ymapInstance.current = null;
        clusterer.current = null;
        deliveryPin.current = null;
      }
    };
  }, [ymapsReady]);

  // Обновление маркеров ПВЗ
  useEffect(() => {
    if (pinType !== 'europost') return;
    if (!ymapInstance.current || !clusterer.current) return;

    window.ymaps.ready(() => {
      if (!clusterer.current) return;
      clusterer.current.removeAll();

      const placemarks = points
        .filter(p => p.lat && p.lon)
        .map(point => {
          const pm = new window.ymaps.Placemark(
            [point.lat, point.lon],
            { hintContent: point.city ? `${point.city}, ${point.address}` : point.address },
            {
              iconLayout: 'default#image',
              iconImageHref: PIN_EUROPOST,
              iconImageSize: [48, 51],
              iconImageOffset: [-24, -51],
            }
          );
          pm.events.add('click', () => onPinClick?.(point));
          return pm;
        });

      clusterer.current.add(placemarks);
    });
  }, [points, pinType]);

  // Принудительное центрирование (при клике на карточку ПВЗ)
  useEffect(() => {
    if (!centerOverride || !ymapInstance.current) return;
    ymapInstance.current.setCenter(centerOverride.coords, centerOverride.zoom || 15, { duration: 300 });
  }, [centerOverride]);

  // Обновление пина доставки при изменении coords
  useEffect(() => {
    if (pinType !== 'delivery' || !pinCoords) return;
    if (!deliveryPin.current || !ymapInstance.current) return;
    deliveryPin.current.geometry.setCoordinates(pinCoords);
    ymapInstance.current.setCenter(pinCoords, 15, { duration: 300 });
  }, [pinCoords, pinType]);

  return (
    <section className="pvz-map-wrap">
      <div
        ref={mapRef}
        id={mapId}
        style={{ width: '100%', height: '100%' }}
      />
    </section>
  );
}