'use client';

// components/pvz/PvzMapContent.js
// Общий UI для страницы /pvz и модалки в чекауте

import { useEffect, useRef, useState } from 'react';
import { usePvzData, PROVIDER_PINS, getCardTitle } from '@/hooks/usePvzData';

const YMAPS_API_KEY = 'ee57964a-5010-4536-9733-41c78d29d531';

const FILTER_LABELS = {
  all:       'Все',
  ikea:      'Склад IKEYA',
  europost:  'Европочта',
  autolight: 'Автолайт',
};

// ─── Иконки провайдеров для карточек ─────────────────────────────────────────

const ICON_IKEA = (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="12" fill="white"/>
    <circle cx="12" cy="12" r="10.8" fill="#FFDB00"/>
    <path d="M5.53 14.251V9.958C5.53 9.479 5.53 9.119 5.52 8.76H7.926C7.916 9.129 7.916 9.459 7.916 9.958V14.251C7.916 14.91 7.916 15.399 7.926 15.848H5.52C5.53 15.409 5.53 14.92 5.53 14.251Z" fill="#0058A3"/>
    <path d="M9.054 14.251V9.958C9.054 9.479 9.054 9.119 9.044 8.76H11.45C11.44 9.129 11.44 9.459 11.44 9.958V11.246H12.783C13.114 10.917 13.384 10.627 13.625 10.377L15.159 8.76H18.075L18.085 8.78C17.404 9.439 15.75 11.076 14.697 12.105C15.78 13.233 17.624 15.11 18.356 15.828L18.346 15.848H15.409L14.076 14.471C13.765 14.141 13.354 13.722 12.843 13.193H11.44V14.251C11.44 14.91 11.44 15.399 11.45 15.848H9.044C9.054 15.409 9.054 14.92 9.054 14.251Z" fill="#0058A3"/>
  </svg>
);

const ICON_EUROPOST = (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="12" fill="white"/>
    <circle cx="12" cy="12" r="10.8" fill="#FF0000"/>
    <path d="M16.3933 8.81333L17.1733 8.36667L12.1333 5.45333L7.09333 8.36667L8.56 9.19333L12.1333 7.09333L15.7067 9.2L16.3933 8.81333Z" fill="white"/>
    <path d="M12.7333 11.96V16.2533L14.1867 15.4133V12.52L16.3933 11.26V14.14L17.8533 13.3V9.04667H17.84L12.7333 11.96Z" fill="white"/>
    <path d="M12.7333 17.2267V18.6733H12.74L17.8533 15.7467V14.2867L12.7333 17.2267Z" fill="white"/>
    <path d="M11.54 18.6333V17.24L7.87333 15.16V13.8533L11.54 15.96V14.6333L7.87333 12.5333V11.1933L11.54 13.2867V11.96L7.87333 9.87333L6.42667 9.04667H6.41333V15.68L11.54 18.6333Z" fill="white"/>
  </svg>
);

const ICON_AUTOLIGHT = (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="12" fill="white"/>
    <circle cx="12" cy="12" r="10.8" fill="#FFD600"/>
    <text x="12" y="16" textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="9" fontWeight="700" fill="#333">АЛ</text>
  </svg>
);

const PROVIDER_ICONS = {
  ikea:      ICON_IKEA,
  europost:  ICON_EUROPOST,
  autolight: ICON_AUTOLIGHT,
};

/**
 * Props:
 *  - onSelect  {fn(point)}  — коллбэк при выборе ПВЗ (только в модалке)
 *  - mapId     {string}     — уникальный id для div карты (чтобы не конфликтовали)
 *  - ymapsReady {boolean}   — флаг готовности Яндекс.Карт (пробрасывается снаружи)
 */
export default function PvzMapContent({ onSelect, mapId = 'pvz-map', ymapsReady }) {
  const { filtered, activeFilter, setActiveFilter, loading, handleSearch } = usePvzData();
  const [selectedPoint, setSelectedPoint] = useState(null);

  const mapRef      = useRef(null);
  const ymapInstance = useRef(null);
  const clusterer   = useRef(null);

  // ─── Инициализация карты ───────────────────────────────────────────────────
  useEffect(() => {
    if (!ymapsReady || !mapRef.current) return;
    window.ymaps.ready(() => {
      if (ymapInstance.current) return;
      ymapInstance.current = new window.ymaps.Map(mapRef.current, {
        center: [53.9045, 27.5615],
        zoom: 10,
        controls: ['zoomControl'],
      });
      clusterer.current = new window.ymaps.Clusterer({
        preset:          'islands#invertedBlueClusterIcons',
        clusterIconColor: '#0058A3',
        groupByCoordinates: false,
      });
      ymapInstance.current.geoObjects.add(clusterer.current);
    });
  }, [ymapsReady]);

  // ─── Обновление маркеров ──────────────────────────────────────────────────
  useEffect(() => {
    if (!ymapInstance.current || !clusterer.current) return;
    window.ymaps.ready(() => {
      clusterer.current.removeAll();
      const placemarks = filtered
        .filter(p => p.lat && p.lon)
        .map(point => {
          const pm = new window.ymaps.Placemark(
            [point.lat, point.lon],
            {},
            {
              iconLayout:      'default#image',
              iconImageHref:   PROVIDER_PINS[point.provider] || PROVIDER_PINS.ikea,
              iconImageSize:   [48, 51],
              iconImageOffset: [-24, -51],
            }
          );
          pm.events.add('click', () => handleCardClick(point));
          return pm;
        });
      clusterer.current.add(placemarks);
    });
  }, [filtered]);

  const handleCardClick = (point) => {
    setSelectedPoint(point);
    if (ymapInstance.current && point.lat && point.lon) {
      ymapInstance.current.setCenter([point.lat, point.lon], 15, { duration: 300 });
    }
  };

  return (
    <>
      <div className="layout">

        {/* ─── Сайдбар ────────────────────────────────────────────────────── */}
        <aside className="sidebar">
          <div className="sidebar-search">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M17.5 17.5L13.875 13.875M15.8333 9.16667C15.8333 12.8486 12.8486 15.8333 9.16667 15.8333C5.48477 15.8333 2.5 12.8486 2.5 9.16667C2.5 5.48477 5.48477 2.5 9.16667 2.5C12.8486 2.5 15.8333 5.48477 15.8333 9.16667Z" stroke="#9E9E9E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <input
              className="search"
              type="text"
              placeholder="Поиск по адресу или городу"
              onChange={handleSearch}
            />
          </div>

          <div className="pvz-scroll">
            {loading && (
              <div style={{ textAlign: 'center', padding: '40px 0', color: '#9e9e9e' }}>
                Загрузка пунктов выдачи...
              </div>
            )}
            {!loading && filtered.length === 0 && (
              <div style={{ textAlign: 'center', padding: '40px 0', color: '#9e9e9e' }}>
                Пункты выдачи не найдены
              </div>
            )}
            {!loading && filtered.map((point) => (
              <div
                key={`${point._type}-${point.id}`}
                className={`pvz-card${selectedPoint?.id === point.id ? ' active' : ''}`}
                onClick={() => handleCardClick(point)}
              >
                <div className="pvz-card__header">
                  <span className="pvz-card__icon">
                    {PROVIDER_ICONS[point.provider]}
                  </span>
                  <span className="card-title">{getCardTitle(point)}</span>
                </div>

                {point.phone && (
                  <div className="card-info">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M11.3332 14.6667C11.1065 14.6667 10.8798 14.6467 10.6532 14.6C9.64652 14.4 8.77318 14.06 7.79985 13.5067C5.65985 12.28 3.72652 10.3467 2.49318 8.2C1.93985 7.23333 1.59985 6.35333 1.39985 5.34667C1.12652 4.00667 1.68652 2.58 2.84652 1.63333C3.14652 1.38667 3.49318 1.29333 3.83318 1.35333C4.17318 1.42 4.46652 1.64 4.65318 1.98L5.19318 2.95333C5.65318 3.78 5.90652 4.24 5.85318 4.79333C5.79318 5.34667 5.45318 5.74 4.83318 6.45333L3.46652 8.02C4.55985 9.82 6.17985 11.4333 7.97985 12.5333L9.54652 11.1667C10.2598 10.5467 10.6532 10.2 11.2065 10.1467C11.7598 10.0867 12.2132 10.34 13.0465 10.8067L14.0199 11.3467C14.3599 11.5333 14.5799 11.8267 14.6465 12.1667C14.7132 12.5067 14.6132 12.86 14.3665 13.1533C13.5799 14.12 12.4598 14.6667 11.3332 14.6667Z" fill="#181818"/>
                    </svg>
                    <a href={`tel:${point.phone}`}>{point.phone}</a>
                  </div>
                )}

                {point.working_hours && (
                  <div className="card-info">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M8.00016 14.6667C4.32683 14.6667 1.3335 11.6733 1.3335 8.00001C1.3335 4.32668 4.32683 1.33334 8.00016 1.33334C11.6735 1.33334 14.6668 4.32668 14.6668 8.00001C14.6668 11.6733 11.6735 14.6667 8.00016 14.6667ZM8.00016 2.26668C4.84016 2.26668 2.26683 4.84001 2.26683 8.00001C2.26683 11.16 4.84016 13.7333 8.00016 13.7333C11.1602 13.7333 13.7335 11.16 13.7335 8.00001C13.7335 4.84001 11.1602 2.26668 8.00016 2.26668Z" fill="#181818"/>
                      <path d="M9.24004 9.70666C9.12004 9.70666 9.00004 9.66 8.91337 9.57333L7.67337 8.33333C7.58671 8.24666 7.54004 8.12666 7.54004 8.00666V5.52666C7.54004 5.26666 7.74671 5.06 8.00671 5.06C8.26671 5.06 8.47337 5.26666 8.47337 5.52666V7.81333L9.58004 8.92C9.76004 9.1 9.76004 9.39333 9.58004 9.58C9.48671 9.67333 9.37337 9.71333 9.25337 9.71333L9.24004 9.70666Z" fill="#181818"/>
                    </svg>
                    <span>{point.working_hours}</span>
                  </div>
                )}

                <div className="card-more">
                  Подробнее
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M12.7749 9.99999C12.7749 10.9333 10.2415 13.1667 8.12488 14.875C7.88321 15.0667 7.53321 15.0333 7.34155 14.7917C7.14988 14.55 7.18321 14.2 7.42488 14.0083C9.28321 12.5083 11.3749 10.5917 11.6499 9.99999C11.3749 9.40833 9.28321 7.49166 7.42488 5.99166C7.18321 5.79999 7.14988 5.44999 7.34155 5.20833C7.53321 4.96666 7.88321 4.93333 8.12488 5.12499C10.2499 6.83333 12.7749 9.07499 12.7749 9.99999Z" fill="#757575"/>
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* ─── Карта ──────────────────────────────────────────────────────── */}
        <section className="map-wrapper">
          <div className="map-filters">
            {Object.entries(FILTER_LABELS).map(([key, label]) => (
              <button
                key={key}
                className={activeFilter === key ? 'active' : ''}
                onClick={() => setActiveFilter(key)}
              >
                {key === 'all' && (
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path d="M6.97492 14.235C6.83992 14.235 6.70492 14.1825 6.60742 14.085L1.64992 9.135C1.44742 8.9325 1.44742 8.6025 1.64992 8.3925C1.85242 8.1825 2.18242 8.19 2.39242 8.3925L6.96742 12.9675L15.5999 3.9225C15.8024 3.7125 16.1324 3.705 16.3424 3.9075C16.5524 4.11 16.5599 4.44 16.3574 4.65L7.35742 14.0775C7.25992 14.1825 7.12492 14.235 6.98242 14.2425L6.97492 14.235Z" fill="white"/>
                  </svg>
                )}
                {' '}{label}
              </button>
            ))}
          </div>
          <div ref={mapRef} id={mapId} style={{ width: '100%', height: '100%', minHeight: '500px' }} />
        </section>
      </div>

      {/* ─── Offcanvas — детали ПВЗ ─────────────────────────────────────── */}
      {selectedPoint && (
        <div className="offcanvas offcanvas-start show" style={{ zIndex: 1060 }}>
          <div className="offcanvas-header" />
          <div className="offcanvas-body">
            <div className="more-pvz_inner">
              <div className="more-pvz_title">
                <h5>{getCardTitle(selectedPoint)}</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setSelectedPoint(null)}
                  aria-label="Закрыть"
                />
              </div>
              <div className="more-pvz_contant">
                {selectedPoint.phone && (
                  <div className="pvz-contatc_point">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M14.1666 18.3334C13.8833 18.3334 13.5999 18.3084 13.3166 18.25C12.0583 18 10.9666 17.575 9.74993 16.8834C7.07493 15.35 4.65827 12.9334 3.1166 10.25C2.42493 9.04169 1.99993 7.94169 1.74993 6.68336C1.40827 5.00836 2.10827 3.22502 3.55827 2.04169C3.93327 1.73336 4.3666 1.61669 4.7916 1.69169C5.2166 1.77502 5.58327 2.05002 5.8166 2.47502L6.4916 3.69169C7.0666 4.72502 7.38327 5.30002 7.3166 5.99169C7.2416 6.68336 6.8166 7.17502 6.0416 8.06669L4.33327 10.025C5.69993 12.275 7.72493 14.2917 9.97493 15.6667L11.9333 13.9584C12.8249 13.1834 13.3166 12.75 14.0083 12.6834C14.6999 12.6084 15.2666 12.925 16.3083 13.5084L17.5249 14.1834C17.9499 14.4167 18.2249 14.7834 18.3083 15.2084C18.3916 15.6334 18.2666 16.075 17.9583 16.4417C16.9749 17.65 15.5749 18.3334 14.1666 18.3334Z" fill="#181818"/>
                    </svg>
                    <span>{selectedPoint.phone}</span>
                  </div>
                )}
                {selectedPoint.working_hours && (
                  <div className="pvz-contatc_point">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M9.99984 18.3334C5.40817 18.3334 1.6665 14.5917 1.6665 10.0001C1.6665 5.40841 5.40817 1.66675 9.99984 1.66675C14.5915 1.66675 18.3332 5.40841 18.3332 10.0001C18.3332 14.5917 14.5915 18.3334 9.99984 18.3334ZM9.99984 2.83341C6.04984 2.83341 2.83317 6.05008 2.83317 10.0001C2.83317 13.9501 6.04984 17.1667 9.99984 17.1667C13.9498 17.1667 17.1665 13.9501 17.1665 10.0001C17.1665 6.05008 13.9498 2.83341 9.99984 2.83341Z" fill="#181818"/>
                      <path d="M11.5498 12.1333C11.3998 12.1333 11.2498 12.075 11.1415 11.9666L9.59147 10.4166C9.48314 10.3083 9.4248 10.1583 9.4248 10.0083V6.90828C9.4248 6.58328 9.68314 6.32495 10.0081 6.32495C10.3331 6.32495 10.5915 6.58328 10.5915 6.90828V9.76662L11.9748 11.15C12.1998 11.375 12.1998 11.7416 11.9748 11.975C11.8581 12.0916 11.7165 12.1416 11.5665 12.1416L11.5498 12.1333Z" fill="#181818"/>
                    </svg>
                    <span>{selectedPoint.working_hours}</span>
                  </div>
                )}
              </div>

              {/* Кнопка «Выбрать» — только в модалке */}
              {onSelect && (
                <div className="more-pvz_down">
                  <button
                    className="more-pvz_choosen"
                    onClick={() => onSelect(selectedPoint)}
                  >
                    Выбрать
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}