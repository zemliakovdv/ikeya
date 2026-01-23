import CartPage from '@/components/cart/CartPage';

// Моковые данные для примера
const mockCartData = {
  available: [
    {
      id: 1,
      name: 'MUDDERVERK',
      description: '3‑местный диван‑кровать с шезлонгом, с широкими подлокотниками Гуннаред/средний серый',
      image: '/assets/img/cart/cart_1.png',
      price: '2560',
      priceCents: '93',
      promoPrice: '1856',
      promoPriceCents: '07',
      discount: '30',
      quantity: 1,
      isChecked: false
    },
    {
      id: 2,
      name: 'VALEVÅG',
      description: 'Матрас, пружины карманного типа, средней жесткости/светло‑голубой, 140x200 см',
      image: '/assets/img/cart/cart_2.png',
      price: '556',
      priceCents: '93',
      quantity: 1,
      isChecked: false
    },
    {
      id: 3,
      name: 'NATTSLÄNDA',
      description: 'Пододеяльник и наволочка, разноцветный цветочный узор, 150x200/50x60 см',
      image: '/assets/img/cart/cart_3.png',
      price: '143',
      priceCents: '93',
      quantity: 1,
      isChecked: false
    }
  ],
  unavailable: [
    {
      id: 4,
      name: 'VALEVÅG',
      description: 'Матрас, пружины карманного типа, средней жесткости/светло‑голубой, 140x200 см',
      image: '/assets/img/cart/cart_4.png',
      price: '556',
      priceCents: '93'
    }
  ]
};

export default function Cart() {
  return <CartPage initialCartData={mockCartData} />;
}
