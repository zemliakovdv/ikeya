'use client';

import { useState } from 'react';
import CartItemsSection from './CartItemsSection';
import CartSummary from './CartSummary';
import RecommendationsSection from '@/components/recommendations/RecommendationsSection';

export default function CartPage({ initialCartData = {} }) {
  const [availableItems, setAvailableItems] = useState(initialCartData.available || []);
  const [unavailableItems, setUnavailableItems] = useState(initialCartData.unavailable || []);

  const handleQuantityChange = (itemId, quantity) => {
    setAvailableItems(items =>
      items.map(item =>
        item.id === itemId ? { ...item, quantity } : item
      )
    );
  };

  const handleDelete = (itemId) => {
    setAvailableItems(items => items.filter(item => item.id !== itemId));
    setUnavailableItems(items => items.filter(item => item.id !== itemId));
  };

  const handleFavorite = (itemId) => {
    console.log('Add to favorites:', itemId);
  };

  const handleCheckChange = (itemId, checked) => {
    setAvailableItems(items =>
      items.map(item =>
        item.id === itemId ? { ...item, isChecked: checked } : item
      )
    );
  };

  const handleSelectAll = (checked) => {
    setAvailableItems(items =>
      items.map(item => ({ ...item, isChecked: checked }))
    );
  };

  const handleDeleteSelected = () => {
    setAvailableItems(items => items.filter(item => !item.isChecked));
  };

  const handleCheckout = () => {
    console.log('Proceed to checkout');
    // Навигация к странице оформления заказа
  };

  // Расчет итогов
  const subtotal = availableItems.reduce((sum, item) => {
    const price = parseFloat(item.price) || 0;
    const quantity = item.quantity || 1;
    return sum + (price * quantity);
  }, 0);

  const discount = availableItems.reduce((sum, item) => {
    if (item.discount) {
      return sum + parseFloat(item.discount);
    }
    return sum;
  }, 0);

  const delivery = 56.00;
  const promoDiscount = 30.00;
  const total = subtotal + delivery;
  const itemCount = availableItems.length;
  const minOrderAmount = 500;
  const canCheckout = total >= minOrderAmount && itemCount > 0;

  const hasAvailableItems = availableItems.length > 0;
  const hasUnavailableItems = unavailableItems.length > 0;

  // Моковые данные для рекомендаций
  const recommendedProducts = [
    {
      id: 1,
      title: 'NÖSUND',
      description: 'Потолочный светильник, береза, 44 см',
      price: 135.00,
      images: [
        '/assets/img/main-page/we-recomend/recomend-1.png',
        '/assets/img/main-page/we-recomend/recomend-2.png',
        '/assets/img/main-page/we-recomend/recomend-3.png',
        '/assets/img/main-page/we-recomend/recomend-4.png',
        '/assets/img/main-page/we-recomend/recomend-5.png',
      ],
      thumbs: [
        '/assets/img/main-page/sales-hist/hits-1.png',
        '/assets/img/main-page/sales-hist/hits-1.png',
        '/assets/img/main-page/sales-hist/hits-3.png',
        '/assets/img/main-page/sales-hist/hits-4.png',
        '/assets/img/main-page/sales-hist/hits-5.png',
      ],
      isHit: true,
      promoCode: '-10% промокод IKEYA'
    },
    {
      id: 2,
      title: 'MUDDERVERK',
      description: 'Lampa wisząca, mosiądz/opalowa biel szkło',
      price: 135.00,
      images: [
        '/assets/img/main-page/we-recomend/recomend-2.png',
        '/assets/img/main-page/we-recomend/recomend-3.png',
        '/assets/img/main-page/we-recomend/recomend-4.png',
        '/assets/img/main-page/we-recomend/recomend-5.png',
        '/assets/img/main-page/we-recomend/recomend-1.png',
      ],
      thumbs: [
        '/assets/img/main-page/we-recomend/recomend-2.png',
        '/assets/img/main-page/we-recomend/recomend-3.png',
        '/assets/img/main-page/we-recomend/recomend-4.png',
      ],
      isHit: true,
      promoCode: '-10% промокод IKEYA'
    },
    {
      id: 3,
      title: 'NYMÅNE',
      description: 'Настольная лампа, антрацит, 33 см',
      price: 135.00,
      images: [
        '/assets/img/main-page/we-recomend/recomend-3.png',
        '/assets/img/main-page/we-recomend/recomend-4.png',
        '/assets/img/main-page/we-recomend/recomend-5.png',
        '/assets/img/main-page/we-recomend/recomend-1.png',
        '/assets/img/main-page/we-recomend/recomend-2.png',
      ],
      thumbs: [
        '/assets/img/main-page/we-recomend/recomend-3.png',
      ],
      isHit: true,
      promoCode: '-10% промокод IKEYA'
    },
    {
      id: 4,
      title: 'RÖDFLIK',
      description: 'Настольная лампа, светло-бежевая',
      price: 135.00,
      images: [
        '/assets/img/main-page/we-recomend/recomend-4.png',
      ],
      thumbs: [
        '/assets/img/main-page/we-recomend/recomend-4.png',
      ],
      isHit: true,
      promoCode: '-10% промокод IKEYA'
    },
    {
      id: 5,
      title: 'SLATTUM',
      description: 'Каркас кровати с обивкой, Vissle темно-серый, 140x200 см',
      price: 135.00,
      images: [
        '/assets/img/main-page/we-recomend/recomend-5.png',
      ],
      thumbs: [
        '/assets/img/main-page/we-recomend/recomend-5.png',
      ],
      isHit: true,
      promoCode: '-10% промокод IKEYA'
    },
    {
      id: 6,
      title: 'SLATTUM',
      description: 'Каркас кровати с обивкой, Vissle темно-серый, 140x200 см',
      price: 135.00,
      images: [
        '/assets/img/main-page/sales-hist/hits-1.png',
        '/assets/img/main-page/sales-hist/hits-2.png',
        '/assets/img/main-page/sales-hist/hits-3.png',
        '/assets/img/main-page/sales-hist/hits-4.png',
        '/assets/img/main-page/sales-hist/hits-5.png',
      ],
      thumbs: [
        '/assets/img/main-page/sales-hist/hits-1.png',
        '/assets/img/main-page/sales-hist/hits-1.png',
        '/assets/img/main-page/sales-hist/hits-3.png',
        '/assets/img/main-page/sales-hist/hits-4.png',
        '/assets/img/main-page/sales-hist/hits-5.png',
      ],
      isHit: true,
      promoCode: '-10% промокод IKEYA'
    },
    {
      id: 7,
      title: 'NÖSUND',
      description: 'Потолочный светильник, береза, 44 см',
      price: 135.00,
      images: [
        '/assets/img/main-page/sales-hist/hits-1.png',
        '/assets/img/main-page/sales-hist/hits-3.png',
        '/assets/img/main-page/sales-hist/hits-4.png',
      ],
      thumbs: [
        '/assets/img/main-page/sales-hist/hits-1.png',
        '/assets/img/main-page/sales-hist/hits-1.png',
        '/assets/img/main-page/sales-hist/hits-3.png',
      ],
      isHit: true,
      promoCode: '-10% промокод IKEYA'
    },
    {
      id: 8,
      title: 'MUDDERVERK',
      description: 'Lampa wisząca, mosiądz/opalowa biel szkło',
      price: 135.00,
      images: [
        '/assets/img/main-page/sales-hist/hits-3.png',
      ],
      thumbs: [
        '/assets/img/main-page/sales-hist/hits-3.png',
      ],
      isHit: true,
      promoCode: '-10% промокод IKEYA'
    },
    {
      id: 9,
      title: 'NYMÅNE',
      description: 'Настольная лампа, антрацит, 33 см',
      price: 135.00,
      images: [
        '/assets/img/main-page/sales-hist/hits-4.png',
      ],
      thumbs: [
        '/assets/img/main-page/sales-hist/hits-4.png',
      ],
      isHit: true,
      promoCode: '-10% промокод IKEYA'
    },
    {
      id: 10,
      title: 'RÖDFLIK',
      description: 'Настольная лампа, светло-бежевая',
      price: 135.00,
      images: [
        '/assets/img/main-page/sales-hist/hits-5.png',
      ],
      thumbs: [
        '/assets/img/main-page/sales-hist/hits-5.png',
      ],
      isHit: true,
      promoCode: '-10% промокод IKEYA'
    },
  ];

  return (
    <>
      <main className="korzina">
        <section className="zakaz">
          <div className="container">
            <div className="row">
              <div className="col-12">
                <div className="zakaz-inner">
                  <h2>Корзина</h2>

                  {/* Уведомления */}
                  {total >= 5000 && (
                    <div className="order-toast_delivery">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2C6.49 2 2 6.49 2 12C2 17.51 6.49 22 12 22C17.51 22 22 17.51 22 12C22 6.49 17.51 2 12 2ZM12.7 15.72C12.7 16.11 12.39 16.42 12 16.42C11.61 16.42 11.3 16.11 11.3 15.72V11.53C11.3 11.14 11.61 10.83 12 10.83C12.39 10.83 12.7 11.14 12.7 11.53V15.72ZM12 9.12C11.54 9.12 11.16 8.75 11.16 8.29C11.16 7.82 11.53 7.44 12 7.44C12.47 7.44 12.84 7.81 12.84 8.28C12.84 8.75 12.47 9.12 12 9.12Z" fill="#0058A3" />
                      </svg>
                      <p>Бесплатная доставка от n стоимости товаров</p>
                    </div>
                  )}

                  {!canCheckout && itemCount > 0 && (
                    <div className="order-toast_choose">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2C6.49 2 2 6.49 2 12C2 17.51 6.49 22 12 22C17.51 22 22 17.51 22 12C22 6.49 17.51 2 12 2ZM11.3 8.28C11.3 7.89 11.61 7.58 12 7.58C12.39 7.58 12.7 7.89 12.7 8.28V12.47C12.7 12.86 12.39 13.17 12 13.17C11.61 13.17 11.3 12.86 11.3 12.47V8.28ZM12.83 15.72C12.83 16.18 12.46 16.56 11.99 16.56C11.52 16.56 11.15 16.18 11.15 15.72C11.15 15.26 11.52 14.88 11.99 14.88C12.46 14.88 12.83 15.25 12.83 15.71V15.72Z" fill="#B71C1C" />
                      </svg>
                      <p>Оформление заказа доступно от {minOrderAmount} стоимости товаров</p>
                    </div>
                  )}

                  <div className="zakaz-content">
                    <div className="cart">
                      <div className="cart-layout">
                        {/* Левая колонка: товары */}
                        <div className="cart-main">
                          {hasAvailableItems && (
                            <CartItemsSection
                              items={availableItems}
                              isUnavailable={false}
                              onQuantityChange={handleQuantityChange}
                              onDelete={handleDelete}
                              onFavorite={handleFavorite}
                              onSelectAll={handleSelectAll}
                              onDeleteSelected={handleDeleteSelected}
                              onCheckChange={handleCheckChange}
                            />
                          )}

                          {hasUnavailableItems && (
                            <CartItemsSection
                              items={unavailableItems}
                              isUnavailable={true}
                              onDelete={handleDelete}
                              onFavorite={handleFavorite}
                              onSelectAll={() => {}}
                              onDeleteSelected={handleDeleteSelected}
                            />
                          )}

                          {!hasAvailableItems && !hasUnavailableItems && (
                            <div className="cart-empty">
                              <h3>Корзина пуста</h3>
                              <p>Добавьте товары из каталога</p>
                            </div>
                          )}
                        </div>

                        {/* Правая колонка: итоги */}
                        {hasAvailableItems && (
                          <CartSummary
                            subtotal={subtotal}
                            promoDiscount={promoDiscount}
                            delivery={delivery}
                            total={total}
                            itemCount={itemCount}
                            totalWeight={4.5}
                            canCheckout={canCheckout}
                            onCheckout={handleCheckout}
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
              {/* Секция рекомендаций */}
      <RecommendationsSection products={recommendedProducts} />
      </main>

    </>
  );
}
