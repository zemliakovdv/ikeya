// mockData/orders.js
export const mockActiveOrders = [
  {
    id: '6651',
    date: '29 июня',
    dateRange: '28-29 июня',
    status: 'assembly',
    price: '2 556,93',
    detailUrl: 'order-processing.html',
    items: [
      { name: 'NATTSLÄNDA', desc: 'Пододеяльник и наволочка, разноцветный цветочный узор, 150x200/50x60 см', quantity: 1, price: '143,93', image: '../assets/img/profile/zakaz_1.png' },
      { name: 'VALEVÅG', desc: 'Матрас, пружины карманного типа, средней жесткости/светло‑голубой, 140x200 см', quantity: 1, price: '558,93', image: '../assets/img/profile/zakaz_2.png' }
    ]
  },
  {
    id: '6650',
    date: '28 июня',
    dateRange: '27-28 июня',
    status: 'awaiting',
    price: '2 556,93',
    countdown: '00:28:39',
    detailUrl: 'order-waiting-payment.html',
    items: [
      { name: 'NATTSLÄNDA', desc: 'Пододеяльник и наволочка, разноцветный цветочный узор, 150x200/50x60 см', quantity: 1, price: '143,93', image: '../assets/img/profile/zakaz_1.png' }
    ]
  },
  {
    id: '6649',
    date: '27 июня',
    dateRange: '26-27 июня',
    status: 'transit',
    price: '2 556,93',
    detailUrl: 'order-in-transit.html',
    items: [
      { name: 'MUGGSVEIK', desc: '9-местный диван-кровать с шезлонгом, с шерстяным покрытием/серый Гуннаред/темный серый', quantity: 1, price: '1 856,07', image: '../assets/img/profile/zakaz_3.png' }
    ]
  },
  {
    id: '6648',
    date: '26 июня',
    dateRange: '25-26 июня',
    status: 'in-transit-pvz',
    price: '2 556,93',
    trackNumber: 'LX004561845UZ',
    detailUrl: 'order-arrived.html',
    items: [
      { name: 'NATTSLÄNDA', desc: 'Пододеяльник и наволочка, разноцветный цветочный узор, 150x200/50x60 см', quantity: 1, price: '143,93', image: '../assets/img/profile/zakaz_1.png' }
    ]
  },
  {
    id: '6647',
    date: '25 июня',
    dateRange: '24-25 июня',
    status: 'arrived-pvz',
    price: '2 556,93',
    trackNumber: 'LX004561845UZ',
    detailUrl: 'order-arrived.html',
    items: [
      { name: 'VALEVÅG', desc: 'Матрас, пружины карманного типа, средней жесткости/светло‑голубой, 140x200 см', quantity: 1, price: '558,93', image: '../assets/img/profile/zakaz_2.png' }
    ]
  }
];
