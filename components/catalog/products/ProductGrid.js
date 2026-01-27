// components/catalog/products/ProductGrid.js
import ProductCard from './ProductCard';

export default function ProductGrid({ products = [] }) {
  // Моковые данные товаров (замени на реальные из API)
  const mockProducts = products.length > 0 ? products : [
    {
      id: 1,
      title: 'SLÄTTUM',
      description: 'Кровать мягкая, Vissle серый, 140x200 см',
      price: 135.00,
      images: [
        '/assets/img/catalog-page/card/card_1.png',
        '/assets/img/catalog-page/card/card_1.png',
        '/assets/img/catalog-page/card/card_1.png',
      ],
      thumbs: [
        '/assets/img/main-page/sales-hist/hits-1.png',
        '/assets/img/main-page/sales-hist/hits-1.png',
        '/assets/img/main-page/sales-hist/hits-3.png',
      ],
      badges: ['Хит продаж', '-10% с IKEYA'],
      slug: 'slattum-bed',
    },
    {
      id: 2,
      title: 'GRÄDVIS',
      description: 'Стол и 2 стула, сосна, 21 см',
      price: 135.00,
      images: [
        '/assets/img/catalog-page/card/card_2.png',
        '/assets/img/catalog-page/card/card_2.png',
        '/assets/img/catalog-page/card/card_2.png',
      ],
      thumbs: [
        '/assets/img/main-page/sales-hist/hits-1.png',
        '/assets/img/main-page/sales-hist/hits-1.png',
        '/assets/img/main-page/sales-hist/hits-3.png',
      ],
      badges: ['Хит продаж', '-10% с IKEYA'],
      slug: 'gradvis-table',
    },
    {
      id: 3,
      title: 'NÄSUND',
      description: 'Рабочий стул, черный, 44 см',
      price: 135.00,
      images: [
        '/assets/img/catalog-page/card/card_3.png',
        '/assets/img/catalog-page/card/card_3.png',
        '/assets/img/catalog-page/card/card_3.png',
      ],
      thumbs: [
        '/assets/img/catalog-page/card/mini/card_mini_1.png',
        '/assets/img/catalog-page/card/mini/card_mini_2.png',
        '/assets/img/catalog-page/card/mini/card_mini_3.png',
      ],
      badges: ['Хит продаж', '-10% с IKEYA'],
      slug: 'nasund-chair',
    },
    {
      id: 4,
      title: 'PELARBJÖRK',
      description: 'Светильник настольный, белый, 14 см',
      price: 135.00,
      images: [
        '/assets/img/catalog-page/card/card_4.png',
        '/assets/img/catalog-page/card/card_4.png',
        '/assets/img/catalog-page/card/card_4.png',
      ],
      thumbs: [
        '/assets/img/main-page/sales-hist/hits-1.png',
        '/assets/img/main-page/sales-hist/hits-1.png',
        '/assets/img/main-page/sales-hist/hits-3.png',
      ],
      badges: ['Хит продаж', '-10% с IKEYA'],
      slug: 'pelarbjork-lamp',
    },
  ];

  return (
    <div className="all-catalog-items">
      {mockProducts.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
