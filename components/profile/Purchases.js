// components/profile/Purchases.js
'use client';

import EmptyState from './EmptyState';

export default function Purchases({ products }) {
  return (
    <div className="orders-shopping_wrapper">
      <div className="orders-shopping">
        {!products || products.length === 0 ? (
          <EmptyState type="purchases" />
        ) : (
          <>
            {/* Сортировка */}
            <div className="all-catalog-sort">
              <div className="catalog-sort">
                <div className="catalog-sort__selected">
                  <span className="catalog-sort__current">Популярные</span>
                </div>
              </div>
            </div>

            {/* Карточки товаров */}
            <div className="shopping-cards">
              <div className="all-catalog-items">
                {products.map((product) => (
                  <div key={product.id} className="col product-card-inner">
                    {/* ... твой код карточки товара */}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
