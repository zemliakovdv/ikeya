// app/catalog/page.js
export const dynamic = 'force-dynamic';

import { Suspense } from 'react';
import Breadcrumbs from '@/components/catalog/Breadcrumbs';
import CategoriesGrid from '@/components/catalog/CategoriesGrid';
import FilterAside from '@/components/catalog/sidebar/FilterAside';
import MobileCatalogFilters from '@/components/catalog/MobileCatalogFilters';
import ProductSort from '@/components/catalog/ProductSort';
import FilterChips from '@/components/catalog/FilterChips';
import ProductGridWithPagination from '@/components/catalog/products/ProductGridWithPagination';
import SeoSection from '@/components/home/SeoSection';
import { getCachedCategoriesTree, getProducts } from '@/lib/api/ikea';

export const metadata = {
  title: 'Каталог товаров — мебель и товары для дома | IKEYA',
  description: 'Широкий выбор мебели и товаров для дома в интернет-магазине IKEYA. Диваны, кровати, столы, стулья, текстиль, освещение и многое другое с доставкой по Беларуси.',
};

const catalogSeoText = `
  <h2>Каталог товаров IKEYA</h2>
  <p>Тестовый SEO-текст для корневого каталога. Здесь будет описание ассортимента мебели и товаров для дома, условий покупки, доставки по Беларуси и преимуществ интернет-магазина.</p>
`;

export default async function CatalogPage({ searchParams }) {
  const sp = await searchParams;

  const allowedSorts = ['cheapest', 'expensive'];
  const sort = allowedSorts.includes(sp?.sort) ? sp.sort : null;

  const currentPage = Math.max(1, Number(sp?.page) || 1);

  const [tree, productsResponse] = await Promise.all([
    getCachedCategoriesTree(),
    getProducts({ page: currentPage, per_page: 20, sort })
  ]);

  const products = productsResponse.data || [];
  const meta = productsResponse.meta || {};
  const totalPages = meta.total_pages || Math.ceil((meta.total || 0) / 20);

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
                hasChildren={true}
                availableFilters={[]}
              />
            </Suspense>

            <div className="all-catalog-center">
              <div className="catalog-toolbar">
                <Suspense fallback={null}>
                  <MobileCatalogFilters
                    treeData={tree}
                    slugChain={[]}
                    showAllFilters={false}
                    hasChildren={true}
                    availableFilters={[]}
                  />
                </Suspense>

                <Suspense fallback={null}>
                  <ProductSort currentSort={sort} />
                </Suspense>
              </div>

              <FilterChips filterLabels={{}} filterTitles={{}} />

              <Suspense fallback={<div>Загрузка товаров...</div>}>
                <ProductGridWithPagination
                  initialProducts={products}
                  categoryId={null}
                  totalPages={totalPages}
                  queryString={productsQueryString}
                  initialPage={currentPage}
                  basePath="/catalog"
                  currentPage={currentPage}
                  totalItems={meta.total || 0}
                />
              </Suspense>
            </div>
          </div>
        </div>
      </section>

      <SeoSection seoText={catalogSeoText} />
    </main>
  );
}