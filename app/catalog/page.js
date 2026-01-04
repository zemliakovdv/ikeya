import Breadcrumbs from '../../components/Breadcrumbs';
import CatalogCategories from '../../components/catalog/CatalogCategories';
import CatalogFilter from '../../components/catalog/CatalogFilter';
import CatalogSort from '../../components/catalog/CatalogSort';
import FilterChips from '../../components/catalog/FilterChips';
import ProductCard from '../../components/catalog/ProductCard';
import Pagination from '../../components/catalog/Pagination';

export default function CatalogPage() {
  const breadcrumbItems = [
    { label: 'Главная', href: '/' },
    { label: 'Каталог', href: '/catalog' }
  ];

  // Пример данных товаров
const products = [
  {
    id: 1,
    title: 'SLATTUM',
    description: 'Каркас кровати с обивкой, Vissle темно-серый, 140x200 см',
    price: '135',
    images: Array(5).fill('/assets/img/catalog-page/card/card_1.png'),
    thumbImages: [
      '/assets/img/main-page/sales-hist/hits-1.png',
      '/assets/img/main-page/sales-hist/hits-1.png',
      '/assets/img/main-page/sales-hist/hits-3.png',
      '/assets/img/main-page/sales-hist/hits-3.png',
      '/assets/img/main-page/sales-hist/hits-3.png',
    ],
    badges: { hit: 'Хит продаж', discount: '-10% промокод IKEYA' }
  },
  {
    id: 2,
    title: 'GRÄDVIS',
    description: 'Стакан, прозрачное стекло, 21 cl',
    price: '135',
    images: Array(5).fill('/assets/img/catalog-page/card/card_2.png'),
    thumbImages: Array(5).fill('/assets/img/main-page/sales-hist/hits-1.png'),
    badges: { hit: 'Хит продаж', discount: '-10% промокод IKEYA' }
  },
  {
    id: 3,
    title: 'NÖSUND',
    description: 'Потолочный светильник, белый, 44 см',
    price: '135',
    images: Array(5).fill('/assets/img/catalog-page/card/card_3.png'),
    thumbImages: ['/assets/img/catalog-page/card/mini/card_mini_1.png', '/assets/img/catalog-page/card/mini/card_mini_2.png', '/assets/img/catalog-page/card/mini/card_mini_3.png', '/assets/img/catalog-page/card/mini/card_mini_3.png', '/assets/img/catalog-page/card/mini/card_mini_3.png'],
    badges: { hit: 'Хит продаж', discount: '-10% промокод IKEYA' }
  },
  {
    id: 4,
    title: 'PELARBJÖRK',
    description: 'Набор из 2 декоративных подушек, серый, 14 см',
    price: '135',
    images: Array(5).fill('/assets/img/catalog-page/card/card_4.png'),
    thumbImages: Array(5).fill('/assets/img/main-page/sales-hist/hits-1.png'),
    badges: { hit: 'Хит продаж', discount: '-10% промокод IKEYA' }
  },
  {
    id: 5,
    title: 'VALEVÅG',
    description: 'Матрас пружинный, средней жесткости, белый, 140x200 см',
    price: '135',
    images: Array(5).fill('/assets/img/catalog-page/card/card_5.png'),
    thumbImages: Array(5).fill('/assets/img/main-page/sales-hist/hits-1.png'),
    badges: { hit: 'Хит продаж', discount: '-10% промокод IKEYA' }
  },
  {
    id: 6,
    title: 'NYMNE',
    description: 'Гардина, 2 шт, белый, 33 см',
    price: '135',
    images: Array(5).fill('/assets/img/catalog-page/card/card_6.png'),
    thumbImages: ['/assets/img/catalog-page/card/mini/card_mini_1.png', '/assets/img/catalog-page/card/mini/card_mini_2.png', '/assets/img/catalog-page/card/mini/card_mini_3.png', '/assets/img/catalog-page/card/mini/card_mini_3.png', '/assets/img/catalog-page/card/mini/card_mini_3.png'],
    badges: { hit: 'Хит продаж', discount: '-10% промокод IKEYA' }
  },
  {
    id: 7,
    title: 'SÖDERHAMN',
    description: 'Диван трехместный, серый',
    price: '135',
    images: Array(5).fill('/assets/img/catalog-page/card/card_7.png'),
    thumbImages: ['/assets/img/catalog-page/card/mini/card_mini_1.png', '/assets/img/catalog-page/card/mini/card_mini_2.png', '/assets/img/catalog-page/card/mini/card_mini_3.png', '/assets/img/catalog-page/card/mini/card_mini_3.png', '/assets/img/catalog-page/card/mini/card_mini_3.png'],
    badges: { hit: 'Хит продаж', discount: '-10% промокод IKEYA' }
  },
  {
    id: 8,
    title: 'HEMNES',
    description: 'Комод с 8 ящиками, белый',
    price: '135',
    images: Array(5).fill('/assets/img/catalog-page/card/card_8.png'),
    thumbImages: Array(5).fill('/assets/img/main-page/sales-hist/hits-1.png'),
    badges: { hit: 'Хит продаж', discount: '-10% промокод IKEYA' }
  },
  {
    id: 9,
    title: 'KALLAX',
    description: 'Стеллаж, белый, 77x147 см',
    price: '135',
    images: Array(5).fill('/assets/img/catalog-page/card/card_9.png'),
    thumbImages: Array(5).fill('/assets/img/main-page/sales-hist/hits-1.png'),
    badges: { hit: 'Хит продаж', discount: '-10% промокод IKEYA' }
  },
  {
    id: 10,
    title: 'BILLY',
    description: 'Книжный шкаф, белый, 80x28x202 см',
    price: '135',
    images: Array(5).fill('/assets/img/catalog-page/card/card_10.png'),
    thumbImages: ['/assets/img/catalog-page/card/mini/card_mini_1.png', '/assets/img/catalog-page/card/mini/card_mini_2.png', '/assets/img/catalog-page/card/mini/card_mini_3.png', '/assets/img/catalog-page/card/mini/card_mini_3.png', '/assets/img/catalog-page/card/mini/card_mini_3.png'],
    badges: { hit: 'Хит продаж', discount: '-10% промокод IKEYA' }
  },
  {
    id: 11,
    title: 'MALM',
    description: 'Каркас кровати, высокий, белый, 160x200 см',
    price: '135',
    images: Array(5).fill('/assets/img/catalog-page/card/card_11.png'),
    thumbImages: ['/assets/img/catalog-page/card/mini/card_mini_1.png', '/assets/img/catalog-page/card/mini/card_mini_2.png', '/assets/img/catalog-page/card/mini/card_mini_3.png', '/assets/img/catalog-page/card/mini/card_mini_3.png', '/assets/img/catalog-page/card/mini/card_mini_3.png'],
    badges: { hit: 'Хит продаж', discount: '-10% промокод IKEYA' }
  },
  {
    id: 12,
    title: 'POÄNG',
    description: 'Кресло, березовый шпон, Knisa светло-бежевый',
    price: '135',
    images: Array(5).fill('/assets/img/catalog-page/card/card_12.png'),
    thumbImages: ['/assets/img/catalog-page/card/mini/card_mini_1.png', '/assets/img/catalog-page/card/mini/card_mini_2.png', '/assets/img/catalog-page/card/mini/card_mini_3.png', '/assets/img/catalog-page/card/mini/card_mini_3.png', '/assets/img/catalog-page/card/mini/card_mini_3.png'],
    badges: { hit: 'Хит продаж', discount: '-10% промокод IKEYA' }
  },
  {
    id: 13,
    title: 'MICKE',
    description: 'Письменный стол, белый, 105x50 см',
    price: '135',
    images: Array(5).fill('/assets/img/catalog-page/card/card_13.png'),
    thumbImages: Array(5).fill('/assets/img/main-page/sales-hist/hits-1.png'),
    badges: { hit: 'Хит продаж', discount: '-10% промокод IKEYA' }
  },
  {
    id: 14,
    title: 'EKTORP',
    description: 'Трехместный диван, Lofallet бежевый',
    price: '135',
    images: Array(5).fill('/assets/img/catalog-page/card/card_14.png'),
    thumbImages: Array(5).fill('/assets/img/main-page/sales-hist/hits-1.png'),
    badges: { hit: 'Хит продаж', discount: '-10% промокод IKEYA' }
  },
  {
    id: 15,
    title: 'LACK',
    description: 'Журнальный столик, белый, 90x55 см',
    price: '135',
    images: Array(5).fill('/assets/img/catalog-page/card/card_15.png'),
    thumbImages: Array(5).fill('/assets/img/main-page/sales-hist/hits-1.png'),
    badges: { hit: 'Хит продаж', discount: '-10% промокод IKEYA' }
  },
  {
    id: 16,
    title: 'NORDLI',
    description: 'Комод с 6 ящиками, белый, 120x99 см',
    price: '135',
    images: Array(5).fill('/assets/img/catalog-page/card/card_16.png'),
    thumbImages: Array(5).fill('/assets/img/main-page/sales-hist/hits-1.png'),
    badges: { hit: 'Хит продаж', discount: '-10% промокод IKEYA' }
  },
  {
    id: 17,
    title: 'STUVA',
    description: 'Комбинация для хранения, белый/береза, 60x50x192 см',
    price: '135',
    images: Array(5).fill('/assets/img/catalog-page/card/card_17.png'),
    thumbImages: Array(5).fill('/assets/img/main-page/sales-hist/hits-1.png'),
    badges: { hit: 'Хит продаж', discount: '-10% промокод IKEYA' }
  },
  {
    id: 18,
    title: 'JANSJÖ',
    description: 'Настольная лампа, черный',
    price: '135',
    images: Array(5).fill('/assets/img/catalog-page/card/card_18.png'),
    thumbImages: Array(5).fill('/assets/img/main-page/sales-hist/hits-1.png'),
    badges: { hit: 'Хит продаж', discount: '-10% промокод IKEYA' }
  },
  {
    id: 19,
    title: 'VEDBO',
    description: 'Кресло, Gunnared бежевый',
    price: '135',
    images: Array(5).fill('/assets/img/catalog-page/card/card_19.png'),
    thumbImages: ['/assets/img/catalog-page/card/mini/card_mini_1.png', '/assets/img/catalog-page/card/mini/card_mini_2.png', '/assets/img/catalog-page/card/mini/card_mini_3.png', '/assets/img/catalog-page/card/mini/card_mini_3.png', '/assets/img/catalog-page/card/mini/card_mini_3.png'],
    badges: { hit: 'Хит продаж', discount: '-10% промокод IKEYA' }
  },
  {
    id: 20,
    title: 'TRYSIL',
    description: 'Гардероб, белый, 118x61x202 см',
    price: '135',
    images: Array(5).fill('/assets/img/catalog-page/card/card_20.png'),
    thumbImages: ['/assets/img/catalog-page/card/mini/card_mini_1.png', '/assets/img/catalog-page/card/mini/card_mini_2.png', '/assets/img/catalog-page/card/mini/card_mini_3.png', '/assets/img/catalog-page/card/mini/card_mini_3.png', '/assets/img/catalog-page/card/mini/card_mini_3.png'],
    badges: { hit: 'Хит продаж', discount: '-10% промокод IKEYA' }
  },
  {
    id: 21,
    title: 'SKUBB',
    description: 'Коробка для обуви, белый, 22x34x16 см',
    price: '135',
    images: Array(5).fill('/assets/img/catalog-page/card/card_21.png'),
    thumbImages: ['/assets/img/catalog-page/card/mini/card_mini_1.png', '/assets/img/catalog-page/card/mini/card_mini_2.png', '/assets/img/catalog-page/card/mini/card_mini_3.png', '/assets/img/catalog-page/card/mini/card_mini_3.png', '/assets/img/catalog-page/card/mini/card_mini_3.png'],
    badges: { hit: 'Хит продаж', discount: '-10% промокод IKEYA' }
  },
  {
    id: 22,
    title: 'RÖNNINGE',
    description: 'Стул, береза',
    price: '135',
    images: Array(5).fill('/assets/img/catalog-page/card/card_22.png'),
    thumbImages: ['/assets/img/catalog-page/card/mini/card_mini_1.png', '/assets/img/catalog-page/card/mini/card_mini_2.png', '/assets/img/catalog-page/card/mini/card_mini_3.png', '/assets/img/catalog-page/card/mini/card_mini_3.png', '/assets/img/catalog-page/card/mini/card_mini_3.png'],
    badges: { hit: 'Хит продаж', discount: '-10% промокод IKEYA' }
  },
  {
    id: 23,
    title: 'LISABO',
    description: 'Стол, ясеневый шпон, 140x78 см',
    price: '135',
    images: Array(5).fill('/assets/img/catalog-page/card/card_23.png'),
    thumbImages: ['/assets/img/catalog-page/card/mini/card_mini_1.png', '/assets/img/catalog-page/card/mini/card_mini_2.png', '/assets/img/catalog-page/card/mini/card_mini_3.png', '/assets/img/catalog-page/card/mini/card_mini_3.png', '/assets/img/catalog-page/card/mini/card_mini_3.png'],
    badges: { hit: 'Хит продаж', discount: '-10% промокод IKEYA' }
  },
  {
    id: 24,
    title: 'HEMNES',
    description: 'Шкаф с 2 дверями, белая морилка, 90x197 см',
    price: '135',
    images: Array(5).fill('/assets/img/catalog-page/card/card_24.png'),
    thumbImages: ['/assets/img/catalog-page/card/mini/card_mini_5.png', '/assets/img/catalog-page/card/mini/card_mini_6.png', '/assets/img/catalog-page/card/mini/card_mini_7.png', '/assets/img/catalog-page/card/mini/card_mini_7.png', '/assets/img/catalog-page/card/mini/card_mini_7.png'],
    badges: { hit: 'Хит продаж', discount: '-10% промокод IKEYA' }
  },
];


  // Пример чипсов фильтров (пустой массив = чипсы не отображаются)
  const filterChips = [];

  return (
    <>
        <main className="main catalog-inner">

       
      <Breadcrumbs items={breadcrumbItems} />
      <CatalogCategories />
      
      <section className="all-catalog">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="all-catalog-inner">
                {/* Боковой фильтр */}
                <CatalogFilter />
                
                {/* Карточки товаров */}
                <div className="all-catalog-cards">
                  {/* Сортировка */}
                  <CatalogSort />
                  
                  {/* Чипсы фильтров */}
                  <FilterChips 
                    chips={filterChips}
                    onRemove={(id) => console.log('Удалить чипс:', id)}
                    onClearAll={() => console.log('Очистить все')}
                  />
                  
                  {/* Сетка товаров */}
                  <div className="all-catalog-items">
                    {products.map((product) => (
                      <ProductCard key={product.id} {...product} />
                    ))}
                  </div>
                  
                  {/* Пагинация */}
                  <Pagination 
                    currentPage={1}
                    totalPages={16}
                    itemsPerPage={20}
                    totalItems={320}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
       </main>
    </>
  );
}
