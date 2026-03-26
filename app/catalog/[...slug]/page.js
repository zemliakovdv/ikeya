// app/catalog/[...slug]/page.js
import Breadcrumbs from '@/components/catalog/Breadcrumbs';
import CategoriesGrid from '@/components/catalog/CategoriesGrid';
import FilterAside from '@/components/catalog/sidebar/FilterAside';
import FilterChips from '@/components/catalog/FilterChips';
import ProductSort from '@/components/catalog/ProductSort';
import InfiniteProductGrid from '@/components/catalog/products/InfiniteProductGrid';
import { getCachedCategoriesTree, getCategoryWithFilters, getCategoryProducts } from '@/lib/api/ikea';
import {
  flattenCategoriesTree,
  findCategoryBySlug,
  buildCategoryChain,
  buildBreadcrumbs,
  getChildCategories,
} from '@/lib/utils/categoryHelpers';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';

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

    // Один запрос вместо пагинации
    const tree = await getCachedCategoriesTree();
    const allCategories = flattenCategoriesTree(tree);

    const currentCategory = findCategoryBySlug(allCategories, currentSlug);

    if (!currentCategory) {
      redirect('/catalog');
    }

    const [categoryWithFilters, productsResponse] = await Promise.all([
      getCategoryWithFilters(currentCategory.id),
      getCategoryProducts(currentCategory.id, 1, 20, sort, sp || {}),
    ]);

    const availableFilters = categoryWithFilters.available_filters || [];
    const priceRange = getPriceRangeFromFilters(availableFilters);

    const filterLabels = {};
    availableFilters.forEach(f => {
      (f.values || []).forEach(v => {
        if (v.id !== undefined) filterLabels[String(v.id)] = v.translated_name || v.name || String(v.id);
      });
    });

    const childCategories = getChildCategories(allCategories, currentCategory.id);
    const categoryChain = buildCategoryChain(allCategories, currentCategory);
    const breadcrumbs = buildBreadcrumbs(categoryChain);
    const level = categoryChain.length;

    const showCategoryGrid = level === 1 && childCategories.length > 0;
    const showAllFilters = level >= 2;

    const initialProducts = productsResponse.data || [];

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

    const categoryData = {
      parentCategory: categoryChain[categoryChain.length - 2] || null,
      grandParentCategory: categoryChain[categoryChain.length - 3] || null,
      greatGrandParentCategory: categoryChain[categoryChain.length - 4] || null,
      subcategories: childCategories,
    };

    const rootCategories = tree.map((cat) => ({
      slug: cat.attributes?.slug || cat.id,
      name: cat.attributes?.translated_name || cat.attributes?.name || 'Категория',
    }));

    const basePath = `/catalog/${categoryChain.map((c) => c.attributes.slug).join('/')}`;

    return (
      <main className="main catalog-inner">
        <Breadcrumbs items={breadcrumbs} />

        <section className="all-catalog">
          <div className="container">
            <h1>{currentCategory.attributes.translated_name}</h1>

            {showCategoryGrid && (
              <div className="catalog-categories">
                <CategoriesGrid categories={childCategories} basePath={basePath} />
              </div>
            )}

            <div className="all-catalog-inner">
              <FilterAside
                currentCategory={currentCategory}
                categoryData={categoryData}
                rootCategories={rootCategories}
                level={level}
                showAllFilters={showAllFilters}
                availableFilters={availableFilters}
              />

              <div className="all-catalog-center" key={productsQueryString}>
                {initialProducts.length > 0 ? (
                  <>
                    <ProductSort currentSort={sort} />
                    <FilterChips filterLabels={filterLabels} />
                    <InfiniteProductGrid
                      key={`${currentCategory.id}-${productsQueryString}`}
                      initialProducts={initialProducts}
                      categoryId={currentCategory.id}
                      totalPages={productsResponse.meta?.total_pages || 1}
                      queryString={productsQueryString}
                    />
                  </>
                ) : (
                  <div className="all-catalog-empty">
                    <p>В этой категории пока нет товаров</p>
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