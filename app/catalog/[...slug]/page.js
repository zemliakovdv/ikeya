// app/catalog/[...slug]/page.js
import Breadcrumbs from '@/components/catalog/Breadcrumbs';
import CatalogStickyOffset from '@/components/catalog/CatalogStickyOffset';
import ChildCategoriesSlider from '@/components/catalog/ChildCategoriesSlider';
import FilterAside from '@/components/catalog/sidebar/FilterAside';
import MobileCatalogFilters from '@/components/catalog/MobileCatalogFilters';
import FilterChips from '@/components/catalog/FilterChips';
import ProductSort from '@/components/catalog/ProductSort';
import ProductGridWithPagination from '@/components/catalog/products/ProductGridWithPagination';
import SeoSection from '@/components/home/SeoSection';
import { getCachedCategoriesTree, getCategoryWithFilters, getCategoryProducts } from '@/lib/api/ikea';
import {
  flattenCategoriesTree,
  findCategoryBySlug,
  buildCategoryChain,
  buildBreadcrumbsFromTree,
  findNodeInTree,
} from '@/lib/utils/categoryHelpers';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const currentSlug = slug[slug.length - 1];

  try {
    const tree = await getCachedCategoriesTree();
    const allCategories = flattenCategoriesTree(tree);
    const category = findCategoryBySlug(allCategories, currentSlug);

    if (!category) return {};

    const attrs = category.attributes || {};
    const seo = attrs.seo || {};
    const name = attrs.translated_name || attrs.name || 'Каталог';

    return {
      title: seo.title || `${name} — купить в Беларуси | IKEYA`,
      description: seo.description || `Купить ${name.toLowerCase()} в интернет-магазине IKEYA. Большой выбор, доступные цены, доставка по Беларуси. Заказывайте онлайн!`,
    };
  } catch {
    return {};
  }
}

function toPositiveInt(value, fallback = 1) {
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : fallback;
}

function toNonNegativeInt(value, fallback = 0) {
  const n = Number(value);
  return Number.isFinite(n) && n >= 0 ? Math.floor(n) : fallback;
}

export default async function CategoryPage({ params, searchParams }) {
  const { slug } = await params;
  const sp = await searchParams;

  const currentSlug = slug[slug.length - 1];

  try {
    const allowedSorts = ['popular', 'newest', 'cheapest', 'expensive'];
    const sort = allowedSorts.includes(sp?.sort) ? sp.sort : null;

    const currentPage = Math.max(1, Number(sp?.page) || 1);

    const tree = await getCachedCategoriesTree();
    const allCategories = flattenCategoriesTree(tree);
    const currentCategory = findCategoryBySlug(allCategories, currentSlug);

    if (!currentCategory) {
      redirect('/catalog');
    }

    const [categoryWithFilters, productsResponse] = await Promise.all([
      getCategoryWithFilters(currentCategory.id),
      getCategoryProducts(currentCategory.id, currentPage, 20, sort, sp || {}),
    ]);

    const categoryData = categoryWithFilters.data;
    const categoryAttrs = categoryData?.attributes || {};
    const seoText = categoryAttrs.seo?.seo_text || categoryAttrs.seo_text || '';

    const availableFilters = categoryWithFilters.available_filters || [];

    const filterLabels = {};
    const filterTitles = {};

    availableFilters.forEach((f) => {
      filterTitles[f.parameter] = f.translated_name || f.name || f.parameter;

      (f.values || []).forEach((v) => {
        if (v.id !== undefined) {
          filterLabels[String(v.id)] = v.translated_name || v.name || String(v.id);
        }
      });
    });

    const { node: currentNode } = findNodeInTree(tree, slug);
    const childCategories = currentNode?.children || [];
    const categoryChain = buildCategoryChain(allCategories, currentCategory);
    const breadcrumbs = buildBreadcrumbsFromTree(tree, slug);
    const level = slug.length;

    const showCategoryGrid = level === 1 && childCategories.length > 0;
    const showAllFilters = level >= 2 || childCategories.length === 0;

    const initialProducts = productsResponse.data || [];
    const meta = productsResponse.meta || {};
    const totalPages = toPositiveInt(meta.total_pages, 1);
    const totalItems = toNonNegativeInt(meta.total, 0);

    const hasActiveFilters = !!(
      sp?.min_price || sp?.max_price ||
      Object.keys(sp || {}).some((k) => k.startsWith('filters['))
    );

    const queryParams = new URLSearchParams();

    if (sort) queryParams.set('sort', sort);
    if (sp?.min_price) queryParams.set('min_price', sp.min_price);
    if (sp?.max_price) queryParams.set('max_price', sp.max_price);

    for (const [key, value] of Object.entries(sp || {})) {
      if (!key.startsWith('filters[')) continue;

      const values = Array.isArray(value) ? value : [value];
      values.forEach((v) => queryParams.append(key, v));
    }

    const productsQueryString = queryParams.toString();
    const basePath = `/catalog/${categoryChain.map((c) => c.attributes.slug).join('/')}`;

    return (
      <main className="main catalog-inner">
        <Breadcrumbs items={breadcrumbs} />

        <section className="all-catalog">
          <div className="container">
            <h1>{currentCategory.attributes.translated_name}</h1>

            {showCategoryGrid && (
              <div className="catalog-categories">
                <ChildCategoriesSlider categories={childCategories} basePath={basePath} />
              </div>
            )}

            <div className="all-catalog-inner">
              <FilterAside
                treeData={tree}
                slugChain={slug}
                showAllFilters={showAllFilters}
                availableFilters={availableFilters}
                hasChildren={childCategories.length > 0}
              />

              <div className="all-catalog-center" style={initialProducts.length === 0 ? { width: '100%' } : {}}>
                <CatalogStickyOffset />
                <div className="catalog-toolbar-sticky">
                  <div className="catalog-toolbar">
                    <MobileCatalogFilters
                      treeData={tree}
                      slugChain={slug}
                      showAllFilters={showAllFilters}
                      availableFilters={availableFilters}
                      hasChildren={childCategories.length > 0}
                    />

                    <ProductSort currentSort={sort} />
                  </div>
                </div>

                <Suspense fallback={null}>
                  <FilterChips filterLabels={filterLabels} filterTitles={filterTitles} />
                </Suspense>

                {initialProducts.length > 0 ? (
                  <ProductGridWithPagination
                    initialProducts={initialProducts}
                    categoryId={currentCategory.id}
                    totalPages={totalPages}
                    queryString={productsQueryString}
                    initialPage={currentPage}
                    basePath={basePath}
                    currentPage={currentPage}
                    totalItems={totalItems}
                  />
                ) : (
                  <div className="all-catalog-empty">
                    {hasActiveFilters ? (
                      <>
                        <img src="/assets/img/catalog-page/not-found.png" alt="Ничего не найдено" />
                        <h3>Ничего не найдено</h3>
                        <p>По выбранным фильтрам товары не найдены.<br />Попробуйте изменить параметры фильтрации или сбросьте фильтры.</p>
                      </>
                    ) : (
                      <p>В этой категории пока нет товаров</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        <SeoSection seoText={seoText} />
      </main>
    );
  } catch (error) {
    if (error?.digest?.startsWith('NEXT_REDIRECT')) throw error;

    console.error('Error loading category:', error);
    redirect('/catalog');
  }
}