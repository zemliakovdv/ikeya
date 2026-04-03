'use client';

import { useEffect, useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const API_BASE_URL = 'http://45.135.234.22';

function parseIncludedSkus(included_products) {
  if (!Array.isArray(included_products) || included_products.length === 0) return [];
  const raw = included_products[0];
  if (!raw) return [];
  if (typeof raw === 'string') {
    try { return JSON.parse(raw); } catch { return []; }
  }
  if (Array.isArray(raw)) return raw;
  return [];
}

function resolveImage(path) {
  if (!path) return '/assets/img/no-image.jpg';
  if (path.startsWith('http')) return path;
  const clean = path.startsWith('/') ? path.slice(1) : path;
  return `${API_BASE_URL}/${clean}`;
}

export default function ItemsTab({ product }) {
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const paginationRef = useRef(null);

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const skus = parseIncludedSkus(product?.attributes?.included_products);

  useEffect(() => {
    if (skus.length === 0) { setLoading(false); return; }

    async function loadItems() {
      setLoading(true);
      try {
        const results = await Promise.all(
          skus.map(sku =>
            fetch(`${API_BASE_URL}/api/v1/products/${sku}`)
              .then(r => r.ok ? r.json() : null)
              .catch(() => null)
          )
        );
        setItems(results.filter(Boolean).map(r => r.data).filter(Boolean));
      } catch {
        setItems([]);
      } finally {
        setLoading(false);
      }
    }

    loadItems();
  }, [product?.id]);

  if (loading) {
    return (
      <div className="tab-predmety__content">
        <p>Загрузка...</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="tab-predmety__content">
        <p>Нет доступных предметов в наборе.</p>
      </div>
    );
  }

  return (
    <div className="tab-predmety__content">
      <div className="predmety-content__slider">
        <Swiper
          modules={[Navigation, Pagination]}
          spaceBetween={20}
          slidesPerView={1}
          navigation={{ prevEl: prevRef.current, nextEl: nextRef.current }}
          pagination={{ el: paginationRef.current, clickable: true }}
          onBeforeInit={(swiper) => {
            swiper.params.navigation.prevEl = prevRef.current;
            swiper.params.navigation.nextEl = nextRef.current;
            swiper.params.pagination.el = paginationRef.current;
          }}
          breakpoints={{
            640: { slidesPerView: 2 },
            992: { slidesPerView: 3 },
            1200: { slidesPerView: 4 },
          }}
        >
          {items.map((item) => {
            const attr = item.attributes || {};
            const img = resolveImage(attr.local_images?.[0]);
            const name = attr.small_desc_name || attr.name_ru || attr.name || 'Товар';
            const sku = attr.sku || item.id;

            return (
              <SwiperSlide key={item.id} className="predmety-slider__card">
                <a href={`/product/${sku}`}>
                  <img src={img} alt={name} onError={(e) => { e.target.src = '/assets/img/no-image.jpg'; }} />
                  <p className="predmety-card__title">{name}</p>
                  <p className="predmety-card__sku">Арт. {sku}</p>
                </a>
              </SwiperSlide>
            );
          })}
        </Swiper>

        {/* Пагинация */}
        <div className="predmety-slider__pagination" ref={paginationRef} />

        {/* Навигация */}
        <button className="predmety-slider__nav predmety-slider__nav-prev" ref={prevRef} type="button">
          <svg width="7" height="12" viewBox="0 0 7 12" fill="none">
            <path d="M6 1L1 6L6 11" stroke="#181818" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <button className="predmety-slider__nav predmety-slider__nav-next" ref={nextRef} type="button">
          <svg width="7" height="12" viewBox="0 0 7 12" fill="none">
            <path d="M1 11L6 6L1 1" stroke="#181818" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </div>
  );
}