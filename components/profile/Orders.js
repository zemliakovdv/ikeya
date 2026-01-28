// app/profile/orders/page.js
'use client';

import { useState } from 'react';
import ActiveOrders from '@/components/profile/ActiveOrders';
import OrderHistory from '@/components/profile/OrderHistory';
import Purchases from '@/components/profile/Purchases';

// Mock данные (те же что выше)
const mockActiveOrders = [
  {
    id: '6651',
    date: '29 июня',
    dateRange: '28-29 июня',
    status: 'assembly',
    price: '2 556,93',
    detailUrl: 'order-processing.html',
    items: [
      { name: 'NATTSLÄNDA', desc: 'Пододеяльник и наволочка, разноцветный цветочный узор, 150x200/50x60 см', quantity: 1, price: '143,93', image: '/assets/img/profile/zakaz_1.png' }
    ]
  }
];

const mockHistoryOrders = [
  {
    id: '6648',
    date: '29 июня',
    status: 'canceled',
    price: '2 556,93',
    items: [
      { name: 'NATTSLÄNDA', desc: 'Пододеяльник и наволочка', quantity: 1, price: '143,93', image: '/assets/img/profile/zakaz_1.png' }
    ]
  }
];

const mockPurchasedProducts = [
  {
    id: 1,
    title: 'SLATTUM',
    description: 'Каркас кровати с обивкой',
    priceWhole: '135',
    priceCents: '00',
    galleryId: 'beds-1',
    images: ['/assets/img/catalog-page/card/card_1.png'],
    thumbs: [{ image: '/assets/img/main-page/sales-hist/hits-1.png' }],
    showThumbs: false,
    badges: { hitSale: true, hitSaleVisible: true, promo: '-10%', promoVisible: true }
  }
];

export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState('active');

  console.log('Active Tab:', activeTab);
  console.log('Active Orders:', mockActiveOrders);
  console.log('History Orders:', mockHistoryOrders);
  console.log('Products:', mockPurchasedProducts);

  return (
    <div className="orders-lists">
      <div className="orders-tabs orders-container">
        
        <ul className="nav nav-tabs" id="ordersTabs" role="tablist">
          <li className="nav-item" role="presentation">
            <button
              className={`nav-link ${activeTab === 'active' ? 'active' : ''}`}
              onClick={() => setActiveTab('active')}
            >
              Активные заказы <span className="active_tab_number">{mockActiveOrders.length}</span>
            </button>
          </li>
          <li className="nav-item" role="presentation">
            <button
              className={`nav-link ${activeTab === 'history' ? 'active' : ''}`}
              onClick={() => setActiveTab('history')}
            >
              История заказов
            </button>
          </li>
          <li className="nav-item" role="presentation">
            <button
              className={`nav-link ${activeTab === 'purchases' ? 'active' : ''}`}
              onClick={() => setActiveTab('purchases')}
            >
              Покупки
            </button>
          </li>
        </ul>

        <div className="tab-content" id="ordersTabsContent">
          {activeTab === 'active' && (
            <div>
              <p>Активные заказы: {mockActiveOrders.length}</p>
              <ActiveOrders orders={mockActiveOrders} />
            </div>
          )}
          {activeTab === 'history' && (
            <div>
              <p>История: {mockHistoryOrders.length}</p>
              <OrderHistory orders={mockHistoryOrders} />
            </div>
          )}
          {activeTab === 'purchases' && (
            <div>
              <p>Покупки: {mockPurchasedProducts.length}</p>
              <Purchases products={mockPurchasedProducts} />
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
