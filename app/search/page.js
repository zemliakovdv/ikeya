import { Suspense } from 'react';
import SearchPageContent from './SearchPageContent';
import PageLoader from '@/components/ui/PageLoader';

export default function SearchPage() {
  return (
    <Suspense fallback={<PageLoader />}>
      <SearchPageContent />
    </Suspense>
  );
}