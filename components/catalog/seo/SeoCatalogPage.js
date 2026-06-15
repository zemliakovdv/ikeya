import Breadcrumbs from '@/components/catalog/Breadcrumbs';
import SeoSection from '@/components/home/SeoSection';
import {
  buildSeoCatalogBreadcrumbItems,
  buildSeoCatalogBreadcrumbJsonLd,
  getSafeText,
  getSeoCatalogUiFilters,
  isPlainObject,
  normalizeSeoCatalogProducts,
  resolveSeoCatalogUrl,
} from '@/lib/seoCatalogPage';
import SeoCatalogClient from './SeoCatalogClient';

export default function SeoCatalogPage({ page, slug }) {
  const title = page.h1 || page.title || 'Подборка IKEYA';
  const description = getSafeText(page.description);
  const breadcrumbs = buildSeoCatalogBreadcrumbItems(page, slug);
  const seoText = getSafeText(page.seo_text);
  const products = normalizeSeoCatalogProducts(page).filter((product) => isPlainObject(product));
  const filters = getSeoCatalogUiFilters(page);
  const catalogUrl = resolveSeoCatalogUrl(page, slug);

  return (
    <main className="main catalog-inner">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildSeoCatalogBreadcrumbJsonLd(breadcrumbs)) }}
      />

      <Breadcrumbs items={breadcrumbs} />

      <section className="all-catalog">
        <div className="container">
          <h1>{title}</h1>

          {description ? (
            <div className="all-catalog-empty" style={{ marginBottom: '24px' }}>
              <p>{description}</p>
            </div>
          ) : null}

          <SeoCatalogClient
            initialProducts={products}
            filters={filters}
            catalogUrl={catalogUrl}
          />

          {seoText ? <SeoSection seoText={seoText} /> : null}
        </div>
      </section>
    </main>
  );
}
