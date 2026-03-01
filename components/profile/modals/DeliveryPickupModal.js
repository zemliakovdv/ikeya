// components/profile/modals/DeliveryPickupModal.js
'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Script from 'next/script';

const API_BASE_URL = 'http://45.135.234.22/api/v1';
const YMAPS_API_KEY = 'ee57964a-5010-4536-9733-41c78d29d531'; // вставь свой ключ

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
      const pvzRes = await fetch(`${API_BASE_URL}/delivery/pickup_points`);
      const pvzData = await pvzRes.json();
      const pvzPoints = (pvzData.pickup_points || []).map(p => ({ ...p, _type: 'pvz' }));

      let euroPoints = [];
      try {
        const euroRes = await fetch(`${API_BASE_URL}/delivery/europost_offices`);
        if (euroRes.ok) {
          const euroData = await euroRes.json();
          euroPoints = (euroData.offices || []).map(o => ({
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
        }
      } catch (e) {
        console.warn('Европочта недоступна:', e.message);
      }

      const all = [...pvzPoints, ...euroPoints];
      setPoints(all);
      setFiltered(all);
    } catch (e) {
      console.error('Ошибка загрузки ПВЗ:', e);
    } finally {
      setLoading(false);
    }
  }

  loadAll(); // ← вот этой строки не хватало
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
        className="pvz-card"
        data-id={point.id}
        type="button"
        onClick={() => setSelectedPoint(point)}
      >
        {/* Бейдж "Рекомендуем" — только для приоритетных точек */}
        {point.priority && (
          <div className="rec-badge">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10.8751 5.71001C10.8401 5.65001 10.8001 5.59001 10.7551 5.53001C10.3701 5.04501 9.71512 5.04501 8.40512 5.04501H8.21512C8.01012 5.04501 7.80012 5.04501 7.75512 5.02501C7.73012 5.01001 7.71512 4.99001 7.71012 4.97501C7.71012 4.92501 7.76512 4.73501 7.82012 4.55001L7.94512 4.15001C7.98012 4.03001 7.99512 3.97501 8.01012 3.92001C8.14512 3.37001 8.05512 2.80001 7.76512 2.31501C7.73512 2.26501 7.70012 2.21501 7.63012 2.11501C7.58012 2.04001 7.55012 2.00001 7.52512 1.97501C7.22512 1.63501 6.70512 1.60501 6.36012 1.90001C6.33512 1.92501 6.30012 1.95501 6.24012 2.02501L4.34012 4.13001C3.85012 4.67001 3.60512 4.94001 3.46512 5.31001C3.45512 5.34001 3.44512 5.37001 3.43512 5.40001C3.12512 5.12501 2.72012 4.95001 2.27512 4.95001C1.57012 4.95001 0.995117 5.52501 0.995117 6.23001V9.02001C0.995117 9.72501 1.57012 10.3 2.27512 10.3C2.84512 10.3 3.35012 10.02 3.66512 9.59501C3.71512 9.67001 3.77512 9.73501 3.84012 9.80001C4.35512 10.3 5.07012 10.3 6.49012 10.3H6.73012C7.89012 10.3 8.47012 10.3 8.99512 10C9.04512 9.97001 9.09512 9.94001 9.14512 9.90501C9.64512 9.56501 9.88512 9.04501 10.3651 8.01001C10.9051 6.84501 11.1801 6.25501 10.8751 5.71001Z" fill="white" />
            </svg>
            <span>Рекомендуем</span>
          </div>
        )}

        {/* Заголовок — иконка провайдера + адрес */}
        <div className="card-title">
          {point.provider === 'ikea' ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M24 12C24 18.6274 18.6274 24 12 24C5.37258 24 0 18.6274 0 12C0 5.37258 5.37258 0 12 0C18.6274 0 24 5.37258 24 12Z" fill="white" />
              <path d="M22.8 12C22.8 17.9647 17.9647 22.8 12 22.8C6.03533 22.8 1.2 17.9647 1.2 12C1.2 6.03533 6.03533 1.2 12 1.2C17.9647 1.2 22.8 6.03533 22.8 12Z" fill="#FFDB00" />
              <path d="M5.52999 14.251V9.95803C5.52999 9.47881 5.52999 9.1194 5.51997 8.75999H7.92568C7.91566 9.12938 7.91566 9.45884 7.91566 9.95803V14.251C7.91566 14.9099 7.91566 15.3991 7.92568 15.8484H5.51997C5.52999 15.4091 5.52999 14.9199 5.52999 14.251Z" fill="#0058A3" />
              <path d="M9.05399 14.251V9.95803C9.05399 9.47881 9.05399 9.1194 9.04396 8.75999H11.4497C11.4397 9.12938 11.4397 9.45884 11.4397 9.95803V11.2459H12.7828C13.1136 10.9165 13.3843 10.6269 13.6248 10.3773L15.1585 8.75999H18.0754L18.0854 8.77995C17.4038 9.43888 15.7499 11.0762 14.6974 12.1045C15.78 13.2327 17.6243 15.1096 18.3561 15.8284L18.346 15.8484H15.4091L14.0759 14.4707C13.7652 14.1412 13.3542 13.7219 12.843 13.1927H11.4397V14.251C11.4397 14.9099 11.4397 15.3991 11.4497 15.8484H9.04396C9.05399 15.4091 9.05399 14.9199 9.05399 14.251Z" fill="#0058A3" />
            </svg>
          ) : point.provider === 'europost' ? (
            <span className="pvz-provider-label pvz-provider-label--europost">Европочта</span>
          ) : (
            <span className="pvz-provider-label pvz-provider-label--autolight">Автолайт</span>
          )}
          {point.city}, {point.address}
        </div>

        {/* Телефон */}
        {point.phone && (
          <div className="card-info">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M11.3332 14.6667C11.1065 14.6667 10.8798 14.6467 10.6532 14.6C9.64652 14.4 8.77318 14.06 7.79985 13.5067C5.65985 12.28 3.72652 10.3467 2.49318 8.2C1.93985 7.23333 1.59985 6.35333 1.39985 5.34667C1.12652 4.00667 1.68652 2.58 2.84652 1.63333C3.14652 1.38667 3.49318 1.29333 3.83318 1.35333C4.17318 1.42 4.46652 1.64 4.65318 1.98L5.19318 2.95333C5.65318 3.78 5.90652 4.24 5.85318 4.79333C5.79318 5.34667 5.45318 5.74 4.83318 6.45333L3.46652 8.02C4.55985 9.82 6.17985 11.4333 7.97985 12.5333L9.54652 11.1667C10.2598 10.5467 10.6532 10.2 11.2065 10.1467C11.7598 10.0867 12.2132 10.34 13.0465 10.8067L14.0199 11.3467C14.3599 11.5333 14.5799 11.8267 14.6465 12.1667C14.7132 12.5067 14.6132 12.86 14.3665 13.1533C13.5799 14.12 12.4598 14.6667 11.3332 14.6667Z" fill="#181818" />
            </svg>
            <a href={`tel:${point.phone}`}>{point.phone}</a>
          </div>
        )}

        {/* Часы работы */}
        {point.working_hours && (
          <div className="card-info">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8.00016 14.6667C4.32683 14.6667 1.3335 11.6733 1.3335 8.00001C1.3335 4.32668 4.32683 1.33334 8.00016 1.33334C11.6735 1.33334 14.6668 4.32668 14.6668 8.00001C14.6668 11.6733 11.6735 14.6667 8.00016 14.6667ZM8.00016 2.26668C4.84016 2.26668 2.26683 4.84001 2.26683 8.00001C2.26683 11.16 4.84016 13.7333 8.00016 13.7333C11.1602 13.7333 13.7335 11.16 13.7335 8.00001C13.7335 4.84001 11.1602 2.26668 8.00016 2.26668Z" fill="#181818" />
              <path d="M9.24004 9.70666C9.12004 9.70666 9.00004 9.66 8.91337 9.57333L7.67337 8.33333C7.58671 8.24666 7.54004 8.12666 7.54004 8.00666V5.52666C7.54004 5.26666 7.74671 5.06 8.00671 5.06C8.26671 5.06 8.47337 5.26666 8.47337 5.52666V7.81333L9.58004 8.92C9.76004 9.1 9.76004 9.39333 9.58004 9.58C9.48671 9.67333 9.37337 9.71333 9.25337 9.71333L9.24004 9.70666Z" fill="#181818" />
            </svg>
            <span>{point.working_hours}</span>
          </div>
        )}

        {/* Кнопка "Подробнее" */}
        <div className="card-more">
          Подробнее
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12.7749 9.99999C12.7749 10.9333 10.2415 13.1667 8.12488 14.875C7.88321 15.0667 7.53321 15.0333 7.34155 14.7917C7.14988 14.55 7.18321 14.2 7.42488 14.0083C9.28321 12.5083 11.3749 10.5917 11.6499 9.99999C11.3749 9.40833 9.28321 7.49166 7.42488 5.99166C7.18321 5.79999 7.14988 5.44999 7.34155 5.20833C7.53321 4.96666 7.88321 4.93333 8.12488 5.12499C10.2499 6.83333 12.7749 9.07499 12.7749 9.99999Z" fill="#757575" />
          </svg>
        </div>
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