'use client';

import { useEffect, useMemo, useState, useCallback, useRef } from 'react';
import PageLoader from '@/components/ui/PageLoader';
import { useRouter } from 'next/navigation';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useAuthModals } from '@/components/auth/AuthModalsHost';
import { createDraft } from '@/lib/api/cart';

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

export default function CartPageClient() {
  const router = useRouter();
  const { isAuth } = useAuth();
  const { openLogin } = useAuthModals();

  const {
    cart,
    updateQuantity,
    removeFromCart,
    removeManyFromCart,
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

  const handleCheckoutAuthorizedRef = useRef(null);

  const minOrderAmount = toNumber(
    cart?.rules?.min_order_amount_byn,
    DEFAULT_MIN_ORDER_AMOUNT
  );

  useEffect(() => {
    function onAuthDone() {
      const pending = sessionStorage.getItem('pendingCheckout');

      if (pending) {
        sessionStorage.removeItem('pendingCheckout');
        setTimeout(() => handleCheckoutAuthorizedRef.current?.(), 1500);
      }
    }

    window.addEventListener('auth-change-done', onAuthDone);

    return () => window.removeEventListener('auth-change-done', onAuthDone);
  }, []);

  useEffect(() => {
    if (!isAuth) return;

    const pending = sessionStorage.getItem('pendingCheckout');

    if (!pending) return;
    if (!availableItems?.length) return;

    sessionStorage.removeItem('pendingCheckout');
    handleCheckoutAuthorizedRef.current?.();
  }, [isAuth, availableItems]);

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

  const allAvailableSelected = useMemo(() => {
    if (!availableSkus.length) return false;
    if (selectedItems.length !== availableSkus.length) return false;

    const selectedSet = new Set(selectedItems);

    return availableSkus.every((sku) => selectedSet.has(sku));
  }, [availableSkus, selectedItems]);

  const selectedData = useMemo(() => {
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
      promoDiscount: toNumber(promoDiscount.toFixed(2)),
      itemCount,
      totalWeight: toNumber(totalWeight.toFixed(2)),
      customsDuty: toNumber(customsDuty.toFixed(2)),
    };
  }, [selectedAvailableItems]);

  const deliveryToBelarus = toNumber(
    delivery?.delivery_to_belarus_byn ||
    totals?.delivery_to_belarus_byn
  );

  const logisticsDelivery = toNumber(
    delivery?.delivery_total_byn ||
    totals?.delivery_total_byn
  );

  const customsDuty = selectedData.customsDuty;
  const totalWeight = selectedData.totalWeight;

  const canCheckout = Boolean(
    allAvailableSelected &&
    selectedData.subtotal >= minOrderAmount &&
    selectedAvailableItems.length > 0
  );

  const saveSummaryToSession = useCallback(() => {
    sessionStorage.setItem('checkoutSummary', JSON.stringify({
      subtotal: selectedData.subtotal,
      promoDiscount: selectedData.promoDiscount,
      itemCount: selectedData.itemCount,
      totalWeight,
      customsDuty,
      delivery: deliveryToBelarus,
      logisticsDelivery,
      europostEligible: delivery?.europost_eligible ?? null,
      availableMethods: delivery?.available_methods || [],
    }));
  }, [
    selectedData,
    totalWeight,
    customsDuty,
    deliveryToBelarus,
    logisticsDelivery,
    delivery,
  ]);

  const handleCheckoutAuthorized = useCallback(async () => {
    if (!canCheckout) return;

    setCheckoutLoading(true);

    try {
      saveSummaryToSession();

      const checkoutItemsPayload = selectedAvailableItems
        .map((item) => ({
          sku: getCartItemSku(item),
          quantity: item?.quantity || 1,
        }))
        .filter((item) => item.sku)
        .map((item) => ({
          sku: String(item.sku),
          quantity: item.quantity,
        }));

      sessionStorage.setItem(
        'selectedSkus',
        JSON.stringify(checkoutItemsPayload.map((item) => item.sku))
      );

      sessionStorage.setItem(
        'checkoutItemsPayload',
        JSON.stringify(checkoutItemsPayload)
      );

      const response = await createDraft();
      const draftId = response.order?.data?.id || response.order_id;

      router.push(`/checkout?draft_id=${draftId}`);
    } catch {
      router.push('/checkout');
    } finally {
      setCheckoutLoading(false);
    }
  }, [canCheckout, saveSummaryToSession, router, selectedAvailableItems]);

  handleCheckoutAuthorizedRef.current = handleCheckoutAuthorized;

  const handleCheckout = useCallback(() => {
    if (!allAvailableSelected) {
      alert('Оформление части корзины пока недоступно. Сейчас можно оформить только все доступные товары.');
      return;
    }

    if (!isAuth) {
      saveSummaryToSession();
      sessionStorage.setItem('pendingCheckout', '1');
      openLogin();
      return;
    }

    handleCheckoutAuthorized();
  }, [
    allAvailableSelected,
    isAuth,
    openLogin,
    saveSummaryToSession,
    handleCheckoutAuthorized,
  ]);

  const handleQuantityChange = useCallback(async (sku, newQuantity) => {
    try {
      await updateQuantity(sku, newQuantity);
    } catch {
      alert('Не удалось изменить количество товара');
    }
  }, [updateQuantity]);

  const handleDelete = useCallback(async (sku) => {
    try {
      await removeFromCart(sku);
      setSelectedItems((prev) => prev.filter((s) => s !== sku));
    } catch {
      alert('Не удалось удалить товар');
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
      alert('Не удалось удалить некоторые товары');
    }
  }, [removeManyFromCart, selectedUnavailable]);

  const handleDeleteSelected = useCallback(async () => {
    if (!selectedItems.length) return;

    try {
      await removeManyFromCart({ skus: selectedItems });
      setSelectedItems([]);
    } catch {
      alert('Не удалось удалить некоторые товары');
    }
  }, [removeManyFromCart, selectedItems]);

  const hasAvailableItems = (availableItems?.length || 0) > 0;
  const hasUnavailableItems = (unavailableItems?.length || 0) > 0;
  const hasPartialSelection = hasAvailableItems && selectedItems.length > 0 && !allAvailableSelected;

  if (isInitialLoading || checkoutLoading) return <PageLoader />;

  return (
    <main className="korzina">
      <section className="zakaz">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="zakaz-inner">
                <h2>Корзина</h2>

                {selectedItems.length > 0 && selectedData.subtotal < minOrderAmount && (
                  <div className="order-toast_choose">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path d="M12 2C6.49 2 2 6.49 2 12C2 17.51 6.49 22 12 22C17.51 22 22 17.51 22 12C22 6.49 17.51 2 12 2ZM11.3 8.28C11.3 7.89 11.61 7.58 12 7.58C12.39 7.58 12.7 7.89 12.7 8.28V12.47C12.7 12.86 12.39 13.17 12 13.17C11.61 13.17 11.3 12.86 11.3 12.47V8.28ZM12.83 15.72C12.83 16.18 12.46 16.56 11.99 16.56C11.52 16.56 11.15 16.18 11.15 15.72C11.15 15.26 11.52 14.88 11.99 14.88C12.46 14.88 12.83 15.25 12.83 15.71V15.72Z" fill="#B71C1C" />
                    </svg>
                    <p>Оформление заказа доступно от {formatAmount(minOrderAmount)} р. стоимости товаров</p>
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

                {hasPartialSelection && (
                  <div className="order-toast_choose">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path d="M12 2C6.49 2 2 6.49 2 12C2 17.51 6.49 22 12 22C17.51 22 22 17.51 22 12C22 6.49 17.51 2 12 2ZM11.3 8.28C11.3 7.89 11.61 7.58 12 7.58C12.39 7.58 12.7 7.89 12.7 8.28V12.47C12.7 12.86 12.39 13.17 12 13.17C11.61 13.17 11.3 12.86 11.3 12.47V8.28ZM12.83 15.72C12.83 16.18 12.46 16.56 11.99 16.56C11.52 16.56 11.15 16.18 11.15 15.72C11.15 15.26 11.52 14.88 11.99 14.88C12.46 14.88 12.83 15.25 12.83 15.71V15.72Z" fill="#B71C1C" />
                    </svg>
                    <p>Оформление выбранных товаров будет доступно после доработки checkout. Доставка в корзине отображается для всей корзины.</p>
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
                          delivery={deliveryToBelarus}
                          itemCount={selectedData.itemCount}
                          totalWeight={totalWeight}
                          customsDuty={customsDuty}
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