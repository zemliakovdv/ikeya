'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/contexts/CartContext';
import CartItemsSection from './CartItemsSection';
import CartSummary from './CartSummary';
import RecommendationsSection from '@/components/recommendations/RecommendationsSection';

export default function CartPage() {
  const router = useRouter();
  const {
    cart,
    updateQuantity,
    removeFromCart,
    availableItems,
    unavailableItems,
    totals,
    flags,
    recommendations,
    loading
  } = useCart();

  // СОСТОЯНИЕ ВЫБРАННЫХ ТОВАРОВ (массив SKU)
  const [selectedItems, setSelectedItems] = useState([]);

  const handleQuantityChange = async (sku, newQuantity) => {
    try {
      await updateQuantity(sku, newQuantity);
    } catch (error) {
      console.error('Ошибка изменения количества:', error);
      alert('Не удалось изменить количество товара');
    }
  };

  const handleDelete = async (sku) => {
    try {
      await removeFromCart(sku);
      // Убираем из выбранных
      setSelectedItems(prev => prev.filter(s => s !== sku));
    } catch (error) {
      console.error('Ошибка удаления товара:', error);
      alert('Не удалось удалить товар');
    }
  };

  // ОБРАБОТЧИК ЧЕКБОКСА
  const handleCheckChange = (sku) => {
    setSelectedItems(prev => 
      prev.includes(sku) 
        ? prev.filter(s => s !== sku)  // Убрать
        : [...prev, sku]                // Добавить
    );
  };

  // ВЫБРАТЬ ВСЕ / СНЯТЬ ВСЕ
  const handleSelectAll = () => {
    if (selectedItems.length === availableItems.length) {
      setSelectedItems([]);  // Снять все
    } else {
      setSelectedItems(availableItems.map(item => item.sku));  // Выбрать все
    }
  };

  // УДАЛИТЬ ВЫБРАННЫЕ
  const handleDeleteSelected = async () => {
    if (selectedItems.length === 0) return;
    
    if (!confirm(`Удалить ${selectedItems.length} товаров из корзины?`)) return;

    try {
      await Promise.all(selectedItems.map(sku => removeFromCart(sku)));
      setSelectedItems([]);
    } catch (error) {
      console.error('Ошибка удаления товаров:', error);
      alert('Не удалось удалить некоторые товары');
    }
  };

  const handleCheckout = () => {
    router.push('/checkout');
  };

  const hasAvailableItems = availableItems.length > 0;
  const hasUnavailableItems = unavailableItems.length > 0;

  const subtotal = parseFloat(totals?.subtotal_new_byn || 0);
  const promoDiscount = parseFloat(totals?.discount_total_byn || 0);
  const total = subtotal;
  const itemCount = availableItems.length;
  const totalWeight = totals?.total_weight_kg || 0;

  const canCheckout = flags?.checkout_allowed || false;
  const minOrderAmount = parseFloat(cart?.rules?.min_order_amount_byn || 500);
  const freeDeliveryThreshold = parseFloat(cart?.rules?.free_delivery_threshold_byn || 5000);

  const recommendedProducts = recommendations || [];

  return (
    <main className="korzina">
      <section className="zakaz">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="zakaz-inner">
                <h2>Корзина</h2>

                {subtotal >= freeDeliveryThreshold && (
                  <div className="order-toast_delivery">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2C6.49 2 2 6.49 2 12C2 17.51 6.49 22 12 22C17.51 22 22 17.51 22 12C22 6.49 17.51 2 12 2ZM12.7 15.72C12.7 16.11 12.39 16.42 12 16.42C11.61 16.42 11.3 16.11 11.3 15.72V11.53C11.3 11.14 11.61 10.83 12 10.83C12.39 10.83 12.7 11.14 12.7 11.53V15.72ZM12 9.12C11.54 9.12 11.16 8.75 11.16 8.29C11.16 7.82 11.53 7.44 12 7.44C12.47 7.44 12.84 7.81 12.84 8.28C12.84 8.75 12.47 9.12 12 9.12Z" fill="#0058A3" />
                    </svg>
                    <p>Бесплатная доставка от {freeDeliveryThreshold} р. стоимости товаров</p>
                  </div>
                )}

                {!canCheckout && itemCount > 0 && (
                  <div className="order-toast_choose">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2C6.49 2 2 6.49 2 12C2 17.51 6.49 22 12 22C17.51 22 22 17.51 22 12C22 6.49 17.51 2 12 2ZM11.3 8.28C11.3 7.89 11.61 7.58 12 7.58C12.39 7.58 12.7 7.89 12.7 8.28V12.47C12.7 12.86 12.39 13.17 12 13.17C11.61 13.17 11.3 12.86 11.3 12.47V8.28ZM12.83 15.72C12.83 16.18 12.46 16.56 11.99 16.56C11.52 16.56 11.15 16.18 11.15 15.72C11.15 15.26 11.52 14.88 11.99 14.88C12.46 14.88 12.83 15.25 12.83 15.71V15.72Z" fill="#B71C1C" />
                    </svg>
                    <p>Оформление заказа доступно от {minOrderAmount} р. стоимости товаров</p>
                  </div>
                )}

                <div className="zakaz-content">
                  <div className="cart">
                    <div className="cart-layout">
                      <div className="cart-main">
                        {hasAvailableItems && (
                          <CartItemsSection
                            items={availableItems}
                            isUnavailable={false}
                            onQuantityChange={handleQuantityChange}
                            onDelete={handleDelete}
                            onFavorite={() => {}}
                            onSelectAll={handleSelectAll}
                            onDeleteSelected={handleDeleteSelected}
                            onCheckChange={handleCheckChange}
                            selectedItems={selectedItems}
                            loading={loading}
                          />
                        )}

                        {hasUnavailableItems && (
                          <CartItemsSection
                            items={unavailableItems}
                            isUnavailable={true}
                            onDelete={handleDelete}
                            onFavorite={() => {}}
                            onSelectAll={() => {}}
                            onDeleteSelected={() => {}}
                            loading={loading}
                          />
                        )}

                        {!hasAvailableItems && !hasUnavailableItems && (
                          <div className="cart-empty">
                            <h3>Корзина пуста</h3>
                            <p>Добавьте товары из каталога</p>
                          </div>
                        )}
                      </div>

                      {hasAvailableItems && (
                        <CartSummary
                          subtotal={subtotal}
                          promoDiscount={promoDiscount}
                          delivery={0}
                          total={total}
                          itemCount={itemCount}
                          totalWeight={totalWeight}
                          canCheckout={canCheckout}
                          onCheckout={handleCheckout}
                          cart={cart}
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

      {recommendedProducts.length > 0 && (
        <RecommendationsSection products={recommendedProducts} />
      )}
    </main>
  );
}
