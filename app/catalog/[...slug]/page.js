// app/catalog/[...slug]/page.js
import { redirect } from 'next/navigation';
import Breadcrumbs from '@/components/catalog/Breadcrumbs';
import CategoriesGrid from '@/components/catalog/CategoriesGrid';
import FilterAside from '@/components/catalog/sidebar/FilterAside';
import ProductSort from '@/components/catalog/ProductSort';
import InfiniteProductGrid from '@/components/catalog/products/InfiniteProductGrid';
import {
  getCategoriesTree,
  getCategoryProducts,
  getChildCategories
} from '@/lib/api/ikea';
import {
  findCategoryBySlug,
  buildCategoryChain,
  buildBreadcrumbs,
  flattenCategoriesTree
} from '@/lib/utils/categoryHelpers';

export async function generateMetadata({ params }) {
  const { slug } = params;
  const currentSlug = slug[slug.length - 1];

  try {
    const currentCategory = findCategoryBySlug(allCategories, currentSlug);

    if (!currentCategory?.attributes?.seo) return {};

    const seo = currentCategory.attributes.seo;
    return {
      title: seo.title,
      description: seo.description,
      keywords: seo.keywords,
      robots: seo.robots,
    };
  } catch (error) {
      // ✅ не глотаем redirect
  if (error?.digest?.startsWith('NEXT_REDIRECT')) throw error;
    console.error('generateMetadata category error:', error);
    redirect('/catalog');
  }
}

export default async function CategoryPage({ params }) {
  const { slug } = params;
  const currentSlug = slug[slug.length - 1];

  try {
    const categoriesResponse = await getCategoriesTree();
    const allCategories = flattenCategoriesTree(categoriesResponse.data);

    const rootCategories = allCategories.filter(cat =>
      !cat.attributes.parent_ids || cat.attributes.parent_ids.length === 0
    );

    const simplifiedRootCategories = rootCategories.map(cat => ({
      ikea_id: cat.attributes.ikea_id,
      name: cat.attributes.translated_name
    }));

    const currentCategory = findCategoryBySlug(allCategories, currentSlug);

    if (!currentCategory) {
      redirect('/catalog');
    }

    const categoryChain = buildCategoryChain(allCategories, currentCategory);
    const breadcrumbs = buildBreadcrumbs(categoryChain);

    const childCategoriesResponse = await getChildCategories(currentCategory.id);
    const childCategories = childCategoriesResponse.data || [];

    const level = categoryChain.length;

    const productsResponse = await getCategoryProducts(currentCategory.id, 1, 20);
    const initialProducts = productsResponse.data || [];

    const categoryData = prepareCategoryData(categoryChain, childCategories);

    const showCategoryGrid = level === 1 && childCategories.length > 0;
    const displayCategories = showCategoryGrid ? childCategories.slice(0, 8) : [];
    const showAllFilters = level >= 2;

    return (
      <main className="main catalog-inner">
        <Breadcrumbs items={breadcrumbs} />

        <section className="all-catalog">
          <div className="container">
            <h1>{currentCategory.attributes.translated_name}</h1>

            {showCategoryGrid && (
              <div className="catalog-categories">
                <CategoriesGrid categories={displayCategories} />
              </div>
            )}

            <div className="all-catalog-inner">
              <FilterAside
                currentCategory={currentCategory}
                categoryData={categoryData}
                rootCategories={simplifiedRootCategories}
                showAllFilters={showAllFilters}
              />

              <div className="all-catalog-center">
                {initialProducts.length > 0 ? (
                  <>
                    <ProductSort totalCount={productsResponse.meta?.total || 0} />
                    <InfiniteProductGrid
                      initialProducts={initialProducts}
                      categoryId={currentCategory.id}
                      totalPages={productsResponse.meta?.total_pages || 1}
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
    console.error('Error loading category:', error);
    redirect('/catalog');
  }
}

function prepareCategoryData(categoryChain, childCategories) {
  const level = categoryChain.length;
  return {
    currentCategory: categoryChain[level - 1],
    parentCategory: level >= 2 ? categoryChain[level - 2] : null,
    grandParentCategory: level >= 3 ? categoryChain[level - 3] : null,
    greatGrandParentCategory: level >= 4 ? categoryChain[level - 4] : null,
    subcategories: childCategories,
    level
  };
}
