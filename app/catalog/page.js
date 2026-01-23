import CatalogLayout from '@/components/catalog/CatalogLayout';
import { getCatalogData } from '@/lib/catalog';

export default async function CatalogPage() {
  const data = await getCatalogData();
  
  return (
    <CatalogLayout
      breadcrumbs={data.breadcrumbs}
      title={data.title}
      showCategoriesGrid={true}
      categories={data.categories}
      filters={data.filters}
      products={data.products}
      totalProducts={data.totalProducts}
      currentLevel={data.currentLevel}
    />
  );
}
