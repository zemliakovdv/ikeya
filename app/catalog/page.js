// app/catalog/page.js
import Breadcrumbs from '@/components/catalog/Breadcrumbs';
import CategoriesGrid from '@/components/catalog/CategoriesGrid';
import FilterAside from '@/components/catalog/sidebar/FilterAside';
import ProductSort from '@/components/catalog/ProductSort';
import InfiniteProductGrid from '@/components/catalog/products/InfiniteProductGrid';
import { getCategoriesTree, getProducts } from '@/lib/api/ikea';
import { flattenCategoriesTree } from '@/lib/utils/categoryHelpers';

export default async function CatalogPage() {
  // Загружаем дерево категорий и товары
  const [categoriesResponse, productsResponse] = await Promise.all([
    getCategoriesTree(),
    getProducts({ page: 1, per_page: 20 })
  ]);
  
  const allCategories = flattenCategoriesTree(categoriesResponse.data);
  
  // Получаем только корневые категории
  const rootCategories = allCategories.filter(cat => 
    !cat.attributes.parent_ids || cat.attributes.parent_ids.length === 0
  );
  
  const simplifiedRootCategories = rootCategories.map(cat => ({
    id: cat.id,
    ikea_id: cat.attributes.ikea_id,
    name: cat.attributes.translated_name
  }));
  
  const products = productsResponse.data || [];
  const meta = productsResponse.meta || {};
  
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
          
          {/* Корневые категории */}
          {rootCategories.length > 0 && (
            <div className="catalog-categories">
              <CategoriesGrid categories={rootCategories} />
            </div>
          )}
          
          <div className="all-catalog-inner">
            <FilterAside 
              showAllFilters={false}
              rootCategories={simplifiedRootCategories}
              level={0}
            />
            
            <div className="all-catalog-center">
              <ProductSort totalCount={meta.total || products.length} />
              
              {/* ✅ ИСПРАВЛЕНО: Для "всех товаров" передаём null или undefined */}
              <InfiniteProductGrid 
                initialProducts={products}
                categoryId={null}
                totalPages={meta.total_pages || Math.ceil((meta.total || 0) / 20)}
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
