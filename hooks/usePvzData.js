// hooks/usePvzData.js
'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

import { buildApiUrl } from '@/lib/config/api';

// ─── Пины для карты ───────────────────────────────────────────────────────────

const makePinSvg = (bgColor, innerSvg) =>
  `data:image/svg+xml;charset=utf-8,${encodeURIComponent(`<svg width="48" height="51" viewBox="0 0 48 51" fill="none" xmlns="http://www.w3.org/2000/svg">
  <g filter="url(#f)">
    <path d="M25.41 43.59C24.63 44.37 23.36 44.37 22.58 43.59L15.41 36.42C14.15 35.16 15.04 33.01 16.82 33.01H31.16C32.94 33.01 33.83 35.16 32.57 36.42L25.4 43.59H25.41Z" fill="white"/>
    <path d="M42 21C42 30.94 33.94 39 24 39C14.06 39 6 30.94 6 21C6 11.06 14.06 3 24 3C33.94 3 42 11.06 42 21Z" fill="white"/>
    <circle cx="24" cy="21" r="16.2" fill="${bgColor}"/>
    ${innerSvg}
  </g>
  <defs>
    <filter id="f" x="-2" y="-2" width="56" height="56" filterUnits="userSpaceOnUse">
      <feFlood flood-opacity="0" result="BackgroundImageFix"/>
      <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
      <feOffset dx="2" dy="2"/><feGaussianBlur stdDeviation="2"/>
      <feComposite in2="hardAlpha" operator="out"/>
      <feColorMatrix type="matrix" values="0 0 0 0 0.13 0 0 0 0 0.13 0 0 0 0 0.13 0 0 0 0.2 0"/>
      <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow"/>
      <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape"/>
    </filter>
  </defs>
</svg>`)}`;

export const PIN_IKEA = makePinSvg('#FFDB00', `
  <path d="M14.295 24.377V17.937C14.295 17.218 14.295 16.679 14.28 16.14H17.889C17.874 16.694 17.874 17.188 17.874 17.937V24.377C17.874 25.365 17.874 26.099 17.889 26.773H14.28C14.295 26.114 14.295 25.38 14.295 24.377Z" fill="#0058A3"/>
  <path d="M19.581 24.377V17.937C19.581 17.218 19.581 16.679 19.566 16.14H23.175C23.16 16.694 23.16 17.188 23.16 17.937V19.869H25.174C25.67 19.375 26.076 18.94 26.437 18.566L28.738 16.14H33.113L33.128 16.17C32.106 17.158 29.625 19.614 28.046 21.157C29.67 22.849 32.437 25.664 33.534 26.743L33.519 26.773H29.114L27.114 24.706C26.648 24.212 26.031 23.583 25.265 22.789H23.16V24.377C23.16 25.365 23.16 26.099 23.175 26.773H19.566C19.581 26.114 19.581 25.38 19.581 24.377Z" fill="#0058A3"/>
`);

export const PIN_EUROPOST = makePinSvg('#FF0000', `
  <path d="M30.59 16.22L31.76 15.55L24.2 11.18L16.64 15.55L18.84 16.79L24.2 13.64L29.56 16.8L30.59 16.22Z" fill="white"/>
  <path d="M25.1 20.94V27.38L27.28 26.12V21.78L30.59 19.89V24.21L32.78 22.95V16.57H32.76L25.1 20.94Z" fill="white"/>
  <path d="M25.1 28.84V31.01H25.11L32.78 26.62V24.43L25.1 28.84Z" fill="white"/>
  <path d="M23.31 30.95V28.86L17.81 25.74V23.78L23.31 26.94V24.95L17.81 21.8V19.79L23.31 22.93V20.94L17.81 17.81L15.64 16.57H15.62V26.52L23.31 30.95Z" fill="white"/>
`);

export const PROVIDER_PINS = {
  ikea:     PIN_IKEA,
  europost: PIN_EUROPOST,
};

// ─── Нормализация ─────────────────────────────────────────────────────────────

function extractAddressFromName(name = '') {
  const commaIdx = name.indexOf(',');
  return commaIdx !== -1 ? name.slice(commaIdx + 1).trim() : name;
}

export function normalizePoint(raw, type) {
  if (type === 'pvz') return { ...raw, _type: 'pvz' };
  if (type === 'europost') {
    return {
      id:                         raw.external_id,
      provider:                   'europost',
      name:                       raw.name,
      city:                       raw.city,
      address:                    extractAddressFromName(raw.name),
      phone:                      raw.phone || null,
      working_hours:              raw.working_hours || null,
      schedules:                  raw.schedules || [],
      break_hours:                raw.break_hours || null,
      delivery_date:              raw.delivery_date || null,
      storage_until:              raw.storage_until || null,
      delivery_price_byn:         raw.delivery_price_byn || null,
      total_delivery_price_byn:   raw.total_delivery_price_byn || null,
      available_for_cart:         raw.available_for_cart ?? true,
      max_weight_kg:              raw.max_weight_kg || null,
      lat:                        raw.lat ? parseFloat(raw.lat) : null,
      lon:                        raw.lon ? parseFloat(raw.lon) : null,
      _type:                      'europost',
    };
  }
  return raw;
}

export function getCardTitle(point) {
  if (point.city && point.address) return `${point.city}, ${point.address}`;
  if (point.address) return point.address;
  if (point.city) return point.city;
  return point.name || '—';
}

// ─── Хук ──────────────────────────────────────────────────────────────────────

export function usePvzData() {
  const [points,       setPoints]       = useState([]);
  const [filtered,     setFiltered]     = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [search,       setSearch]       = useState('');
  const [loading,      setLoading]      = useState(true);

  const searchTimer = useRef(null);

  useEffect(() => {
    async function loadAll() {
      setLoading(true);
      try {
        const [pvzRes, euroRes] = await Promise.allSettled([
          fetch(buildApiUrl('/delivery/pickup_points')),
          fetch(buildApiUrl('/delivery/europost_offices')),
        ]);

        const pvzPoints = pvzRes.status === 'fulfilled' && pvzRes.value.ok
          ? ((await pvzRes.value.json()).pickup_points || []).map(p => normalizePoint(p, 'pvz'))
          : [];

        const euroPoints = euroRes.status === 'fulfilled' && euroRes.value.ok
          ? ((await euroRes.value.json()).offices || []).map(o => normalizePoint(o, 'europost'))
          : [];

        const all = [...pvzPoints, ...euroPoints];
        setPoints(all);
        setFiltered(all);
      } catch (e) {
        console.error('Ошибка загрузки ПВЗ:', e);
      } finally {
        setLoading(false);
      }
    }
    loadAll();
  }, []);

  useEffect(() => {
    let result = [...points];
    if (activeFilter !== 'all') {
      result = result.filter(p => p.provider === activeFilter);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(p =>
        p.address?.toLowerCase().includes(q) ||
        p.city?.toLowerCase().includes(q) ||
        p.name?.toLowerCase().includes(q)
      );
    }
    setFiltered(result);
  }, [activeFilter, search, points]);

  const handleSearch = useCallback((e) => {
    const val = e.target.value;
    clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => setSearch(val), 300);
  }, []);

  return {
    filtered,
    activeFilter,
    setActiveFilter,
    loading,
    handleSearch,
  };
}