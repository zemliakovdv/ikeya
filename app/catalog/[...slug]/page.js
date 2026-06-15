// app/catalog/[...slug]/page.js
import Breadcrumbs from '@/components/catalog/Breadcrumbs';
import CatalogStickyOffset from '@/components/catalog/CatalogStickyOffset';
import ChildCategoriesSlider from '@/components/catalog/ChildCategoriesSlider';
import FilterAside from '@/components/catalog/sidebar/FilterAside';
import MobileCatalogFilters from '@/components/catalog/MobileCatalogFilters';
import FilterChips from '@/components/catalog/FilterChips';
import ProductSort from '@/components/catalog/ProductSort';
import ProductGridWithPagination from '@/components/catalog/products/ProductGridWithPagination';
import SeoCatalogPage from '@/components/catalog/seo/SeoCatalogPage';
import SeoSection from '@/components/home/SeoSection';
import { getCachedCategoriesTree, getCategoryWithFilters, getCategoryProducts } from '@/lib/api/ikea';
import { getSeoCatalogPageBySlug } from '@/lib/api/seoCatalogPages';
import { buildSeoCatalogMetadata, isPublishedSeoCatalogPage } from '@/lib/seoCatalogPage';
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

    if (!category) {
      if (slug.length === 1) {
        const seoPage = await getSeoCatalogPageBySlug(currentSlug);

        if (seoPage && isPublishedSeoCatalogPage(seoPage)) {
          return buildSeoCatalogMetadata(seoPage, currentSlug);
        }
      }

      return {};
    }

    const attrs = category.attributes || {};
    const seo = attrs.seo || {};
    const name = attrs.translated_name || attrs.name || 'Каталог';

const title = seo.title || `${name} — купить в Беларуси | IKEYA`;
    const description = seo.description || `Купить ${name.toLowerCase()} в интернет-магазине IKEYA. Большой выбор, доступные цены, доставка по Беларуси. Заказывайте онлайн!`;
    const canonicalUrl = `https://ikeya.by/catalog/${slug.join('/')}`;
    const imageUrl = attrs.icon_url
      ? `https://ikeya.by${attrs.icon_url.startsWith('/') ? attrs.icon_url : `/${attrs.icon_url}`}`
      : (attrs.local_image_path
        ? `https://ikeya.by${attrs.local_image_path.startsWith('/') ? attrs.local_image_path : `/${attrs.local_image_path}`}`
        : 'https://ikeya.by/assets/img/no-image.jpg');

    return {
      title,
      description,
      alternates: { canonical: canonicalUrl },
      openGraph: {
        title,
        description,
        url: canonicalUrl,
        siteName: 'IKEYA',
        images: [{ url: imageUrl, width: 1200, height: 630, alt: name }],
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: [imageUrl],
        url: canonicalUrl,
      },
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
      if (slug.length === 1) {
        const seoPage = await getSeoCatalogPageBySlug(currentSlug);

        if (seoPage && isPublishedSeoCatalogPage(seoPage)) {
          return <SeoCatalogPage page={seoPage} slug={currentSlug} />;
        }
      }

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

    const { node: currentNode, ancestors: currentNodeAncestors } = findNodeInTree(tree, slug);
    const childCategories = currentNode?.children || [];
    const categoryChain = buildCategoryChain(allCategories, currentCategory);
    const breadcrumbs = buildBreadcrumbsFromTree(tree, slug);
    const parentBreadcrumb = breadcrumbs.length > 1 ? breadcrumbs[breadcrumbs.length - 2] : null;
    const mobileBackItem = parentBreadcrumb?.href
      ? { name: parentBreadcrumb.name || parentBreadcrumb.label, href: parentBreadcrumb.href }
      : { name: 'Каталог', href: '/catalog' };
    const isRootLevelCategory = currentNodeAncestors.length === 0;

    const showChildCategoriesSlider = isRootLevelCategory && childCategories.length > 0;
    const showAllFilters = !isRootLevelCategory || childCategories.length === 0;

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

    const prevUrl = currentPage > 1
      ? buildPaginationUrl(basePath, queryParams, currentPage - 1)
      : null;

    const nextUrl = currentPage < totalPages
      ? buildPaginationUrl(basePath, queryParams, currentPage + 1)
      : null;

    return (
      <main className="main catalog-inner">
        {prevUrl && <link rel="prev" href={prevUrl} />}
        {nextUrl && <link rel="next" href={nextUrl} />}

        <Breadcrumbs items={breadcrumbs} mobileBackItem={mobileBackItem} />

        <section className="all-catalog">
          <div className="container">
            <h1>{currentCategory.attributes.translated_name}</h1>

            {showChildCategoriesSlider && (
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
