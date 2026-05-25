'use client';

// components/delivery/map/DeliveryMap.js

import { useEffect, useRef } from 'react';
import { PIN_EUROPOST } from '@/hooks/usePvzData';

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
  const mapRef = useRef(null);
  const ymapInstance = useRef(null);
  const clusterer = useRef(null);
  const deliveryPin = useRef(null);
  const pointsRef = useRef(points);
  const onPinClickRef = useRef(onPinClick);
  const pinCoordsRef = useRef(pinCoords); // Баг 2: храним последние coords в ref
  const mapReadyRef = useRef(false);      // Баг 1: флаг готовности карты

  // Актуализируем refs при каждом рендере
  useEffect(() => {
    pointsRef.current = points;
  }, [points]);

  useEffect(() => {
    onPinClickRef.current = onPinClick;
  }, [onPinClick]);

  useEffect(() => {
    pinCoordsRef.current = pinCoords;
  }, [pinCoords]);

  // Хелпер — добавить маркеры в кластер
  function addPlacemarks(pts) {
    if (!clusterer.current) return;
    clusterer.current.removeAll();

    const placemarks = pts
      .filter(p => p.lat && p.lon)
      .map(point => {
        const pm = new window.ymaps.Placemark(
          [point.lat, point.lon],
          { hintContent: point.city ? `${point.city}, ${point.address}` : point.address },
          {
            iconLayout: 'default#image',
            iconImageHref: PIN_EUROPOST,
            iconImageSize: [48, 51],
            iconImageOffset: [-24, -45], // Баг 3: исправлен offset
          }
        );
        pm.events.add('click', () => onPinClickRef.current?.(point));
        return pm;
      });

    clusterer.current.add(placemarks);
  }

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
        clusterer.current = new window.ymaps.Clusterer({
          preset: 'islands#invertedRedClusterIcons',
          groupByCoordinates: false,
        });
        ymapInstance.current.geoObjects.add(clusterer.current);

        // Баг 1: используем setTimeout(0) чтобы гарантировать актуальный ref
        setTimeout(() => {
          if (!destroyed && pointsRef.current.length > 0) {
            addPlacemarks(pointsRef.current);
          }
          mapReadyRef.current = true;
        }, 0);
      }

      if (pinType === 'delivery') {
        // Баг 2: берём последние coords из ref, а не из замкнутого prop
        const initialCoords = pinCoordsRef.current || [53.9045, 27.5615];

        deliveryPin.current = new window.ymaps.Placemark(
          initialCoords,
          {},
          {
            iconLayout: 'default#image',
            iconImageHref: '/assets/img/pin.svg',
            iconImageSize: [40, 65],
            iconImageOffset: [-20, -65],
          }
        );
        ymapInstance.current.geoObjects.add(deliveryPin.current);
        deliveryPin.current.options.set('draggable', true);

        deliveryPin.current.events.add('dragend', () => {
          const pos = deliveryPin.current.geometry.getCoordinates();
          onMapClick?.(pos);
        });

        ymapInstance.current.events.add('click', (e) => {
          const pos = e.get('coords');
          deliveryPin.current.geometry.setCoordinates(pos);
          onMapClick?.(pos);
        });

        // Баг 2: если coords уже были до инициализации — центрируем карту
        if (pinCoordsRef.current) {
          ymapInstance.current.setCenter(pinCoordsRef.current, 15, { duration: 300 });
        }

        mapReadyRef.current = true;
      }
    });

    return () => {
      destroyed = true;
      mapReadyRef.current = false;
      if (ymapInstance.current) {
        ymapInstance.current.destroy();
        ymapInstance.current = null;
        clusterer.current = null;
        deliveryPin.current = null;
      }
    };
  }, [ymapsReady]);

  // Баг 1: обновление маркеров при изменении points
  useEffect(() => {
    if (pinType !== 'europost') return;
    if (!ymapInstance.current || !clusterer.current) return;
    if (!mapReadyRef.current) return;

    addPlacemarks(points);
  }, [points, pinType]);

  // Принудительное центрирование
  useEffect(() => {
    if (!centerOverride || !ymapInstance.current) return;
    ymapInstance.current.setCenter(centerOverride.coords, centerOverride.zoom || 15, { duration: 300 });
  }, [centerOverride]);

  // Баг 2: обновление пина доставки
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