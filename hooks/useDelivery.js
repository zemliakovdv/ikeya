'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  getDeliveryTypes,
  getPickupPoints,
  searchPickupPoints,
  calculateDelivery,
} from '@/lib/api/delivery';

/**
 * Универсальный хук для checkout:
 * - types/providers
 * - pickup points (list + search)
 * - calculate delivery
 */
export default function useDelivery() {
  const [types, setTypes] = useState([]); // [{key,name}]
  const [providers, setProviders] = useState([]); // ["ikea","europost",...]
  const [loadingTypes, setLoadingTypes] = useState(false);
  const [typesError, setTypesError] = useState('');

  const [pickupPoints, setPickupPoints] = useState([]); // [{id,provider,...}]
  const [loadingPoints, setLoadingPoints] = useState(false);
  const [pointsError, setPointsError] = useState('');

  const [calcResult, setCalcResult] = useState(null);
  const [loadingCalc, setLoadingCalc] = useState(false);
  const [calcError, setCalcError] = useState('');

  // чтобы не ловить гонки запросов
  const searchReqIdRef = useRef(0);
  const calcReqIdRef = useRef(0);

  // 1) types/providers
  useEffect(() => {
    let mounted = true;

    async function loadTypes() {
      setLoadingTypes(true);
      setTypesError('');
      try {
        const data = await getDeliveryTypes();
        if (!mounted) return;
        setTypes(Array.isArray(data?.types) ? data.types : []);
        setProviders(Array.isArray(data?.providers) ? data.providers : []);
      } catch (e) {
        if (!mounted) return;
        setTypesError(e?.message || 'Не удалось загрузить типы доставки');
      } finally {
        if (mounted) setLoadingTypes(false);
      }
    }

    loadTypes();
    return () => {
      mounted = false;
    };
  }, []);

  // 2) points: initial list
  const loadPickupPoints = useCallback(async () => {
    setLoadingPoints(true);
    setPointsError('');
    try {
      const data = await getPickupPoints();
      setPickupPoints(Array.isArray(data?.pickup_points) ? data.pickup_points : []);
    } catch (e) {
      setPointsError(e?.message || 'Не удалось загрузить ПВЗ');
    } finally {
      setLoadingPoints(false);
    }
  }, []);

  // 3) points: search
  const findPickupPoints = useCallback(async (query) => {
    const q = (query || '').trim();
    const reqId = ++searchReqIdRef.current;

    // пустая строка — возвращаемся к полному списку
    if (!q) {
      await loadPickupPoints();
      return;
    }

    setLoadingPoints(true);
    setPointsError('');

    try {
      const data = await searchPickupPoints(q);
      if (reqId !== searchReqIdRef.current) return; // устаревший ответ
      setPickupPoints(Array.isArray(data?.pickup_points) ? data.pickup_points : []);
    } catch (e) {
      if (reqId !== searchReqIdRef.current) return;
      setPointsError(e?.message || 'Поиск ПВЗ не удался');
    } finally {
      if (reqId === searchReqIdRef.current) setLoadingPoints(false);
    }
  }, [loadPickupPoints]);

  // 4) calculate
  const runCalculate = useCallback(async (payload) => {
    const reqId = ++calcReqIdRef.current;

    setLoadingCalc(true);
    setCalcError('');

    try {
      const data = await calculateDelivery(payload);
      if (reqId !== calcReqIdRef.current) return;
      setCalcResult(data || null);
      return data;
    } catch (e) {
      if (reqId !== calcReqIdRef.current) return;
      setCalcResult(null);
      setCalcError(e?.message || 'Не удалось рассчитать доставку');
      throw e;
    } finally {
      if (reqId === calcReqIdRef.current) setLoadingCalc(false);
    }
  }, []);

  return {
    // types/providers
    types,
    providers,
    loadingTypes,
    typesError,

    // pickup points
    pickupPoints,
    loadingPoints,
    pointsError,
    loadPickupPoints,
    findPickupPoints,

    // calculate
    calcResult,
    loadingCalc,
    calcError,
    runCalculate,
  };
}