'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ProfileLayout from '@/components/profile/ProfileLayout';
import Reviews from '@/components/profile/Reviews';
import { useAuth } from '@/contexts/AuthContext';

const breadcrumbs = [
  { label: 'Профиль', href: '/profile' },
  { label: 'Отзывы', href: null },
];

import { buildApiUrl } from '@/lib/config/api';

async function fetchAvailableProducts(token) {
  const res = await fetch(buildApiUrl('/account/reviews/available'), {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Ошибка загрузки товаров для отзыва');
  const json = await res.json();
  return json.data || [];
}

async function fetchReviews(token) {
  const res = await fetch(buildApiUrl('/account/reviews?per_page=100'), {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Ошибка загрузки отзывов');
  const json = await res.json();
  return json.data || [];
}

export default function ReviewsPage() {
  const { isAuth, isHydrated, token } = useAuth();
  const router = useRouter();

  const [availableProducts, setAvailableProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isHydrated || !isAuth) return;

    async function load() {
      setLoading(true);
      try {
        const [products, reviewsList] = await Promise.all([
          fetchAvailableProducts(token),
          fetchReviews(token),
        ]);
        setAvailableProducts(products);
        setReviews(reviewsList);
      } catch (e) {
        setError(e.message || 'Не удалось загрузить данные');
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [isHydrated, isAuth, token]);

  return (
    <ProfileLayout breadcrumbs={breadcrumbs}>
      <Reviews
        availableProducts={availableProducts}
        reviews={reviews}
        loading={loading}
        error={error}
        token={token}
        onReviewCreated={(newReview, sku) => {
          // Убираем товар из «Ждут отзыва», добавляем в «Отзывы»
          setAvailableProducts(prev => prev.filter(p => p.sku !== sku));
          setReviews(prev => [newReview, ...prev]);
        }}
        onReviewDeleted={(id) => {
          setReviews(prev => prev.filter(r => r.id !== id));
        }}
      />
    </ProfileLayout>
  );
}