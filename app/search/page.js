import { Suspense } from 'react';
import SearchPageContent from './SearchPageContent';

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="container" style={{ padding: '60px 0' }}>Загрузка...</div>}>
      <SearchPageContent />
    </Suspense>
  );
}