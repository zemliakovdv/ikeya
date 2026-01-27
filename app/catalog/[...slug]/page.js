// app/catalog/[...slug]/page.js
import { redirect } from 'next/navigation';
import Breadcrumbs from '@/components/catalog/Breadcrumbs';
import CategoriesGrid from '@/components/catalog/CategoriesGrid';
import FilterAside from '@/components/catalog/sidebar/FilterAside';
import ProductSort from '@/components/catalog/ProductSort';
import FilterChips from '@/components/catalog/FilterChips';
import ProductGrid from '@/components/catalog/products/ProductGrid';
import Pagination from '@/components/catalog/Pagination';

export async function generateMetadata({ params }) {
  const { slug = [] } = params;
  const level = slug.length;

  const titles = {
    1: `${slug[0]} | Каталог IKEA`,
    2: `${slug[1]} — ${slug[0]} | IKEA`,
    3: `${slug[2]} — ${slug[1]} | IKEA`,
    4: `${slug[3]} — ${slug[2]} | IKEA`
  };

  return {
    title: titles[level] || 'Каталог IKEA',
    description: `Каталог товаров IKEA — ${slug.join(' / ')}`
  };
}

export default async function CatalogDynamicPage({ params, searchParams }) {
  const { slug = [] } = params;
  const level = slug.length;
  const [level1, level2, level3, level4] = slug;

  if (level === 0) {
    redirect('/catalog');
  }

  // TODO: Запрос к API
  const categoryData = {
    name: level1 === 'sad-i-balkon' ? 'Сад и балкон' : level1,
    level2Name: level2 ? 'Садовая и балконная мебель' : null,
    level3Name: level3 ? 'Садовая мебель' : null,
    level4Name: level4 ? 'Садовые стулья и кресла' : null,
    subcategories: [],
    products: [],
    filters: {},
  };

  // Breadcrumbs
  const breadcrumbs = [
    { label: 'Главная', href: '/' },
    { label: 'Каталог', href: '/catalog' },
  ];

  if (level >= 1) breadcrumbs.push({ label: categoryData.name, href: `/catalog/${level1}` });
  if (level >= 2) breadcrumbs.push({ label: categoryData.level2Name || level2, href: `/catalog/${level1}/${level2}` });
  if (level >= 3) breadcrumbs.push({ label: categoryData.level3Name || level3, href: `/catalog/${level1}/${level2}/${level3}` });
  if (level >= 4) breadcrumbs.push({ label: categoryData.level4Name || level4 });

  const showCategoriesGrid = level === 1;
  const showAllFilters = level >= 2;

  // Определяем заголовок
  const pageTitle = level >= 2 
    ? (categoryData.level4Name || categoryData.level3Name || categoryData.level2Name || 'Категория')
    : null;

  // Определяем текущую категорию для sidebar
  let currentCategoryForSidebar = categoryData.name;
  if (level === 3) currentCategoryForSidebar = categoryData.level3Name;
  if (level === 4) currentCategoryForSidebar = categoryData.level4Name;

  return (
    <main className="main catalog-inner">
      <Breadcrumbs items={breadcrumbs} />

      {showCategoriesGrid && <CategoriesGrid categories={categoryData.subcategories} limit={8} />}

      <section className="all-catalog">
        <div className="container">
          <div className="row">
            <div className="col-12">
              {pageTitle && <h2>{pageTitle}</h2>}
              <div className="all-catalog-inner">
                <FilterAside 
                  showAllFilters={showAllFilters}
                  currentCategory={currentCategoryForSidebar}
                  categorySlug={level1}
                  parentCategory={level >= 2 ? { name: level === 4 ? categoryData.level3Name : categoryData.level2Name, slug: level === 4 ? level3 : level2 } : null}
                  grandParentCategory={level >= 3 ? { name: level === 4 ? categoryData.level2Name : categoryData.name, slug: level === 4 ? level2 : level1 } : null}
                  greatGrandParentCategory={level >= 4 ? { name: categoryData.name, slug: level1 } : null}
                  subcategories={categoryData.subcategories}
                  level={level}
                />

                <div className="all-catalog-cards">
                  <ProductSort />
                  <FilterChips filters={categoryData.filters} />
                  <ProductGrid products={categoryData.products} />
                  <Pagination 
                    currentPage={1}
                    totalPages={16}
                    totalItems={320}
                    itemsPerPage={20}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
