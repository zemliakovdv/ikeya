import Breadcrumbs from '../../../components/Breadcrumbs';
import CatalogCategories from '../../../components/catalog/CatalogCategories';
import CategoryFilter from '../../../components/catalog/CategoryFilter';
import CatalogSort from '../../../components/catalog/CatalogSort';
import FilterChips from '../../../components/catalog/FilterChips';
import ProductCard from '../../../components/catalog/ProductCard';
import Pagination from '../../../components/catalog/Pagination';

export default function CategoryPage({ params }) {
  const categoryName = 'Сад и балкон';
  
  const breadcrumbItems = [
    { label: 'Главная', href: '/' },
    { label: 'Каталог', href: '/catalog' },
    { label: categoryName, href: `/catalog/${params.category}` }
  ];

  const subcategories = [
    { label: 'Садовая и балконная мебель', href: '/catalog-second', active: false },
    { label: 'Зонты, беседки и перголы', href: '/catalog-second', active: false },
    { label: 'Полы для балконов и террас', href: '/catalog-second', active: false },
    { label: 'Садовые принадлежности', href: '/catalog-second', active: false },
    { label: 'Освещение сада', href: '/catalog-second', active: false },
    { label: 'Ковры для балкона и террасы', href: '/catalog-second', active: false },
    { label: 'Хранение в саду и на балконе', href: '/catalog-second', active: false },
    { label: 'Садовая кухня и гриль', href: '/catalog-second', active: false },
  ];

  const products = [
    {
      id: 1,
      title: 'SLATTUM',
      description: 'Каркас кровати с обивкой, Vissle темно-серый, 140x200 см',
      price: '135',
      images: Array(5).fill('/assets/img/catalog-page/card/card1.png'),
      thumbImages: Array(5).fill('/assets/img/main-page/sales-hist/hits-1.png'),
      badges: { hit: 'Хит продаж', discount: '-10% промокод IKEYA' }
    },
    {
      id: 2,
      title: 'GRÄDVIS',
      description: 'Стакан, прозрачное стекло, 21 cl',
      price: '135',
      images: Array(5).fill('/assets/img/catalog-page/card/card2.png'),
      thumbImages: Array(5).fill('/assets/img/main-page/sales-hist/hits-1.png'),
      badges: { new: 'Новинка' }
    },
    {
      id: 3,
      title: 'NÖSUND',
      description: 'Потолочный светильник, белый, 44 см',
      price: '135',
      images: Array(5).fill('/assets/img/catalog-page/card/card3.png'),
      thumbImages: ['/assets/img/catalog-page/card/mini/cardmini1.png', '/assets/img/catalog-page/card/mini/cardmini2.png', '/assets/img/catalog-page/card/mini/cardmini3.png'],
      badges: { hit: 'Хит продаж' }
    },
        {
      id: 3,
      title: 'NÖSUND',
      description: 'Потолочный светильник, белый, 44 см',
      price: '135',
      images: Array(5).fill('/assets/img/catalog-page/card/card3.png'),
      thumbImages: ['/assets/img/catalog-page/card/mini/cardmini1.png', '/assets/img/catalog-page/card/mini/cardmini2.png', '/assets/img/catalog-page/card/mini/cardmini3.png'],
      badges: { hit: 'Хит продаж' }
    },
        {
      id: 3,
      title: 'NÖSUND',
      description: 'Потолочный светильник, белый, 44 см',
      price: '135',
      images: Array(5).fill('/assets/img/catalog-page/card/card3.png'),
      thumbImages: ['/assets/img/catalog-page/card/mini/cardmini1.png', '/assets/img/catalog-page/card/mini/cardmini2.png', '/assets/img/catalog-page/card/mini/cardmini3.png'],
      badges: { hit: 'Хит продаж' }
    },
        {
      id: 3,
      title: 'NÖSUND',
      description: 'Потолочный светильник, белый, 44 см',
      price: '135',
      images: Array(5).fill('/assets/img/catalog-page/card/card3.png'),
      thumbImages: ['/assets/img/catalog-page/card/mini/cardmini1.png', '/assets/img/catalog-page/card/mini/cardmini2.png', '/assets/img/catalog-page/card/mini/cardmini3.png'],
      badges: { hit: 'Хит продаж' }
    },
        {
      id: 3,
      title: 'NÖSUND',
      description: 'Потолочный светильник, белый, 44 см',
      price: '135',
      images: Array(5).fill('/assets/img/catalog-page/card/card3.png'),
      thumbImages: ['/assets/img/catalog-page/card/mini/cardmini1.png', '/assets/img/catalog-page/card/mini/cardmini2.png', '/assets/img/catalog-page/card/mini/cardmini3.png'],
      badges: { hit: 'Хит продаж' }
    },
        {
      id: 3,
      title: 'NÖSUND',
      description: 'Потолочный светильник, белый, 44 см',
      price: '135',
      images: Array(5).fill('/assets/img/catalog-page/card/card3.png'),
      thumbImages: ['/assets/img/catalog-page/card/mini/cardmini1.png', '/assets/img/catalog-page/card/mini/cardmini2.png', '/assets/img/catalog-page/card/mini/cardmini3.png'],
      badges: { hit: 'Хит продаж' }
    },

        {
      id: 3,
      title: 'NÖSUND',
      description: 'Потолочный светильник, белый, 44 см',
      price: '135',
      images: Array(5).fill('/assets/img/catalog-page/card/card3.png'),
      thumbImages: ['/assets/img/catalog-page/card/mini/cardmini1.png', '/assets/img/catalog-page/card/mini/cardmini2.png', '/assets/img/catalog-page/card/mini/cardmini3.png'],
      badges: { hit: 'Хит продаж' }
    },
        {
      id: 3,
      title: 'NÖSUND',
      description: 'Потолочный светильник, белый, 44 см',
      price: '135',
      images: Array(5).fill('/assets/img/catalog-page/card/card3.png'),
      thumbImages: ['/assets/img/catalog-page/card/mini/cardmini1.png', '/assets/img/catalog-page/card/mini/cardmini2.png', '/assets/img/catalog-page/card/mini/cardmini3.png'],
      badges: { hit: 'Хит продаж' }
    },
        {
      id: 3,
      title: 'NÖSUND',
      description: 'Потолочный светильник, белый, 44 см',
      price: '135',
      images: Array(5).fill('/assets/img/catalog-page/card/card3.png'),
      thumbImages: ['/assets/img/catalog-page/card/mini/cardmini1.png', '/assets/img/catalog-page/card/mini/cardmini2.png', '/assets/img/catalog-page/card/mini/cardmini3.png'],
      badges: { hit: 'Хит продаж' }
    },

        {
      id: 3,
      title: 'NÖSUND',
      description: 'Потолочный светильник, белый, 44 см',
      price: '135',
      images: Array(5).fill('/assets/img/catalog-page/card/card3.png'),
      thumbImages: ['/assets/img/catalog-page/card/mini/cardmini1.png', '/assets/img/catalog-page/card/mini/cardmini2.png', '/assets/img/catalog-page/card/mini/cardmini3.png'],
      badges: { hit: 'Хит продаж' }
    }
  ];

  return (
    <>
        <main class="main catalog-inner the_first_level">
      <Breadcrumbs items={breadcrumbItems} />
      <CatalogCategories limit={8} />
      
      <section className="all-catalog">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="all-catalog-inner">
                <CategoryFilter 
                  level={1}
                  activeCategory={categoryName}
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
