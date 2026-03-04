// app/catalog/[...slug]/page.js
import Breadcrumbs from '@/components/catalog/Breadcrumbs';
import CategoriesGrid from '@/components/catalog/CategoriesGrid';
import FilterAside from '@/components/catalog/sidebar/FilterAside';
import FilterChips from '@/components/catalog/FilterChips';
import ProductSort from '@/components/catalog/ProductSort';
import InfiniteProductGrid from '@/components/catalog/products/InfiniteProductGrid';
import { getCachedCategories, getCategoryWithFilters, getCategoryProducts } from '@/lib/api/ikea';
import {
  findCategoryBySlug,
  buildCategoryChain,
  buildBreadcrumbs,
  getChildCategories,
} from '@/lib/utils/categoryHelpers';
import { redirect } from 'next/navigation';

export default async function CategoryPage({ params, searchParams }) {
  // ✅ Next.js 15: params и searchParams — это Promise
  const { slug } = await params;
  const sp = await searchParams;
  console.log('🔍 searchParams:', JSON.stringify(sp));

  const currentSlug = slug[slug.length - 1];

  try {
    const allowedSorts = ['popular', 'newest', 'cheapest', 'expensive'];
    const sort = allowedSorts.includes(sp?.sort) ? sp.sort : null;

    const allCategories = await getCachedCategories();
    const currentCategory = findCategoryBySlug(allCategories, currentSlug);

    if (!currentCategory) {
      redirect('/catalog');
    }

    const [categoryWithFilters, productsResponse] = await Promise.all([
      getCategoryWithFilters(currentCategory.id),
      getCategoryProducts(currentCategory.id, 1, 20, sort, sp || {}),
    ]);

    const availableFilters = categoryWithFilters.available_filters || [];
    const childCategories = getChildCategories(allCategories, currentCategory.id);
    const categoryChain = buildCategoryChain(allCategories, currentCategory);
    const breadcrumbs = buildBreadcrumbs(categoryChain);
    const level = categoryChain.length;

    const showCategoryGrid = level === 1 && childCategories.length > 0;
    const showAllFilters = level >= 2;

    const initialProducts = productsResponse.data || [];

    // Строка фильтров для InfiniteProductGrid (подгрузка следующих страниц)
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

    // Данные для сайдбара
    const categoryData = {
      parentCategory: categoryChain[categoryChain.length - 2] || null,
      grandParentCategory: categoryChain[categoryChain.length - 3] || null,
      greatGrandParentCategory: categoryChain[categoryChain.length - 4] || null,
      subcategories: childCategories,
    };

    const rootCategories = allCategories
      .filter((cat) => !cat.attributes?.parent_ids?.length)
      .map((cat) => ({
        slug: cat.attributes.slug,
        name: cat.attributes.translated_name || cat.attributes.name,
      }));

    const basePath = `/catalog/${categoryChain.map((c) => c.attributes.slug).join('/')}`;
    console.log('📦 initialProducts count:', initialProducts.length, 'queryString:', productsQueryString);
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
                    <FilterChips />
                    <ProductSort currentSort={sort} />
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