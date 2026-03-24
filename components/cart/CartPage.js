'use client';

import { useEffect, useMemo, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useAuthModals } from '@/components/auth/AuthModalsHost';
import { calculateDelivery } from '@/lib/api/cart';

import CartItemsSection from './CartItemsSection';
import CartSummary from './CartSummary';
import RecommendationsSection from '@/components/recommendations/RecommendationsSection';

const MIN_ORDER_AMOUNT = 150; // BYN

export default function CartPage() {
  const router = useRouter();
  const { isAuth } = useAuth();
  const { openLogin } = useAuthModals();
  const {
    cart, updateQuantity, removeFromCart,
    availableItems, unavailableItems,
    totals, recommendations, loading,
  } = useCart();

  const [selectedItems, setSelectedItems] = useState([]);
  const [delivery, setDelivery] = useState(0);
  const [deliveryLoading, setDeliveryLoading] = useState(false);

  const availableSkus = useMemo(
    () => (availableItems || []).map(it => it?.sku).filter(Boolean),
    [availableItems]
  );

  // Подчищаем выбор если товары исчезли
  useEffect(() => {
    setSelectedItems(prev => prev.filter(sku => availableSkus.includes(sku)));
  }, [availableSkus]);

  // Пересчёт доставки при изменении выбранных товаров
  useEffect(() => {
    if (!selectedItems.length) { setDelivery(0); return; }

    const items = selectedItems.map(sku => {
      const found = (availableItems || []).find(it => it.sku === sku);
      return { sku, quantity: found?.quantity || 1 };
    });

    setDeliveryLoading(true);
    calculateDelivery({ delivery_type: 'pickup', items })
      .then(data => {
        const cost = parseFloat(data?.delivery?.base_cost_byn || 0);
        setDelivery(data?.delivery?.free_delivery_eligible ? 0 : cost);
      })
      .catch(() => setDelivery(0))
      .finally(() => setDeliveryLoading(false));
  }, [selectedItems, availableItems]);

  // Считаем данные только для выбранных товаров
  const selectedData = useMemo(() => {
    if (!selectedItems.length) return { subtotal: 0, promoDiscount: 0, itemCount: 0, totalWeight: 0 };

    const allItems = availableItems || [];
    const selected = allItems.filter(it => selectedItems.includes(it.sku));

    // Для пропорционального расчёта веса
    const totalQtyAll = allItems.reduce((acc, it) => acc + (it.quantity || 1), 0);
    const totalWeightAll = parseFloat(totals?.total_weight_kg || 0);

    let subtotal = 0;
    let promoDiscount = 0;
    let totalWeight = 0;
    let itemCount = 0;

    selected.forEach(it => {
      const qty = it.quantity || 1;
      // Если pricing нули — берём product.price_byn
      const pricingNew = parseFloat(it.pricing?.unit_price_new_byn || 0);
      const productPrice = parseFloat(it.product?.price_byn || 0);
      const price = pricingNew > 0 ? pricingNew : productPrice;
      const discount = parseFloat(it.pricing?.unit_discount_byn || 0);

      subtotal += price * qty;
      promoDiscount += discount * qty;
      itemCount += qty;

      // Вес пропорционально количеству
      if (totalQtyAll > 0) {
        totalWeight += (totalWeightAll / totalQtyAll) * qty;
      }
    });

    // Таможенная пошлина по выбранным товарам
    let customsDuty = 0;
    selected.forEach(it => {
      const duty = parseFloat(it.customs_duty?.total_byn || 0);
      customsDuty += duty * (it.quantity || 1);
    });

    return {
      subtotal: parseFloat(subtotal.toFixed(2)),
      promoDiscount: parseFloat(promoDiscount.toFixed(2)),
      itemCount,
      totalWeight: parseFloat(totalWeight.toFixed(2)),
      customsDuty: parseFloat(customsDuty.toFixed(2)),
    };
  }, [selectedItems, availableItems, totals]);

  const canCheckout = selectedItems.length > 0 && selectedData.subtotal >= MIN_ORDER_AMOUNT;

  const handleQuantityChange = useCallback(async (sku, newQuantity) => {
    try { await updateQuantity(sku, newQuantity); }
    catch { alert('Не удалось изменить количество товара'); }
  }, [updateQuantity]);

  const handleDelete = useCallback(async (sku) => {
    try {
      await removeFromCart(sku);
      setSelectedItems(prev => prev.filter(s => s !== sku));
    } catch { alert('Не удалось удалить товар'); }
  }, [removeFromCart]);

  const handleCheckChange = useCallback((sku, checked) => {
    if (!sku) return;
    setSelectedItems(prev => {
      const set = new Set(prev);
      checked ? set.add(sku) : set.delete(sku);
      return Array.from(set);
    });
  }, []);

  const handleSelectAll = useCallback((checked) => {
    setSelectedItems(checked ? availableSkus : []);
  }, [availableSkus]);

  const handleDeleteSelected = useCallback(async () => {
    if (!selectedItems.length) return;
    if (!confirm(`Удалить ${selectedItems.length} товаров из корзины?`)) return;
    try {
      await Promise.all(selectedItems.map(sku => removeFromCart(sku)));
      setSelectedItems([]);
    } catch { alert('Не удалось удалить некоторые товары'); }
  }, [removeFromCart, selectedItems]);

  const handleCheckout = useCallback(() => {
    if (!isAuth) { openLogin(); return; }
    router.push('/checkout');
  }, [router, isAuth, openLogin]);

  const hasAvailableItems = (availableItems?.length || 0) > 0;
  const hasUnavailableItems = (unavailableItems?.length || 0) > 0;

  return (
    <main className="korzina">
      <section className="zakaz">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="zakaz-inner">
                <h2>Корзина</h2>

                {/* Минимальная сумма заказа */}
                {selectedItems.length > 0 && selectedData.subtotal < MIN_ORDER_AMOUNT && (
                  <div className="order-toast_choose">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path d="M12 2C6.49 2 2 6.49 2 12C2 17.51 6.49 22 12 22C17.51 22 22 17.51 22 12C22 6.49 17.51 2 12 2ZM11.3 8.28C11.3 7.89 11.61 7.58 12 7.58C12.39 7.58 12.7 7.89 12.7 8.28V12.47C12.7 12.86 12.39 13.17 12 13.17C11.61 13.17 11.3 12.86 11.3 12.47V8.28ZM12.83 15.72C12.83 16.18 12.46 16.56 11.99 16.56C11.52 16.56 11.15 16.18 11.15 15.72C11.15 15.26 11.52 14.88 11.99 14.88C12.46 14.88 12.83 15.25 12.83 15.71V15.72Z" fill="#B71C1C" />
                    </svg>
                    <p>Оформление заказа доступно от {MIN_ORDER_AMOUNT} р. стоимости товаров</p>
                  </div>
                )}

                {/* Не выбран ни один товар */}
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
                            onFavorite={() => {}}
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
                            selectedItems={[]}
                            onDelete={handleDelete}
                            onFavorite={() => {}}
                            onSelectAll={() => {}}
                            onDeleteSelected={() => {}}
                            onCheckChange={() => {}}
                            loading={loading}
                          />
                        )}

                        {!hasAvailableItems && !hasUnavailableItems && (
                          <div className="cart-empty">
                            <img src="/assets/img/cart/no-goods.png" alt="" />
                            <h3>Ваша корзина пуста</h3>
                            <button className="empty-btn" onClick={() => router.push('/')}>
                              Перейти к покупкам
                            </button>
                          </div>
                        )}
                      </div>

                      {hasAvailableItems && (
                        <CartSummary
                          subtotal={selectedData.subtotal}
                          promoDiscount={selectedData.promoDiscount}
                          delivery={delivery}
                          itemCount={selectedData.itemCount}
                          totalWeight={selectedData.totalWeight}
                          customsDuty={selectedData.customsDuty}
                          canCheckout={canCheckout}
                          onCheckout={handleCheckout}
                          cart={cart}
                          deliveryLoading={deliveryLoading}
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

      <RecommendationsSection products={recommendations || []} />
    </main>
  );
}