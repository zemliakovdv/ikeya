import { Suspense } from 'react';
import SearchPageContent from './SearchPageContent';
import PageLoader from '@/components/ui/PageLoader';

// Страница читает запрос только на клиенте. Без dynamic статический кэш
// сохраняет router tree первого запроса и следующие поиски не сменяют выдачу.
export const dynamic = 'force-dynamic';

// Один маршрут на пустую форму, выдачу, пустой результат, пагинацию, сортировку и фильтры.
export const metadata = {
  robots: {
    index: false,
    follow: true,
  },
};

export default function SearchPage({ searchParams }) {
  const rawQuery = searchParams?.q;
  const query = Array.isArray(rawQuery) ? rawQuery[0] || '' : rawQuery || '';

  return (
    <Suspense key={query} fallback={<PageLoader />}>
      <SearchPageContent />
    </Suspense>
  );
}