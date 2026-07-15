import { Suspense } from 'react';
import UnsubscribeHandler from '@/components/marketing/UnsubscribeHandler';

export const metadata = {
  title: 'Отписка от рассылки | IKEYA',
  description: 'Обработка запроса на отписку от рекламной рассылки IKEYA.',
  robots: {
    index: false,
    follow: false,
  },
  referrer: 'no-referrer',
};

export default function UnsubscribePage() {
  return (
    <Suspense fallback={null}>
      <UnsubscribeHandler />
    </Suspense>
  );
}
