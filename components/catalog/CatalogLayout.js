import Breadcrumbs from '@/components/ui/Breadcrumbs';
import CategoriesGrid from './CategoriesGrid';
import FilterAside from './sidebar/FilterAside';
import ProductGrid from './products/ProductGrid';
import FilterChips from './FilterChips';

export default function CatalogLayout({ 
  breadcrumbs = [],
  title = '',
  showCategoriesGrid = false,
  categories = [],
  filters = {},
  products = [],
  totalProducts = 0,
  currentLevel = 0,
  activeFilters = [],
  onFilterChange,
  onRemoveFilter,
  onClearAllFilters
}) {
  return (
    <main className="main catalog-inner">
      <Breadcrumbs items={breadcrumbs} />
      
      {showCategoriesGrid && (
        <CategoriesGrid categories={categories} />
      )}
      
      <section className="all-catalog">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <h2>{title}</h2>
              
              <FilterChips 
                activeFilters={activeFilters}
                onRemove={onRemoveFilter}
                onClearAll={onClearAllFilters}
              />
              
              <div className="all-catalog-inner">
                <FilterAside 
                  filters={filters}
                  currentLevel={currentLevel}
                  onFilterChange={onFilterChange}
                />
                
                <ProductGrid 
                  products={products}
                  totalProducts={totalProducts}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
