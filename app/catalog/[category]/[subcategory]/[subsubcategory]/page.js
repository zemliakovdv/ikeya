import Breadcrumbs from '../../../../../components/Breadcrumbs';
import FullCategoryFilter from '../../../../../components/catalog/FullCategoryFilter';
import CatalogSort from '../../../../../components/catalog/CatalogSort';
import FilterChips from '../../../../../components/catalog/FilterChips';
import ProductCard from '../../../../../components/catalog/ProductCard';
import Pagination from '../../../../../components/catalog/Pagination';

export default function ThirdLevelPage({ params }) {
  const breadcrumbItems = [
    { label: 'Главная', href: '/' },
    { label: 'Каталог', href: '/catalog' },
    { label: 'Сад и балкон', href: `/catalog/${params.category}` },
    { label: 'Садовая и балконная мебель', href: `/catalog/${params.category}/${params.subcategory}` },
    { label: 'Садовая мебель', href: `/catalog/${params.category}/${params.subcategory}/${params.subsubcategory}` }
  ];

  const subcategories = [
    { label: 'Садовая мебель', href: '/catalog-third', active: true },
    { label: 'Диваны для сада и балкона', href: '/catalog-category', active: false },
    { label: 'Садовые стулья и кресла', href: '/catalog-category', active: false },
    { label: 'Мягкие гарнитуры для террасы и балкона', href: '/catalog-category', active: false },
    { label: 'Модули садовой мебели', href: '/catalog-category', active: false },
    { label: 'Скамейки для сада и балкона', href: '/catalog-category', active: false },
    { label: 'Подушки для сидения на открытом воздухе', href: '/catalog-category', active: false },
  ];

  const products = [
    {
      id: 1,
      title: 'SLATTUM',
      description: 'Каркас кровати с обивкой, Vissle темно-серый, 140x200 см',
      price: '135',
      images: Array(5).fill('/assets/img/catalog-page/card/card_1.png'),
      thumbImages: Array(5).fill('/assets/img/main-page/sales-hist/hits-1.png'),
      badges: { hit: 'Хит продаж', discount: '-10% промокод IKEYA' }
    },
    {
      id: 2,
      title: 'GRÄDVIS',
      description: 'Стакан, прозрачное стекло, 21 cl',
      price: '135',
      images: Array(5).fill('/assets/img/catalog-page/card/card_2.png'),
      thumbImages: Array(5).fill('/assets/img/main-page/sales-hist/hits-1.png'),
      badges: { new: 'Новинка' }
    },
    {
      id: 3,
      title: 'NÖSUND',
      description: 'Потолочный светильник, белый, 44 см',
      price: '135',
      images: Array(5).fill('/assets/img/catalog-page/card/card_3.png'),
      thumbImages: ['/assets/img/catalog-page/card/mini/card_mini_1.png', '/assets/img/catalog-page/card/mini/card_mini_2.png', '/assets/img/catalog-page/card/mini/card_mini_3.png'],
      badges: { hit: 'Хит продаж' }
    },
        {
      id: 2,
      title: 'GRÄDVIS',
      description: 'Стакан, прозрачное стекло, 21 cl',
      price: '135',
      images: Array(5).fill('/assets/img/catalog-page/card/card_2.png'),
      thumbImages: Array(5).fill('/assets/img/main-page/sales-hist/hits-1.png'),
      badges: { new: 'Новинка' }
    },
        {
      id: 1,
      title: 'SLATTUM',
      description: 'Каркас кровати с обивкой, Vissle темно-серый, 140x200 см',
      price: '135',
      images: Array(5).fill('/assets/img/catalog-page/card/card_1.png'),
      thumbImages: Array(5).fill('/assets/img/main-page/sales-hist/hits-1.png'),
      badges: { hit: 'Хит продаж', discount: '-10% промокод IKEYA' }
    },
    {
      id: 2,
      title: 'GRÄDVIS',
      description: 'Стакан, прозрачное стекло, 21 cl',
      price: '135',
      images: Array(5).fill('/assets/img/catalog-page/card/card_2.png'),
      thumbImages: Array(5).fill('/assets/img/main-page/sales-hist/hits-1.png'),
      badges: { new: 'Новинка' }
    },
    {
      id: 3,
      title: 'NÖSUND',
      description: 'Потолочный светильник, белый, 44 см',
      price: '135',
      images: Array(5).fill('/assets/img/catalog-page/card/card_3.png'),
      thumbImages: ['/assets/img/catalog-page/card/mini/card_mini_1.png', '/assets/img/catalog-page/card/mini/card_mini_2.png', '/assets/img/catalog-page/card/mini/card_mini_3.png'],
      badges: { hit: 'Хит продаж' }
    },
        {
      id: 2,
      title: 'GRÄDVIS',
      description: 'Стакан, прозрачное стекло, 21 cl',
      price: '135',
      images: Array(5).fill('/assets/img/catalog-page/card/card_2.png'),
      thumbImages: Array(5).fill('/assets/img/main-page/sales-hist/hits-1.png'),
      badges: { new: 'Новинка' }
    },
        {
      id: 1,
      title: 'SLATTUM',
      description: 'Каркас кровати с обивкой, Vissle темно-серый, 140x200 см',
      price: '135',
      images: Array(5).fill('/assets/img/catalog-page/card/card_1.png'),
      thumbImages: Array(5).fill('/assets/img/main-page/sales-hist/hits-1.png'),
      badges: { hit: 'Хит продаж', discount: '-10% промокод IKEYA' }
    },
    {
      id: 2,
      title: 'GRÄDVIS',
      description: 'Стакан, прозрачное стекло, 21 cl',
      price: '135',
      images: Array(5).fill('/assets/img/catalog-page/card/card_2.png'),
      thumbImages: Array(5).fill('/assets/img/main-page/sales-hist/hits-1.png'),
      badges: { new: 'Новинка' }
    },
    {
      id: 3,
      title: 'NÖSUND',
      description: 'Потолочный светильник, белый, 44 см',
      price: '135',
      images: Array(5).fill('/assets/img/catalog-page/card/card_3.png'),
      thumbImages: ['/assets/img/catalog-page/card/mini/card_mini_1.png', '/assets/img/catalog-page/card/mini/card_mini_2.png', '/assets/img/catalog-page/card/mini/card_mini_3.png'],
      badges: { hit: 'Хит продаж' }
    },
        {
      id: 2,
      title: 'GRÄDVIS',
      description: 'Стакан, прозрачное стекло, 21 cl',
      price: '135',
      images: Array(5).fill('/assets/img/catalog-page/card/card_2.png'),
      thumbImages: Array(5).fill('/assets/img/main-page/sales-hist/hits-1.png'),
      badges: { new: 'Новинка' }
    },
        {
      id: 1,
      title: 'SLATTUM',
      description: 'Каркас кровати с обивкой, Vissle темно-серый, 140x200 см',
      price: '135',
      images: Array(5).fill('/assets/img/catalog-page/card/card_1.png'),
      thumbImages: Array(5).fill('/assets/img/main-page/sales-hist/hits-1.png'),
      badges: { hit: 'Хит продаж', discount: '-10% промокод IKEYA' }
    },
    {
      id: 2,
      title: 'GRÄDVIS',
      description: 'Стакан, прозрачное стекло, 21 cl',
      price: '135',
      images: Array(5).fill('/assets/img/catalog-page/card/card_2.png'),
      thumbImages: Array(5).fill('/assets/img/main-page/sales-hist/hits-1.png'),
      badges: { new: 'Новинка' }
    },
    {
      id: 3,
      title: 'NÖSUND',
      description: 'Потолочный светильник, белый, 44 см',
      price: '135',
      images: Array(5).fill('/assets/img/catalog-page/card/card_3.png'),
      thumbImages: ['/assets/img/catalog-page/card/mini/card_mini_1.png', '/assets/img/catalog-page/card/mini/card_mini_2.png', '/assets/img/catalog-page/card/mini/card_mini_3.png'],
      badges: { hit: 'Хит продаж' }
    },
        {
      id: 2,
      title: 'GRÄDVIS',
      description: 'Стакан, прозрачное стекло, 21 cl',
      price: '135',
      images: Array(5).fill('/assets/img/catalog-page/card/card_2.png'),
      thumbImages: Array(5).fill('/assets/img/main-page/sales-hist/hits-1.png'),
      badges: { new: 'Новинка' }
    },    {
      id: 1,
      title: 'SLATTUM',
      description: 'Каркас кровати с обивкой, Vissle темно-серый, 140x200 см',
      price: '135',
      images: Array(5).fill('/assets/img/catalog-page/card/card_1.png'),
      thumbImages: Array(5).fill('/assets/img/main-page/sales-hist/hits-1.png'),
      badges: { hit: 'Хит продаж', discount: '-10% промокод IKEYA' }
    },
    {
      id: 2,
      title: 'GRÄDVIS',
      description: 'Стакан, прозрачное стекло, 21 cl',
      price: '135',
      images: Array(5).fill('/assets/img/catalog-page/card/card_2.png'),
      thumbImages: Array(5).fill('/assets/img/main-page/sales-hist/hits-1.png'),
      badges: { new: 'Новинка' }
    },
    {
      id: 3,
      title: 'NÖSUND',
      description: 'Потолочный светильник, белый, 44 см',
      price: '135',
      images: Array(5).fill('/assets/img/catalog-page/card/card_3.png'),
      thumbImages: ['/assets/img/catalog-page/card/mini/card_mini_1.png', '/assets/img/catalog-page/card/mini/card_mini_2.png', '/assets/img/catalog-page/card/mini/card_mini_3.png'],
      badges: { hit: 'Хит продаж' }
    },
        {
      id: 2,
      title: 'GRÄDVIS',
      description: 'Стакан, прозрачное стекло, 21 cl',
      price: '135',
      images: Array(5).fill('/assets/img/catalog-page/card/card_2.png'),
      thumbImages: Array(5).fill('/assets/img/main-page/sales-hist/hits-1.png'),
      badges: { new: 'Новинка' }
    }
    ,    {
      id: 1,
      title: 'SLATTUM',
      description: 'Каркас кровати с обивкой, Vissle темно-серый, 140x200 см',
      price: '135',
      images: Array(5).fill('/assets/img/catalog-page/card/card_1.png'),
      thumbImages: Array(5).fill('/assets/img/main-page/sales-hist/hits-1.png'),
      badges: { hit: 'Хит продаж', discount: '-10% промокод IKEYA' }
    },
    {
      id: 2,
      title: 'GRÄDVIS',
      description: 'Стакан, прозрачное стекло, 21 cl',
      price: '135',
      images: Array(5).fill('/assets/img/catalog-page/card/card_2.png'),
      thumbImages: Array(5).fill('/assets/img/main-page/sales-hist/hits-1.png'),
      badges: { new: 'Новинка' }
    },
    {
      id: 3,
      title: 'NÖSUND',
      description: 'Потолочный светильник, белый, 44 см',
      price: '135',
      images: Array(5).fill('/assets/img/catalog-page/card/card_3.png'),
      thumbImages: ['/assets/img/catalog-page/card/mini/card_mini_1.png', '/assets/img/catalog-page/card/mini/card_mini_2.png', '/assets/img/catalog-page/card/mini/card_mini_3.png'],
      badges: { hit: 'Хит продаж' }
    },
        {
      id: 2,
      title: 'GRÄDVIS',
      description: 'Стакан, прозрачное стекло, 21 cl',
      price: '135',
      images: Array(5).fill('/assets/img/catalog-page/card/card_2.png'),
      thumbImages: Array(5).fill('/assets/img/main-page/sales-hist/hits-1.png'),
      badges: { new: 'Новинка' }
    }
  ];

  return (
    <>
     <main class="main catalog-inner">
      <Breadcrumbs items={breadcrumbItems} />
      
      <section className="all-catalog">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="all-catalog-inner">
                <FullCategoryFilter 
                  breadcrumbCategories={[
                    { label: 'Сад и Балкон', href: `/catalog/${params.category}` },
                    { label: 'Садовая и балконная мебель', href: `/catalog/${params.category}/${params.subcategory}` }
                  ]}
                  subcategories={subcategories}
                />
                
                <div className="all-catalog-cards">
                  <CatalogSort />
                  <FilterChips chips={[]} onRemove={() => {}} onClearAll={() => {}} />
                  
                  <div className="all-catalog-items">
                    {products.map((product) => (
                      <ProductCard key={product.id} {...product} />
                    ))}
                  </div>
                  
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
