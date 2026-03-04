import Breadcrumbs from '@/components/catalog/Breadcrumbs';
import CategoriesGrid from '@/components/catalog/CategoriesGrid';
import FilterAside from '@/components/catalog/sidebar/FilterAside';
import ProductSort from '@/components/catalog/ProductSort';
import InfiniteProductGrid from '@/components/catalog/products/InfiniteProductGrid';
import { getCachedCategories, getProducts } from '@/lib/api/ikea'; // ← getCachedCategories вместо getCategoriesTree

export default async function CatalogPage() {
  const [allCategories, productsResponse] = await Promise.all([
    getCachedCategories(), // ← убираем 5.7MB проблему
    getProducts({ page: 1, per_page: 20 })
  ]);

  // корневые — те у кого все parent_ids не являются реальными категориями
  const allCategoryIds = new Set(allCategories.map((c) => c.id));
  const rootCategories = allCategories.filter((cat) => {
    const parentIds = cat?.attributes?.parent_ids || [];
    return parentIds.every((pid) => !allCategoryIds.has(pid));
  });

  const simplifiedRootCategories = rootCategories
    .map((cat) => ({
      slug: cat?.attributes?.slug || cat?.id,  // ← fallback на id если slug нет
      name: cat?.attributes?.translated_name || cat?.attributes?.name || 'Категория'
    }))
    .filter((c) => c.slug); // без slug в /catalog/[...slug] не перейти

  const products = productsResponse.data || [];
  const meta = productsResponse.meta || {};

  const breadcrumbs = [
    { name: 'Главная', href: '/' },
    { name: 'Каталог', href: '/catalog' }
  ];

  return (
    <main className="main catalog-inner">
      <Breadcrumbs items={breadcrumbs} />

      <section className="all-catalog">
        <div className="container">
          <h1>Каталог</h1>

          {rootCategories.length > 0 && (
            <div className="catalog-categories">
              <CategoriesGrid categories={rootCategories} />
            </div>
          )}

          <div className="all-catalog-inner">
            <FilterAside
              showAllFilters={false}
              rootCategories={simplifiedRootCategories}
              level={0}
            />

            <div className="all-catalog-center">
              <ProductSort currentSort={null} />

              <InfiniteProductGrid
                initialProducts={products}
                categoryId={null}
                totalPages={meta.total_pages || Math.ceil((meta.total || 0) / 20)}
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
