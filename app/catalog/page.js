// app/catalog/page.js
export const dynamic = 'force-dynamic';

import { Suspense } from 'react';
import Breadcrumbs from '@/components/catalog/Breadcrumbs';
import CategoriesGrid from '@/components/catalog/CategoriesGrid';
import FilterAside from '@/components/catalog/sidebar/FilterAside';
import ProductSort from '@/components/catalog/ProductSort';
import FilterChips from '@/components/catalog/FilterChips';
import InfiniteProductGrid from '@/components/catalog/products/InfiniteProductGrid';
import { getCachedCategoriesTree, getProducts } from '@/lib/api/ikea';

export default async function CatalogPage() {
  const [tree, productsResponse] = await Promise.all([
    getCachedCategoriesTree(),
    getProducts({ page: 1, per_page: 20 })
  ]);

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

          {tree.length > 0 && (
            <div className="catalog-categories">
              <CategoriesGrid categories={tree} />
            </div>
          )}

          <div className="all-catalog-inner">
            <Suspense fallback={null}>
              <FilterAside
                treeData={tree}
                slugChain={[]}
                showAllFilters={false}
              />
            </Suspense>

            <div className="all-catalog-center">
              <Suspense fallback={null}>
                <ProductSort currentSort={null} />
              </Suspense>

              <FilterChips filterLabels={{}} filterTitles={{}} />

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