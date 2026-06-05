// app/catalog/page.js
export const dynamic = 'force-dynamic';

import { Suspense } from 'react';
import Breadcrumbs from '@/components/catalog/Breadcrumbs';
import CatalogStickyOffset from '@/components/catalog/CatalogStickyOffset';
import CategoriesGrid from '@/components/catalog/CategoriesGrid';
import FilterAside from '@/components/catalog/sidebar/FilterAside';
import MobileCatalogFilters from '@/components/catalog/MobileCatalogFilters';
import ProductSort from '@/components/catalog/ProductSort';
import FilterChips from '@/components/catalog/FilterChips';
import ProductGridWithPagination from '@/components/catalog/products/ProductGridWithPagination';
import SeoSection from '@/components/home/SeoSection';
import { getCachedCatalogSeo, getCachedCategoriesTree, getProducts } from '@/lib/api/ikea';

const FALLBACK_METADATA_TITLE = 'Каталог товаров — мебель и товары для дома | IKEYA';
const FALLBACK_METADATA_DESCRIPTION = 'Широкий выбор мебели и товаров для дома в интернет-магазине IKEYA. Диваны, кровати, столы, стулья, текстиль, освещение и многое другое с доставкой по Беларуси.';

export async function generateMetadata() {
  const catalogSeo = await getCachedCatalogSeo();
  const title = catalogSeo?.meta_title || FALLBACK_METADATA_TITLE;
  const description = catalogSeo?.meta_description || FALLBACK_METADATA_DESCRIPTION;

  return {
    title,
    description,
    alternates: { canonical: 'https://ikeya.by/catalog' },
    openGraph: {
      title,
      description,
      url: 'https://ikeya.by/catalog',
      siteName: 'IKEYA',
      images: [{ url: 'https://ikeya.by/assets/img/no-image.jpg', width: 1200, height: 630, alt: 'Каталог товаров IKEYA' }],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['https://ikeya.by/assets/img/no-image.jpg'],
      url: 'https://ikeya.by/catalog',
    },
  };
}

function buildPaginationUrl(basePath, queryParams, page) {
  const params = new URLSearchParams(queryParams);
  if (page > 1) {
    params.set('page', String(page));
  } else {
    params.delete('page');
  }
  const qs = params.toString();
  return qs ? `${basePath}?${qs}` : basePath;
}

export default async function CatalogPage({ searchParams }) {
  const sp = await searchParams;

  const allowedSorts = ['cheapest', 'expensive'];
  const sort = allowedSorts.includes(sp?.sort) ? sp.sort : null;

  const currentPage = Math.max(1, Number(sp?.page) || 1);

  const [tree, catalogSeo, productsResponse] = await Promise.all([
    getCachedCategoriesTree(),
    getCachedCatalogSeo(),
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

  const basePath = '/catalog';

  const prevUrl = currentPage > 1
    ? buildPaginationUrl(basePath, queryParams, currentPage - 1)
    : null;

  const nextUrl = currentPage < totalPages
    ? buildPaginationUrl(basePath, queryParams, currentPage + 1)
    : null;

  const breadcrumbs = [
    { name: 'Главная', href: '/' },
    { name: 'Каталог', href: '/catalog' }
  ];

  const seoText = typeof catalogSeo?.seo_text === 'string' ? catalogSeo.seo_text.trim() : '';

  return (
    <main className="main catalog-inner">
      {prevUrl && <link rel="prev" href={prevUrl} />}
      {nextUrl && <link rel="next" href={nextUrl} />}

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
              <CatalogStickyOffset />
              <div className="catalog-toolbar-sticky">
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
              </div>

              <div className="catalog-page-filter-chips">
                <FilterChips filterLabels={{}} filterTitles={{}} />
              </div>

              <Suspense fallback={<div>Загрузка товаров...</div>}>
                <ProductGridWithPagination
                  initialProducts={products}
                  categoryId={null}
                  totalPages={totalPages}
                  queryString={productsQueryString}
                  initialPage={currentPage}
                  basePath={basePath}
                  currentPage={currentPage}
                  totalItems={meta.total || 0}
                />
              </Suspense>
            </div>
          </div>
        </div>
      </section>

      {seoText ? <SeoSection seoText={seoText} /> : null}
    </main>
  );
}
