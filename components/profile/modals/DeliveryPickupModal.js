// components/profile/modals/DeliveryPickupModal.js
'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Script from 'next/script';

const API_BASE_URL = 'http://45.135.234.22/api/v1';
const YMAPS_API_KEY = 'ВАШ_КЛЮЧ'; // вставь свой ключ

const FILTER_LABELS = {
  all: 'Все',
  ikea: 'Склад IKEA',
  europost: 'Европочта',
  autolight: 'Автолайт',
};

// Цвета маркеров по провайдеру
const PROVIDER_COLORS = {
  ikea: '#0058A3',
  europost: '#FF6600',
  autolight: '#00910A',
};

export default function DeliveryPickupModal({ onClose, onSelect }) {
  const [points, setPoints] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [ymapsReady, setYmapsReady] = useState(false);

  const mapRef = useRef(null);       // DOM-элемент
  const ymapInstance = useRef(null); // экземпляр карты
  const clusterer = useRef(null);    // кластеризатор
  const searchTimeout = useRef(null);

  // Загрузка ПВЗ
  useEffect(() => {
    async function loadAll() {
      setLoading(true);
      try {
        const [pvzRes, euroRes] = await Promise.all([
          fetch(`${API_BASE_URL}/delivery/pickup_points`),
          fetch(`${API_BASE_URL}/delivery/europost_offices`),
        ]);
        const pvzData = await pvzRes.json();
        const euroData = await euroRes.json();

        const pvzPoints = (pvzData.pickup_points || []).map(p => ({ ...p, _type: 'pvz' }));
        const euroPoints = (euroData.offices || []).map(o => ({
          id: o.external_id,
          provider: 'europost',
          name: o.name,
          city: o.city,
          address: o.address,
          phone: o.phone,
          working_hours: o.working_hours,
          lat: parseFloat(o.lat),
          lon: parseFloat(o.lon),
          _type: 'europost',
        }));

        const all = [...pvzPoints, ...euroPoints];
        setPoints(all);
        setFiltered(all);
      } catch (e) {
        console.error('Ошибка загрузки ПВЗ', e);
      } finally {
        setLoading(false);
      }
    }
    loadAll();
  }, []);

  // Инициализация карты когда ymaps загружен И DOM готов
  useEffect(() => {
    if (!ymapsReady || !mapRef.current) return;

    window.ymaps.ready(() => {
      // Если карта уже создана — не пересоздаём
      if (ymapInstance.current) return;

      ymapInstance.current = new window.ymaps.Map(mapRef.current, {
        center: [53.9045, 27.5615], // Минск
        zoom: 10,
        controls: ['zoomControl'],
      });

      clusterer.current = new window.ymaps.Clusterer({
        preset: 'islands#invertedBlueClusterIcons',
        groupByCoordinates: false,
      });

      ymapInstance.current.geoObjects.add(clusterer.current);
    });
  }, [ymapsReady]);

  // Обновляем маркеры при изменении filtered
  useEffect(() => {
    if (!ymapInstance.current || !clusterer.current) return;

    window.ymaps.ready(() => {
      clusterer.current.removeAll();

      const validPoints = filtered.filter(p => p.lat && p.lon);

      const placemarks = validPoints.map(point => {
        const color = PROVIDER_COLORS[point.provider] || '#757575';

        const placemark = new window.ymaps.Placemark(
          [point.lat, point.lon],
          {
            hintContent: point.name,
            balloonContent: `<b>${point.name}</b><br/>${point.city}, ${point.address}`,
          },
          {
            preset: 'islands#circleIcon',
            iconColor: color,
          }
        );

        placemark.events.add('click', () => {
          setSelectedPoint(point);
        });

        return placemark;
      });

      clusterer.current.add(placemarks);

      // Подгоняем bounds под все точки
      if (placemarks.length > 0) {
        ymapInstance.current.setBounds(
          clusterer.current.getBounds(),
          { checkZoomRange: true, zoomMargin: 40 }
        );
      }
    });
  }, [filtered]);

  // Центрируем на выбранной точке
  useEffect(() => {
    if (!ymapInstance.current || !selectedPoint?.lat || !selectedPoint?.lon) return;

    window.ymaps.ready(() => {
      ymapInstance.current.setCenter([selectedPoint.lat, selectedPoint.lon], 15, {
        duration: 300,
      });
    });
  }, [selectedPoint]);

  // Уничтожаем карту при закрытии модалки
  useEffect(() => {
    return () => {
      if (ymapInstance.current) {
        ymapInstance.current.destroy();
        ymapInstance.current = null;
        clusterer.current = null;
      }
    };
  }, []);

  // Фильтр по провайдеру + локальный поиск
  useEffect(() => {
    let result = points;
    if (activeFilter !== 'all') {
      result = result.filter(p => p.provider === activeFilter);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(p =>
        p.city?.toLowerCase().includes(q) ||
        p.address?.toLowerCase().includes(q) ||
        p.name?.toLowerCase().includes(q)
      );
    }
    setFiltered(result);
  }, [activeFilter, points, search]);

  // Поиск через API с debounce
  const handleSearch = useCallback((value) => {
    setSearch(value);
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    if (!value.trim()) return;

    searchTimeout.current = setTimeout(async () => {
      try {
        const res = await fetch(
          `${API_BASE_URL}/delivery/pickup_points_search?query=${encodeURIComponent(value)}`
        );
        const data = await res.json();
        const results = (data.pickup_points || []).map(p => ({ ...p, _type: 'pvz' }));
        const euro = points.filter(p =>
          p.provider === 'europost' &&
          (p.city?.toLowerCase().includes(value.toLowerCase()) ||
           p.address?.toLowerCase().includes(value.toLowerCase()))
        );
        setFiltered([...results, ...euro]);
      } catch (e) {
        console.error('Ошибка поиска ПВЗ', e);
      }
    }, 400);
  }, [points]);

  const handleSelect = () => {
    if (!selectedPoint) return;
    onSelect?.(selectedPoint);
    onClose();
  };

  return (
    <>
      {/* Подгружаем Яндекс.Карты если ещё не загружены */}
      <Script
        src={`https://api-maps.yandex.ru/2.1/?apikey=${YMAPS_API_KEY}&lang=ru_RU`}
        strategy="afterInteractive"
        onLoad={() => setYmapsReady(true)}
      />

      <div className="modal fade show d-block" style={{ zIndex: 1055 }} id="deliveryModal">
        <div className="modal-dialog modal-fullscreen modal-dialog-scrollable">
          <div className="modal-content">

            <div className="modal-header">
              <h5 className="modal-title">Адреса доставки</h5>
              <button type="button" className="btn-close" onClick={onClose} aria-label="Close" />
            </div>

            <div className="modal-body" style={{ padding: 0 }}>
              <section className="pvz-map">
                <div className="container">
                  <div className="row">
                    <div className="col-12">
                      <div className="page">
                        <div className="layout">

                          <aside className="sidebar">
                            <div className="sidebar-search">
                              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M18.1665 17.3417L14.8165 13.9917C15.9332 12.6833 16.6165 10.9917 16.6165 9.14166C16.6082 5.01666 13.2582 1.66666 9.1415 1.66666C5.02484 1.66666 1.6665 5.01666 1.6665 9.14166C1.6665 13.2667 5.0165 16.6167 9.1415 16.6167C10.9915 16.6167 12.6832 15.9333 13.9915 14.8167L17.3415 18.1667C17.4582 18.2833 17.5998 18.3333 17.7498 18.3333C17.8998 18.3333 18.0498 18.275 18.1582 18.1667C18.3832 17.9417 18.3832 17.575 18.1582 17.3417H18.1665ZM9.1415 15.45C5.6665 15.45 2.83317 12.6167 2.83317 9.14166C2.83317 5.66666 5.65817 2.83332 9.1415 2.83332C12.6248 2.83332 15.4498 5.66666 15.4498 9.14166C15.4498 12.6167 12.6165 15.45 9.1415 15.45Z" fill="#757575" />
                              </svg>
                              <input
                                className="search"
                                placeholder="Введите название населенного пункта"
                                value={search}
                                onChange={e => handleSearch(e.target.value)}
                              />
                            </div>

                            <div className="pvz-scroll" id="pvzList">
                              {loading ? (
                                <div className="pvz-loading">Загружаем точки выдачи…</div>
                              ) : filtered.length === 0 ? (
                                <div className="pvz-empty">Ничего не найдено</div>
                              ) : (
                                filtered.map(point => (
                                  <div
                                    key={`${point.provider}-${point.id}`}
                                    className={`pvz-item ${selectedPoint?.id === point.id ? 'pvz-item--active' : ''}`}
                                    onClick={() => setSelectedPoint(point)}
                                  >
                                    <div className={`pvz-item__badge pvz-item__badge--${point.provider}`}>
                                      {point.provider === 'ikea' ? 'IKEA'
                                        : point.provider === 'europost' ? 'Европочта'
                                        : point.provider}
                                    </div>
                                    <div className="pvz-item__name">{point.name}</div>
                                    <div className="pvz-item__address">{point.city}, {point.address}</div>
                                    {point.working_hours && (
                                      <div className="pvz-item__hours">{point.working_hours}</div>
                                    )}
                                  </div>
                                ))
                              )}
                            </div>
                          </aside>

                          <section className="map-wrapper">
                            <div className="map-filters">
                              {Object.entries(FILTER_LABELS).map(([key, label]) => (
                                <button
                                  key={key}
                                  data-filter={key}
                                  className={activeFilter === key ? 'active' : ''}
                                  onClick={() => setActiveFilter(key)}
                                >
                                  {key === 'all' && (
                                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                      <path d="M6.97492 14.235C6.83992 14.235 6.70492 14.1825 6.60742 14.085L1.64992 9.135C1.44742 8.9325 1.44742 8.6025 1.64992 8.3925C1.85242 8.1825 2.18242 8.19 2.39242 8.3925L6.96742 12.9675L15.5999 3.9225C15.8024 3.7125 16.1324 3.705 16.3424 3.9075C16.5524 4.11 16.5599 4.44 16.3574 4.65L7.35742 14.0775C7.25992 14.1825 7.12492 14.235 6.98242 14.2425L6.97492 14.235Z" fill="white" />
                                    </svg>
                                  )}
                                  {' '}{label}
                                </button>
                              ))}
                            </div>

                            {/* Яндекс.Карта */}
                            <div
                              id="map"
                              ref={mapRef}
                              style={{ width: '100%', height: '100%', minHeight: '500px' }}
                            />
                          </section>

                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </div>

          </div>
        </div>
      </div>

      {/* Offcanvas — детали ПВЗ */}
      {selectedPoint && (
        <div className="offcanvas offcanvas-start show" style={{ zIndex: 1060 }}>
          <div className="offcanvas-header" />
          <div className="offcanvas-body">
            <div className="more-pvz_inner">
              <div className="more-pvz_title">
                <h5>{selectedPoint.city}, {selectedPoint.address}</h5>
                <button type="button" className="btn-close" onClick={() => setSelectedPoint(null)} aria-label="Закрыть" />
              </div>
              <div className="more-pvz_contant">
                {selectedPoint.phone && (
                  <div className="pvz-contatc_point">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M14.1666 18.3334C13.8833 18.3334 13.5999 18.3084 13.3166 18.25C12.0583 18 10.9666 17.575 9.74993 16.8834C7.07493 15.35 4.65827 12.9334 3.1166 10.25C2.42493 9.04169 1.99993 7.94169 1.74993 6.68336C1.40827 5.00836 2.10827 3.22502 3.55827 2.04169C3.93327 1.73336 4.3666 1.61669 4.7916 1.69169C5.2166 1.77502 5.58327 2.05002 5.8166 2.47502L6.4916 3.69169C7.0666 4.72502 7.38327 5.30002 7.3166 5.99169C7.2416 6.68336 6.8166 7.17502 6.0416 8.06669L4.33327 10.025C5.69993 12.275 7.72493 14.2917 9.97493 15.6667L11.9333 13.9584C12.8249 13.1834 13.3166 12.75 14.0083 12.6834C14.6999 12.6084 15.2666 12.925 16.3083 13.5084L17.5249 14.1834C17.9499 14.4167 18.2249 14.7834 18.3083 15.2084C18.3916 15.6334 18.2666 16.075 17.9583 16.4417C16.9749 17.65 15.5749 18.3334 14.1666 18.3334Z" fill="#181818" />
                    </svg>
                    <span>{selectedPoint.phone}</span>
                  </div>
                )}
                {selectedPoint.working_hours && (
                  <div className="pvz-contatc_point">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9.99984 18.3334C5.40817 18.3334 1.6665 14.5917 1.6665 10.0001C1.6665 5.40841 5.40817 1.66675 9.99984 1.66675C14.5915 1.66675 18.3332 5.40841 18.3332 10.0001C18.3332 14.5917 14.5915 18.3334 9.99984 18.3334ZM9.99984 2.83341C6.04984 2.83341 2.83317 6.05008 2.83317 10.0001C2.83317 13.9501 6.04984 17.1667 9.99984 17.1667C13.9498 17.1667 17.1665 13.9501 17.1665 10.0001C17.1665 6.05008 13.9498 2.83341 9.99984 2.83341Z" fill="#181818" />
                      <path d="M11.5498 12.1333C11.3998 12.1333 11.2498 12.075 11.1415 11.9666L9.59147 10.4166C9.48314 10.3083 9.4248 10.1583 9.4248 10.0083V6.90828C9.4248 6.58328 9.68314 6.32495 10.0081 6.32495C10.3331 6.32495 10.5915 6.58328 10.5915 6.90828V9.76662L11.9748 11.15C12.1998 11.375 12.1998 11.7416 11.9748 11.975C11.8581 12.0916 11.7165 12.1416 11.5665 12.1416L11.5498 12.1333Z" fill="#181818" />
                    </svg>
                    <span>{selectedPoint.working_hours}</span>
                  </div>
                )}
              </div>
              <div className="more-pvz_down">
                <button className="more-pvz_choosen" onClick={handleSelect}>
                  Выбрать
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="modal-backdrop fade show" onClick={onClose} style={{ zIndex: 1054 }} />
    </>
  );
}