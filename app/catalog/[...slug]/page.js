// app/catalog/[...slug]/page.js
import Breadcrumbs from '@/components/catalog/Breadcrumbs';
import ChildCategoriesSlider from '@/components/catalog/ChildCategoriesSlider';
import FilterAside from '@/components/catalog/sidebar/FilterAside';
import FilterChips from '@/components/catalog/FilterChips';
import ProductSort from '@/components/catalog/ProductSort';
import ProductGridWithPagination from '@/components/catalog/products/ProductGridWithPagination';
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

    const name = category.attributes.translated_name || category.attributes.name || 'Каталог';

    return {
      title: `${name} — купить в Беларуси | IKEYA`,
      description: `Купить ${name.toLowerCase()} в интернет-магазине IKEYA. Большой выбор, доступные цены, доставка по Беларуси. Заказывайте онлайн!`,
    };
  } catch {
    return {};
  }
}

function getPriceRangeFromFilters(filters) {
  const priceBucket = (filters || []).find(f => f.parameter === 'f-price-buckets');
  if (!priceBucket?.values?.length) return { min: 0, max: 10000 };

  let min = Infinity;
  let max = 0;

  priceBucket.values.forEach(({ id }) => {
    const match = id.match(/^PRICE_(\d+)_(\d+)$/);
    if (!match) return;
    const lo = parseInt(match[1]) / 100;
    const hi = parseInt(match[2]) / 100;
    if (lo < min) min = lo;
    if (hi < 92233720368547 && hi > max) max = hi;
  });

  return {
    min: min === Infinity ? 0 : Math.floor(min),
    max: max === 0 ? 10000 : Math.ceil(max)
  };
}

export default async function CategoryPage({ params, searchParams }) {
  const { slug } = await params;
  const sp = await searchParams;

  const currentSlug = slug[slug.length - 1];

  try {
    const allowedSorts = ['popular', 'newest', 'cheapest', 'expensive'];
    const sort = allowedSorts.includes(sp?.sort) ? sp.sort : null;

    // Читаем номер страницы из URL — для прямых переходов по пагинации
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

    const availableFilters = categoryWithFilters.available_filters || [];
    const priceRange = getPriceRangeFromFilters(availableFilters);

    const filterLabels = {};
    const filterTitles = {};
    availableFilters.forEach(f => {
      filterTitles[f.parameter] = f.translated_name || f.name || f.parameter;
      (f.values || []).forEach(v => {
        if (v.id !== undefined) filterLabels[String(v.id)] = v.translated_name || v.name || String(v.id);
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
    const totalPages = meta.total_pages || 1;

    const hasActiveFilters = !!(
      sp?.min_price || sp?.max_price ||
      Object.keys(sp || {}).some(k => k.startsWith('filters['))
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
                <ProductSort currentSort={sort} />
                <FilterChips filterLabels={filterLabels} filterTitles={filterTitles} />
                {initialProducts.length > 0 ? (
                  <>
                  <ProductGridWithPagination
                      initialProducts={initialProducts}
                      categoryId={currentCategory.id}
                      totalPages={totalPages}
                      queryString={productsQueryString}
                      initialPage={currentPage}
                      basePath={basePath}
                      currentPage={currentPage}
                      totalItems={meta.total || 0}
                    />
                  </>
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
      </main>
    );
  } catch (error) {
    if (error?.digest?.startsWith('NEXT_REDIRECT')) throw error;
    console.error('Error loading category:', error);
    redirect('/catalog');
  }
}