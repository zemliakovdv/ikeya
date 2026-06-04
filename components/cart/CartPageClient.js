'use client';

import { useEffect, useMemo, useState, useCallback, useRef } from 'react';
import PageLoader from '@/components/ui/PageLoader';
import { useRouter } from 'next/navigation';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useAuthModals } from '@/components/auth/AuthModalsHost';
import { createDraft, getCheckoutSummary } from '@/lib/api/cart';

import CartItemsSection from './CartItemsSection';
import CartSummary from './CartSummary';

const DEFAULT_MIN_ORDER_AMOUNT = 150; // BYN

function toNumber(value, fallback = 0) {
  const normalized = String(value ?? '')
    .replace(/\s/g, '')
    .replace(',', '.');

  const num = Number.parseFloat(normalized);
  return Number.isFinite(num) ? num : fallback;
}

function formatAmount(value) {
  return toNumber(value).toLocaleString('ru-RU', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
}

function getCartItemSku(item) {
  return (
    item?.sku ||
    item?.product_sku ||
    item?.product?.sku ||
    item?.product?.data?.attributes?.sku ||
    item?.product?.attributes?.sku ||
    item?.attributes?.sku ||
    item?.attributes?.product_sku ||
    null
  );
}

function buildItemsPayload(sourceItems = []) {
  return sourceItems
    .map((item) => ({
      sku: getCartItemSku(item),
      quantity: item?.quantity || 1,
    }))
    .filter((item) => item.sku)
    .map((item) => ({
      sku: String(item.sku),
      quantity: Number(item.quantity || 1),
    }));
}

function sumItemsQuantity(items = []) {
  return items.reduce((acc, item) => acc + Number(item?.quantity || 0), 0);
}

function normalizeSummaryResponse(response) {
  const summary =
    response?.summary ||
    response?.data?.summary ||
    response?.cart?.totals ||
    response ||
    null;

  const delivery =
    response?.delivery ||
    response?.data?.delivery ||
    response?.cart?.delivery ||
    summary?.delivery ||
    null;

  if (!summary) return null;

  const responseItems = Array.isArray(response?.items)
    ? response.items
    : Array.isArray(summary?.items)
      ? summary.items
      : [];

  const meta = response?.meta || summary?.meta || response?.data?.meta || {};

const subtotal = toNumber(
    summary.subtotal_new_byn ??
    summary.items_total_byn ??
    response?.subtotal_new_byn ??
    response?.items_total_byn
  );

  const finalTotalRaw =
    summary.total_byn ??
    response?.total_byn ??
    summary.final_total_byn ??
    response?.final_total_byn ??
    null;

  return {
    subtotal,
    finalTotal: finalTotalRaw !== null ? toNumber(finalTotalRaw) : null,
    promoDiscount: toNumber(
      summary.discount_total_byn ??
      response?.discount_total_byn
    ),
    itemCount: Number(
      summary.items_count ??
      response?.items_count ??
      sumItemsQuantity(responseItems)
    ),
    totalWeight: toNumber(
      summary.total_weight_kg ??
      response?.total_weight_kg ??
      delivery?.total_weight_kg
    ),
    customsDuty: toNumber(
      summary.customs_total_byn ??
      response?.customs_total_byn
    ),
    deliveryToBelarus: toNumber(
      summary.delivery_to_belarus_byn ??
      response?.delivery_to_belarus_byn ??
      delivery?.delivery_to_belarus_byn
    ),
    logisticsDelivery: toNumber(
      summary.delivery_total_byn ??
      response?.delivery_total_byn ??
      delivery?.delivery_total_byn
    ),
    checkoutAllowed:
      typeof meta.checkout_allowed === 'boolean'
        ? meta.checkout_allowed
        : undefined,
    minOrderError:
      meta.min_order_error ||
      meta.min_order_message ||
      meta.checkout_error ||
      '',
    delivery,
  };
}

export default function CartPageClient() {
  const router = useRouter();
  const { isAuth } = useAuth();
  const { openLogin } = useAuthModals();

  const {
    cart,
    updateQuantity,
    removeFromCart,
    removeManyFromCart,
    refreshCart,
    availableItems,
    unavailableItems,
    totals,
    delivery,
    loading,
    items,
  } = useCart();

  const isInitialLoading = loading && (items || []).length === 0;

  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedUnavailable, setSelectedUnavailable] = useState([]);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [remoteSummary, setRemoteSummary] = useState(null);
  const [isCheckoutAuthFlowPending, setIsCheckoutAuthFlowPending] = useState(false);
  const [isPreparingCheckout, setIsPreparingCheckout] = useState(false);
  const [isGuestCartMergeDone, setIsGuestCartMergeDone] = useState(false);

  const handleCheckoutAuthorizedRef = useRef(null);
  const checkoutRetryTimerRef = useRef(null);
  const checkoutRetryCountRef = useRef(0);
  const checkoutAutoContinueRef = useRef(false);

  const minOrderAmount = toNumber(
    cart?.rules?.min_order_amount_byn,
    DEFAULT_MIN_ORDER_AMOUNT
  );

  const resetCheckoutAuthFlow = useCallback((options = {}) => {
    const { removePending = true } = options;

    if (checkoutRetryTimerRef.current) {
      clearTimeout(checkoutRetryTimerRef.current);
      checkoutRetryTimerRef.current = null;
    }

    checkoutRetryCountRef.current = 0;
    checkoutAutoContinueRef.current = false;

    if (removePending) {
      sessionStorage.removeItem('pendingCheckout');
    }

    setIsCheckoutAuthFlowPending(false);
    setIsPreparingCheckout(false);
    setIsGuestCartMergeDone(false);
  }, []);

  useEffect(() => {
    function onAuthDone() {
      const pending = sessionStorage.getItem('pendingCheckout');
      if (pending !== '1') return;

      if (checkoutRetryTimerRef.current) {
        clearTimeout(checkoutRetryTimerRef.current);
        checkoutRetryTimerRef.current = null;
      }

      checkoutRetryCountRef.current = 0;
      setIsCheckoutAuthFlowPending(true);
      setIsPreparingCheckout(true);
      setIsGuestCartMergeDone(false);
    }

    window.addEventListener('auth-change-done', onAuthDone);

    return () => window.removeEventListener('auth-change-done', onAuthDone);
  }, []);

  useEffect(() => {
    function onAuthModalClosed() {
      if (sessionStorage.getItem('pendingCheckout') !== '1' && !isCheckoutAuthFlowPending) {
        return;
      }

      resetCheckoutAuthFlow({ removePending: true });
    }

    window.addEventListener('auth-modal-closed', onAuthModalClosed);

    return () => window.removeEventListener('auth-modal-closed', onAuthModalClosed);
  }, [isCheckoutAuthFlowPending, resetCheckoutAuthFlow]);

  useEffect(() => {
    function onGuestCartMergeDone() {
      if (sessionStorage.getItem('pendingCheckout') !== '1') {
        return;
      }

      setIsGuestCartMergeDone(true);
    }

    window.addEventListener('guest-cart-merge-done', onGuestCartMergeDone);

    return () => window.removeEventListener('guest-cart-merge-done', onGuestCartMergeDone);
  }, []);

  const availableSkus = useMemo(
    () => (availableItems || [])
      .map((item) => getCartItemSku(item))
      .filter(Boolean)
      .map((sku) => String(sku)),
    [availableItems]
  );

  const availableSkusKey = availableSkus.join(',');

  const unavailableSkus = useMemo(
    () => (unavailableItems || [])
      .map((item) => getCartItemSku(item))
      .filter(Boolean)
      .map((sku) => String(sku)),
    [unavailableItems]
  );

  useEffect(() => {
    setSelectedItems((prev) => {
      const skus = availableSkusKey ? availableSkusKey.split(',') : [];

      if (prev.length === 0) return skus;

      const skuSet = new Set(skus);
      const filtered = prev.filter((sku) => skuSet.has(sku));
      const added = skus.filter((sku) => !prev.includes(sku));

      return [...filtered, ...added];
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [availableSkusKey]);

  const selectedAvailableItems = useMemo(() => {
    const selectedSet = new Set(selectedItems);

    return (availableItems || []).filter((item) => {
      const sku = getCartItemSku(item);
      return sku && selectedSet.has(String(sku));
    });
  }, [availableItems, selectedItems]);

  const selectedItemsPayload = useMemo(
    () => buildItemsPayload(selectedAvailableItems),
    [selectedAvailableItems]
  );

  const selectedItemsPayloadKey = useMemo(
    () => selectedItemsPayload.map((item) => `${item.sku}:${item.quantity}`).join('|'),
    [selectedItemsPayload]
  );

  useEffect(() => {
    if (!isCheckoutAuthFlowPending) return;
    if (!isAuth) return;
    if (checkoutAutoContinueRef.current) return;
    if (!isGuestCartMergeDone) return;

    const pending = sessionStorage.getItem('pendingCheckout');

    if (pending !== '1') {
      resetCheckoutAuthFlow({ removePending: false });
      return;
    }

    if (loading) return;

    if (!availableItems?.length) {
      if (checkoutRetryTimerRef.current) return;

      if (checkoutRetryCountRef.current >= 4) {
        resetCheckoutAuthFlow({ removePending: true });
        return;
      }

      checkoutRetryTimerRef.current = setTimeout(() => {
        checkoutRetryTimerRef.current = null;
        checkoutRetryCountRef.current += 1;

        if (!sessionStorage.getItem('pendingCheckout')) {
          resetCheckoutAuthFlow({ removePending: false });
          return;
        }

        refreshCart?.();
      }, checkoutRetryCountRef.current === 0 ? 600 : 500);

      return;
    }

    if (checkoutRetryTimerRef.current) {
      clearTimeout(checkoutRetryTimerRef.current);
      checkoutRetryTimerRef.current = null;
    }

    const fallbackPayload = buildItemsPayload(availableItems || []);

    if (!selectedAvailableItems.length || !selectedItemsPayload.length) {
      if (fallbackPayload.length > 0) {
        const fallbackSkus = fallbackPayload.map((item) => item.sku);
        setSelectedItems((prev) => {
          const current = (prev || []).map((sku) => String(sku));

          if (
            current.length === fallbackSkus.length &&
            current.every((sku, idx) => sku === fallbackSkus[idx])
          ) {
            return prev;
          }

          return fallbackSkus;
        });

        return;
      }

      resetCheckoutAuthFlow({ removePending: true });
      return;
    }

    checkoutAutoContinueRef.current = true;

    (async () => {
      const success = await handleCheckoutAuthorizedRef.current?.();

      if (success) {
        sessionStorage.removeItem('pendingCheckout');
        setIsCheckoutAuthFlowPending(false);
        setIsPreparingCheckout(false);
      } else {
        resetCheckoutAuthFlow({ removePending: true });
      }
    })().finally(() => {
      checkoutAutoContinueRef.current = false;
    });
  }, [
    isAuth,
    isCheckoutAuthFlowPending,
    isGuestCartMergeDone,
    loading,
    availableItems,
    selectedAvailableItems.length,
    selectedItemsPayloadKey,
    refreshCart,
    resetCheckoutAuthFlow,
  ]);

  const selectedDataFallback = useMemo(() => {
    if (!selectedAvailableItems.length) {
      return {
        subtotal: 0,
        finalTotal: 0,
        promoDiscount: 0,
        itemCount: 0,
        totalWeight: 0,
        customsDuty: 0,
        deliveryToBelarus: 0,
        logisticsDelivery: 0,
        checkoutAllowed: false,
        minOrderError: '',
        delivery: null,
      };
    }
  
    let subtotal = 0;
    let promoDiscount = 0;
    let itemCount = 0;
    let totalWeight = 0;
    let customsDuty = 0;
  
    selectedAvailableItems.forEach((item) => {
      const qty = Number(item?.quantity || 1);
  
      const lineTotal = toNumber(item?.pricing?.line_total_new_byn);
      const unitPrice = toNumber(item?.pricing?.unit_price_new_byn || item?.product?.price_byn);
      const lineDiscount = toNumber(item?.pricing?.line_discount_byn);
      const unitDiscount = toNumber(item?.pricing?.unit_discount_byn);
      const itemWeight = toNumber(item?.weight);
      const itemCustoms = toNumber(item?.pricing?.customs_total_byn);
  
      subtotal += lineTotal > 0 ? lineTotal : unitPrice * qty;
      promoDiscount += lineDiscount > 0 ? lineDiscount : unitDiscount * qty;
      itemCount += qty;
      customsDuty += itemCustoms;
  
      if (itemWeight > 0) {
        totalWeight += itemWeight * qty;
      }
    });
  
    return {
      subtotal: toNumber(subtotal.toFixed(2)),
      finalTotal: null,
      promoDiscount: toNumber(promoDiscount.toFixed(2)),
      itemCount,
      totalWeight: toNumber(totalWeight.toFixed(2)),
      customsDuty: toNumber(customsDuty.toFixed(2)),
      deliveryToBelarus: toNumber(
        delivery?.delivery_to_belarus_byn ||
        totals?.delivery_to_belarus_byn
      ),
      logisticsDelivery: toNumber(
        delivery?.delivery_total_byn ||
        totals?.delivery_total_byn
      ),
      checkoutAllowed: undefined,
      minOrderError: '',
      delivery,
    };
  }, [selectedAvailableItems, delivery, totals]);

  const selectedData = remoteSummary || selectedDataFallback;

  const fallbackCanCheckout = Boolean(
    selectedData.subtotal >= minOrderAmount &&
    selectedAvailableItems.length > 0
  );

  const canCheckout = Boolean(
    selectedAvailableItems.length > 0 &&
    (
      typeof selectedData.checkoutAllowed === 'boolean'
        ? selectedData.checkoutAllowed
        : fallbackCanCheckout
    )
  );

  const checkoutErrorMessage = selectedData.minOrderError ||
    `Оформление заказа доступно от ${formatAmount(minOrderAmount)} р. стоимости товаров`;

  const saveSummaryToSession = useCallback(() => {
    const summaryDelivery = selectedData.delivery || delivery;

    sessionStorage.setItem('checkoutSummary', JSON.stringify({
      subtotal: selectedData.subtotal,
      finalTotal: selectedData.finalTotal,
      promoDiscount: selectedData.promoDiscount,
      itemCount: selectedData.itemCount,
      totalWeight: selectedData.totalWeight,
      customsDuty: selectedData.customsDuty,
      delivery: selectedData.deliveryToBelarus,
      logisticsDelivery: selectedData.logisticsDelivery,
      europostEligible: summaryDelivery?.europost_eligible ?? null,
      availableMethods: summaryDelivery?.available_methods || [],
    }));
  }, [selectedData, delivery]);

  const handleCheckoutAuthorized = useCallback(async () => {
    if (!canCheckout) return false;

    setCheckoutLoading(true);

    try {
      try {
        const summaryResponse = await getCheckoutSummary();
        const checkoutData = summaryResponse?.checkout || summaryResponse;
        const normalized = normalizeSummaryResponse(checkoutData);
        if (normalized) setRemoteSummary(normalized);
      } catch {
        // Если summary не доступен — используем fallback из корзины
      }

      saveSummaryToSession();

      sessionStorage.setItem(
        'selectedSkus',
        JSON.stringify(selectedItemsPayload.map((item) => item.sku))
      );

      sessionStorage.setItem(
        'checkoutItemsPayload',
        JSON.stringify(selectedItemsPayload)
      );

      const response = await createDraft({
        items: selectedItemsPayload,
      });

      const draftId =
        response?.order_id ||
        response?.draft_order_id ||
        response?.id ||
        response?.data?.order_id ||
        response?.data?.id ||
        response?.data?.attributes?.id ||
        response?.order?.id ||
        response?.order?.order_id ||
        response?.order?.data?.id ||
        response?.order?.data?.attributes?.id;

      if (!draftId) {
        throw new Error('Бэк не вернул order_id черновика');
      }

      sessionStorage.setItem('checkoutDraftId', String(draftId));

      router.push(`/checkout?draft_id=${draftId}`);
      return true;
    } catch (err) {
      const conflictDraftId =
        err?.payload?.draft_order_id ||
        err?.payload?.order_id ||
        err?.payload?.draft?.id ||
        err?.payload?.order?.id;

      const isDraftConflict =
        err?.status === 409 ||
        err?.payload?.code === 'checkout_draft_exists';

      if (isDraftConflict && conflictDraftId) {
        sessionStorage.setItem('checkoutDraftId', String(conflictDraftId));
        router.push(`/checkout?draft_id=${conflictDraftId}`);
        return true;
      }

      return false;
    } finally {
      setCheckoutLoading(false);
    }
  }, [canCheckout, saveSummaryToSession, router, selectedItemsPayload]);

  handleCheckoutAuthorizedRef.current = handleCheckoutAuthorized;

  const handleCheckout = useCallback(() => {
    if (!selectedAvailableItems.length) {
      return;
    }

    if (isPreparingCheckout || checkoutLoading) {
      return;
    }

    if (!canCheckout) {
      return;
    }

    if (!isAuth) {
      if (checkoutRetryTimerRef.current) {
        clearTimeout(checkoutRetryTimerRef.current);
        checkoutRetryTimerRef.current = null;
      }

      checkoutRetryCountRef.current = 0;
      checkoutAutoContinueRef.current = false;
      saveSummaryToSession();
      sessionStorage.setItem('pendingCheckout', '1');
      openLogin();
      return;
    }

    handleCheckoutAuthorized();
  }, [
    selectedAvailableItems,
    canCheckout,
    checkoutErrorMessage,
    isAuth,
    isPreparingCheckout,
    checkoutLoading,
    openLogin,
    saveSummaryToSession,
    handleCheckoutAuthorized,
  ]);

  const handleQuantityChange = useCallback(async (sku, newQuantity) => {
    try {
      await updateQuantity(sku, newQuantity);
    } catch {
    }
  }, [updateQuantity]);

  const handleDelete = useCallback(async (sku) => {
    try {
      await removeFromCart(sku);
      setSelectedItems((prev) => prev.filter((s) => s !== sku));
    } catch {
    }
  }, [removeFromCart]);

  const handleCheckChange = useCallback((sku, checked) => {
    if (!sku) return;

    setSelectedItems((prev) => {
      const set = new Set(prev);

      if (checked) {
        set.add(sku);
      } else {
        set.delete(sku);
      }

      return Array.from(set);
    });
  }, []);

  const handleSelectAll = useCallback((checked) => {
    setSelectedItems(checked ? availableSkus : []);
  }, [availableSkus]);

  const handleCheckChangeUnavailable = useCallback((sku, checked) => {
    if (!sku) return;

    setSelectedUnavailable((prev) => {
      const set = new Set(prev);

      if (checked) {
        set.add(sku);
      } else {
        set.delete(sku);
      }

      return Array.from(set);
    });
  }, []);

  const handleSelectAllUnavailable = useCallback((checked) => {
    setSelectedUnavailable(checked ? unavailableSkus : []);
  }, [unavailableSkus]);

  const handleDeleteSelectedUnavailable = useCallback(async () => {
    if (!selectedUnavailable.length) return;

    try {
      await removeManyFromCart({ skus: selectedUnavailable });
      setSelectedUnavailable([]);
    } catch {
    }
  }, [removeManyFromCart, selectedUnavailable]);

  const handleDeleteSelected = useCallback(async () => {
    if (!selectedItems.length) return;

    try {
      await removeManyFromCart({ skus: selectedItems });
      setSelectedItems([]);
    } catch {
    }
  }, [removeManyFromCart, selectedItems]);

  const hasAvailableItems = (availableItems?.length || 0) > 0;
  const hasUnavailableItems = (unavailableItems?.length || 0) > 0;

  if (isInitialLoading || checkoutLoading || isPreparingCheckout) {
    return <PageLoader />;
  }

  return (
    <main className="korzina">
      <section className="zakaz">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="zakaz-inner">
                <h2>Корзина</h2>

                {selectedItems.length > 0 && !canCheckout && (
                  <div className="order-toast_choose">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path d="M12 2C6.49 2 2 6.49 2 12C2 17.51 6.49 22 12 22C17.51 22 22 17.51 22 12C22 6.49 17.51 2 12 2ZM11.3 8.28C11.3 7.89 11.61 7.58 12 7.58C12.39 7.58 12.7 7.89 12.7 8.28V12.47C12.7 12.86 12.39 13.17 12 13.17C11.61 13.17 11.3 12.86 11.3 12.47V8.28ZM12.83 15.72C12.83 16.18 12.46 16.56 11.99 16.56C11.52 16.56 11.15 16.18 11.15 15.72C11.15 15.26 11.52 14.88 11.99 14.88C12.46 14.88 12.83 15.25 12.83 15.71V15.72Z" fill="#B71C1C" />
                    </svg>
                    <p>{checkoutErrorMessage}</p>
                  </div>
                )}

                {hasAvailableItems && selectedItems.length === 0 && (
                  <div className="order-toast_choose">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path d="M12 2C6.49 2 2 6.49 2 12C2 17.51 6.49 22 12 22C17.51 22 22 17.51 22 12C22 6.49 17.51 2 12 2ZM11.3 8.28C11.3 7.89 11.61 7.58 12 7.58C12.39 7.58 12.7 7.89 12.7 8.28V12.47C12.7 12.86 12.39 13.17 12 13.17C11.61 13.17 11.3 12.86 11.3 12.47V8.28ZM12.83 15.72C12.83 16.18 12.46 16.56 11.99 16.56C11.52 16.56 11.15 16.18 11.15 15.72C11.15 15.26 11.52 14.88 11.99 14.88C12.46 14.88 12.83 15.25 12.83 15.71V15.72Z" fill="#B71C1C" />
                    </svg>
                    <p>Выберите товары, чтобы перейти к оформлению заказа</p>
                  </div>
                )}

                <div className="zakaz-content">
                  <div className={`cart${!hasAvailableItems && !hasUnavailableItems ? ' is-empty-cart' : ''}`}>
                    <div className="cart-layout">
                      <div className="cart-main">
                        {hasAvailableItems && (
                          <CartItemsSection
                            items={availableItems}
                            isUnavailable={false}
                            selectedItems={selectedItems}
                            onQuantityChange={handleQuantityChange}
                            onDelete={handleDelete}
                            onSelectAll={handleSelectAll}
                            onDeleteSelected={handleDeleteSelected}
                            onCheckChange={handleCheckChange}
                            loading={loading}
                          />
                        )}

                        {hasUnavailableItems && (
                          <CartItemsSection
                            items={unavailableItems}
                            isUnavailable={true}
                            selectedItems={selectedUnavailable}
                            onDelete={handleDelete}
                            onSelectAll={handleSelectAllUnavailable}
                            onDeleteSelected={handleDeleteSelectedUnavailable}
                            onCheckChange={handleCheckChangeUnavailable}
                            loading={loading}
                          />
                        )}

                        {!hasAvailableItems && !hasUnavailableItems && (
                          <div className="cart-empty">
                            <img src="/assets/img/cart/no-goods.png" alt="" />
                            <h3>Ваша корзина пуста</h3>
                            <button className="empty-btn" onClick={() => router.push('/')} type="button">
                              Перейти к покупкам
                            </button>
                          </div>
                        )}
                      </div>

                      {hasAvailableItems && (
                        <CartSummary
                          subtotal={selectedData.subtotal}
                          promoDiscount={selectedData.promoDiscount}
                          delivery={selectedData.deliveryToBelarus}
                          finalTotal={selectedData.finalTotal}
                          itemCount={selectedData.itemCount}
                          totalWeight={selectedData.totalWeight}
                          customsDuty={selectedData.customsDuty}
                          canCheckout={canCheckout}
                          onCheckout={handleCheckout}
                          cart={cart}
                          checkoutLoading={checkoutLoading}
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
