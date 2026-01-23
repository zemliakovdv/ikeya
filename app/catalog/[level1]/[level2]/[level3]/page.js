import CatalogLayout from '@/components/catalog/CatalogLayout';
import { getCatalogData } from '@/lib/catalog';

export default async function CatalogLevel3Page({ params }) {
  const { level1, level2, level3 } = params;
  const data = await getCatalogData({ level1, level2, level3 });
  
  return (
    <CatalogLayout
      breadcrumbs={data.breadcrumbs}
      title={data.title}
      showCategoriesGrid={false}
      filters={data.filters}
      products={data.products}
      totalProducts={data.totalProducts}
      currentLevel={data.currentLevel}
    />
  );
}
