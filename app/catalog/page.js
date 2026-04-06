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
import Pagination from '@/components/catalog/Pagination';

export default async function CatalogPage({ searchParams }) {
  const sp = await searchParams;
  const allowedSorts = ['cheapest', 'expensive'];
  const sort = allowedSorts.includes(sp?.sort) ? sp.sort : null;

  const [tree, productsResponse] = await Promise.all([
    getCachedCategoriesTree(),
    getProducts({ page: 1, per_page: 20, sort })
  ]);

  const products = productsResponse.data || [];
  const meta = productsResponse.meta || {};
  console.log('catalog meta:', JSON.stringify(meta));

  const priceRange = { min: 0, max: 10000 };

  const queryParams = new URLSearchParams();
  if (sort) queryParams.set('sort', sort);
  if (sp?.min_price) queryParams.set('min_price', sp.min_price);
  if (sp?.max_price) queryParams.set('max_price', sp.max_price);
  const productsQueryString = queryParams.toString();

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
                priceRange={priceRange}
              />
            </Suspense>

            <div className="all-catalog-center">
              <Suspense fallback={null}>
                <ProductSort currentSort={sort} />
              </Suspense>

              <FilterChips filterLabels={{}} filterTitles={{}} />

              <Suspense fallback={<div>Загрузка товаров...</div>}>
                <InfiniteProductGrid
                  key={productsQueryString}
                  initialProducts={products}
                  categoryId={null}
                  totalPages={meta.total_pages || Math.ceil((meta.total || 0) / 20)}
                  queryString={productsQueryString}
                />
              </Suspense>

              <Pagination
                currentPage={Number(sp?.page) || 1}
                totalPages={meta.total_pages || Math.ceil((meta.total || 0) / 20)}
                totalItems={meta.total || 0}
                basePath="/catalog"
                queryString={productsQueryString}
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}