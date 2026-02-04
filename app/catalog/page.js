// app/catalog/page.js
import Breadcrumbs from '@/components/catalog/Breadcrumbs';
import CategoriesGrid from '@/components/catalog/CategoriesGrid';
import FilterAside from '@/components/catalog/sidebar/FilterAside';
import ProductSort from '@/components/catalog/ProductSort';
import FilterChips from '@/components/catalog/FilterChips';
import ProductGrid from '@/components/catalog/products/ProductGrid';
import Pagination from '@/components/catalog/Pagination';
import { getPopularCategories, getProducts } from '@/lib/api/ikea';

export const metadata = {
  title: 'Каталог | IKEA',
  description: 'Каталог товаров IKEA — мебель и товары для дома',
};

export default async function CatalogPage({ searchParams }) {
  const page = Number(searchParams.page) || 1;
  const per_page = 20;

  // 🔥 ПОЛУЧАЕМ ДАННЫЕ ИЗ API
  let categories = [];
  let products = [];
  let meta = { total: 0, page: 1, per_page: 20 };

  try {
    // Параллельно загружаем категории и товары
    const [categoriesData, productsData] = await Promise.all([
      getPopularCategories(),
      getProducts({ page, per_page })
    ]);
    
    categories = categoriesData?.data || [];
    products = productsData?.data || [];
    meta = productsData?.meta || meta;
    
    console.log('✅ Категорий:', categories.length, '| Товаров:', products.length);
  } catch (error) {
    console.error('❌ Ошибка загрузки:', error);
  }

  const filters = {}; // TODO: Добавим позже

  // Вычисляем общее количество страниц
  const totalPages = Math.ceil(meta.total / meta.per_page);

  return (
    <main className="main catalog-inner">
      {/* Хлебные крошки */}
      <Breadcrumbs items={[{ label: 'Главная', href: '/' }, { label: 'Каталог' }]} />

      {/* Верхняя панель с категориями */}
      <CategoriesGrid categories={categories} />

      {/* Основной контент */}
      <section className="all-catalog">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="all-catalog-inner">
                {/* Левый sidebar с фильтрами */}
                <FilterAside 
                  showAllFilters={false}
                  filters={filters}
                />

                {/* Правая секция с товарами */}
                <div className="all-catalog-cards">
                  {/* Сортировка */}
                  <ProductSort />

                  {/* Чипсы активных фильтров */}
                  <FilterChips filters={filters} />

                  {/* Сетка товаров */}
                  <ProductGrid products={products} />

                  {/* Пагинация */}
                  <Pagination 
                    currentPage={page}
                    totalPages={totalPages}
                    totalItems={meta.total}
                    itemsPerPage={per_page}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
