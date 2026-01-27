// app/catalog/page.js
import Breadcrumbs from '@/components/catalog/Breadcrumbs';
import CategoriesGrid from '@/components/catalog/CategoriesGrid';
import FilterAside from '@/components/catalog/sidebar/FilterAside';
import ProductSort from '@/components/catalog/ProductSort';
import FilterChips from '@/components/catalog/FilterChips';
import ProductGrid from '@/components/catalog/products/ProductGrid';
import Pagination from '@/components/catalog/Pagination';

export const metadata = {
  title: 'Каталог | IKEA',
  description: 'Каталог товаров IKEA — мебель и товары для дома',
};

export default async function CatalogPage({ searchParams }) {
  // TODO: Здесь будет запрос к API для получения данных
  const categories = []; // Массив категорий для верхней панели
  const products = [];   // Массив товаров
  const filters = {};    // Активные фильтры

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
                  showAllFilters={false} // На главной скрыты доп. фильтры
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
                    currentPage={1}
                    totalPages={16}
                    totalItems={320}
                    itemsPerPage={20}
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
