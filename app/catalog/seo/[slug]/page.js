import { permanentRedirect } from 'next/navigation';
import { getSafeSlug } from '@/lib/seoCatalogPage';

export const revalidate = 3600;
export const dynamicParams = true;

export default async function SeoCatalogLegacyPage({ params }) {
  const resolvedParams = await params;
  const slug = getSafeSlug(resolvedParams?.slug);

  permanentRedirect(`/catalog/${slug}`);
}
