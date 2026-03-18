// app/catalog/page.js
import { Suspense } from 'react';
import Breadcrumbs from '@/components/catalog/Breadcrumbs';
import CategoriesGrid from '@/components/catalog/CategoriesGrid';
import FilterAside from '@/components/catalog/sidebar/FilterAside';
import ProductSort from '@/components/catalog/ProductSort';
import FilterChips from '@/components/catalog/FilterChips';
import InfiniteProductGrid from '@/components/catalog/products/InfiniteProductGrid';
import { getCachedCategories, getProducts } from '@/lib/api/ikea';

export default async function CatalogPage() {
  const [allCategories, productsResponse] = await Promise.all([
    getCachedCategories(),
    getProducts({ page: 1, per_page: 20 })
  ]);

  const allCategoryIds = new Set(allCategories.map((c) => c.id));
  const rootCategories = allCategories.filter((cat) => {
    const parentIds = cat?.attributes?.parent_ids || [];
    return parentIds.every((pid) => !allCategoryIds.has(pid));
  });

  const simplifiedRootCategories = rootCategories
    .map((cat) => ({
      slug: cat?.attributes?.slug || cat?.id,
      name: cat?.attributes?.translated_name || cat?.attributes?.name || 'Категория'
    }))
    .filter((c) => c.slug);

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
            <Suspense fallback={null}>
              <FilterAside
                showAllFilters={false}
                rootCategories={simplifiedRootCategories}
                level={0}
              />
            </Suspense>

            <div className="all-catalog-center">
              <Suspense fallback={null}>
                <ProductSort currentSort={null} />
              </Suspense>

              <Suspense fallback={<div>Загрузка товаров...</div>}>
                <InfiniteProductGrid
                  initialProducts={products}
                  categoryId={null}
                  totalPages={meta.total_pages || Math.ceil((meta.total || 0) / 20)}
                />
              </Suspense>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}